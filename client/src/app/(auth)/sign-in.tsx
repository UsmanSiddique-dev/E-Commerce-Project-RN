import { COLORS } from "../../../constants/index";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, TextInput, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type VerificationStrategy = "email_code" | "phone_code" | "totp" | "backup_code";

function getErrorMessage(error: unknown, fallback: string) {
    if (typeof error === "object" && error !== null) {
        if ("longMessage" in error && typeof error.longMessage === "string") {
            return error.longMessage;
        }
        if ("message" in error && typeof error.message === "string") {
            return error.message;
        }
    }

    return fallback;
}

export default function Page() {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");
    const [verificationStrategy, setVerificationStrategy] = React.useState<VerificationStrategy | null>(null);
    const loading = fetchStatus === "fetching";

    const showAuthError = (error: unknown, fallback: string) => {
        const fieldError = errors.fields.code ?? errors.fields.identifier ?? errors.fields.password;

        Toast.show({
            type: "error",
            text1: "Sign In Failed",
            text2: getErrorMessage(error, fieldError?.longMessage ?? fieldError?.message ?? fallback),
        });
    };

    const finalizeSignIn = async () => {
        await signIn.finalize({
            navigate: ({ session }) => {
                if (!session?.currentTask) {
                    router.replace("/");
                }
            },
        });
    };

    const onSignInPress = async () => {
        if (!emailAddress.trim() || !password) {
            Toast.show({
                type: "error",
                text1: "Missing Fields",
                text2: "Please enter your email and password",
            });
            return;
        }

        try {
            const { error } = await signIn.password({
                emailAddress: emailAddress.trim(),
                password,
            });

            if (error) {
                showAuthError(error, "Unable to sign in");
                return;
            }

            if (signIn.status === "complete") {
                await finalizeSignIn();
            } else if (signIn.status === "needs_client_trust") {
                const emailCodeFactor = signIn.supportedSecondFactors.find(
                    (factor) => factor.strategy === "email_code",
                );

                if (!emailCodeFactor) {
                    showAuthError(null, "Email verification is not available for this sign-in");
                    return;
                }

                await signIn.mfa.sendEmailCode();
                setVerificationStrategy("email_code");
            } else if (signIn.status === "needs_second_factor") {
                const phoneCodeFactor = signIn.supportedSecondFactors.find(
                    (factor) => factor.strategy === "phone_code",
                );
                const totpFactor = signIn.supportedSecondFactors.find(
                    (factor) => factor.strategy === "totp",
                );
                const backupCodeFactor = signIn.supportedSecondFactors.find(
                    (factor) => factor.strategy === "backup_code",
                );

                if (phoneCodeFactor) {
                    await signIn.mfa.sendPhoneCode();
                    setVerificationStrategy("phone_code");
                } else if (totpFactor) {
                    setVerificationStrategy("totp");
                } else if (backupCodeFactor) {
                    setVerificationStrategy("backup_code");
                } else {
                    showAuthError(null, "No supported verification method is available");
                }
            } else {
                showAuthError(null, "Sign-in requires an additional step that is not supported");
            }
        } catch (error) {
            showAuthError(error, "Unable to sign in");
        }
    };

    const onVerifyPress = async () => {
        if (!code.trim() || !verificationStrategy) {
            Toast.show({
                type: "error",
                text1: "Missing Fields",
                text2: "Enter your verification code",
            });
            return;
        }

        try {
            let error: unknown;

            switch (verificationStrategy) {
                case "email_code":
                    ({ error } = await signIn.mfa.verifyEmailCode({ code: code.trim() }));
                    break;
                case "phone_code":
                    ({ error } = await signIn.mfa.verifyPhoneCode({ code: code.trim() }));
                    break;
                case "totp":
                    ({ error } = await signIn.mfa.verifyTOTP({ code: code.trim() }));
                    break;
                case "backup_code":
                    ({ error } = await signIn.mfa.verifyBackupCode({ code: code.trim() }));
                    break;
            }

            if (error) {
                showAuthError(error, "Invalid verification code");
                return;
            }

            if (signIn.status === "complete") {
                await finalizeSignIn();
            } else {
                showAuthError(null, "Verification is not complete yet");
            }
        } catch (error) {
            showAuthError(error, "Invalid verification code");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
            {!verificationStrategy ? (
                <>
                    <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
                        <Text className="text-secondary">Sign in to continue</Text>
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-primary font-medium mb-2">Email</Text>
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="user@example.com" placeholderTextColor="#999" autoCapitalize="none" keyboardType="email-address" value={emailAddress} onChangeText={setEmailAddress} />
                    </View>

                    {/* Password */}
                    <View className="mb-6">
                        <Text className="text-primary font-medium mb-2">Password</Text>
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="********" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
                    </View>

                    {/* Submit */}
                    <Pressable className={`w-full py-4 rounded-full items-center mb-10 ${loading || !emailAddress || !password ? "bg-gray-300" : "bg-primary"}`} onPress={onSignInPress} disabled={loading || !emailAddress || !password}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Sign In</Text>}
                    </Pressable>

                    {/* Footer */}
                    <View className="flex-row justify-center">
                        <Text className="text-secondary">Don&apos;t have an account? </Text>
                        <Link href="/sign-up">
                            <Text className="text-primary font-bold">Sign up</Text>
                        </Link>
                    </View>
                </>
            ) : (
                <>
                    {/* Verification */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">
                            {verificationStrategy === "email_code" ? "Verify Email" : "Verify Account"}
                        </Text>
                        <Text className="text-secondary text-center">
                            {verificationStrategy === "email_code"
                                ? "Enter the code sent to your email"
                                : verificationStrategy === "phone_code"
                                    ? "Enter the code sent to your phone"
                                    : verificationStrategy === "totp"
                                        ? "Enter the code from your authenticator app"
                                        : "Enter one of your backup codes"}
                        </Text>
                    </View>

                    <View className="mb-6">
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest" placeholder="123456" placeholderTextColor="#999" keyboardType="number-pad" value={code} onChangeText={setCode} />
                    </View>

                    <Pressable className="w-full bg-primary py-4 rounded-full items-center" onPress={onVerifyPress} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Verify</Text>}
                    </Pressable>
                </>
            )}
        </SafeAreaView>
    );
}

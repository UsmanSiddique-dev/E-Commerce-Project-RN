import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Address } from "../../constants/types";
import { dummyAddress } from "@/assets/assets";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";

const Checkout = () => {
  const { cartTotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");

  const shipping = 2.0;
  
  const tax = 0;
  const total = cartTotal + shipping + tax;
  const fetchAddress = async () => {
    const addrList = dummyAddress;
    if (addrList.length > 0) {
      // Find default or first address
      const def = addrList.find((a: any) => a.isDefault) || addrList[0];
      setSelectedAddress(def as Address);
    }
    setPageLoading(false);
  };
  const handlePlaceHolder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please add a Shipping Address",
      });
      return;
    }
    if (paymentMethod === "stripe") {
      return Toast.show({
        type: "error",
        text1: "Info",
        text2: "Stripre not implemented yet",
      });
    }
    router.replace("/orders");
  };
  useEffect(() => {
    fetchAddress();
  }, []);
  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface  justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Checkout" showBack />
      <ScrollView className="flex-1 px-4 mt-4">
        {/* Adress section */}
        <Text className="text-lg font-bold text-primary">Shipping Address</Text>
        {selectedAddress ? (
          <View className="bg-white p-4 rounded-xl mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-bold">
                {selectedAddress.type}
              </Text>
              <TouchableOpacity onPress={() => router.push("/addresses")}>
                <Text className="text-accent text-sm">Change </Text>
              </TouchableOpacity>
            </View>
            <Text>
              {selectedAddress.street}, {selectedAddress.city}
              {"\n"}
              {selectedAddress.state}, {selectedAddress.zipCode}
              {"\n"}
              {selectedAddress.country}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            className="bg-white p-6 rounded-xl mb-6 items-center justify-center border-dashed border-2"
            onPress={() => router.push("/addresses")}
          >
            <Text className="text-primary font-bold">Add Address</Text>
          </TouchableOpacity>
        )}
        {/* Payment Section */}
        <Text className="text-lg font-bold text-primary mb-4">
          Payment Method
        </Text>
        {/* Cash on Delivery */}
        <TouchableOpacity
        onPress={()=> setPaymentMethod('cash')}
          className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === "cash" ? "border-primary " : "border-transparent"}`}
        >
          <Ionicons
            className="mr-3"
            name="cash-outline"
            size={24}
            color={COLORS.primary}
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold">Cash on Delivery</Text>
            <Text className="text-secondary text-xs mt-1">
              Pay when you recive Order
            </Text>
          </View>
          {paymentMethod === "cash" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Checkout;

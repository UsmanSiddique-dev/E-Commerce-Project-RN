import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Address } from "../../constants/types";
import { dummyAddress } from "@/assets/assets";

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
  useEffect(()=>{
    fetchAddress()
  },[])
  return (
    <View>
      <Text>Checkout</Text>
    </View>
  );
};

export default Checkout;

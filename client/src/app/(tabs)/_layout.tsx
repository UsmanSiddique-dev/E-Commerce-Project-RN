import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import {Feather, Ionicons } from "@expo/vector-icons";
import {COLORS} from "./../../../constants";

const TabLayout = () => {
  return (
    <Tabs screenOptions={{
        headerShown:false,
        tabBarActiveTintColor: COLORS.primary,
         tabBarInactiveTintColor: "#CDCDE0",
         tabBarShowLabel: false,
         tabBarStyle:{
            backgroundColor:'#fff',
            borderTopWidth:1,
            borderTopColor:'#F0F0F0',
            height:58,
            paddingTop:8
         }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name={focused ? "shopping-cart" : "shopping-cart"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

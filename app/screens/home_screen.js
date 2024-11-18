import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import img from "../assests/profile.png";
import noimg from "../assests/noimg.png";
import CustomerContext, { Customer } from "../useContext/context";
import { AllCustomers } from "../dB/operations";
import { useNavigation } from "@react-navigation/native";
export default function Home_screen() {
  const { totalCustomers } = CustomerContext(Customer);
  const navigation = useNavigation();
  const [totalCustomer, setTotal] = useState("");
  useEffect(() => {
    // console.log(totalCustomers);
    async function fun() {
      try {
        const res = await AllCustomers();
        setTotal(res.length);
      } catch (error) {}
    }
    fun();
  }, []);
  return (
    <SafeAreaView>
      <View>
        <View className="p-2 mx-5 flex flex-row justify-between items-center">
          <View>
            <Text>Hi,Manikanta</Text>
            <Text>Tekkalipatnam village</Text>
          </View>
          <Image source={img} className="w-14 h-14" />
        </View>
        <View className="p-2 mx-5 mt-5 flex flex-row justify-between items-center">
          <Text className="text-[20px] font-bold">Add Shop Image</Text>
          <Text className="text-blue-600 text-[23px]">Add+</Text>
        </View>
        <View className="mx-auto p-10">
          <Image source={noimg} className="w-32 h-32" />
        </View>
        <View className="p-2 mx-5 mt-5 flex flex-row justify-between items-center">
          <Text className="text-[20px] font-bold">Add Notes</Text>
          <Text className="text-blue-600 text-[23px]">Add+</Text>
        </View>
        <View className="mx-auto p-10">
          <Image source={noimg} className="w-32 h-32" />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderColor: "#D3D3D3",
            padding: 16,
            marginTop: 0,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
          className="p-5 w-44 flex flex-col mx-2 rounded items-start justify-start py-5"
          onPress={() => navigation.navigate("Customers")}
        >
          <Text className="text-[25px] font-bold">{totalCustomer}</Text>
          <Text className="font-bold text-[20px]">Total Customers</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

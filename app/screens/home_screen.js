import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import img from "../assests/profile.png";
import noimg from "../assests/noimg.png";
import CustomerContext, { Customer } from "../useContext/context";
import {
  All,
  AllCustomers,
  Allnotes,
  CreateNotes,
  getTopCustomersWithMoreKatha,
  SingleShopOwner,
} from "../dB/operations";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
export default function Home_screen({ route }) {
  const { title, subtitle, desc, message, id, phone } = route?.params || "";
  const { totalCustomers } = CustomerContext(Customer);
  const navigation = useNavigation();
  const [totalCustomer, setTotal] = useState("");
  const [notes, setNotes] = useState([]);
  const [moreKatha, setMoreKatha] = useState([]);
  const [shopOwnerdetails, setShopownerDetails] = useState({});
  useEffect(() => {
    async function fun() {
      try {
        const res = await SingleShopOwner(phone);
        setShopownerDetails(res[0]);
      } catch (error) {
        console.log(error);
      }
    }
    fun();
  }, []);
  useEffect(() => {
    // console.log(totalCustomers);
    if (title && subtitle && desc) {
      const newData = {
        title: title,
        subtitle: subtitle,
        description: desc,
      };

      setNotes((prevData) => [...prevData, newData]);
    }
    if (message && id) {
      setNotes((prev) => prev.filter((customer) => customer.id !== id));
    }
    async function fun() {
      try {
        const res = await AllCustomers();
        setTotal(res.length);
      } catch (error) {}
    }
    fun();
    fun1();
    fun2();
    fun3();
  }, [title, subtitle, desc, message, id]);
  async function fun1() {
    try {
      const res = await CreateNotes();
    } catch (error) {
      console.log(error);
    }
  }
  async function fun2() {
    try {
      const res = await Allnotes();
      setNotes(res);
    } catch (error) {
      console.log(error);
    }
  }
  async function fun3() {
    try {
      const res = await getTopCustomersWithMoreKatha();
      setMoreKatha(res);
    } catch (error) {
      console.log(error);
    }
  }
  const color = [
    "#fa5cda",
    "#038cfc",
    "#13e861",
    "#bb3ce6",
    "#dbb6d3",
    "#6e3823",
  ];
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-2 mx-5 flex flex-row justify-between items-center">
          <View>
            <Text className="text-[23px]">Hi,{shopOwnerdetails.fullname}</Text>
            <Text className="text-[20px]">{shopOwnerdetails.shopname}</Text>
            <Text className="text-[16px]">Tekkalipatnam village</Text>
          </View>
          <Image source={img} className="w-14 h-14" />
        </View>
        <View className="p-2 mx-2 mt-5 flex flex-row justify-between items-center">
          <Text className="text-[20px] font-bold">Frequent csutomers</Text>
          {/* <Text className="text-blue-600 text-[23px]">Add+</Text> */}
        </View>
        {moreKatha.length > 0 ? (
          <View>
            <View className="bg-gray-500 mx-2 mt-2 flex flex-row items-center rounded">
              <Text className="text-white text-xl px-5 w-[20%]">S.No</Text>
              <Text className="text-white text-xl px-3 w-[30%]">Name</Text>
              <Text className="text-white text-xl px-3 w-[23%]">Phone</Text>
              <Text className="text-white text-xl px-3 w-[34%]">Address</Text>
            </View>
            {moreKatha.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-200 mx-2 py-2 flex flex-row items-center "
                  onPress={() =>
                    navigation.navigate("manuplate", {
                      customerid: item.id,
                      customername: item.name,
                    })
                  }
                >
                  <Text className="w-[20%] px-6 text-lg">{index + 1}</Text>
                  <Text className="w-[30%] px-2 text-lg">{item.name}</Text>
                  <Text className="w-[22%] px-2 text-lg">{item.phone}</Text>
                  <Text className="w-[35%] px-3 text-lg">
                    {" "}
                    {item.address.length > 10
                      ? item.address.slice(0, 13) + "..."
                      : item.address}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="mx-auto p-10">
            <Image source={noimg} className="w-32 h-32" />
          </View>
        )}
        <View className="p-2 mx-5 mt-5 flex flex-row justify-between items-center">
          <Text className="text-[20px] font-bold">Add Notes</Text>
          <Text
            className="text-blue-600 text-[23px]"
            onPress={() => navigation.navigate("Notes")}
          >
            Add+
          </Text>
        </View>
        {notes.length > 0 ? (
          <ScrollView horizontal className="p-2 ">
            {notes.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: color[index % color.length],
                    borderColor: "#D3D3D3",
                    padding: 16,
                    marginTop: 0,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                  className="p-5 mx-2  mb-10 rounded-xl relative"
                  onPress={() =>
                    navigation.navigate("Single_notes", {
                      id: item.id,
                    })
                  }
                >
                  <Text className="text-[23px]">{item.title}</Text>
                  <Text className="text-[20px] text-gray-400">
                    {item.subtitle}
                  </Text>
                  <Text className="w-52 h-32 ">{item.description}</Text>
                  <View className="flex flex-row justify-between items-center -mr-2">
                    <View className="flex flex-row items-center">
                      <Text className="text-lg">Created at:</Text>
                      <Text className="text-[17px] ml-1">
                        {item.createddate}
                      </Text>
                    </View>
                    <View className="bg-gray-400 rounded-full p-2">
                      <Entypo name="edit" size={20} color="black" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View className="mx-auto p-10">
            <Image source={noimg} className="w-32 h-32" />
          </View>
        )}
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
          className="p-5 w-44 flex flex-col mx-2 mb-10 rounded items-start justify-start py-5"
          onPress={() => navigation.navigate("Customers")}
        >
          <Text className="text-[25px] font-bold">{totalCustomer}</Text>
          <Text className="font-bold text-[20px]">Total Customers</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

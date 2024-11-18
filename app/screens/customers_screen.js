import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AllCustomers,
  createEntries,
  InsertCustomersData,
} from "../dB/operations";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
export default function Customers_screen() {
  const navigation = useNavigation();
  const [customerData, setCustomerdata] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fun() {
      try {
        await createEntries();
      } catch (error) {}
    }
    fun();
    Customers();
  }, []);
  async function Customers() {
    try {
      const res = await AllCustomers();
      setData(res);
    } catch (error) {
      console.log(error);
    }
  }
  const refRBSheet = useRef();
  const InsertCustomers = async () => {
    try {
      const res = await InsertCustomersData(
        customerData.name,
        customerData.phone,
        customerData.address
      );
      if (res) {
        setCustomerdata({
          name: "",
          phone: "",
          address: "",
        });
      }
    } catch (error) {}
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="felx flex-row justify-end p-2">
          <Button
            title="Add Customer"
            onPress={() => refRBSheet.current.open()}
          />
        </View>

        <View className="bg-gray-500 mx-2 mt-5 flex flex-row items-center rounded">
          <Text className="text-white text-xl px-3 w-[22%]">Name</Text>
          <Text className="text-white text-xl px-3 w-[23%]">Phone</Text>
          <Text className="text-white text-xl px-3 w-[34%]">Address</Text>
          <Text className="text-white text-xl px-5 w-[35%]">Katha</Text>
        </View>
        <View>
          {data.map((item, index) => {
            return (
              <TouchableOpacity
                className="bg-gray-200 mx-2 py-2 flex flex-row items-center "
                key={index}
              >
                <Text className=" text-lg px-3 w-[22%]">{item.name}</Text>
                <Text className=" text-lg px-3 w-[23%]">{item.phone}</Text>
                <Text className=" text-lg px-3 w-[35%]">{item.address}</Text>
                <View
                  className=" mx-auto"
                  onPress={() =>
                    navigation.navigate("manuplate", {
                      customerid: item.id,
                      customername: item.name,
                    })
                  }
                >
                  <AntDesign
                    name="eyeo"
                    size={24}
                    color="black"
                    className=""
                    onPress={() =>
                      navigation.navigate("manuplate", {
                        customerid: item.id,
                        customername: item.name,
                      })
                    }
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <RBSheet
        ref={refRBSheet}
        useNativeDriver={true}
        customStyles={{
          container: {
            height: 320,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            position: "absolute",
            top: 0,
          },
          // draggableIcon: {
          //   backgroundColor: "#000",
          // },
        }}
        // draggable={true}
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <ScrollView className="mt-10">
          <Text className="p-2 font-bold text-[20px] ml-6">
            Add/Update Customer Details
          </Text>
          <View className="border-[0.8px] border-gray-400 p-2 mx-10 rounded mb-3">
            <TextInput
              placeholder="Enter Customername"
              value={customerData.name}
              onChangeText={(text) => {
                setCustomerdata((prev) => {
                  return {
                    ...prev,
                    name: text,
                  };
                });
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 p-2 mx-10 rounded mb-3">
            <TextInput
              placeholder="Enter Customer phone number"
              keyboardType="numeric"
              value={customerData.phone}
              onChangeText={(text) => {
                setCustomerdata((prev) => {
                  return {
                    ...prev,
                    phone: text,
                  };
                });
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 p-2 mx-10 rounded mb-3">
            <TextInput
              placeholder="Enter Customer address"
              value={customerData.address}
              onChangeText={(text) => {
                setCustomerdata((prev) => {
                  return {
                    ...prev,
                    address: text,
                  };
                });
              }}
            />
          </View>
          <View className="mx-20 rounded-2xl">
            <Button title="Submit" onPress={InsertCustomers} />
          </View>
        </ScrollView>
      </RBSheet>
    </SafeAreaView>
  );
}

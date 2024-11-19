import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AllCustomers,
  createCustomerKathaSummaryTable,
  createEntries,
  DeleteCustomer,
  InsertCustomersData,
  UpdateCustomerData,
} from "../dB/operations";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomerContext, { Customer } from "../useContext/context";
export default function Customers_screen() {
  const navigation = useNavigation();
  const [customerData, setCustomerdata] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [data, setData] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [customerid, setCustomerid] = useState("");
  const { FindTotalCustomers } = CustomerContext(Customer);
  useEffect(() => {
    async function fun() {
      try {
        await createEntries();
      } catch (error) {}
    }
    fun();
    Customers();
    fun1()
  }, []);
  async function fun1()
  {
    try {
      const res=await createCustomerKathaSummaryTable()
    } catch (error) {
      console.log(error)
    }
  }
  async function Customers() {
    try {
      const res = await AllCustomers();
      setData(res);
      // FindTotalCustomers(res.length);
    } catch (error) {
      console.log(error);
    }
  }
  const refRBSheet = useRef();
  const InsertCustomers = async () => {
    try {
      const customer = {
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
      };
      setData((prevData) => [...prevData, customer]);
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
  const UpdateCustomer = async () => {
    try {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === customerid
            ? {
                ...item,
                name: customerData.name,
                phone: customerData.phone,
                address: customerData.address,
              }
            : item
        )
      );
      const res = await UpdateCustomerData(
        customerid,
        customerData.name,
        customerData.phone,
        customerData.address
      );
      refRBSheet.current.close();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      setData((prev) => prev.filter((customer) => customer.id !== id));
      const res = await DeleteCustomer(id);
    } catch (error) {
      console.log(error);
    }
  };
  const [Search, setSearch] = useState("");
  const filterData = data.filter((value) => {
    return (
      value.name.toLowerCase().includes(Search.toLowerCase()) ||
      value.phone.toLowerCase().includes(Search.toLowerCase())
    );
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="felx flex-row justify-end p-2">
          <Button
            title="Add Customer"
            onPress={() => {
              setCustomerdata({
                name: "",
                phone: "",
                address: "",
              });
              refRBSheet.current.open();
            }}
          />
        </View>
        <View className="border-[0.9px] border-gray-400 mx-10 rounded p-2 flex flex-row items-center ">
          <FontAwesome name="search" size={20} color="black" />
          <TextInput
            placeholder="Serach Customer"
            maxLength={20}
            value={Search}
            onChangeText={(text) => setSearch(text)}
            className="ml-2"
          />
        </View>
        <View className="bg-gray-500 mx-2 mt-5 flex flex-row items-center rounded">
          <Text className="text-white text-xl px-3 w-[22%]">Name</Text>
          <Text className="text-white text-xl px-3 w-[23%]">Phone</Text>
          <Text className="text-white text-xl px-3 w-[34%]">Address</Text>
          <Text className="text-white text-xl px-5 w-[35%]">Katha</Text>
        </View>
        <View>
          {filterData.map((item, index) => {
            return (
              <TouchableOpacity
                className="bg-gray-200 mx-2 py-2 flex flex-row items-center "
                key={index}
                onPress={() => {
                  Alert.alert(
                    `${item.name}`,
                    "If you want to update or delete this customer, long press on the name.",
                    [
                      {
                        text: "Update",
                        onPress: () => {
                          setCustomerid(item.id);
                          setUpdateStatus(true);
                          setCustomerdata({
                            name: item.name,
                            phone: item.phone,
                            address: item.address,
                          });
                          refRBSheet.current.open();
                        },
                      },
                      {
                        text: "Delete",
                        onPress: () => handleDelete(item.id),
                        style: "destructive",
                      },
                    ],
                    { cancelable: true }
                  );
                }}
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
                        phone: item.phone,
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
              maxLength={30}
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
              maxLength={10}
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
              maxLength={100}
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
            <Button
              title="Submit"
              onPress={() => {
                if (!updateStatus) {
                  InsertCustomers();
                } else {
                  UpdateCustomer();
                }
              }}
            />
          </View>
        </ScrollView>
      </RBSheet>
    </SafeAreaView>
  );
}

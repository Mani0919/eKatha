import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { Customer } from "../useContext/context";
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import noimg from "../assests/noimg.png";
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
  const { setCustomerDetails } = useContext(Customer);
  useEffect(() => {
    async function fun() {
      try {
        await createEntries();
      } catch (error) {}
    }
    fun();
    Customers();
    fun1();
  }, []);

  async function fun1() {
    try {
      const res = await createCustomerKathaSummaryTable();
    } catch (error) {
      console.log(error);
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

  const InsertCustomers = async () => {
    try {
  
      // setData((prevData) => [...prevData, customer]);
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
      await Customers();
    } catch (error) {}
  };
  const UpdateCustomer = async () => {
    console.log(customerid, "updated");
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
      if (res) {
        setModalVisible(false);
      } else {
        Alert.alert("something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    console.log(id, "ddeeleldele");
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
  const [modalVisible, setModalVisible] = useState(false);

  const handleCustomerDetails = (id, name) => {
    navigation.navigate("manuplate", {
      customerid: id,
      customername: name,
    });
  };
  return (
    <SafeAreaView className="flex-1">
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
              // refRBSheet.current.open();
              setModalVisible(true);
            }}
          />
        </View>
        {filterData.length > 0 ? (
          <View>
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
                              // refRBSheet.current.open();
                              setModalVisible(true);
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
                    <Text className=" text-lg px-3 w-[35%]">
                      {item.address}
                    </Text>
                    <View
                      className=" mx-auto"
                      onPress={() => handleCustomerDetails(item.id, item.name)}
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
          </View>
        ) : (
          <View className="mx-auto p-10 flex flex-col items-center">
            <Image source={noimg} className="w-44 h-44" />
            <Text className="text-[20px] font-bold">No data</Text>
          </View>
        )}
      </ScrollView>

      {modalVisible && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 justify-center items-center">
          <Animated.View
            entering={SlideInUp.duration(300)} // Slide from bottom to top
            exiting={SlideOutUp.duration(300)} // Slide up to dismiss
            className="absolute top-0 left-0 right-0 bg-white rounded-b-2xl p-6 shadow-lg"
          >
            <ScrollView>
              <Text className="text-lg font-bold mb-4">
                Add/Update Customer Details
              </Text>
              <View className="border-[0.9px] border-gray-400 rounded mb-4 p-3">
                <TextInput
                  placeholder="Enter Customer Name"
                  value={customerData.name}
                  onChangeText={(text) =>
                    setCustomerdata((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>
              <View className="border-[0.9px] border-gray-400 rounded mb-4 p-3">
                <TextInput
                  placeholder="Enter Customer Phone"
                  value={customerData.phone}
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={(text) =>
                    setCustomerdata((prev) => ({ ...prev, phone: text }))
                  }
                />
              </View>
              <View className="border-[0.9px] border-gray-400 rounded mb-4 p-3">
                <TextInput
                  placeholder="Enter Customer Address"
                  value={customerData.address}
                  onChangeText={(text) =>
                    setCustomerdata((prev) => ({ ...prev, address: text }))
                  }
                />
              </View>
              <View className="rounded-2xl mb-4 w-full flex flex-row justify-between items-center">
                <View className="p-2 w-36 rounded">
                  <Button
                    title="Close"
                    onPress={() => setModalVisible(false)}
                    color="red"
                  />
                </View>
                <View className="p-2 w-36 rounded">
                  <Button
                    title="Submit"
                    onPress={() => {
                      if (!updateStatus) {
                        InsertCustomers();
                      } else {
                        UpdateCustomer();
                      }
                      setModalVisible(false);
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

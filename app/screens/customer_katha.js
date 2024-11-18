import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AllCustomersKatha,
  CustomerKatha,
  DeleteCustomerKath,
  InsertCustomersKathaDeatils,
  UpdatecutomerKatha,
} from "../dB/operations";
import RBSheet from "react-native-raw-bottom-sheet";

export default function CustomerKathas({ route }) {
  const { customerid, customername } = route?.params;
  const [customerKatha, setCustomerKatha] = useState({
    date: "",
    products: "",
    totalamount: "",
    paid: "",
    due: "",
  });
  const [data, setData] = useState([]);
  const refRBSheet = useRef();
  const [updateStatus, setUpdateStatus] = useState(false);
  const [updateid, setUpdateid] = useState("");
  useEffect(() => {
    async function fun() {
      try {
        const res = CustomerKatha(customerid, customername);
      } catch (error) {}
    }
    fun();
  }, []);

  const InsertCustomerKatha = async () => {
    try {
      const newKatha = {
        customerid,
        customername,
        date: customerKatha.date,
        totalproducts: customerKatha.products,
        totalamount: customerKatha.totalamount,
        paid: customerKatha.paid,
        due: customerKatha.due,
      };
      setData((prevData) => [...prevData, newKatha]);
      const res = await InsertCustomersKathaDeatils(
        customerid,
        customername,
        customerKatha.date,
        customerKatha.products,
        customerKatha.totalamount,
        customerKatha.paid,
        customerKatha.due
      );
      refRBSheet.current.close();
    } catch (error) {
      console.log("err", error);
    }
  };
  useEffect(() => {
    // Alert.alert(
    //   "If you want to update/delete the katha, long press on the date "
    // );
    async function katha() {
      try {
        const res = await AllCustomersKatha(customerid, customername);
        setData(res.length > 0 ? res : []);
      } catch (error) {
        console.log(error);
      }
    }
    katha();
  }, [customerid, data.length]);

  const handleDelete = async (id) => {
    try {
      setData((prev) => prev.filter((customer) => customer.id !== id));
      const res = await DeleteCustomerKath(customerid, customername, id);
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateCustomerKatha = async () => {
    try {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === updateid
            ? {
                ...item,
                date: customerKatha.date,
                totalproducts: customerKatha.products,
                totalamount: customerKatha.totalamount,
                paid: customerKatha.paid,
                due: customerKatha.due,
              }
            : item
        )
      );
      const res = await UpdatecutomerKatha(
        customerid,
        customername,
        customerKatha.date,
        customerKatha.products,
        customerKatha.totalamount,
        customerKatha.paid,
        customerKatha.due,
        updateid
      );
      refRBSheet.current.close();
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateStatus(false);
    }
  };
  return (
    <SafeAreaView>
      <View>
        <View className="flex flex-row justify-end p-2">
          <Button title="Add katha" onPress={() => refRBSheet.current.open()} />
        </View>
      </View>

      <View className="bg-gray-500 mx-2 mt-5 flex flex-row items-center rounded">
        <Text className="text-white text-lg px-2 w-[20%]">Date</Text>
        <Text className="text-white text-lg px-3 w-[23%]"> Products</Text>
        <Text className="text-white text-lg px-3 w-[23%]"> Amount</Text>
        <Text className="text-white text-lg px-2 w-[20%]">Paid</Text>
        <Text className="text-white text-lg px-1 w-[35%]">Due</Text>
      </View>
      <View>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              className="bg-gray-200 mx-2 py-2 flex flex-row items-center "
              key={index}
              onPress={() => {
                Alert.alert(
                  "Katha Options",
                  "If you want to update or delete the katha, long press on the date.",
                  [
                    {
                      text: "Update",
                      onPress: () => {
                        setUpdateid(item.id);
                        setUpdateStatus(true);
                        console.log("Updating customer katha:", item);
                        setCustomerKatha({
                          date: item.date,
                          products: item.totalproducts,
                          totalamount: item.totalamount,
                          paid: item.paid,
                          due: item.due,
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
              <Text className=" text-lg px-3 w-[22%]">{item.date}</Text>
              <Text className=" text-lg px-3 w-[23%]">
                {item.totalproducts}
              </Text>
              <Text className=" text-lg px-3 w-[20%]">{item.totalamount}</Text>
              <Text className=" text-lg px-3 w-[20%]">{item.paid}</Text>
              <Text className=" text-lg px-3 w-[35%]">{item.due}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={true}
        customStyles={{
          container: {
            height: 420,
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
            Add/Update Customer Katha
          </Text>
          <View className="border-[0.8px] border-gray-400 p-2 mx-10 rounded mb-3">
            <TextInput
              placeholder="Enter data"
              value={customerKatha.date}
              onChangeText={(text) => {
                setCustomerKatha((prev) => {
                  return {
                    ...prev,
                    date: text,
                  };
                });
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 p-2 mx-10 rounded mb-3">
            <TextInput
              placeholder="Enter total products "
              keyboardType="numeric"
              value={customerKatha.products}
              onChangeText={(text) => {
                setCustomerKatha((prev) => {
                  return {
                    ...prev,
                    products: text,
                  };
                });
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 p-2 mx-10 rounded mb-3">
            <TextInput
              placeholder="Enter total amount "
              keyboardType="numeric"
              value={customerKatha.totalamount}
              onChangeText={(text) => {
                setCustomerKatha((prev) => {
                  return {
                    ...prev,
                    totalamount: text,
                  };
                });
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 p-2 mx-10 rounded mb-3">
            <TextInput
              placeholder="paid amount"
              keyboardType="numeric"
              value={customerKatha.paid}
              onChangeText={(text) => {
                const totalAmount = parseFloat(customerKatha.totalamount) || 0;
                const paidAmount = parseFloat(text) || 0;
          
                if (paidAmount <= totalAmount) {
                  setCustomerKatha((prev) => ({
                    ...prev,
                    paid: text,
                  }));
                } else {
                  alert("Paid amount cannot be greater than total amount");
                }
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 p-2 mx-10 rounded mb-3">
            <TextInput
              placeholder="Due amount to pay"
              keyboardType="numeric"
              value={customerKatha.due}
              onChangeText={(text) => {
                const totalAmount = parseFloat(customerKatha.totalamount) || 0;
                const dueAmount = parseFloat(text) || 0;
          
                if (dueAmount <= totalAmount) {
                  setCustomerKatha((prev) => ({
                    ...prev,
                    due: text,
                  }));
                } else {
                  alert("Due amount cannot be greater than total amount");
                }
              }}
            />
          </View>
          <View className="mx-20 rounded-2xl">
            <Button
              title="Submit"
              onPress={() => {
                if (!updateStatus) {
                  InsertCustomerKatha();
                } else {
                  UpdateCustomerKatha();
                }
              }}
            />
          </View>
        </ScrollView>
      </RBSheet>
    </SafeAreaView>
  );
}

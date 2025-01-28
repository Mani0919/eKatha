import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AllCustomersKatha,
  CustomerKatha,
  DailySummary,
  DeleteCustomerKath,
  InsertCustomersKathaDeatils,
  updateCustomerKathaSummary,
  UpdatecutomerKatha,
} from "../dB/operations";
import RBSheet from "react-native-raw-bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Customer } from "../useContext/context";
import noimg from "../assests/noimg.png";

export default function CustomerKathas({ route }) {
  const navigation = useNavigation();
  const { customerid, customername, phone } = route?.params;
  const { addCustomerKatha } = useContext(Customer);
  const [customerKatha, setCustomerKatha] = useState({
    date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
    products: "",
    totalamount: "",
    paid: "",
    due: "",
  });
  const [data, setData] = useState([]);
  const refRBSheet = useRef();
  const share = useRef();
  const [updateStatus, setUpdateStatus] = useState(false);
  const [updateid, setUpdateid] = useState("");
  const [totaldue, setTotaldue] = useState(0);
  useEffect(() => {
    async function fun() {
      try {
        const res = CustomerKatha(customerid, customername);
      } catch (error) {}
    }
    fun();
    fun1();
  }, []);
  async function fun1() {
    try {
      await DailySummary();
    } catch (error) {
      console.log(error);
    }
  }
  const InsertCustomerKatha = async () => {
    try {
      // const newKatha = {
      //   customerid,
      //   customername,
      //   date: customerKatha.date,
      //   totalproducts: customerKatha.products,
      //   totalamount: customerKatha.totalamount,
      //   paid: customerKatha.paid,
      //   due: customerKatha.due,
      // };
      // setData((prevData) => [...prevData, newKatha]);
      const res = await InsertCustomersKathaDeatils(
        customerid,
        customername,
        customerKatha.date,
        customerKatha.products,
        customerKatha.totalamount,
        customerKatha.paid,
        customerKatha.due
      );
      console.log("id", customerid);
      const result = await updateCustomerKathaSummary(customerid, customername); //newly kept
      if (res) {
        await AllCustomersKatha(customerid, customername);
        refRBSheet.current.close();
      } else {
        Alert.alert("Something went wrong");
      }
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
        console.log("Customer Katha", res);
        setData(res.length > 0 ? res : []);
        let sum = 0;
        res.map((item, _) => {
          sum = sum + parseInt(item.due);
        });
        setTotaldue(sum);
      } catch (error) {
        console.log(error);
      }
    }
    katha();
  }, [customerid]);

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

  const getDate=(date)=>
  {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${da}-${mo}-${ye}`;
  }

  return (
<SafeAreaView className="flex-1 bg-gray-50">
 {/* Header */}
 <View className="bg-white px-4 py-3 flex-row justify-between items-center shadow-md">
   <View className="flex-row items-center space-x-3">
     <AntDesign name="arrowleft" size={24} className="text-gray-800" onPress={() => navigation.goBack()} />
     <Text className="text-xl font-semibold text-gray-800">Customer Katha</Text>
   </View>
   <TouchableOpacity onPress={() => share.current.open()}>
     <Ionicons name="share-social-outline" size={24} className="text-gray-800" />
   </TouchableOpacity>
 </View>

 {/* Add Button */}
 <View className="px-4 py-3">
   <TouchableOpacity 
     className="bg-blue-600 py-2.5 px-6 rounded-lg self-end flex-row items-center space-x-2"
     onPress={() => {
       setCustomerKatha({
         date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
         products: "",
         totalamount: "",
         paid: "",
         due: "",
       });
       refRBSheet.current.open();
     }}
   >
     <MaterialIcons name="add" size={20} color="white" />
     <Text className="text-white font-medium">Add Katha</Text>
   </TouchableOpacity>
 </View>

 {data.length > 0 ? (
   <ScrollView className="flex-1">
     {/* Due Amount Card */}
     <View className="mx-4 mb-4 bg-white rounded-xl shadow-sm p-4">
       <Text className="text-gray-600 text-base">Total Due Amount</Text>
       <Text className="text-3xl font-bold text-gray-900 mt-1">₹{totaldue}</Text>
     </View>

     {/* Table */}
     <View className="mx-4 bg-white rounded-xl shadow-sm overflow-hidden">
       <View className="bg-gray-800 px-4 py-3 flex-row items-center">
         <Text className="text-white font-medium w-[20%]">Date</Text>
         <Text className="text-white font-medium w-[23%]">Products</Text>
         <Text className="text-white font-medium w-[23%]">Amount</Text>
         <Text className="text-white font-medium w-[17%]">Paid</Text>
         <Text className="text-white font-medium flex-1">Due</Text>
       </View>

       {data.map((item, index) => {
  // Format the date using Intl.DateTimeFormat with a short month
  const formattedDate = new Date(
    item.date.split("-").reverse().join("-")
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short", // Use short for abbreviated month
    day: "numeric",
  });

  return (
    <TouchableOpacity
      key={index}
      className={`px-4 py-3.5 flex-row items-center border-b border-gray-100 ${
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      }`}
      onPress={() => {
        Alert.alert(
          "Manage Entry",
          "Choose an action",
          [
            {
              text: "Update",
              onPress: () => {
                setUpdateid(item.id);
                setUpdateStatus(true);
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
              style: "destructive",
              onPress: () => handleDelete(item.id),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }}
    >
      {/* Use the formatted date */}
      <Text className="text-gray-800 w-[20%]">{formattedDate}</Text>
      <Text className="text-gray-800 w-[23%]">{item.totalproducts}</Text>
      <Text className="text-gray-800 w-[23%]">₹{item.totalamount}</Text>
      <Text className="text-green-600 font-medium w-[17%]">₹{item.paid}</Text>
      <Text className="text-red-600 font-medium flex-1">₹{item.due}</Text>
    </TouchableOpacity>
  );
})}

     </View>
   </ScrollView>
 ) : (
   <View className="flex-1 justify-center items-center p-8">
     <Image source={noimg} className="w-48 h-48 opacity-75" />
     <Text className="text-xl font-semibold text-gray-800 mt-6">No Entries Yet</Text>
     <Text className="text-gray-500 text-center mt-2">Start by adding your first katha entry</Text>
   </View>
 )}

 {/* Add/Edit Sheet */}
 <RBSheet
 ref={refRBSheet}
 height={520}
 openDuration={250}
 customStyles={{
   container: {
     borderTopLeftRadius: 20,
     borderTopRightRadius: 20,
   }
 }}
>
 <View className="flex-1 bg-white px-6 pt-6">
   <Text className="text-2xl font-bold text-gray-800 mb-6">
     {updateStatus ? "Update Entry" : "Add New Entry"}
   </Text>
   
   <ScrollView className="flex-1 -mx-2">
     <View className="mb-4">
       <Text className="text-sm font-medium text-gray-700 mb-1">Entry Date</Text>
       <TextInput
         className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
         placeholder="DD-MM-YYYY"
         value={customerKatha.date}
         onChangeText={text => setCustomerKatha(prev => ({...prev, date: text}))}
       />
     </View>

     <View className="mb-4">
       <Text className="text-sm font-medium text-gray-700 mb-1">Number of Products</Text>
       <TextInput
         className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
         placeholder="Enter total products"
         keyboardType="numeric"
         value={customerKatha.products}
         onChangeText={text => setCustomerKatha(prev => ({...prev, products: text}))}
       />
     </View>

     <View className="mb-4">
       <Text className="text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</Text>
       <TextInput
         className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
         placeholder="Enter total amount"
         keyboardType="numeric"
         value={customerKatha.totalamount}
         onChangeText={text => setCustomerKatha(prev => ({...prev, totalamount: text}))}
       />
     </View>

     <View className="mb-4">
       <Text className="text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</Text>
       <TextInput
         className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
         placeholder="Enter paid amount" 
         keyboardType="numeric"
         value={customerKatha.paid}
         onChangeText={text => {
           const total = parseFloat(customerKatha.totalamount) || 0;
           const paid = parseFloat(text) || 0;
           if (paid <= total) {
             setCustomerKatha(prev => ({...prev, paid: text}));
           } else {
             Alert.alert("Invalid Amount", "Paid amount cannot exceed total amount");
           }
         }}
       />
     </View>

     <View className="mb-6">
       <Text className="text-sm font-medium text-gray-700 mb-1">Due Amount (₹)</Text>
       <TextInput
         className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
         placeholder="Enter due amount"
         keyboardType="numeric"
         value={customerKatha.due}
         onChangeText={text => {
           const total = parseFloat(customerKatha.totalamount) || 0;
           const due = parseFloat(text) || 0;
           if (due <= total) {
             setCustomerKatha(prev => ({...prev, due: text}));
           } else {
             Alert.alert("Invalid Amount", "Due amount cannot exceed total amount");
           }
         }}
       />
     </View>
   </ScrollView>

   <View className="flex-row space-x-4 mb-6">
     <TouchableOpacity 
       className="flex-1 py-3 rounded-lg bg-gray-100"
       onPress={() => refRBSheet.current.close()}
     >
       <Text className="text-center text-gray-800 font-medium">Cancel</Text>
     </TouchableOpacity>
     
     <TouchableOpacity
       className="flex-1 py-3 rounded-lg bg-blue-600"
       onPress={() => {
         if (!updateStatus) {
           InsertCustomerKatha();
         } else {
           UpdateCustomerKatha();
         }
       }}
     >
       <Text className="text-center text-white font-medium">
         {updateStatus ? "Update" : "Save"}
       </Text>
     </TouchableOpacity>
   </View>
 </View>
</RBSheet>

 {/* Share Sheet */}
 <RBSheet
   ref={share}
   height={200}
   customStyles={{
     container: {
       borderTopLeftRadius: 20,
       borderTopRightRadius: 20,
     }
   }}
 >
   <View className="p-6">
     <Text className="text-xl font-bold text-gray-800 mb-6">Share Katha</Text>
     <View className="flex-row space-x-6">
       <TouchableOpacity
         className="bg-green-500 p-4 rounded-full"
         onPress={() => {
           const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
             `Hi ${customername}, your due amount is ₹${totaldue}`
           )}`;
           Linking.openURL(url).catch(() => Alert.alert("Error", "WhatsApp not installed"));
         }}
       >
         <FontAwesome name="whatsapp" size={32} color="white" />
       </TouchableOpacity>

       <TouchableOpacity
         className="bg-blue-500 p-4 rounded-full"
         onPress={() => {
           const url = `sms:${phone}?body=${encodeURIComponent(
             `Hi ${customername}, your due amount is ₹${totaldue}`
           )}`;
           Linking.openURL(url).catch(() => Alert.alert("Error", "Cannot send SMS"));
         }}
       >
         <MaterialIcons name="textsms" size={32} color="white" />
       </TouchableOpacity>
     </View>
   </View>
 </RBSheet>
</SafeAreaView>
  );
}

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
  UpdateShopOwner,
  UpdateShopOwnerDetails,
} from "../dB/operations";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import RBSheet from "react-native-raw-bottom-sheet";
export default function Home_screen({ route }) {
  const { title, subtitle, desc, message, id, phone } = route?.params || "";
  const { totalCustomers } = CustomerContext(Customer);
  const navigation = useNavigation();
  const [totalCustomer, setTotal] = useState("");
  const [notes, setNotes] = useState([]);
  const [moreKatha, setMoreKatha] = useState([]);
  const [shopOwnerdetails, setShopownerDetails] = useState({});
  const [toupdatedetails, setToupdateDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shopname: "",
  });
  useEffect(() => {
    async function fun() {
      try {
        const res = await SingleShopOwner(phone);
        setShopownerDetails(res[0]);
        setImage(res[0].pic);
        setToupdateDetails({
          name: res[0].fullname,
          email: res[0].email,
          phone: res[0].phone,
          address: res[0].address,
          shopname: res[0].shopname,
        });
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
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState("");

  const handleLogout = () => {
    navigation.navigate("auth");
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
    })();
  }, []);

  const openCamera = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      console.log(uri);
      setImage(uri);
      await UpdateShopOwner(uri, shopOwnerdetails.id);
    }
  };
  const refRBSheet = useRef();

  const handelUpdateOwner = async () => {
    try {
      setShopownerDetails({
        fullname: toupdatedetails.name,
        shopname: toupdatedetails.shopname,
        address: toupdatedetails.address,
      });
      const res = await UpdateShopOwnerDetails(
        toupdatedetails.name,
        toupdatedetails.phone,
        toupdatedetails.email,
        toupdatedetails.address,
        toupdatedetails.shopname,
        shopOwnerdetails.id
      );
      if (res) {
        refRBSheet.current.close();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-2 mx-5 flex flex-row justify-between items-center">
          <View>
            <Text className="text-[23px]">Hi,{shopOwnerdetails.fullname}</Text>
            <Text className="text-[20px]">{shopOwnerdetails.shopname}</Text>
            <Text className="text-[16px]">{shopOwnerdetails.address}</Text>
          </View>
          <TouchableOpacity onPress={() => setVisible(true)}>
            {image === "" ? (
              <Image source={img} className="w-14 h-14" />
            ) : (
              <Image
                source={{ uri: image }}
                className="w-20 h-20 rounded-full"
              />
            )}
          </TouchableOpacity>
        </View>
        <View className="p-2 mx-2 mt-5 flex flex-row justify-between items-center">
          <Text className="text-[20px] font-bold">Frequent customers</Text>
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

        <Modal
          transparent={true}
          visible={visible}
          animationType="slide"
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.drawer}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={openCamera}>
                <Text>Edit Profile Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => refRBSheet.current.open()}
              >
                <Text>Edit Profile details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  /* Add Logout logic */
                  handleLogout();
                }}
              >
                <Text>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <RBSheet
          ref={refRBSheet}
          useNativeDriver={true}
          customStyles={{
            container: {
              height: 375,
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
          <View className="mt-10 mx-auto mb-2">
            <Text className="font-bold text-[20px]">Update profile details</Text>
          </View>
          <View className="border-[0.8px] border-gray-400 mx-10 rounded p-2 ">
            <TextInput
              placeholder="Enter fullname"
              value={toupdatedetails.name}
              onChangeText={(text) => {
                setToupdateDetails((prev) => {
                  return {
                    ...prev,
                    name: text,
                  };
                });
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 mx-10 rounded p-2 mt-2">
            <TextInput
              placeholder="Enter phonenumber"
              keyboardType="numeric"
              value={toupdatedetails.phone}
              onChangeText={(text) => {
                setToupdateDetails((prev) => {
                  return {
                    ...prev,
                    phone: text,
                  };
                });
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 mx-10 rounded p-2 mt-2">
            <TextInput
              placeholder="Enter email"
              value={toupdatedetails.email}
              onChangeText={(text) => {
                setToupdateDetails((prev) => {
                  return {
                    ...prev,
                    email: text,
                  };
                });
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 mx-10 rounded p-2 mt-2">
            <TextInput
              placeholder="Enter address"
              value={toupdatedetails.address}
              onChangeText={(text) => {
                setToupdateDetails((prev) => {
                  return {
                    ...prev,
                    address: text,
                  };
                });
              }}
            />
          </View>
          <View className="border-[0.8px] border-gray-400 mx-10 rounded p-2 mt-2">
            <TextInput
              placeholder="Enter shopname"
              value={toupdatedetails.shopname}
              onChangeText={(text) => {
                setToupdateDetails((prev) => {
                  return {
                    ...prev,
                    shopname: text,
                  };
                });
              }}
            />
          </View>
          <View className="mx-16 mt-2">
            <Button title="Update" onPress={handelUpdateOwner} />
          </View>
        </RBSheet>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 24, margin: 10 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  drawer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  closeButton: { alignSelf: "flex-end", fontSize: 24, marginBottom: 10 },
  option: { marginVertical: 10 },
});

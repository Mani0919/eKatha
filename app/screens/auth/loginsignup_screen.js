import {
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import img from "../../assests/login.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import {
  CheckShopOwner,
  createShopOwners,
  InsertShopOwner,
} from "../../dB/operations";

export default function Loginsignup_screen() {
  const { width } = Dimensions.get("window");
  const [toggle, setToggle] = useState(true);
  const navigation = useNavigation();
  const [signUpdata, setSignupdata] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    shopname: "",
  });

  const [logindata, setLogindata] = useState({
    phone: "",
    password: "",
  });

  useEffect(() => {
    async function fun() {
      try {
        await createShopOwners();
      } catch (error) {
        console.log("database error");
      }
    }
    fun();
  }, []);

  const handleRegister = async () => {
    try {
      const res = await InsertShopOwner(
        signUpdata.name,
        signUpdata.email,
        signUpdata.phone,
        signUpdata.password,
        signUpdata.address,
        signUpdata.shopname
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogin = async () => {
    try {
      const res = await CheckShopOwner(logindata.phone, logindata.password);
      if (res) {
        navigation.replace("Home", {
          phone: logindata.phone,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#c0d6ed" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Image source={img} className="w-full h-96" />
        </View>

        {!toggle ? (
          <View
            className="bg-white p-2 -mt-20  w-full flex-1"
            style={style.container}
          >
            <View className="flex flex-row justify-center items-center py-4">
              <Text
                className={`text-[23px] -mr-1 ${
                  !toggle ? "text-blue-400" : ""
                }`}
              >
                SignIn
              </Text>
              <MaterialCommunityIcons
                name="slash-forward"
                size={24}
                color="black"
              />
              <Text
                className="text-[15px] -ml-1"
                onPress={() => setToggle(!toggle)}
              >
                Login
              </Text>
            </View>
            <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
              <TextInput
                placeholder="Enter fullname"
                value={signUpdata.name}
                onChangeText={(text) =>
                  setSignupdata((prev) => {
                    return { ...prev, name: text };
                  })
                }
              />
            </View>

            <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
              <TextInput
                placeholder="Enter phonenumber"
                keyboardType="numeric"
                value={signUpdata.phone}
                onChangeText={(text) =>
                  setSignupdata((prev) => {
                    return { ...prev, phone: text };
                  })
                }
              />
            </View>
            <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
              <TextInput
                placeholder="Enter email (optional)"
                value={signUpdata.email}
                onChangeText={(text) =>
                  setSignupdata((prev) => {
                    return { ...prev, email: text };
                  })
                }
              />
            </View>
            <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
              <TextInput
                placeholder="Enter password"
                value={signUpdata.password}
                onChangeText={(text) =>
                  setSignupdata((prev) => {
                    return { ...prev, password: text };
                  })
                }
              />
            </View>
            <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
              <TextInput
                placeholder="Enter address"
                value={signUpdata.address}
                onChangeText={(text) =>
                  setSignupdata((prev) => {
                    return { ...prev, address: text };
                  })
                }
              />
            </View>
            <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
              <TextInput
                placeholder="Enter shopname"
                value={signUpdata.shopname}
                onChangeText={(text) =>
                  setSignupdata((prev) => {
                    return { ...prev, shopname: text };
                  })
                }
              />
            </View>
            <View className=" p-2 mx-10 rounded">
              <Button title="Submit" onPress={handleRegister} />
            </View>
          </View>
        ) : (
          <View
            className="bg-white p-2 -mt-20  w-full flex-1"
            style={style.container}
          >
            <View className="flex flex-row justify-center items-center py-4">
              <Text
                className="text-[15px] -mr-1"
                onPress={() => setToggle(!toggle)}
              >
                SignIn
              </Text>
              <MaterialCommunityIcons
                name="slash-forward"
                size={24}
                color="black"
              />
              <Text
                className={`text-[23px] -ml-1 ${toggle ? "text-blue-400" : ""}`}
              >
                Login
              </Text>
            </View>
            <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
              <TextInput
                placeholder="Enter phonenumber"
                keyboardType="numeric"
                value={logindata.phone}
                onChangeText={(text) => {
                  setLogindata((prev) => {
                    return {
                      ...prev,
                      phone: text,
                    };
                  });
                }}
              />
            </View>
            <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
              <TextInput
                placeholder="Enter password"
                value={logindata.password}
                onChangeText={(text) => {
                  setLogindata((prev) => {
                    return {
                      ...prev,
                      password: text,
                    };
                  });
                }}
              />
            </View>
            <View className=" p-2 mx-10 rounded">
              <Button title="Submit" onPress={handleLogin} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

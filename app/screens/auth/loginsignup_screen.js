import {
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import img from "../../assests/login.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import {
  CheckShopOwner,
  createCustomerKathaSummaryTable,
  createEntries,
  createShopOwners,
  InsertShopOwner,
} from "../../dB/operations";
import { Formik, useFormik } from "formik";
import { Login, SignUp } from "../../Validations/sigup_validation";

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
    fun1();
    fun2();
  }, []);
  async function fun1() {
    try {
      await createEntries();
    } catch (error) {
      console.log(error);
    }
  }
  async function fun2()
  {
    try {
      await createCustomerKathaSummaryTable()
    } catch (error) {
      console.log(error)
    }
  }
  const profile = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      shopname: "",
    },
    initialValues: signUpdata,
    validationSchema: SignUp,
    onSubmit: () => {
      const handleRegister = async () => {
        try {
          const res = await InsertShopOwner(
            profile.values.name,
            profile.values.email,
            profile.values.phone,
            profile.values.password,
            profile.values.address,
            profile.values.shopname
          );
          if (res) {
            Alert.alert("Registred");
            setToggle(true)
          } else {
            Alert.alert("Something went wrong");
          }
        } catch (error) {
          console.log(error);
        }
      };
      handleRegister();
    },
  });
  const login = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: Login,
    onSubmit: () => {
      const handleLogin = async () => {
        try {
          const res = await CheckShopOwner(
            login.values.phone,
            login.values.password
          );
          if (res) {
            navigation.replace("Home", {
              phone: login.values.phone,
            });
          } else {
            Alert.alert("Invalid user");
          }
        } catch (error) {
          console.log(error);
        }
      };
      handleLogin();
    },
  });
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
            {[
              { placeholder: "Enter fullname", name: "name" },
              {
                placeholder: "Enter phonenumber",
                name: "phone",
                keyboardType: "numeric",
                maxLength: 10,
              },
              { placeholder: "Enter email (optional)", name: "email" },
              { placeholder: "Enter password", name: "password" },
              { placeholder: "Enter address", name: "address" },
              { placeholder: "Enter shopname", name: "shopname" },
            ].map((field, index) => (
              <View key={index}>
                <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
                  <TextInput
                    placeholder={field.placeholder}
                    keyboardType={field.keyboardType}
                    maxLength={field.maxLength}
                    value={profile.values[field.name]}
                    onChangeText={profile.handleChange(field.name)}
                    onBlur={profile.handleBlur(field.name)}
                  />
                </View>
                {profile.touched[field.name] && profile.errors[field.name] ? (
                  <Text className="text-red-500 mx-10">
                    {profile.errors[field.name]}
                  </Text>
                ) : null}
              </View>
            ))}

            <View className=" p-2 mx-10 rounded">
              <Button title="Submit" onPress={profile.handleSubmit} />
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
                maxLength={10}
                value={login.values.phone}
                onChangeText={login.handleChange("phone")}
                onBlur={login.handleBlur("phone")}
              />
            </View>
            {login.touched.phone && login.errors.phone ? (
              <Text className="text-red-500 mx-10">{login.errors.phone}</Text>
            ) : null}
            {/* Password Input */}
            <View className="border-[0.7px] border-gray-300 p-2 mx-10 rounded mb-2">
              <TextInput
                placeholder="Enter password"
                value={login.values.password} // Formik-managed state
                secureTextEntry // Hide password input
                onChangeText={login.handleChange("password")} // Formik handler
                onBlur={login.handleBlur("password")} // Mark as touched when blurred
              />
            </View>
            {login.touched.password && login.errors.password ? (
              <Text className="text-red-500 mx-10">
                {login.errors.password}
              </Text>
            ) : null}
            {/* Submit Button */}
            <View className="p-2 mx-10 rounded">
              <Button title="Submit" onPress={login.handleSubmit} />
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

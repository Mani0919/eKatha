import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import img from "../../assests/login.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import {
  AllShopOwners,
  CheckShopOwner,
  createCustomerKathaSummaryTable,
  createEntries,
  createShopOwners,
  InsertShopOwner,
} from "../../dB/operations";
import { Formik, useFormik } from "formik";
import { Login, SignUp } from "../../Validations/sigup_validation";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import ForgotPasswordModal from "../../ui/forgot";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Loginsignup_screen() {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(100);
  const { height } = Dimensions.get("window");
  const [toggle, setToggle] = useState(true);
  const navigation = useNavigation();
  const [shopOwners, setShopOwners] = useState([]);
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [toggle]);

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
        const res = await AllShopOwners();
        setShopOwners(res);
        const t=await AsyncStorage.getItem("login");
        if(t!=null){
          navigation.replace("Home");
        }
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
  async function fun2() {
    try {
      await createCustomerKathaSummaryTable();
    } catch (error) {
      console.log(error);
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
      console.log(profile.values);
      const handleRegister = async () => {
        const res = shopOwners.find(
          (item) => item.phone === profile.values.phone
        );
        if (res) {
          Toast.show({
            type: "info",
            text1: "Phone number already exist",
            text2: "Please try with another phone number",
            position: "top",
          });
        } else {
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
             
              Toast.show({
                type: "success",
                text1: "Account Created!",
                text2: "You have successfully registered 🎉",
                position: "top",
                visibilityTime: 3000,
              });
              setToggle(true);
              profile.resetForm();
            } else {
              Alert.alert("Phone number already exist");
            }
          } catch (error) {
            console.log(error);
          }
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
            await AsyncStorage.setItem("login","true");
            await AsyncStorage.setItem("phone",login.values.phone);
            navigation.replace("Home", {
              phone: login.values.phone,
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Invalid Credentials",
              text2: "Please check your phone number and password",
              position: "top",
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      handleLogin();
    },
  });

  const renderInput = (
    { placeholder, name, keyboardType, maxLength, secureTextEntry },
    formik
  ) => (
    <View className="mb-4">
      <View className="relative">
        <View className="absolute top-[14px] left-4 z-10">
          {name === "email" && (
            <Feather name="mail" size={20} color="#6b7280" />
          )}
          {name === "password" && (
            <Feather name="lock" size={20} color="#6b7280" />
          )}
          {name === "phone" && (
            <Feather name="phone" size={20} color="#6b7280" />
          )}
          {name === "name" && <Feather name="user" size={20} color="#6b7280" />}
          {name === "address" && (
            <Feather name="map-pin" size={20} color="#6b7280" />
          )}
          {name === "shopname" && (
            <Feather name="shopping-bag" size={20} color="#6b7280" />
          )}
        </View>
        <TextInput
          placeholder={placeholder}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          value={formik.values[name]}
          onChangeText={formik.handleChange(name)}
          onBlur={formik.handleBlur(name)}
          className="bg-gray-50/60 rounded-xl px-12 py-4 text-gray-700 text-[16px]"
          placeholderTextColor="#9ca3af"
        />
      </View>
      {formik.touched[name] && formik.errors[name] && (
        <Text className="text-red-500 text-sm ml-4 mt-1">
          {formik.errors[name]}
        </Text>
      )}
    </View>
  );
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#1e40af" barStyle="light-content" />

      {/* Fixed Header Image */}
      <View className="h-[35%]">
        <Image source={img} className="absolute w-full h-full" />
        <LinearGradient
          colors={["rgba(30,64,175,0.4)", "rgba(30,64,175,0.8)"]}
          className="absolute w-full h-full"
        />
      </View>

      {/* Scrollable Content */}
      <Animated.View
        className="flex-1 bg-white rounded-t-3xl -mt-20"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
        >
          {/* Auth Toggle */}
          <View className="flex-row justify-center items-center my-6">
            <TouchableOpacity
              onPress={() => setToggle(false)}
              className={`px-6 py-2 rounded-l-full ${
                !toggle ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-[16px] font-semibold ${
                  !toggle ? "text-white" : "text-gray-600"
                }`}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setToggle(true)}
              className={`px-6 py-2 rounded-r-full ${
                toggle ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-[16px] font-semibold ${
                  toggle ? "text-white" : "text-gray-600"
                }`}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 120 : 90,
            }}
          >
            {/* Form Fields */}
            <View className="px-6">
              {!toggle ? (
                // Sign Up Form
                <>
                  {[
                    { placeholder: "Full Name", name: "name" },
                    {
                      placeholder: "Phone Number",
                      name: "phone",
                      keyboardType: "numeric",
                      maxLength: 10,
                    },
                    {
                      placeholder: "Email (optional)",
                      name: "email",
                      keyboardType: "email-address",
                    },
                    {
                      placeholder: "Password",
                      name: "password",
                      secureTextEntry: true,
                    },
                    { placeholder: "Address", name: "address" },
                    { placeholder: "Shop Name", name: "shopname" },
                  ].map((field, index) => renderInput(field, profile))}
                </>
              ) : (
                // Login Form
                <>
                  {renderInput(
                    {
                      placeholder: "Phone Number",
                      name: "phone",
                      keyboardType: "numeric",
                      maxLength: 10,
                    },
                    login
                  )}
                  {renderInput(
                    {
                      placeholder: "Password",
                      name: "password",
                      secureTextEntry: true,
                    },
                    login
                  )}
                </>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={toggle ? login.handleSubmit : profile.handleSubmit}
                className="bg-blue-500 rounded-xl py-4 mt-4"
              >
                <Text className="text-white text-center font-bold text-lg">
                  {toggle ? "Login" : "Create Account"}
                </Text>
              </TouchableOpacity>

              {/* Additional Options */}
              {toggle && (
                <TouchableOpacity
                  className="mt-4"
                  onPress={() => setIsForgotPasswordVisible(true)}
                >
                  <Text className="text-blue-500 text-center">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
          <ForgotPasswordModal
            visible={isForgotPasswordVisible}
            onClose={() => setIsForgotPasswordVisible(false)}
          />
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

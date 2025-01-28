import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ForgotPassword } from "../dB/operations";
import Toast from "react-native-toast-message";

const ForgotPasswordModal = ({ visible, onClose }) => {
  // Animation values
  const slideAnim = useState(
    new Animated.Value(Dimensions.get("window").height)
  )[0];

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
    forgotPasswordFormik.resetForm();
  };

  const forgotPasswordFormik = useFormik({
    initialValues: {
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Please enter valid phone number"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      console.log("Reset password values:", values);
      // Handle password reset logic here
      try {
        const res = await ForgotPassword(values.phone, values.password);
        console.log(res);
        if (res) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Password reset successfully",
          });
          forgotPasswordFormik.resetForm();
        }
        else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to reset password,enter valid phone number",
          });
        }
      } catch (error) {
        console.error("Error resetting password:", error);
      }
      handleClose();
    },
  });

  const renderInput = ({
    name,
    placeholder,
    icon,
    secureTextEntry = false,
  }) => (
    <View className="mb-4">
      <View className="relative">
        <View className="absolute top-[14px] left-4 z-10">
          <Feather name={icon} size={20} color="#6b7280" />
        </View>
        <TextInput
          placeholder={placeholder}
          value={forgotPasswordFormik.values[name]}
          onChangeText={forgotPasswordFormik.handleChange(name)}
          onBlur={forgotPasswordFormik.handleBlur(name)}
          secureTextEntry={secureTextEntry}
          keyboardType={name === "phone" ? "numeric" : "default"}
          maxLength={name === "phone" ? 10 : undefined}
          className="bg-gray-50/60 rounded-xl px-12 py-4 text-gray-700 text-[16px]"
          placeholderTextColor="#9ca3af"
        />
      </View>
      {forgotPasswordFormik.touched[name] &&
        forgotPasswordFormik.errors[name] && (
          <Text className="text-red-500 text-sm ml-4 mt-1">
            {forgotPasswordFormik.errors[name]}
          </Text>
        )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-t-3xl p-6"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-800">
              Reset Password
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Feather name="x" size={24} color="#4b5563" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text className="text-gray-600 mb-6">
            Enter your phone number and new password to reset your account.
          </Text>

          {/* Form Fields */}
          {renderInput({
            name: "phone",
            placeholder: "Enter Phone Number",
            icon: "phone",
          })}
          {renderInput({
            name: "password",
            placeholder: "New Password",
            icon: "lock",
            secureTextEntry: true,
          })}
          {renderInput({
            name: "confirmPassword",
            placeholder: "Confirm Password",
            icon: "check",
            secureTextEntry: true,
          })}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={forgotPasswordFormik.handleSubmit}
            className="bg-blue-500 rounded-xl py-4 mt-4"
          >
            <Text className="text-white text-center font-bold text-lg">
              Reset Password
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;

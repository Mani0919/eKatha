import { View, Text,  Alert, TouchableOpacity, Animated, ScrollView } from 'react-native';
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { DeleteNotes, SingleNOte } from "../dB/operations";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
export default function Singlenotes_screen({ route }) {
  const { id, title,subtitle, desc } = route?.params || "";
  const [data, setData] = useState({});
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  useEffect(() => {
    if(title && desc)
    {
      setData({
        title:title,
        subtitle:subtitle,
        description:desc
      })
    }
    async function fun() {
      try {
        const res = await SingleNOte(id);
        setData(res[0]);
      } catch (error) {
        console.log(error);
      }
    }
    fun();
  }, [id,title,subtitle,desc]);
  const handleDelete = async () => {
    try {
      const res = await DeleteNotes(id);
      if (res) {
        navigation.navigate("Home",{
          message:"deleted",
          id:id
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formatDate = (date) => {
    const options = { 
      hour: '2-digit', 
      minute: '2-digit', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(date).toLocaleString('en-US', options);
  };
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  const confirmDelete = () => {
    Alert.alert(
      "Delete Note",
      "This action cannot be undone. Are you sure?",
      [
        {
          text: "Cancel",
          className: "text-gray-500 font-medium",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: handleDelete,
          className: "text-red-500 font-bold",
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50 ">
      <ScrollView className="flex-1">
        {/* Top Actions Bar */}
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
          className="px-4 py-3 backdrop-blur-lg"
        >
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 rounded-full bg-gray-100/80"
            >
              <Feather name="arrow-left" size={24} color="#374151" />
            </TouchableOpacity>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => navigation.navigate("Notes", { id })}
                className="p-3 rounded-full bg-blue-500/10"
              >
                <AntDesign name="edit" size={22} color="#2563eb" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={confirmDelete}
                className="p-3 rounded-full bg-red-500/10"
              >
                <AntDesign name="delete" size={22} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Content Container */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="px-5 py-6"
        >
          {/* Category Tag */}
          <View className="flex-row items-center mb-4">
            <View className="bg-violet-100 rounded-full px-4 py-1.5 flex-row items-center">
              <MaterialCommunityIcons name="note-text" size={16} color="#7c3aed" />
              <Text className="text-violet-700 ml-2 font-medium">Note</Text>
            </View>
          </View>

          {/* Title Section */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              {data?.title}
            </Text>
            {data?.subtitle && (
              <Text className="text-xl text-gray-600 font-medium leading-relaxed">
                {data.subtitle}
              </Text>
            )}
          </View>

          {/* Description Card */}
          <View className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-100/50 min-h-[200px] mb-6">
            <Text className="text-[17px] leading-relaxed text-gray-700">
              {data?.description}
            </Text>
          </View>

          {/* Metadata */}
          <View className="flex-row justify-between items-center mt-4 px-2">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="pencil-circle" size={20} color="#6b7280" />
              <Text className="text-gray-500 ml-2">
                {data?.editeddate ? 'Edited' : 'Created'}
              </Text>
            </View>
            
            {data.editeddate && (
              <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                <AntDesign name="clockcircle" size={16} color="#4b5563" />
                <Text className="text-gray-600 ml-2 font-medium">
                  {formatDate(data.editeddate)}
                </Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-center space-x-4 mt-8">
            <TouchableOpacity className="bg-gray-100 p-4 rounded-full">
              <Feather name="share-2" size={22} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 p-4 rounded-full">
              <Feather name="bookmark" size={22} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 p-4 rounded-full">
              <Feather name="copy" size={22} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

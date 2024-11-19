import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DeleteNotes, SingleNOte } from "../dB/operations";
import { useNavigation } from "@react-navigation/native";
export default function Singlenotes_screen({ route }) {
  const { id, title,subtitle, desc } = route?.params || "";
  const [data, setData] = useState({});
  const navigation = useNavigation();
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
  return (
    <SafeAreaView className="flex-1 ">
      <View className="flex-1 justify-between mt-5">
        <View>
          <View className="flex flex-row justify-end items-center gap-x-2 mr-3">
            <AntDesign
              name="edit"
              size={27}
              color="blue"
              onPress={() =>
                navigation.navigate("Notes", {
                  id: id,
                })
              }
            />
            <AntDesign
              name="delete"
              size={27}
              color="red"
              onPress={() => {
                Alert.alert(
                  "Confirmation",
                  "Are you sure you want to proceed?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      onPress: () => handleDelete(),
                    },
                  ],
                  { cancelable: true }
                );
              }}
            />
          </View>
          <View className="p-3 mx-5  mt-4">
            <View className="flex flex-row items-center gap-x-2">
              {/* <Text className="text-[23px] font-bold">Title:</Text> */}
              <Text className="text-[27px] font-bold">{data.title}</Text>
            </View>
            <View className="flex flex-row items-center gap-x-2">
              {/* <Text className="text-[23px] font-bold">SubTitle:</Text> */}
              <Text className="text-[23px] ">{data.subtitle}</Text>
            </View>
            <View className="flex flex-row items-start gap-x-2 justify-start">
              {/* <Text className="text-[23px] font-bold">Description:</Text> */}
              <Text className="text-[17px] ">{data.description}</Text>
            </View>
          </View>
        </View>
        {data.editeddate && (
          <View className="p-3  border-gray-300 flex flex-row items-center ml-3">
            <Text className="font-bold mr-1 text-[20px]">Edited at:</Text>
            <Text className="text-[17px]">{data.editeddate}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

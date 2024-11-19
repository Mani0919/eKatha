import { View, Text, TextInput, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InsertNotes, SingleNOte, UpdateNotes } from "../dB/operations";
import { useNavigation } from "@react-navigation/native";

export default function Notes_screen({ route }) {
  const { id } = route?.params || "";
  const [notes, setNotes] = useState({
    title: "",
    subtitle: "",
    desc: "",
  });
  const navigation = useNavigation();
  useEffect(() => {
    async function fun() {
      try {
        const res = await SingleNOte(id);
        setNotes({
          title: res[0].title,
          subtitle: res[0].subtitle,
          desc: res[0].description,
        });
      } catch (error) {
        console.log(error);
      }
    }
    fun();
  }, [id]);
  const InsertData = async () => {
    try {
      const res = await InsertNotes(
        notes.title,
        notes.subtitle,
        notes.desc,
        new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
      );
      setNotes({
        title: "",
        subtitle: "",
        desc: "",
      });
      if (res) {
        navigation.navigate("Home", {
          title: notes.title,
          subtitle: notes.subtitle,
          desc: notes.desc,
        });
      } else {
        Alert.alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateData = async () => {
    try {
      const res = await UpdateNotes(
        notes.title,
        notes.subtitle,
        notes.desc,
        new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        id
      );
      if (res) {
        navigation.navigate("Single_notes", {
          id,
          title: notes.title,
          subtitle:notes.subtitle,
          desc: notes.desc,
        });
      } else {
        Alert.alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <View className="border-[0.9px] mt-10 border-gray-500 mx-10 p-2 rounded mb-3">
        <TextInput
          placeholder="Enter notes title"
          value={notes.title}
          onChangeText={(text) => {
            setNotes((prev) => {
              return {
                ...prev,
                title: text,
              };
            });
          }}
        />
      </View>
      <View className="border-[0.9px] border-gray-500 mx-10 p-2 rounded mb-3">
        <TextInput
          placeholder="Enter notes subtitle"
          value={notes.subtitle}
          onChangeText={(text) => {
            setNotes((prev) => {
              return {
                ...prev,
                subtitle: text,
              };
            });
          }}
        />
      </View>
      <View className="border-[0.9px] border-gray-500 mx-10 p-2 rounded mb-3 flex flex-row items-start justify-start">
        <TextInput
          placeholder="Enter notes here"
          multiline
          numberOfLines={15}
          style={{
            // height: 200,
            textAlignVertical: "top",
          }}
          value={notes.desc}
          onChangeText={(text) => {
            setNotes((prev) => {
              return {
                ...prev,
                desc: text,
              };
            });
          }}
        />
      </View>
      <View className="mx-10 rounded">
        <Button
          title="Submit"
          onPress={() => {
            if (!id) {
              InsertData();
            } else {
              UpdateData();
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

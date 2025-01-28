import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { InsertNotes, SingleNOte, UpdateNotes } from "../dB/operations";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
export default function Notes_screen({ route }) {
  const { id } = route?.params || "";
  const [initialValues, setInitialValues] = useState({
    title: "",
    subtitle: "",
    desc: "",
  });
  const [notes, setNotes] = useState({
    title: "",
    subtitle: "",
    desc: "",
  });
  const navigation = useNavigation();
  useEffect(() => {
    async function fetchNote() {
      if (id) {
        try {
          const res = await SingleNOte(id);
          setInitialValues({
            title: res[0].title,
            subtitle: res[0].subtitle,
            desc: res[0].description,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchNote();
  }, [id]);
  const handleInsertData = async (values, resetForm) => {
    try {
      const res = await InsertNotes(
        values.title,
        values.subtitle,
        values.desc,
        new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
      );
      if (res) {
        resetForm();
        navigation.navigate("Home", {
          title: values.title,
          subtitle: values.subtitle,
          desc: values.desc,
        });
      } else {
        Alert.alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateData = async (values) => {
    try {
      const res = await UpdateNotes(
        values.title,
        values.subtitle,
        values.desc,
        new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        id
      );
      if (res) {
        navigation.navigate("Single_notes", {
          id,
          title: values.title,
          subtitle: values.subtitle,
          desc: values.desc,
        });
      } else {
        Alert.alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    subtitle: Yup.string().required("Subtitle is required"),
    desc: Yup.string().required("Description is required"),
  });
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
  >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.header}>{id ? "Edit Note" : "Create New Note"}</Text>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            id ? handleUpdateData(values) : handleInsertData(values, resetForm);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter note title"
                  value={values.title}
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                  placeholderTextColor="#666"
                />
                {touched.title && errors.title && (
                  <Text className="text-red-500">{errors.title}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Subtitle</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter note subtitle"
                  value={values.subtitle}
                  onChangeText={handleChange("subtitle")}
                  onBlur={handleBlur("subtitle")}
                  placeholderTextColor="#666"
                />
                {touched.subtitle && errors.subtitle && (
                  <Text className="text-red-500">{errors.subtitle}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter note description"
                  value={values.desc}
                  onChangeText={handleChange("desc")}
                  onBlur={handleBlur("desc")}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  placeholderTextColor="#666"
                />
                {touched.desc && errors.desc && (
                  <Text className="text-red-500">{errors.desc}</Text>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>
                    {id ? "Update" : "Save"} Note
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

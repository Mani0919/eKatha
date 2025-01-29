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
  Pressable,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import img from "../assests/profile.png";
import noimg from "../assests/noimg.png";
import CustomerContext, { Customer } from "../useContext/context";
import {
  All,
  AllCustomers,
  Allnotes,
  CreateNotes,
  getAllTimeStatistics,
  getMonthlyStatistics,
  getTopCustomersWithMoreKatha,
  SingleShopOwner,
  UpdateShopOwner,
  UpdateShopOwnerDetails,
} from "../dB/operations";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MonthlyStatsChart from "../ui/monthlyChart";

export default function Home_screen({ route }) {
  const { title, subtitle, desc, message, id, phone } = route?.params || "";
  const { data } = useContext(Customer);
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
  const [modalVisible, setModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [monthly, setMonthly] = useState({
    monthlyStats: {},
    totalVisits: 0,
    totalAmount: "0.00"
  });
  const [isLoading, setIsLoading] = useState(false);
  async function getMonthsData() {
    try {
      setIsLoading(true);
      const res = await getMonthlyStatistics();
      console.log("res monthly", res);
      if (res) {
        setMonthly(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  useFocusEffect(
    useCallback(() => {
      getMonthsData();
      fun3()
      fun1()
      fun2()
    }, [])
  );
  useEffect(() => {
    //  setMoreKatha(data);
    // console.log("top data",data)
    async function fun() {
      try {
        const phonenum = await AsyncStorage.getItem("phone");
        const res = await SingleShopOwner(phonenum);
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
        console.log("length", res);
        setTotal(res.length > 0 ? res.length : "0");
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
    AsyncStorage.removeItem("login");
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
      setIsProfileModalVisible(false);
      console.log("res", res);
      if (res) {
        setIsProfileModalVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.greeting}>
              Hi, {shopOwnerdetails?.fullname}
            </Text>
            <Text style={styles.shopName}>{shopOwnerdetails?.shopname}</Text>
            <Text style={styles.address}>{shopOwnerdetails?.address}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
            <Image
              source={image ? { uri: image } : img}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <TouchableOpacity
            style={styles.stat}
            onPress={() => navigation.navigate("Customers")}
          >
            <Text style={styles.statNumber}>{totalCustomer}</Text>
            <Text style={styles.statLabel}>Total Customers</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{notes.length}</Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
        </View>

        {/* Frequent Customers Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Frequent Customers</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Customers")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {moreKatha.length > 0 ? (
          <View style={styles.customersTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: "15%" }]}>
                No.
              </Text>
              <Text style={[styles.tableHeaderText, { width: "30%" }]}>
                Name
              </Text>
              <Text style={[styles.tableHeaderText, { width: "25%" }]}>
                Phone
              </Text>
              <Text style={[styles.tableHeaderText, { width: "30%" }]}>
                Address
              </Text>
            </View>
            {moreKatha.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tableRow}
                onPress={() =>
                  navigation.navigate("manuplate", {
                    customerid: item.id,
                    customername: item.name,
                  })
                }
              >
                <Text style={[styles.tableCell, { width: "15%" }]}>
                  {index + 1}
                </Text>
                <Text style={[styles.tableCell, { width: "30%" }]}>
                  {item.name}
                </Text>
                <Text style={[styles.tableCell, { width: "25%" }]}>
                  {item.phone}
                </Text>
                <Text style={[styles.tableCell, { width: "30%" }]}>
                  {item.address.length > 10
                    ? `${item.address.slice(0, 10)}...`
                    : item.address}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Image source={noimg} style={styles.emptyStateImage} />
            <Text style={styles.emptyStateText}>No frequent customers yet</Text>
          </View>
        )}

        {/* Notes Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Notes")}>
            <Text style={styles.addButton}>Add +</Text>
          </TouchableOpacity>
        </View>

        {notes.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.notesContainer}
          >
            {notes.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.noteCard,
                  { backgroundColor: color[index % color.length] },
                ]}
                onPress={() =>
                  navigation.navigate("Single_notes", {
                    id: item.id,
                  })
                }
              >
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.noteSubtitle}>{item.subtitle}</Text>
                <Text style={styles.noteDescription}>
                  {item.description.length > 100
                    ? `${item.description.slice(0, 100)}...`
                    : item.description}
                </Text>
                <View style={styles.noteFooter}>
                  <View style={styles.noteDate}>
                    <MaterialIcons name="access-time" size={16} color="#666" />
                    <Text style={styles.noteDateText}>{item.createddate}</Text>
                  </View>
                  <TouchableOpacity style={styles.editButton}>
                    <Entypo name="edit" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Image source={noimg} style={styles.emptyStateImage} />
            <Text style={styles.emptyStateText}>No notes yet</Text>
          </View>
        )}
        <View className="my-4">
          {monthly && <MonthlyStatsChart data={monthly} />}
        </View>
        <Modal
          transparent={true}
          visible={isMenuVisible}
          animationType="fade"
          onRequestClose={() => setIsMenuVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsMenuVisible(false)}
          >
            <Animated.View
              entering={SlideInUp.duration(300)}
              exiting={SlideOutUp.duration(300)}
              style={styles.menuContainer}
            >
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Profile Options</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsMenuVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.menuItem} onPress={openCamera}>
                <MaterialIcons name="photo-camera" size={24} color="#007AFF" />
                <Text style={styles.menuItemText}>Change Profile Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuVisible(false);
                  setIsProfileModalVisible(true);
                }}
              >
                <MaterialIcons name="edit" size={24} color="#007AFF" />
                <Text style={styles.menuItemText}>Edit Profile Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, styles.logoutButton]}
                onPress={handleLogout}
              >
                <MaterialIcons name="logout" size={24} color="#FF3B30" />
                <Text style={[styles.menuItemText, styles.logoutText]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Modal>

        {/* Profile Update Modal */}
        <Modal
          transparent={true}
          visible={isProfileModalVisible}
          animationType="fade"
          onRequestClose={() => setIsProfileModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              entering={SlideInDown.duration(300)}
              exiting={SlideOutUp.duration(300)}
              style={styles.updateModalContainer}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Profile</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsProfileModalVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.updateForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={toupdatedetails.name}
                    onChangeText={(text) =>
                      setToupdateDetails((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="Enter your full name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={toupdatedetails.phone}
                    onChangeText={(text) =>
                      setToupdateDetails((prev) => ({ ...prev, phone: text }))
                    }
                    keyboardType="phone-pad"
                    placeholder="Enter your phone number"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={toupdatedetails.email}
                    onChangeText={(text) =>
                      setToupdateDetails((prev) => ({ ...prev, email: text }))
                    }
                    keyboardType="email-address"
                    placeholder="Enter your email"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput
                    style={styles.input}
                    value={toupdatedetails.address}
                    onChangeText={(text) =>
                      setToupdateDetails((prev) => ({
                        ...prev,
                        address: text,
                      }))
                    }
                    placeholder="Enter your address"
                    multiline
                  />
                </View>

                <View style={styles.inputGroup} className="mb-4">
                  <Text style={styles.inputLabel}>Shop Name</Text>
                  <TextInput
                    style={styles.input}
                    value={toupdatedetails.shopname}
                    onChangeText={(text) =>
                      setToupdateDetails((prev) => ({
                        ...prev,
                        shopname: text,
                      }))
                    }
                    placeholder="Enter your shop name"
                  />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsProfileModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={handelUpdateOwner}
                >
                  <Text style={styles.updateButtonText}>Update Profile</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </ScrollView>

      {/* Keep your existing Modal components with updated styles */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  shopName: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
  },
  address: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
    maxWidth: "80%",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#e0e0e0",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  seeAll: {
    fontSize: 14,
    color: "#007AFF",
  },
  addButton: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  customersTable: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tableRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tableCell: {
    fontSize: 14,
    color: "#1a1a1a",
  },
  notesContainer: {
    paddingHorizontal: 20,
  },
  noteCard: {
    width: 280,
    padding: 20,
    marginRight: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  noteSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  noteDescription: {
    fontSize: 14,
    color: "#444",
    marginBottom: 16,
    lineHeight: 20,
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  noteDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  noteDateText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#1a1a1a",
  },
  logoutButton: {
    marginTop: 10,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#FF3B30",
  },
  updateModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  updateForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#1a1a1a",
    backgroundColor: "#f8f9fa",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: "#007AFF",
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

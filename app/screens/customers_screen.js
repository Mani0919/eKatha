import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AllCustomers,
  createCustomerKathaSummaryTable,
  createEntries,
  DeleteCustomer,
  InsertCustomersData,
  UpdateCustomerData,
} from "../dB/operations";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontAwesome, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Customer } from "../useContext/context";
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import noimg from "../assests/noimg.png";
import { StatusBar } from "expo-status-bar";
export default function Customers_screen() {
  const navigation = useNavigation();
  const [customerData, setCustomerdata] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [data, setData] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [customerid, setCustomerid] = useState("");
  const { setCustomerDetails } = useContext(Customer);
  useEffect(() => {
    async function fun() {
      try {
        await createEntries();
      } catch (error) {}
    }
    fun();
    Customers();
    fun1();
  }, []);

  async function fun1() {
    try {
      const res = await createCustomerKathaSummaryTable();
    } catch (error) {
      console.log(error);
    }
  }
  async function Customers() {
    try {
      const res = await AllCustomers();
      setData(res);
      // FindTotalCustomers(res.length);
    } catch (error) {
      console.log(error);
    }
  }

  const InsertCustomers = async () => {
    try {
  
      // setData((prevData) => [...prevData, customer]);
      const res = await InsertCustomersData(
        customerData.name,
        customerData.phone,
        customerData.address
      );
      if (res) {
        setCustomerdata({
          name: "",
          phone: "",
          address: "",
        });
      }
      await Customers();
    } catch (error) {}
  };
  const UpdateCustomer = async () => {
    console.log(customerid, "updated");
    try {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === customerid
            ? {
                ...item,
                name: customerData.name,
                phone: customerData.phone,
                address: customerData.address,
              }
            : item
        )
      );
      const res = await UpdateCustomerData(
        customerid,
        customerData.name,
        customerData.phone,
        customerData.address
      );
      if (res) {
        setModalVisible(false);
      } else {
        Alert.alert("something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    console.log(id, "ddeeleldele");
    try {
      setData((prev) => prev.filter((customer) => customer.id !== id));
      const res = await DeleteCustomer(id);
    } catch (error) {
      console.log(error);
    }
  };
  const [Search, setSearch] = useState("");
  // const filterData = data.filter((value) => {
  //   return (
  //     value.name.toLowerCase().includes(Search.toLowerCase()) ||
  //     value.phone.toLowerCase().includes(Search.toLowerCase())
  //   );
  // });
  const [modalVisible, setModalVisible] = useState(false);

  const handleCustomerDetails = (id, name) => {
    navigation.navigate("manuplate", {
      customerid: id,
      customername: name,
    });
  };
  // const [search, setSearch] = useState('');
  const [filterData, setFilterData] = useState([]);
  
  useEffect(() => {
    const filtered = data.filter(customer => 
      customer.name.toLowerCase().includes(Search.toLowerCase()) ||
      customer.phone.includes(Search) ||
      customer.address.toLowerCase().includes(Search.toLowerCase())
    );
    setFilterData(filtered);
  }, [Search, data]);

    const handleCustomerAction = (item) => {
    Alert.alert(
      item.name,
      "Choose an action for this customer",
      [
        {
          text: "View Details",
          onPress: () => navigation.navigate("manuplate", {
            customerid: item.id,
            customername: item.name,
            phone: item.phone,
          }),
        },
        {
          text: "Update",
          onPress: () => {
            setCustomerid(item.id);
            setUpdateStatus(true);
            setCustomerdata({
              name: item.name,
              phone: item.phone,
              address: item.address,
            });
            setModalVisible(true);
          },
        },
        {
          text: "Delete",
          onPress: () => handleDelete(item.id),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setCustomerdata({ name: "", phone: "", address: "" });
            setModalVisible(true);
          }}
        >
          <MaterialIcons name="person-add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Customer</Text>
        </TouchableOpacity>
      </View>

      
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customers..."
              placeholderTextColor="#999"
              maxLength={20}
              value={Search}
              onChangeText={setSearch}
            />
          </View>
          {filterData.length > 0 ? (
        <>
          {/* Customer List */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { width: '25%' }]}>Name</Text>
              <Text style={[styles.headerCell, { width: '25%' }]}>Phone</Text>
              <Text style={[styles.headerCell, { width: '40%' }]}>Address</Text>
              <Text style={[styles.headerCell, { width: '10%' }]}></Text>
            </View>

            {filterData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
                onPress={() => handleCustomerAction(item)}
              >
                <Text style={[styles.cell, { width: '25%' }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.cell, { width: '25%' }]}>
                  {item.phone}
                </Text>
                <Text style={[styles.cell, { width: '40%' }]} numberOfLines={1}>
                  {item.address}
                </Text>
                <View style={[styles.cell, { width: '10%' }]}>
                  <AntDesign name="eyeo" size={20} color="#007AFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Image source={noimg} style={styles.emptyStateImage} />
          <Text style={styles.emptyStateText}>No customers found</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first customer to get started
          </Text>
        </View>
      )}
    </ScrollView>

    {/* Add/Update Customer Modal */}
    {modalVisible && (
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={SlideInUp.duration(300)}
          exiting={SlideOutUp.duration(300)}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {updateStatus ? "Update Customer" : "Add New Customer"}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Customer Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter customer name"
                value={customerData.name}
                onChangeText={(text) =>
                  setCustomerdata((prev) => ({ ...prev, name: text }))
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                keyboardType="numeric"
                maxLength={10}
                value={customerData.phone}
                onChangeText={(text) =>
                  setCustomerdata((prev) => ({ ...prev, phone: text }))
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter customer address"
                multiline
                numberOfLines={3}
                value={customerData.address}
                onChangeText={(text) =>
                  setCustomerdata((prev) => ({ ...prev, address: text }))
                }
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={() => {
                if (!updateStatus) {
                  InsertCustomers();
                } else {
                  UpdateCustomer();
                }
                setModalVisible(false);
              }}
            >
              <Text style={styles.submitButtonText}>
                {updateStatus ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    )}
  </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  tableContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
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
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f8f9fa',
  },
  cell: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    maxHeight: '80%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

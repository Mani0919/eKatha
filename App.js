import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Customers_screen from "./app/screens/customers_screen";
import CustomerKathas from "./app/screens/customer_katha";
import Home_screen from "./app/screens/home_screen";
import Notes_screen from "./app/screens/notes_screen";
import Singlenotes_screen from "./app/screens/singlenotes_screen";
import Loginsignup_screen from "./app/screens/auth/loginsignup_screen";
import CustomerContext from "./app/useContext/context";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
export default function App() {
  const [initialRoute, setInitialRoute] = useState("auth");

  useEffect(() => {
    const getLogin = async () => {
      const token = await AsyncStorage.getItem("login");
      if (token != null) {
        setInitialRoute("Home");
      }
    };
    getLogin();
  }, []);
  return (
    <CustomerContext>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="auth"
            component={Loginsignup_screen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home_screen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Customers"
            component={Customers_screen}
            options={{
              headerShown: false,
            }}
            // options={{
            //   headerSearchBarOptions: {
            //     placeholder: "Search katha",
            //   },
            // }}
          />
          <Stack.Screen
            name="manuplate"
            component={CustomerKathas}
            options={{
              headerShown: false,
              title: "Customer Katha",
            }}
          />
          <Stack.Screen name="Notes" component={Notes_screen} />
          <Stack.Screen
            name="Single_notes"
            component={Singlenotes_screen}
            options={{
              headerShown: false,
              title: "Notes Details",
            }}
          />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </CustomerContext>
  );
}

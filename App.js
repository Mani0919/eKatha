import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Customers_screen from "./app/screens/customers_screen";
import CustomerKathas from "./app/screens/customer_katha";
import Home_screen from "./app/screens/home_screen";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home_screen} options={{
          headerShown:false
        }}/>
        <Stack.Screen name="Customers" component={Customers_screen} />
        <Stack.Screen
          name="manuplate"
          component={CustomerKathas}
          options={{
            headerShown: false,
            title: "Customer Katha",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

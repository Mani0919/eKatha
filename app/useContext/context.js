import { View, Text } from "react-native";
import React, { createContext, useState } from "react";

export const Customer = createContext();
export default function CustomerContext({ children }) {
  const [totalCustomers, setTotalCustomers] = useState("");

  const FindTotalCustomers = (total) => {
    setTotalCustomers(total);
  };
  return (
    <Customer.Provider value={{ totalCustomers, FindTotalCustomers }}>
      {children}
    </Customer.Provider>
  );
}

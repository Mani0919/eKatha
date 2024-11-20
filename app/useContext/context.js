import { View, Text } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import { getTopCustomersWithMoreKatha } from "../dB/operations";

export const Customer = createContext();
export default function CustomerContext({ children }) {
  const [totalCustomers, setTotalCustomers] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fun() {
      try {
        const res = await getTopCustomersWithMoreKatha();
        setData(res)
      } catch (error) {
        console.log(error);
      }
    }
    fun();
  }, []);

  const addCustomerKatha = (newKatha) => {
    setData((prevData) => [...prevData, newKatha]);
  };
  return (
    <Customer.Provider value={{ totalCustomers, data,addCustomerKatha }}>
      {children}
    </Customer.Provider>
  );
}

import { View, Text } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import { getTopCustomersWithMoreKatha } from "../dB/operations";

export const Customer = createContext();

export default function CustomerContext({ children }) {
  const [totalCustomers, setTotalCustomers] = useState("");
  const [data, setData] = useState([]);
  const [details, setDetails] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    async function fun() {
      try {
        const res = await getTopCustomersWithMoreKatha();
        setData(res);
      } catch (error) {
        console.log(error);
      }
    }
    fun();
  }, []);

  const addCustomerKatha = (newKatha) => {
    setData((prevData) => [...prevData, newKatha]);
  };

  // Function to set customer details
  const setCustomerDetails = (id, name) => {
    console.log("hi context",id,name)
    setDetails({ id, name });
  };

  // Function to clear customer details
  const clearCustomerDetails = () => {
    setDetails({ id: "", name: "" });
  };

  return (
    <Customer.Provider
      value={{
        totalCustomers,
        data,
        addCustomerKatha,
        setCustomerDetails,
        clearCustomerDetails,
      }}
    >
      {children}
    </Customer.Provider>
  );
}

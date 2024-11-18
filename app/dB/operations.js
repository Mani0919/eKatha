import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";

const dataBase = SQLite.openDatabaseAsync("shop.db");

export async function createEntries() {
  try {
    const db = await dataBase;
    await db.execAsync(`
          PRAGMA journal_mode = WAL;
          PRAGMA foreign_keys = ON;
          CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT  NOT NULL , name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT)
        `);
    console.log("customers table created.");
  } catch (error) {
    console.error("Error creating entries: ", error);
  }
}

export async function InsertCustomersData(name, phone, address) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `INSERT INTO customers ( name, phone,address) VALUES ($name, $phone,$address)`
    );
    try {
      const res = await st.executeAsync({
        // $id: id,
        $name: name,
        $phone: phone,
        $address: address,
      });
      if (res.changes > 0) {
        console.log("Inserted successfully. Rows affected:", res.changes);
        return true; // Indicates success
      } else {
        console.log("No rows were affected.");
        return false; // Indicates no rows affected
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("Database preparation error:", error);
  }
}

export async function AllCustomers() {
  try {
    const db = await dataBase;
    // const st = await db.prepareAsync(`SELECT * FROM customers`);
    try {
      const res = await db.getAllAsync(`SELECT * FROM customers`);
      //   console.log(res);
      return res;
    } catch (error) {}
  } catch (error) {
    console.log("Database error");
  }
}

//kath table
export async function CustomerKatha(customerid, customername) {
  try {
    const db = await dataBase;

    const name = customername.replace(/\s+/g, "").replace(/[^a-zA-Z0-9_]/g, "");

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS katha_${name}_${customerid} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          customerid TEXT NOT NULL,
          date TEXT,
          totalproducts TEXT NOT NULL,
          totalamount TEXT NOT NULL,
          paid TEXT,
          due TEXT,
          FOREIGN KEY (customerid) REFERENCES customers(id) ON DELETE CASCADE
        )
      `);

    console.log(`Table katha_${name}_${customerid} created.`);
  } catch (error) {
    console.error("Error creating entries: ", error);
  }
}

export async function InsertCustomersKathaDeatils(
  customerid,
  customername,
  date,
  products,
  totalamount,
  paid,
  due
) {
  try {
    const db = await dataBase;
    const name = customername.replace(/\s+/g, "").replace(/[^a-zA-Z0-9_]/g, "");

    const st = await db.prepareAsync(
      `INSERT INTO katha_${name}_${customerid} (customerid, date, totalproducts,totalamount,paid,due) VALUES ($id, $date,$products,$totalamount,$paid,$due)`
    );
    try {
      const res = await st.executeAsync({
        $id: customerid,
        $date: date,
        $products: products,
        $totalamount: totalamount,
        $paid: paid,
        $due: due,
      });
      if (res.changes > 0) {
        console.log("Inserted successfully. Rows affected:", res.changes);
        return true; // Indicates success
      } else {
        console.log("No rows were affected.");
        return false; // Indicates no rows affected
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("Database preparation error:", error);
  }
}

export async function AllCustomersKatha(customerid, customername) {
  try {
    const db = await dataBase;
    const name = customername.replace(/\s+/g, "").replace(/[^a-zA-Z0-9_]/g, "");
    try {
      const res = await db.getAllAsync(
        `SELECT * FROM katha_${name}_${customerid}`
      );
      console.log(res);
      return res;
    } catch (error) {}
  } catch (error) {
    console.log("Database error");
  }
}

export async function DeleteCustomerKath(customerid,customername,id) {
  try {
    const db = await dataBase;
    const name = customername.replace(/\s+/g, "").replace(/[^a-zA-Z0-9_]/g, "");

    console.log(`Attempting to delete from table: katha_${name}_${customerid}`);
    // console.log({ date, products, amount, due });

    const st = await db.prepareAsync(
      `DELETE FROM katha_${name}_${customerid} WHERE id=$id`
    );

    const res = await st.executeAsync({
      $id: id,
    });

    console.log(`Rows affected: ${res.changes}`);

    if (res.changes > 0) {
      console.log("Product deleted successfully");
    } else {
      console.log("No rows matched for deletion");
    }

    return res;
  } catch (error) {
    console.error("Error occurred during delete:", error);
  }
}
export async function UpdatecutomerKatha(
  customerid,
  customername,
  date,
  products,
  amount,
  paid,
  due,
  id
) {
  try {
    const db = await dataBase;
    const name = customername.replace(/\s+/g, "").replace(/[^a-zA-Z0-9_]/g, "");

    const st = await db.prepareAsync(
      `UPDATE katha_${name}_${customerid} SET date=$date,totalproducts=$products,totalamount=$amount,paid=$paid,due=$due WHERE id=$id`
    );
    try {
      const res = await st.executeAsync({
        $date: date,
        $products: products,
        $amount: amount,
        $paid: paid,
        $due: due,
        $id: id,
      });
      console.log("Product Updated");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

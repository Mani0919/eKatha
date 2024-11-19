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

export async function UpdateCustomerData(id, name, phone, address) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `UPDATE customers SET name=$name,phone=$phone,address=$address WHERE id=$id`
    );
    try {
      const res = await st.executeAsync({
        $name: name,
        $phone: phone,
        $address: address,
        $id: id,
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
    console.log("database error");
  }
}

export async function DeleteCustomer(id) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(`DELETE FROM customers WHERE id=$id`);
    try {
      const res = await st.executeAsync({
        $id: id,
      });
      if (res.changes > 0) {
        console.log("Customer deleted successfully");
      } else {
        console.log("No rows matched for deletion");
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
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

export async function DeleteCustomerKath(customerid, customername, id) {
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

//notes
export async function CreateNotes() {
  try {
    const db = await dataBase;
    await db.execAsync(`
         PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT  NOT NULL , title TEXT NOT NULL, subtitle TEXT NOT NULL, description TEXT NOT NULL, createddate TEXT )`);
    const columns = await db.getAllAsync(`PRAGMA table_info(notes);`);
    const columnNames = columns.map((col) => col.name);
    console.log("Existing columns:", columnNames);
    if (!columnNames.includes("createddate")) {
      await db.execAsync(`ALTER TABLE notes ADD COLUMN createddate TEXT;`);
      console.log("Added missing 'createddate' column");
    }
    if (!columnNames.includes("editeddate")) {
      await db.execAsync(`ALTER TABLE notes ADD COLUMN editeddate TEXT;`);
      console.log("Added missing 'editeddate' column");
    }
    console.log("Note table created");
  } catch (error) {
    console.log(error);
  }
}

export async function InsertNotes(title, subtitle, desc, date) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `INSERT INTO notes(title,subtitle,description,createddate) VALUES($title,$subtitle,$desc,$date)`
    );
    try {
      const res = await st.executeAsync({
        $title: title,
        $subtitle: subtitle,
        $desc: desc,
        $date: date,
      });
      if (res.changes > 0) {
        console.log("Inserted notes data");
        return res;
      } else {
        console.log("not Inserted notes data");
      }
    } catch (error) {
      console.log("err", error);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function Allnotes() {
  try {
    const db = await dataBase;
    try {
      const res = await db.getAllAsync(`SELECT * FROM notes`);
      // console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function SingleNOte(id) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(`SELECT * FROM notes WHERE id=$id`);
    try {
      const res = await st.executeAsync({
        $id: id,
      });
      const rows = await res.getAllAsync();
      console.log(rows);
      return rows;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function UpdateNotes(title, subtitle, desc, date, id) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `UPDATE notes SET title=$title,subtitle=$subtitle,description=$desc,editeddate=$date WHERE id=$id`
    );
    try {
      const res = await st.executeAsync({
        $title: title,
        $subtitle: subtitle,
        $desc: desc,
        $date: date,
        $id: id,
      });
      console.log("Product Updated");
      return res;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function DeleteNotes(id) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(`DELETE FROM notes WHERE id=$id`);
    try {
      const res = await st.executeAsync({
        $id: id,
      });
      if (res.changes > 0) {
        console.log("Note deleted successfully");
        return res;
      } else {
        console.log("No rows matched for deletion");
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function createCustomerKathaSummaryTable() {
  try {
    const db = await dataBase;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS customer_katha_summary (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        customerid INTEGER NOT NULL,
        katha_count INTEGER NOT NULL,
        FOREIGN KEY (customerid) REFERENCES customers(id) ON DELETE CASCADE
      )
    `);

    console.log("customer_katha_summary table created.");
  } catch (error) {
    console.error("Error creating customer_katha_summary table: ", error);
  }
}

export async function updateCustomerKathaSummary(customerid, customername) {
  console.log("console", customerid, customername);
  try {
    const db = await dataBase;

    const name = customername.replace(/\s+/g, "").replace(/[^a-zA-Z0-9_]/g, "");
    const tableName = `katha_${name}_${customerid}`;

    // Count the number of rows in the katha table
    const result = await db.getAllAsync(
      `SELECT COUNT(*) AS kathaCount FROM ${tableName}`
    );
    console.log("result", result);
    const kathaCount = result[0].kathaCount || 0;
    console.log("kathacount", kathaCount);
    const existingEntry = await db.getAllAsync(
      `SELECT * FROM customer_katha_summary WHERE customerid = ?`,
      [customerid]
    );
    console.log("exisfing", existingEntry);
    await db.execAsync("BEGIN TRANSACTION");
    if (existingEntry.length > 0) {
      // Update the existing summary
      await db.runAsync(
        `UPDATE customer_katha_summary SET katha_count = ? WHERE customerid = ?`,
        [kathaCount, customerid]
      );
    } else {
      // Insert a new summary entry
      await db.runAsync(
        `INSERT INTO customer_katha_summary (customerid, katha_count) VALUES (?, ?)`,
        [customerid, kathaCount]
      );
    }
    await db.execAsync("COMMIT");
    console.log(`Customer ${customerid} katha summary updated.`);
  } catch (error) {
    console.error("Error updating customer_katha_summary: ", error);
  }
}

export async function getTopCustomersWithMoreKatha() {
  try {
    const db = await dataBase;

    // Query to fetch the top 7 customers sorted by katha_count in descending order
    const query = `
      SELECT c.id, c.name, c.phone, c.address, s.katha_count
      FROM customers c
      INNER JOIN customer_katha_summary s ON c.id = s.customerid
      ORDER BY s.katha_count DESC
      LIMIT 7
    `;

    const results = await db.getAllAsync(query);

    console.log("Top 7 customers with more kathas:", results);
    return results;
  } catch (error) {
    console.error("Error retrieving top customers with more kathas:", error);
  }
}

export async function All() {
  try {
    const db = await dataBase;
    const res = await db.getAllAsync(`SELECT * FROM customer_katha_summary`);
    console.log("result katha ", res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function createShopOwners() {
  try {
    const db = await dataBase;
    await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS shopowners (id INTEGER PRIMARY KEY AUTOINCREMENT  NOT NULL ,fullname TEXT NOT NULL, email TEXT , phone TEXT UNIQUE, password TEXT, address Text,pic TEXT, shopname TEXT)
        `);
    console.log("Table created and sample entries added.");
  } catch (error) {
    console.error("Error creating entries: ", error);
  }
}
export async function InsertShopOwner(
  name,
  email,
  phone,
  password,
  address,
  shopname
) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `INSERT INTO shopowners (fullname,email,phone,password,address,shopname) VALUES($name,$email,$phone,$password,$address,$shopname)`
    );
    try {
      const res = await st.executeAsync({
        $name: name,
        $email: email,
        $phone: phone,
        $password: password,
        $address: address,
        $shopname: shopname,
      });
      if (res.changes > 0) {
        console.log("Inserted");
      } else {
        console.log("NO");
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function CheckShopOwner(phone, password) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `SELECT * FROM shopowners WHERE phone=$phone AND password=$password`
    );
    try {
      const res = await st.executeAsync({
        $phone: phone,
        $password: password,
      });
      const rows = await res.getAllAsync();

      console.log(rows);

      return rows.length > 0;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function SingleShopOwner(phone) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `SELECT * FROM shopowners WHERE phone=$phone`
    );
    try {
      const res = await st.executeAsync({
        $phone: phone,
      });
      const rows = await res.getAllAsync();

      console.log(rows);

      return rows;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function UpdateShopOwner(pic, id) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `UPDATE shopowners SET pic=$pic WHERE id=$id`
    );
    try {
      const res = await st.executeAsync({
        $pic: pic,
        $id: id,
      });
      if (res.changes > 0) {
        console.log("Updated");
      } else {
        console.log("no");
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function UpdateShopOwnerDetails(
  name,
  phone,
  email,
  address,
  shopname,
  id
) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `UPDATE shopowners SET fullname=$name,phone=$phone,email=$email,address=$address,shopname=$shopname WHERE id=$id`
    );
    try {
      const res = await st.executeAsync({
        $name: name,
        $phone: phone,
        $email: email,
        $address: address,
        $shopname: shopname,
        $id: id,
      });
      if (res.changes > 0) {
        console.log("Updated details");
        return res
      } else {
        console.log("no");
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";
import * as FileSystem from 'expo-file-system'
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
        return true
      } else {
        console.log("No rows matched for deletion");
        return false
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
  console.log("all", customerid, customername);
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
  let transactionActive = false; // Initialize the transaction flag
  const db = await dataBase;
  try {
    // Sanitize the customer name for use in the table name
    const name = customername.replace(/\s+/g, "").replace(/[^a-zA-Z0-9_]/g, "");
    const tableName = `katha_${name}_${customerid}`;

    // Count the number of rows in the katha table
    const result = await db.getAllAsync(
      `SELECT COUNT(*) AS kathaCount FROM ${tableName}`
    );
    console.log("result", result);
    const kathaCount = result[0].kathaCount || 0; // Default to 0 if no rows found
    console.log("kathacount", kathaCount);

    // Check if an existing entry for this customer already exists in the summary table
    const existingEntry = await db.getAllAsync(
      `SELECT * FROM customer_katha_summary WHERE customerid = ?`,
      [customerid]
    );
    console.log("existing", existingEntry);

    // Check if a transaction is already active before starting a new one
    // Difference: Here, we explicitly check if a transaction is already active.
    if (!transactionActive) {
      await db.execAsync("BEGIN TRANSACTION"); // Start a new transaction only if not active
      transactionActive = true; // Mark the transaction as active
    }

    // If an existing entry is found, update it; otherwise, insert a new entry
    if (existingEntry.length > 0) {
      // Update the existing summary entry with the new katha count
      await db.runAsync(
        `UPDATE customer_katha_summary SET katha_count = ? WHERE customerid = ?`,
        [kathaCount, customerid]
      );
    } else {
      // Insert a new summary entry for the customer with the initial katha count
      await db.runAsync(
        `INSERT INTO customer_katha_summary (customerid, katha_count) VALUES (?, ?)`,
        [customerid, kathaCount]
      );
    }

    // Commit the transaction if it's active (this is the same behavior as before)
    // Difference: We now only commit if a transaction is active to avoid issues with nested transactions.
    if (transactionActive) {
      await db.execAsync("COMMIT"); // Commit the transaction
      transactionActive = false; // Mark the transaction as inactive after commit
    }
    console.log(`Customer ${customerid} katha summary updated.`);
  } catch (error) {
    // Rollback the transaction in case of any error to maintain database integrity
    // Difference: We only roll back the transaction if it was actually started and is active.
    if (transactionActive) {
      await db.execAsync("ROLLBACK"); // Rollback the transaction on error
    }
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
export async function AllShopOwners() {
  try {
    const db = await dataBase;
    const res = await db.getAllAsync(`SELECT * FROM shopowners`);
    console.log("all cutomers",res);
    return res;
  } catch (error) {
    console.log(error);
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
        return res;
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
        return res;
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

//daily summary
export async function DailySummary() {
  try {
    const db = await dataBase;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS daily_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      date TEXT NOT NULL,
      total_customers INTEGER NOT NULL,
      total_products INTEGER NOT NULL,
      total_amount REAL NOT NULL
)
    `);
    console.log("daily summary table created")
  } catch (error) {
    console.log(error);
  }
}



//statics
// Function to fetch all customer visits and total purchases for all dates
export async function getAllTimeStatistics() {
  try {
    const db = await dataBase;
    
    // 1. Fetch all customers
    const customers = await db.getAllAsync(`SELECT * FROM customers`);
    
    let totalAmount = 0;  // To hold the sum of all purchases
    let totalVisits = 0;  // To hold the total number of customer visits
    let dailyStats = {};  // Object to store daily statistics
    
    // 2. Loop through each customer
    for (let customer of customers) {
      const customerId = customer.id;
      const customerName = customer.name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9_]/g, "");
      
      // 3. Query the katha table for this customer
      const kathaTable = `katha_${customerName}_${customerId}`;
      
      // Fetch the total purchase amount and the number of visits for each date
      const result = await db.getAllAsync(`
        SELECT date, SUM(totalamount) AS totalAmount, COUNT(id) AS visitCount
        FROM ${kathaTable}
        GROUP BY date
        ORDER BY date ASC
      `);
      
      // Add the result to the overall totals and daily statistics
      result.forEach(day => {
        const date = day.date;
        const amount = parseFloat(day.totalAmount || 0);
        const visits = day.visitCount || 0;
        
        totalAmount += amount;  // Sum of all purchases
        totalVisits += visits;  // Total number of visits

        // Save the daily statistics
        if (!dailyStats[date]) {
          dailyStats[date] = { totalAmount: 0, totalVisits: 0 };
        }
        
        dailyStats[date].totalAmount += amount;
        dailyStats[date].totalVisits += visits;
      });
    }
    
    // 4. Return the total statistics and daily breakdown
    console.log(`Total Visits: ${totalVisits}`);
    console.log(`Total Amount Purchased: ${totalAmount.toFixed(2)}`);
    console.log('Daily Stats:', dailyStats);
    return { totalVisits, totalAmount: totalAmount.toFixed(2), dailyStats };
    
  } catch (error) {
    console.error("Error fetching statistics:", error);
  }
}



// Function to fetch customer data grouped by month (year-month format)
export async function getMonthlyStatistics() {
  try {
    const db = await dataBase;
    
    // 1. Fetch all customers
    const customers = await db.getAllAsync(`SELECT * FROM customers`);
    
    let totalAmount = 0;
    let totalVisits = 0;
    let monthlyStats = {};
    
    // 2. Loop through each customer
    for (let customer of customers) {
      const customerId = customer.id;
      const customerName = customer.name
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9_]/g, "");
      
      const kathaTable = `katha_${customerName}_${customerId}`;
      
      // 3. Query that keeps transactions grouped
      const result = await db.getAllAsync(`
        SELECT 
          CASE 
            WHEN strftime('%Y-%m', date) IS NULL THEN 'current'
            ELSE strftime('%Y-%m', date)
          END AS month,
          SUM(totalamount) AS totalAmount,
          COUNT(id) AS visitCount
        FROM ${kathaTable}
        GROUP BY month
      `);
      
      // 4. Process results while maintaining grouping
      result.forEach(month => {
        const monthKey = 'Month 1'; // Using a single month for all transactions
        const amount = parseFloat(month.totalAmount || 0);
        const visits = month.visitCount || 0;
        
        totalAmount += amount;
        totalVisits += visits;
        
        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = {
            totalAmount: 0,
            totalVisits: 0
          };
        }
        
        monthlyStats[monthKey].totalAmount += amount;
        monthlyStats[monthKey].totalVisits += visits;
      });
    }
    
    return {
      totalVisits,
      totalAmount: totalAmount.toFixed(2),
      monthlyStats
    };
    
  } catch (error) {
    console.error("Error fetching monthly statistics:", error);
    throw error;
  }
}




export async function ForgotPassword(phone, password) {
  try {
    const db = await dataBase;
    const st = await db.prepareAsync(
      `UPDATE shopowners SET password=$password WHERE phone=$phone`
    );
    try {
      const res = await st.executeAsync({
        $password: password,
        $phone: phone,
      });
      if (res.changes > 0) {
        console.log("password updated");
        return res;
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

//delete account
export async function DeleteAccount() {
  try {
    // First close any existing database connections
    if (dataBase) {
      // Close all open database connections
      dataBase.closeAsync && dataBase._dataBase.close(); // Close the database if it's open
    }

    // Clear any stored data
    await dataBase.clearAsync && dataBase.clearAsync();

    // Get the database file path
    const dbPath = `${FileSystem.documentDirectory}SQLite/shop.db`;
    
    // Check if file exists before attempting deletion
    const { exists } = await FileSystem.getInfoAsync(dbPath);
    if (exists) {
      // Delete the actual database file
      await FileSystem.deleteAsync(dbPath, { idempotent: true });
    }

    // Delete using SQLite method as well for completeness
    await SQLite.deleteDatabaseAsync("shop.db");
    
    console.log("Database deleted successfully");
    return true;
  } catch (error) {
    console.log("Error deleting database:", error);
    return false;
  }
}
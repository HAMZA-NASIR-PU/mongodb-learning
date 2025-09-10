# Advanced Questions for Data Analysis.

---

## 📌 Question1: Data Analysis Question (Ranking)

You are working with an **e-commerce database**. The `orders` collection stores documents like this:

```json
{
  orderId: 1001,
  customerId: "C1",
  orderDate: ISODate("2025-01-15"),
  totalAmount: 500
}
```

### Task:

1. For each **month**, rank all customers by their **total spending** (sum of `totalAmount`).
2. Return each customer’s rank within that month, along with their spending.
3. Ensure that ties are handled properly (two customers with the same spending should get the same rank, and the next rank should be skipped).

---

### ⚡ Challenge:

* You need to **group by customer + month** to calculate total spending.
* Then you need to **partition by month** and rank customers based on spending.
* Finally, you need to project results like:

  * `month`, `customerId`, `totalSpending`, `rank`.

---

👉 This is a good question because:

* It combines **grouping and ranking**.
* It shows how a customer’s position changes **month by month**.
* You can later extend it into insights like “Top 3 customers per month”.

---


Great 👍 let’s prepare some **dummy order data** for the ranking question.
We’ll include multiple customers, multiple months, and some ties to see how `$rank` behaves.

---

### 📌 Dummy Data

```js
db.orders.insertMany([
  // January Orders
  { orderId: 1001, customerId: "C1", orderDate: ISODate("2025-01-05"), totalAmount: 300 },
  { orderId: 1002, customerId: "C2", orderDate: ISODate("2025-01-07"), totalAmount: 500 },
  { orderId: 1003, customerId: "C1", orderDate: ISODate("2025-01-15"), totalAmount: 200 },
  { orderId: 1004, customerId: "C3", orderDate: ISODate("2025-01-20"), totalAmount: 500 },
  { orderId: 1005, customerId: "C4", orderDate: ISODate("2025-01-25"), totalAmount: 700 },

  // February Orders
  { orderId: 2001, customerId: "C1", orderDate: ISODate("2025-02-03"), totalAmount: 800 },
  { orderId: 2002, customerId: "C2", orderDate: ISODate("2025-02-08"), totalAmount: 400 },
  { orderId: 2003, customerId: "C3", orderDate: ISODate("2025-02-12"), totalAmount: 800 },
  { orderId: 2004, customerId: "C4", orderDate: ISODate("2025-02-18"), totalAmount: 300 },
  { orderId: 2005, customerId: "C2", orderDate: ISODate("2025-02-22"), totalAmount: 200 },

  // March Orders
  { orderId: 3001, customerId: "C1", orderDate: ISODate("2025-03-01"), totalAmount: 500 },
  { orderId: 3002, customerId: "C2", orderDate: ISODate("2025-03-06"), totalAmount: 600 },
  { orderId: 3003, customerId: "C3", orderDate: ISODate("2025-03-10"), totalAmount: 400 },
  { orderId: 3004, customerId: "C4", orderDate: ISODate("2025-03-15"), totalAmount: 600 }
]);
```

---

### 🔎 What this dataset covers

* **January**:

  * C1 = 300+200 = 500
  * C2 = 500
  * C3 = 500
  * C4 = 700 (highest)
    👉 Tie between C1, C2, C3.

* **February**:

  * C1 = 800
  * C2 = 400+200 = 600
  * C3 = 800
  * C4 = 300
    👉 Tie between C1 and C3.

* **March**:

  * C1 = 500
  * C2 = 600
  * C3 = 400
  * C4 = 600
    👉 Tie between C2 and C4.

---


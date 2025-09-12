// Advanced Questions for Data Analysis.

// Question 1

db.orders.insertMany([
  // January Orders
  {
    orderId: 1001,
    customerId: "C1",
    orderDate: ISODate("2025-01-05"),
    totalAmount: 300,
  },
  {
    orderId: 1002,
    customerId: "C2",
    orderDate: ISODate("2025-01-07"),
    totalAmount: 500,
  },
  {
    orderId: 1003,
    customerId: "C1",
    orderDate: ISODate("2025-01-15"),
    totalAmount: 200,
  },
  {
    orderId: 1004,
    customerId: "C3",
    orderDate: ISODate("2025-01-20"),
    totalAmount: 500,
  },
  {
    orderId: 1005,
    customerId: "C4",
    orderDate: ISODate("2025-01-25"),
    totalAmount: 700,
  },

  // February Orders
  {
    orderId: 2001,
    customerId: "C1",
    orderDate: ISODate("2025-02-03"),
    totalAmount: 800,
  },
  {
    orderId: 2002,
    customerId: "C2",
    orderDate: ISODate("2025-02-08"),
    totalAmount: 400,
  },
  {
    orderId: 2003,
    customerId: "C3",
    orderDate: ISODate("2025-02-12"),
    totalAmount: 800,
  },
  {
    orderId: 2004,
    customerId: "C4",
    orderDate: ISODate("2025-02-18"),
    totalAmount: 300,
  },
  {
    orderId: 2005,
    customerId: "C2",
    orderDate: ISODate("2025-02-22"),
    totalAmount: 200,
  },

  // March Orders
  {
    orderId: 3001,
    customerId: "C1",
    orderDate: ISODate("2025-03-01"),
    totalAmount: 500,
  },
  {
    orderId: 3002,
    customerId: "C2",
    orderDate: ISODate("2025-03-06"),
    totalAmount: 600,
  },
  {
    orderId: 3003,
    customerId: "C3",
    orderDate: ISODate("2025-03-10"),
    totalAmount: 400,
  },
  {
    orderId: 3004,
    customerId: "C4",
    orderDate: ISODate("2025-03-15"),
    totalAmount: 600,
  },
]);

// Sort by customerId and month
db.orders.aggregate([
  {
    $group: {
      _id: {
        customerId: "$customerId",
        month: { $month: "$orderDate" },
      },
      totalSpending: { $sum: "$totalAmount" },
    },
  },
  {
    $sort: {
      // Order matters
      "_id.customerId": 1,
      "_id.month": 1,
    },
  },
]);

db.orders.aggregate([
  {
    $group: {
      _id: {
        customerId: "$customerId",
        month: { $month: "$orderDate" },
      },
      totalSpending: { $sum: "$totalAmount" },
    },
  },
  {
    $project: {
      _id: 0,
      customerId: "$_id.customerId",
      month: "$_id.month",
      totalSpending: 1,
    },
  },
  {
    $sort: {
      customerId: 1,
      month: 1,
    },
  },
]);

db.orders.aggregate([
  {
    $group: {
      _id: {
        customerId: "$customerId",
        month: { $month: "$orderDate" },
      },
      totalSpending: { $sum: "$totalAmount" },
    },
  },
  {
    $sort: { "_id.customerId": 1, "_id.month": 1 },
  },
  {
    $group: {
      _id: "$_id.customerId",
      months: {
        $push: {
          month: "$_id.month",
          totalSpending: "$totalSpending",
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      customerId: "$_id",
      months: 1,
    },
  },
]);

// Main solution
db.orders.aggregate([
  {
    $group: {
      _id: {
        customerId: "$customerId",
        month: { $month: "$orderDate" },
      },
      totalSpending: { $sum: "$totalAmount" },
    },
  },
  {
    $setWindowFields: {
      partitionBy: "$_id.month",
      sortBy: { totalSpending: -1 },
      output: {
        rank: { $rank: {} },
      },
    },
  },
  {
    $project: {
      _id: 0,
      customerId: "$_id.customerId",
      month: "$_id.month",
      totalSpending: 1,
      rank: 1,
    },
  },
]);

db.orders.aggregate([
  {
    $group: {
      _id: {
        customerId: "$customerId",
        month: { $month: "$orderDate" },
      },
      totalSpending: { $sum: "$totalAmount" },
    },
  },
]);

db.orders.aggregate([
  {
    $group: {
      _id: {
        customerId: "$customerId",
        monthNum: { $month: "$orderDate" },
      },
      totalSpending: { $sum: "$totalAmount" },
    },
  },
]);

db.orders.aggregate([
  {
    $group: {
      _id: {
        customerId: "$customerId",
        monthNum: { $month: "$orderDate" },
      },
      data: { $push: "$$ROOT" },
    },
  },
  {
    $project: {
      _id: 0,
      customerId: "$_id.customerId",
      monthNum: "$_id.monthNum",
      data: 1,
    },
  },
  {
    $sort: { customerId: 1, monthNum: 1 },
  },
]);

// To show only the Top 3 customers per month:

db.orders.aggregate([
  {
    $group: {
      _id: {
        customerId: "$customerId",
        monthNum: { $month: "$orderDate" },
      },
      totalSpending: { $sum: "$totalAmount" },
    },
  },
  {
    $setWindowFields: {
      partitionBy: "$_id.monthNum",
      sortBy: { totalSpending: -1 },
      output: {
        rank: { $rank: {} },
      },
    },
  },
  {
    $match: { rank: { $lte: 3 } },
  },
  {
    $project: {
      _id: 0,
      customerId: "$_id.customerId",
      monthNum: "$_id.monthNum",
      totalSpending: 1,
      rank: 1,
    },
  },
]);

// Question 2

db.transactions.insertMany([
  {
    transactionId: 1,
    customerId: "C001",
    amount: 150,
    transactionDate: ISODate("2025-09-01T10:00:00Z"),
  },
  {
    transactionId: 2,
    customerId: "C002",
    amount: 300,
    transactionDate: ISODate("2025-09-01T11:30:00Z"),
  },
  {
    transactionId: 3,
    customerId: "C001",
    amount: 120,
    transactionDate: ISODate("2025-09-02T09:45:00Z"),
  },
  {
    transactionId: 4,
    customerId: "C003",
    amount: 500,
    transactionDate: ISODate("2025-09-03T15:20:00Z"),
  },
  {
    transactionId: 5,
    customerId: "C004",
    amount: 200,
    transactionDate: ISODate("2025-09-04T14:10:00Z"),
  },
  {
    transactionId: 6,
    customerId: "C002",
    amount: 50,
    transactionDate: ISODate("2025-09-05T08:00:00Z"),
  },
  {
    transactionId: 7,
    customerId: "C003",
    amount: 400,
    transactionDate: ISODate("2025-09-06T19:30:00Z"),
  },
]);

// Main solution
db.transactions.aggregate([
  {
    $setWindowFields: {
      sortBy: { transactionDate: 1 },
      output: {
        cumulativeRevenue: {
          $sum: "$amount",
          window: { documents: ["unbounded", "current"] },
        },
        transactionsRank: {
          $rank: {},
        },
        movingAvgAmount: {
          $avg: "$amount",
          window: { documents: [-1, 1] },
        },
      },
    },
  },
]);

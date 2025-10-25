db.customers.insertMany([
  { _id: 1, customer_id: 1, name: "Alice" },
  { _id: 2, customer_id: 2, name: "Bob" },
  { _id: 3, customer_id: 3, name: "Charlie" },
  { _id: 4, customer_id: 4, name: "Diana" },
  { _id: 5, customer_id: 5, name: "Eve" },
]);

db.orders.insertMany([
  { _id: 1, customer_id: 1, name: "Alice" },
  { _id: 2, customer_id: 2, name: "Bob" },
  { _id: 3, customer_id: 3, name: "Charlie" },
  { _id: 4, customer_id: 4, name: "Diana" },
  { _id: 5, customer_id: 5, name: "Eve" },
]);

// Solution 1

db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "customer_id",
      foreignField: "customer_id",
      as: "orders",
    },
  },
  {
    $addFields: {
      isValid: {
        $let: {
          vars: {
            obj: {
              $reduce: {
                input: "$orders",
                initialValue: { count_A: 0, count_B: 0, count_C: 0 },
                in: {
                  count_A: {
                    $add: [
                      "$$value.count_A",
                      { $cond: [{ $eq: ["$$this.product_name", "A"] }, 1, 0] },
                    ],
                  },
                  count_B: {
                    $add: [
                      "$$value.count_B",
                      { $cond: [{ $eq: ["$$this.product_name", "B"] }, 1, 0] },
                    ],
                  },
                  count_C: {
                    $add: [
                      "$$value.count_C",
                      { $cond: [{ $eq: ["$$this.product_name", "C"] }, 1, 0] },
                    ],
                  },
                },
              },
            },
          },
          in: {
            $and: [
              { $gt: ["$$obj.count_A", 0] },
              { $gt: ["$$obj.count_B", 0] },
              { $eq: ["$$obj.count_C", 0] },
            ],
          },
        },
      },
    },
  },
  { $match: { isValid: true } },
  { $project: { _id: 0, customer_id: 1, name: 1 } },
]);

// Solution 2

db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "customer_id",
      foreignField: "customer_id",
      as: "orders",
    },
  },
  // Step 1: Unwind each order
  { $unwind: "$orders" },

  // Step 2: Group by customer and collect all unique products
  {
    $group: {
      _id: "$customer_id",
      name: { $first: "$name" },
      products: { $addToSet: "$orders.product_name" },
    },
  },

  // Step 3: Keep only customers who bought both A and B but not C
  {
    $match: {
      products: { $all: ["A", "B"], $nin: ["C"] },
    },
  },

  // Step 4: Final projection
  {
    $project: {
      _id: 0,
      customer_id: "$_id",
      name: 1,
    },
  },
]);

// Solution 3

db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "customer_id",
      foreignField: "customer_id",
      as: "orders",
    },
  },
  { $unwind: "$orders" },
  {
    $group: {
      _id: "$customer_id",
      name: { $first: "$name" },
      countA: {
        $sum: { $cond: [{ $eq: ["$orders.product_name", "A"] }, 1, 0] },
      },
      countB: {
        $sum: { $cond: [{ $eq: ["$orders.product_name", "B"] }, 1, 0] },
      },
      countC: {
        $sum: { $cond: [{ $eq: ["$orders.product_name", "C"] }, 1, 0] },
      },
    },
  },
  {
    $match: {
      countA: { $gt: 0 },
      countB: { $gt: 0 },
      countC: 0,
    },
  },
  {
    $project: {
      _id: 0,
      customer_id: "$_id",
      name: 1,
    },
  },
]);

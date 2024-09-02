
// Practice Query 1: Salespersons Record

// Scenario: You have a sales collection where each document records a sale made by a salesperson, including details like the date,
// amount, and whether the sale was online or in-store.You want to calculate the total sales for each salesperson and categorize them
// as "High Performer" or "Low Performer" based on whether their total sales exceed a certain threshold.

db.sales.insertMany([
    { _id: 1, salesperson: "John", date: ISODate("2024-08-01T00:00:00Z"), amount: 5000, type: "online" },
    { _id: 2, salesperson: "John", date: ISODate("2024-08-02T00:00:00Z"), amount: 3000, type: "in-store" },
    { _id: 3, salesperson: "Alice", date: ISODate("2024-08-01T00:00:00Z"), amount: 7000, type: "online" },
    { _id: 4, salesperson: "Alice", date: ISODate("2024-08-02T00:00:00Z"), amount: 8000, type: "in-store" },
    { _id: 5, salesperson: "Bob", date: ISODate("2024-08-01T00:00:00Z"), amount: 2000, type: "online" },
    { _id: 6, salesperson: "Bob", date: ISODate("2024-08-02T00:00:00Z"), amount: 1000, type: "in-store" },
    { _id: 7, salesperson: "John", date: ISODate("2024-08-03T00:00:00Z"), amount: 4000, type: "online" },
    { _id: 8, salesperson: "Alice", date: ISODate("2024-08-03T00:00:00Z"), amount: 6000, type: "online" },
    { _id: 9, salesperson: "Bob", date: ISODate("2024-08-03T00:00:00Z"), amount: 5000, type: "in-store" },
    { _id: 10, salesperson: "John", date: ISODate("2024-08-04T00:00:00Z"), amount: 2000, type: "in-store" }
]);


db.sales.aggregate([
    {
        $group: {
            _id: "$salesperson",
            totalSales: { $sum: "$amount" },
            totalTransactions: { $sum: 1 }
        }
    },
    {
        $addFields: {
            performance: {
                $cond: {
                    if: { $gte: ["$totalSales", 10000] },
                    then: "High Performer",
                    else: "Low Performer"
                }
            }
        }
    }
]);


db.employees.insertMany([
    { employeeId: 1, department: "Sales", monthlySales: 5000 },
    { employeeId: 2, department: "Sales", monthlySales: 7000 },
    { employeeId: 3, department: "Sales", monthlySales: 6000 },
    { employeeId: 4, department: "HR", monthlySales: 2000 },
    { employeeId: 5, department: "HR", monthlySales: 3000 },
    { employeeId: 6, department: "HR", monthlySales: 2500 },
    { employeeId: 7, department: "Engineering", monthlySales: 10000 },
    { employeeId: 8, department: "Engineering", monthlySales: 12000 },
    { employeeId: 9, department: "Engineering", monthlySales: 11000 }
]);


// Question 1

db.employees.aggregate([
    {
        $setWindowFields: {
            partitionBy: "$department", // Grouping by department
            sortBy: { monthlySales: -1 }, // Sort by sales in descending order
            output: {
                rank: {
                    $rank: {} // Assign rank based on the sorted order
                }
            }
        }
    },
    {
        $project: {
            employeeId: 1,
            department: 1,
            monthlySales: 1,
            rank: 1
        }
    }
]);


db.employees.aggregate([
    {
        $setWindowFields: {
            partitionBy: "$department",
            sortBy: { monthlySales: 1 }, // Sort by sales in ascending order
            output: {
                cumulativeSales: {
                    $sum: "$monthlySales"
                }
            }
        }
    },
    {
        $project: {
            employeeId: 1,
            department: 1,
            monthlySales: 1,
            cumulativeSales: 1
        }
    }
]);

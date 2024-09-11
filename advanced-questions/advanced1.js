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


// Question 2

db.sensorData.insertMany([
    { deviceId: 1, timestamp: new Date("2023-09-01T08:00:00Z"), temperature: 22.5 },
    { deviceId: 1, timestamp: new Date("2023-09-01T09:00:00Z"), temperature: 23.0 },
    { deviceId: 1, timestamp: new Date("2023-09-01T10:00:00Z"), temperature: 21.5 },
    { deviceId: 1, timestamp: new Date("2023-09-01T11:00:00Z"), temperature: 24.0 },
    { deviceId: 1, timestamp: new Date("2023-09-01T12:00:00Z"), temperature: 23.8 },
    { deviceId: 1, timestamp: new Date("2023-09-01T13:00:00Z"), temperature: 22.0 },
    { deviceId: 1, timestamp: new Date("2023-09-01T14:00:00Z"), temperature: 25.5 },
    { deviceId: 1, timestamp: new Date("2023-09-01T15:00:00Z"), temperature: 26.1 },
    { deviceId: 1, timestamp: new Date("2023-09-01T16:00:00Z"), temperature: 27.0 },
    { deviceId: 1, timestamp: new Date("2023-09-01T17:00:00Z"), temperature: 24.5 },
    { deviceId: 1, timestamp: new Date("2023-09-01T18:00:00Z"), temperature: 23.5 },
    { deviceId: 2, timestamp: new Date("2023-09-01T08:00:00Z"), temperature: 18.5 },
    { deviceId: 2, timestamp: new Date("2023-09-01T09:00:00Z"), temperature: 19.0 },
    { deviceId: 2, timestamp: new Date("2023-09-01T10:00:00Z"), temperature: 20.5 },
    { deviceId: 2, timestamp: new Date("2023-09-01T11:00:00Z"), temperature: 21.5 },
    { deviceId: 2, timestamp: new Date("2023-09-01T12:00:00Z"), temperature: 22.0 },
    { deviceId: 2, timestamp: new Date("2023-09-01T13:00:00Z"), temperature: 23.0 }
]);

db.sensorData.aggregate([
    {
        $setWindowFields: {
            partitionBy: "$deviceId", // Group by deviceId
            sortBy: { timestamp: 1 }, // Sort by timestamp in ascending order
            output: {
                movingAverageTemperature: {
                    $avg: "$temperature",
                    window: {
                        documents: [-9, 0] // Last 10 records (sliding window)
                    }
                }
            }
        }
    },
    {
        $project: {
            _id: 0, // Exclude the _id field
            deviceId: 1,
            timestamp: 1,
            temperature: 1,
            movingAverageTemperature: 1
        }
    }
]);


// Question 3
db.students.insertMany([
    {
        studentId: 1,
        name: "John",
        courses: [
            {
                courseName: "Math",
                assignments: [
                    { marks: 85, weightage: 0.5 },
                    { marks: 90, weightage: 0.5 }
                ]
            },
            {
                courseName: "Physics",
                assignments: [
                    { marks: 75, weightage: 0.4 },
                    { marks: 80, weightage: 0.6 }
                ]
            }
        ]
    },
    {
        studentId: 2,
        name: "Jane",
        courses: [
            {
                courseName: "Math",
                assignments: [
                    { marks: 95, weightage: 0.3 },
                    { marks: 85, weightage: 0.7 }
                ]
            },
            {
                courseName: "Chemistry",
                assignments: [
                    { marks: 80, weightage: 0.5 },
                    { marks: 70, weightage: 0.5 }
                ]
            }
        ]
    }
]);


db.students.aggregate([
    {
        $addFields: {
            courseWeightedAverages: {
                $map: {
                    input: "$courses",
                    as: "course",
                    in: {
                        courseName: "$$course.courseName",
                        weightedAverage: {
                            $let: {
                                vars: {
                                    weightedData: {
                                        $reduce: {
                                            input: "$$course.assignments",
                                            initialValue: { totalWeightedMarks: 0, totalWeightage: 0 },
                                            in: {
                                                totalWeightedMarks: {
                                                    $add: [
                                                        "$$value.totalWeightedMarks",
                                                        { $multiply: ["$$this.marks", "$$this.weightage"] }
                                                    ]
                                                },
                                                totalWeightage: {
                                                    $add: ["$$value.totalWeightage", "$$this.weightage"]
                                                }
                                            }
                                        }
                                    }
                                },
                                in: {
                                    $cond: {
                                        if: { $gt: ["$$weightedData.totalWeightage", 0] },
                                        then: {
                                            $divide: [
                                                "$$weightedData.totalWeightedMarks",
                                                "$$weightedData.totalWeightage"
                                            ]
                                        },
                                        else: null
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    {
        $addFields: {
            overallAverage: {
                $avg: "$courseWeightedAverages.weightedAverage"
            }
        }
    },
    {
        $project: {
            _id: 0,
            studentId: 1,
            name: 1,
            courseWeightedAverages: 1,
            overallAverage: 1
        }
    }
]);




// Question 4


db.products.insertMany([
    {
        "_id": 1,
        "name": "Smartphone",
        "price": 500,
        "categories": ["electronics", "mobile"],
        "discount": { "percentage": 10 },
        "sales": 150
    },
    {
        "_id": 2,
        "name": "Laptop",
        "price": 1200,
        "categories": ["electronics", "computers"],
        "discount": { "percentage": 15 },
        "sales": 200
    },
    {
        "_id": 3,
        "name": "Vacuum Cleaner",
        "price": 300,
        "categories": ["home appliances"],
        "sales": 50
    },
    {
        "_id": 4,
        "name": "Washing Machine",
        "price": 700,
        "categories": ["home appliances", "electronics"],
        "discount": { "percentage": 5 },
        "sales": 80
    }
]);



db.products.aggregate([
    {
        $match: {
            $expr: {
                $in: ["electronics", "$categories"] // Match products in the "electronics" category
            }
        }
    },
    {
        $addFields: {
            discountedPrice: {
                $cond: {
                    if: { $gt: [{ $ifNull: ["$discount.percentage", 0] }, 0] }, // Check if discount is present
                    then: { 
                        $subtract: [
                            "$price", 
                            { $multiply: ["$price", { $divide: ["$discount.percentage", 100] }] } // Apply discount
                        ] 
                    },
                    else: "$price" // If no discount, keep the original price
                }
            }
        }
    },
    {
        $project: {
            name: 1,
            price: 1,
            discount: "$discount.percentage",
            discountedPrice: 1
        }
    }
]);


// Question 5

db.userLogs.insertMany([
    { userId: 1, eventType: "login", timestamp: new Date("2023-09-01T08:00:00Z") },
    { userId: 1, eventType: "viewPage", timestamp: new Date("2023-09-01T08:15:00Z") },
    { userId: 1, eventType: "viewPage", timestamp: new Date("2023-09-01T08:20:00Z") },
    { userId: 1, eventType: "logout", timestamp: new Date("2023-09-01T09:00:00Z") },
    { userId: 1, eventType: "login", timestamp: new Date("2023-09-02T10:00:00Z") },
    { userId: 1, eventType: "viewPage", timestamp: new Date("2023-09-02T10:30:00Z") },
    { userId: 1, eventType: "logout", timestamp: new Date("2023-09-02T11:00:00Z") },
    { userId: 2, eventType: "login", timestamp: new Date("2023-09-01T08:00:00Z") },
    { userId: 2, eventType: "viewPage", timestamp: new Date("2023-09-01T08:20:00Z") },
    { userId: 2, eventType: "logout", timestamp: new Date("2023-09-01T09:00:00Z") }
]);

db.userLogs.aggregate([
    {
        $sort: { userId: 1, timestamp: 1 } // Sort events by userId and timestamp
    },
    {
        $group: {
            _id: {
                userId: "$userId",
                eventType: "$eventType"
            },
            events: { $push: "$$ROOT" } // Group events by userId and eventType
        }
    },
    // Further stages will go here for session extraction, duration, and page views
]);

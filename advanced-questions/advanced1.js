db.employees.insertMany([
  { employeeId: 1, department: "Sales", monthlySales: 5000 },
  { employeeId: 2, department: "Sales", monthlySales: 7000 },
  { employeeId: 3, department: "Sales", monthlySales: 6000 },
  { employeeId: 4, department: "HR", monthlySales: 2000 },
  { employeeId: 5, department: "HR", monthlySales: 3000 },
  { employeeId: 6, department: "HR", monthlySales: 2500 },
  { employeeId: 7, department: "Engineering", monthlySales: 10000 },
  { employeeId: 8, department: "Engineering", monthlySales: 12000 },
  { employeeId: 9, department: "Engineering", monthlySales: 11000 },
]);

// Query to find the maximum sales.
db.employees.find().sort({ monthlySales: -1 }).limit(1);

// Via aggregation pipeline:
db.employees.aggregate([
  {
    $sort: {
      monthlySales: -1,
    },
  },
  {
    $limit: 1,
  },
]);

// 🔑 Hints for Question 1

// Partition the data by department

// You need to compare employees only within the same department.

// In MongoDB, this is done with partitionBy inside $setWindowFields.

// Sort employees by sales

// Ranking requires ordering employees by monthlySales.

// Use sortBy: { monthlySales: -1 } so the highest sales come first.

// Assign ranks

// MongoDB window functions ($rank, $denseRank, $rowNumber) are perfect here.

// Use $rank to give 1 to the top salesperson in each department.

// Project clean output

// After ranking, you probably only want fields:
// employeeId, department, monthlySales, rank.

// Use $project to hide _id and unnecessary fields.

// ⚡ Think of it step by step:

// Step 1: Group by department (logical grouping using partition).

// Step 2: Sort employees within that group by sales descending.

// Step 3: Apply a ranking function to assign position.

db.employees.aggregate([
  {
    $group: {
      _id: "$department",
      count: { $sum: 1 },
    },
  },
]);

db.employees.aggregate([
  {
    $group: {
      _id: "$department",
      data: { $push: "$$ROOT" },
    },
  },
]);

db.employees.aggregate([
  {
    $group: {
      _id: "$department",
      data: { $push: "$$ROOT" },
    },
  },
  {
    $project: {
      _id: 1,
      data: 1,
      maxMonthlySalary: {
        $reduce: {
          input: "$data",
          initialValue: 0,
          in: {
            $cond: {
              if: { $gt: ["$$this.monthlySales", "$$value"] },
              then: "$$this.monthlySales",
              else: "$$value",
            },
          },
        },
      },
    },
  },
]);

db.employees.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$department", // Grouping by department
      sortBy: { monthlySales: -1 }, // Sort by sales in descending order
      output: {
        rank: {
          $rank: {}, // Assign rank based on the sorted order
        },
      },
    },
  },
  {
    $project: {
      employeeId: 1,
      department: 1,
      monthlySales: 1,
      rank: 1,
    },
  },
]);

// Question 1

db.employees.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$department", // Grouping by department
      sortBy: { monthlySales: -1 }, // Sort by sales in descending order
      output: {
        rank: {
          $rank: {}, // Assign rank based on the sorted order
        },
      },
    },
  },
  {
    $project: {
      employeeId: 1,
      department: 1,
      monthlySales: 1,
      rank: 1,
    },
  },
]);

db.employees.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$department",
      sortBy: { monthlySales: 1 }, // Sort by sales in ascending order
      output: {
        cumulativeSales: {
          $sum: "$monthlySales",
        },
      },
    },
  },
  {
    $project: {
      employeeId: 1,
      department: 1,
      monthlySales: 1,
      cumulativeSales: 1,
    },
  },
]);

// Question 2

db.sensorData.aggregate([
  {
    $group: {
      _id: "$deviceId",
      data: { $push: "$$ROOT" },
    },
  },
]);

// My question:  How to sort the objects in above "data" array ?

// Method 1:
db.sensorData.aggregate([
  {
    $sort: { timestamp: -1 }, // ascending order
  },
  {
    $group: {
      _id: "$deviceId",
      data: { $push: "$$ROOT" },
    },
  },
]);

// Method 2 (MongoDB 5.2+):
db.sensorData.aggregate([
  {
    $group: {
      _id: "$deviceId",
      data: { $push: "$$ROOT" },
    },
  },
  {
    $project: {
      data: {
        $sortArray: { input: "$data", sortBy: { timestamp: 1 } },
      },
    },
  },
]);

db.sensors.aggregate([
  {
    $group: {
      _id: "$deviceId",
      data: { $push: "$$ROOT" },
    },
  },
  {
    $project: {
      _id: 1,
      count: { $size: "$data" },
    },
  },
]);

db.sensors.insertMany([
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:00:00Z"),
    temperature: 25,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:05:00Z"),
    temperature: 26,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:10:00Z"),
    temperature: 24,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:15:00Z"),
    temperature: 28,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:20:00Z"),
    temperature: 27,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:25:00Z"),
    temperature: 29,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:30:00Z"),
    temperature: 30,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:35:00Z"),
    temperature: 31,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:40:00Z"),
    temperature: 28,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:45:00Z"),
    temperature: 27,
  },
  {
    deviceId: "A1",
    timestamp: ISODate("2025-09-01T10:50:00Z"),
    temperature: 26,
  },

  {
    deviceId: "B1",
    timestamp: ISODate("2025-09-01T10:00:00Z"),
    temperature: 30,
  },
  {
    deviceId: "B1",
    timestamp: ISODate("2025-09-01T10:05:00Z"),
    temperature: 29,
  },
  {
    deviceId: "B1",
    timestamp: ISODate("2025-09-01T10:10:00Z"),
    temperature: 31,
  },
  {
    deviceId: "B1",
    timestamp: ISODate("2025-09-01T10:15:00Z"),
    temperature: 32,
  },
  {
    deviceId: "B1",
    timestamp: ISODate("2025-09-01T10:20:00Z"),
    temperature: 30,
  },
]);

// Main Solution:

db.sensors.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$deviceId",
      sortBy: { timestamp: 1 },
      output: {
        movingAverageTemperature: {
          $avg: "$temperature",
          window: {
            documents: [-9, 0],
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      deviceId: 1,
      timestamp: 1,
      temperature: 1,
      movingAverageTemperature: 1,
    },
  },
]);

// db.sensorData.insertMany([
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T08:00:00Z"),
//     temperature: 22.5,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T09:00:00Z"),
//     temperature: 23.0,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T10:00:00Z"),
//     temperature: 21.5,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T11:00:00Z"),
//     temperature: 24.0,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T12:00:00Z"),
//     temperature: 23.8,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T13:00:00Z"),
//     temperature: 22.0,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T14:00:00Z"),
//     temperature: 25.5,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T15:00:00Z"),
//     temperature: 26.1,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T16:00:00Z"),
//     temperature: 27.0,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T17:00:00Z"),
//     temperature: 24.5,
//   },
//   {
//     deviceId: 1,
//     timestamp: new Date("2023-09-01T18:00:00Z"),
//     temperature: 23.5,
//   },
//   {
//     deviceId: 2,
//     timestamp: new Date("2023-09-01T08:00:00Z"),
//     temperature: 18.5,
//   },
//   {
//     deviceId: 2,
//     timestamp: new Date("2023-09-01T09:00:00Z"),
//     temperature: 19.0,
//   },
//   {
//     deviceId: 2,
//     timestamp: new Date("2023-09-01T10:00:00Z"),
//     temperature: 20.5,
//   },
//   {
//     deviceId: 2,
//     timestamp: new Date("2023-09-01T11:00:00Z"),
//     temperature: 21.5,
//   },
//   {
//     deviceId: 2,
//     timestamp: new Date("2023-09-01T12:00:00Z"),
//     temperature: 22.0,
//   },
//   {
//     deviceId: 2,
//     timestamp: new Date("2023-09-01T13:00:00Z"),
//     temperature: 23.0,
//   },
// ]);

// Main Solution:

db.sensorData.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$deviceId", // Group by deviceId
      sortBy: { timestamp: 1 }, // Sort by timestamp in ascending order
      output: {
        movingAverageTemperature: {
          $avg: "$temperature",
          window: {
            documents: [-9, 0], // Last 10 records (sliding window)
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 0, // Exclude the _id field
      deviceId: 1,
      timestamp: 1,
      temperature: 1,
      movingAverageTemperature: 1,
    },
  },
]);

// Question 3

// You have a collection of students with nested documents for their courses, and within each course, there is an array of assignments with marks and weightage.
// Write a query that computes the weighted average of each course's assignments and then computes the overall average grade for the student across all courses.

// New dummy data:

db.students.insertMany([
  {
    studentId: 1,
    name: "Alice",
    courses: [
      {
        courseName: "Math",
        assignments: [
          { assignment: "Quiz 1", marks: 80, weightage: 0.4 },
          { assignment: "Quiz 2", marks: 90, weightage: 0.6 },
        ],
      },
      {
        courseName: "Science",
        assignments: [
          { assignment: "Lab 1", marks: 70, weightage: 0.3 },
          { assignment: "Lab 2", marks: 85, weightage: 0.7 },
        ],
      },
    ],
  },
  {
    studentId: 2,
    name: "Bob",
    courses: [
      {
        courseName: "Math",
        assignments: [
          { assignment: "Quiz 1", marks: 60, weightage: 0.5 },
          { assignment: "Quiz 2", marks: 75, weightage: 0.5 },
        ],
      },
      {
        courseName: "History",
        assignments: [{ assignment: "Essay", marks: 80, weightage: 1.0 }],
      },
    ],
  },
]);

// Best Solution:
db.students.aggregate([
  {
    $project: {
      name: 1,
      courses: {
        $map: {
          input: "$courses",
          as: "c",
          in: {
            $let: {
              vars: {
                weightedTotal: { $sum: "$$c.assignments.weightage" },
                weightedSum: {
                  $reduce: {
                    input: "$$c.assignments",
                    initialValue: 0,
                    in: {
                      $add: [
                        "$$value",
                        { $multiply: ["$$this.marks", "$$this.weightage"] },
                      ],
                    },
                  },
                },
              },
              in: {
                courseName: "$$c.courseName",
                weightedAverage: {
                  $divide: ["$$weightedSum", "$$weightedTotal"],
                },
              },
            },
          },
        },
      },
    },
  },
  {
    $project: {
      name: 1,
      courses: 1,
      totalAverage: {
        $let: {
          vars: {
            weightedAverageSum: { $sum: "$courses.weightedAverage" },
            totalCourses: { $size: "$courses" },
          },
          in: {
            $divide: ["$$weightedAverageSum", "$$totalCourses"],
          },
        },
      },
    },
  },
]);

// Now do unwinding
db.students.aggregate([
  {
    $project: {
      name: 1,
      courseAverages: {
        $map: {
          input: "$courses",
          as: "c",
          in: {
            $let: {
              vars: {
                totalWeightage: { $sum: "$$c.assignments.weightage" },
                totalWeighted: {
                  $reduce: {
                    input: "$$c.assignments",
                    initialValue: 0,
                    in: {
                      $add: [
                        "$$value",
                        { $multiply: ["$$this.marks", "$$this.weightage"] },
                      ],
                    },
                  },
                },
              },
              in: {
                courseName: "$$c.courseName",
                average: {
                  $divide: [
                    "$$totalWeighted",
                    {
                      $cond: {
                        if: { $eq: ["$$totalWeightage", 0] },
                        then: 1,
                        else: "$$totalWeightage",
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  {
    $unwind: "$courseAverages",
  },
]);

// Solution 2:

db.students.aggregate([
  {
    $project: {
      name: 1,
      courseAverages: {
        $map: {
          input: "$courses",
          as: "c",
          in: {
            $let: {
              vars: {
                totalWeightage: { $sum: "$$c.assignments.weightage" },
                totalWeighted: {
                  $reduce: {
                    input: "$$c.assignments",
                    initialValue: 0,
                    in: {
                      $add: [
                        "$$value",
                        { $multiply: ["$$this.marks", "$$this.weightage"] },
                      ],
                    },
                  },
                },
              },
              in: {
                courseName: "$$c.courseName",
                average: {
                  $divide: [
                    "$$totalWeighted",
                    {
                      $cond: {
                        if: { $eq: ["$$totalWeightage", 0] },
                        then: 1,
                        else: "$$totalWeightage",
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  {
    $unwind: "$courseAverages",
  },
  {
    $group: {
      _id: "$name",
      courses: { $push: "$courseAverages" },
      overallAverage: { $avg: "$courseAverages.average" },
    },
  },
]);

db.students.insertMany([
  {
    studentId: 1,
    name: "John",
    courses: [
      {
        courseName: "Math",
        assignments: [
          { marks: 85, weightage: 0.5 },
          { marks: 90, weightage: 0.5 },
        ],
      },
      {
        courseName: "Physics",
        assignments: [
          { marks: 75, weightage: 0.4 },
          { marks: 80, weightage: 0.6 },
        ],
      },
    ],
  },
  {
    studentId: 2,
    name: "Jane",
    courses: [
      {
        courseName: "Math",
        assignments: [
          { marks: 95, weightage: 0.3 },
          { marks: 85, weightage: 0.7 },
        ],
      },
      {
        courseName: "Chemistry",
        assignments: [
          { marks: 80, weightage: 0.5 },
          { marks: 70, weightage: 0.5 },
        ],
      },
    ],
  },
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
                      initialValue: {
                        totalWeightedMarks: 0,
                        totalWeightage: 0,
                      },
                      in: {
                        totalWeightedMarks: {
                          $add: [
                            "$$value.totalWeightedMarks",
                            { $multiply: ["$$this.marks", "$$this.weightage"] },
                          ],
                        },
                        totalWeightage: {
                          $add: ["$$value.totalWeightage", "$$this.weightage"],
                        },
                      },
                    },
                  },
                },
                in: {
                  $cond: {
                    if: { $gt: ["$$weightedData.totalWeightage", 0] },
                    then: {
                      $divide: [
                        "$$weightedData.totalWeightedMarks",
                        "$$weightedData.totalWeightage",
                      ],
                    },
                    else: null,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      overallAverage: {
        $avg: "$courseWeightedAverages.weightedAverage",
      },
    },
  },
  {
    $project: {
      _id: 0,
      studentId: 1,
      name: 1,
      courseWeightedAverages: 1,
      overallAverage: 1,
    },
  },
]);

// Question 4

// In a collection of products, each document
// contains the fields price, categories, and sales.
// Some products have nested discount fields.

// Write an aggregation query that calculates the final price for each product,
// applying the discount only if the product belongs to a specific category ("electronics").
// Provide the list of products with the final price.

db.products.insertMany([
  {
    productId: 1,
    name: "Laptop",
    categories: ["electronics", "computers"],
    price: 1000,
    discount: { percent: 10 }, // 10% off, should apply
  },
  {
    productId: 2,
    name: "Shirt",
    categories: ["clothing", "men"],
    price: 50,
    // no discount, not electronics
  },
  {
    productId: 3,
    name: "Phone",
    categories: ["electronics", "mobile"],
    price: 500,
    discount: { percent: 5 }, // 5% off, should apply
  },
  {
    productId: 4,
    name: "Book",
    categories: ["books", "education"],
    price: 20,
    discount: { percent: 50 }, // discount exists, but not electronics → ignore
  },
  {
    productId: 5,
    name: "Headphones",
    categories: ["electronics", "audio"],
    price: 200,
    // electronics but no discount → final price = 200
  },
]);

// Laptop & Phone → electronics + discount → discounted price.

// Shirt → not electronics, no discount → same price.

// Book → discount exists, but not electronics → must ignore discount.

// Headphones → electronics, but no discount → keep original price.

db.products.aggregate([
  {
    $project: {
      productId: 1,
      name: 1,
      categories: 1,
      price: 1,
      discount: 1,
      discountedPrice: {
        $cond: {
          if: { $in: ["electronics", "$categories"] },
          then: {
            $cond: {
              if: { $ifNull: ["$discount", false] },
              then: {
                $subtract: [
                  "$price",
                  {
                    $multiply: [
                      "$price",
                      { $divide: ["$discount.percent", 100] },
                    ],
                  },
                ],
              },
              else: "$price",
            },
          },
          else: "$price",
        },
      },
    },
  },
]);

// Use $$REMOVE to conditionally remove the field during $project and $addFields aggregation 
// pipeline stages when used with $cond operator.
db.products.aggregate([
  {
    $project: {
      productId: 1,
      name: 1,
      categories: 1,
      price: 1,
      discount: 1,
      discountedPrice: {
        $cond: {
          if: { $in: ["electronics", "$categories"] },
          then: {
            $cond: {
              if: { $ifNull: ["$discount", false] },
              then: {
                $subtract: [
                  "$price",
                  {
                    $multiply: [
                      "$price",
                      { $divide: ["$discount.percent", 100] },
                    ],
                  },
                ],
              },
              else: "$$REMOVE",
            },
          },
          else: "$$REMOVE",
        },
      },
    },
  },
]);


// Question 5

//You have a collection of user activity logs where each document contains a userId, eventType (e.g., login, logout, viewPage, etc.),
// and timestamp. Write a query that summarizes the session information for each user. Each session is defined by a login event followed
// by a logout event. Include the total number of sessions, average session duration, and the number of times a user has viewed pages per session.

// Case 1: when each user have both login and logout time.
db.userLogs.insertMany([
  {
    userId: 1,
    eventType: "login",
    timestamp: new Date("2023-09-01T08:00:00Z"),
  },
  {
    userId: 1,
    eventType: "viewPage",
    timestamp: new Date("2023-09-01T08:15:00Z"),
  },
  {
    userId: 1,
    eventType: "viewPage",
    timestamp: new Date("2023-09-01T08:20:00Z"),
  },
  {
    userId: 1,
    eventType: "logout",
    timestamp: new Date("2023-09-01T09:00:00Z"),
  },
  {
    userId: 1,
    eventType: "login",
    timestamp: new Date("2023-09-02T10:00:00Z"),
  },
  {
    userId: 1,
    eventType: "viewPage",
    timestamp: new Date("2023-09-02T10:30:00Z"),
  },
  {
    userId: 1,
    eventType: "logout",
    timestamp: new Date("2023-09-02T11:00:00Z"),
  },
  {
    userId: 2,
    eventType: "login",
    timestamp: new Date("2023-09-01T08:00:00Z"),
  },
  {
    userId: 2,
    eventType: "viewPage",
    timestamp: new Date("2023-09-01T08:20:00Z"),
  },
  {
    userId: 2,
    eventType: "logout",
    timestamp: new Date("2023-09-01T09:00:00Z"),
  },
]);

// Main solution
db.userLogs.aggregate([
  // 1. Sort by user + timestamp
  {
    $sort: { userId: 1, timestamp: 1 },
  },
  // 2. Keep only login + logout events
  {
    $match: {
      eventType: { $in: ["login", "logout"] },
    },
  },
  // 3. For each login, peek at the next event
  {
    $setWindowFields: {
      partitionBy: "$userId",
      sortBy: { timestamp: 1 },
      output: {
        nextEvent: { $shift: { output: "$eventType", by: 1 } },
        nextTime: { $shift: { output: "$timestamp", by: 1 } },
      },
    },
  },
  // 4. Keep only proper login → logout pairs
  {
    $match: { eventType: "login", nextEvent: "logout" },
  },

  // 5. Reshape docs into sessions
  {
    $project: {
      _id: 0,
      userId: 1,
      loginTime: "$timestamp",
      logoutTime: "$nextTime",
    },
  },
  // 6. Lookup page views inside session window
  {
    $lookup: {
      from: "userLogs",
      let: { u: "$userId", login: "$loginTime", logout: "$logoutTime" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$u"] },
                { $eq: ["$eventType", "viewPage"] },
                { $gte: ["$timestamp", "$$login"] },
                { $lte: ["$timestamp", "$$logout"] },
              ],
            },
          },
        },
      ],
      as: "pageViews",
    },
  },
  // 7. Calculate session duration and page view count.
  {
    $addFields: {
      sessionDuration: {
        $divide: [
          { $subtract: ["$logoutTime", "$loginTime"] }, // milliseconds
          1000 * 60, // convert to minutes
        ],
      },
      pageViewCount: { $size: "$pageViews" },
    },
  },
  // 8: Group per user
  {
    $group: {
      _id: "$userId",
      totalSessions: { $sum: 1 },
      avgSessionDuration: { $avg: "$sessionDuration" },
      avgPageViewsPerSession: { $avg: "$pageViewCount" },
    },
  },
  {
    $project: {
      _id: 0,
      userId: "$_id",
      totalSessions: 1,
      avgSessionDuration: 1,
      avgPageViewsPerSession: 1,
    },
  },
  {
    $sort: {
      userId: 1,
    },
  },
]);

// Solution 2

db.userLogs.aggregate([
  {
    // Stage 1: Group events by user and sort them by timestamp to easily identify sessions.
    $sort: { userId: 1, timestamp: 1 },
  },
  {
    // Stage 2: Identify login and logout events to define session boundaries.
    $group: {
      _id: "$userId",
      events: {
        $push: {
          eventType: "$eventType",
          timestamp: "$timestamp",
        },
      },
    },
  },
  {
    // Stage 3: Process events for each user to extract session details.
    $project: {
      _id: 1,
      sessions: {
        $reduce: {
          input: "$events",
          initialValue: {
            sessionsArray: [],
            currentPageViews: 0,
            currentLoginTimestamp: null,
          },
          in: {
            $let: {
              vars: {
                currentEvent: "$$this",
                accumulator: "$$value",
              },
              in: {
                // If it's a login event, record the login timestamp.
                currentLoginTimestamp: {
                  $cond: {
                    if: { $eq: ["$$currentEvent.eventType", "login"] },
                    then: "$$currentEvent.timestamp",
                    else: "$$accumulator.currentLoginTimestamp",
                  },
                },
                // Count page views.
                currentPageViews: {
                  $cond: {
                    if: { $eq: ["$$currentEvent.eventType", "viewPage"] },
                    then: { $add: ["$$accumulator.currentPageViews", 1] },
                    else: "$$accumulator.currentPageViews",
                  },
                },
                // When a logout event occurs, finalize the session.
                sessionsArray: {
                  $cond: {
                    if: { $eq: ["$$currentEvent.eventType", "logout"] },
                    then: {
                      $concatArrays: [
                        "$$accumulator.sessionsArray",
                        [
                          {
                            sessionDuration: {
                              $subtract: [
                                "$$currentEvent.timestamp",
                                "$$accumulator.currentLoginTimestamp",
                              ],
                            },
                            pageViewsInSession:
                              "$$accumulator.currentPageViews",
                          },
                        ],
                      ],
                    },
                    else: "$$accumulator.sessionsArray",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    // Stage 4: Calculate aggregated session statistics per user.
    $project: {
      _id: 1,
      totalSessions: { $size: "$sessions.sessionsArray" },
      averageSessionDuration: {
        $avg: "$sessions.sessionsArray.sessionDuration",
      },
      pageViewsPerSession: {
        // Calculate average page views per session. Handle cases with no sessions.
        $cond: {
          if: { $eq: [{ $size: "$sessions.sessionsArray" }, 0] },
          then: 0,
          else: { $avg: "$sessions.sessionsArray.pageViewsInSession" },
        },
      },
    },
  },
]);

// "You have an e-commerce platform, and the products collection contains fields for views, sales, and ratings.
// Write an aggregation query to rank products based on a weighted formula where sales have a weight of 50%, ratings 30%, and views 20%.
// Calculate the popularity score for each product and rank them accordingly."

// Challenge: The interviewee needs to calculate a custom weighted formula and rank products based on that.
// Operators to Use: $addFields, $sum, $sort, $rank, $multiply, $merge

db.products.insertMany([
  {
    productId: 1,
    name: "Laptop",
    views: 1000,
    sales: 200,
    ratings: 4.5,
  },
  {
    productId: 2,
    name: "Phone",
    views: 1500,
    sales: 300,
    ratings: 4.0,
  },
  {
    productId: 3,
    name: "Headphones",
    views: 800,
    sales: 400,
    ratings: 4.8,
  },
  {
    productId: 4,
    name: "Shirt",
    views: 1200,
    sales: 150,
    ratings: 3.8,
  },
  {
    productId: 5,
    name: "Book",
    views: 600,
    sales: 100,
    ratings: 4.9,
  },
]);

// Normalization = leveling the playing field so that weights represent true importance instead of just being overwhelmed by raw numbers.

db.products.aggregate([
  // Step 1: get max values for normalization
  {
    $facet: {
      data: [{ $match: {} }], // keep original docs
      maxValues: [
        {
          $group: {
            _id: null,
            maxSales: { $max: "$sales" },
            maxRatings: { $max: "$ratings" },
            maxViews: { $max: "$views" },
          },
        },
      ],
    },
  },
  {
    $unwind: "$maxValues",
  },
  {
    $unwind: "$data",
  },
  {
    $replaceRoot: {
      newRoot: { $mergeObjects: ["$data", "$maxValues"] },
    },
  },
  // Step 2: calculate normalized popularity score
  {
    $addFields: {
      popularityScore: {
        $add: [
          { $multiply: [{ $divide: ["$sales", "$maxSales"] }, 0.5] },
          { $multiply: [{ $divide: ["$ratings", "$maxRatings"] }, 0.3] },
          { $multiply: [{ $divide: ["$views", "$maxViews"] }, 0.2] },
        ],
      },
    },
  },
  // Step 3: rank by popularityScore
  {
    $setWindowFields: {
      sortBy: { popularityScore: -1 },
      output: {
        rank: { $rank: {} },
      },
    },
  },
  // Step 4: project clean output
  {
    $project: {
      _id: 0,
      productId: 1,
      name: 1,
      sales: 1,
      ratings: 1,
      views: 1,
      popularityScore: 1,
      rank: 1,
    },
  },
]);

// Without using the concept of normalization.
db.products.aggregate([
  {
    $addFields: {
      popularityScore: {
        $sum: [
          { $multiply: ["$sales", 0.5] },
          { $multiply: ["$ratings", 0.3] },
          { $multiply: ["$views", 0.2] },
        ],
      },
    },
  },
  {
    $setWindowFields: {
      sortBy: { popularityScore: -1 },
      output: {
        rank: { $rank: {} },
      },
    },
  },
  {
    $sort: { popularityScore: -1 },
  },
  {
    $project: {
      _id: 0,
      productId: 1,
      name: 1,
      views: 1,
      sales: 1,
      ratings: 1,
      popularityScore: 1,
      rank: 1,
    },
  },
]);


// Question 10
// You have a collection of user interactions where each document contains userId, eventType, and timestamp. 
// Write an aggregation query that calculates the number of each event type (viewPage, click, purchase) that occurred in 
// a sliding 30-minute time window for each user. The output should include the userId, event type, and count of events within each 30-minute window.


db.interactions.insertMany([
  { userId: "U1", eventType: "viewPage", timestamp: new Date("2023-09-01T08:00:00Z") },
  { userId: "U1", eventType: "click",    timestamp: new Date("2023-09-01T08:05:00Z") },
  { userId: "U1", eventType: "viewPage", timestamp: new Date("2023-09-01T08:10:00Z") },
  { userId: "U1", eventType: "purchase", timestamp: new Date("2023-09-01T08:20:00Z") },
  { userId: "U1", eventType: "click",    timestamp: new Date("2023-09-01T08:25:00Z") },
  { userId: "U1", eventType: "viewPage", timestamp: new Date("2023-09-01T08:40:00Z") },
  { userId: "U2", eventType: "viewPage", timestamp: new Date("2023-09-01T08:00:00Z") },
  { userId: "U2", eventType: "purchase", timestamp: new Date("2023-09-01T08:15:00Z") },
  { userId: "U2", eventType: "viewPage", timestamp: new Date("2023-09-01T08:35:00Z") },
  { userId: "U2", eventType: "click",    timestamp: new Date("2023-09-01T08:50:00Z") },
  { userId: "U2", eventType: "click",    timestamp: new Date("2023-09-01T09:00:00Z") }
]);



// Error: Range-based bounds require sortBy a single field -> Must use "sort By" field in "$setWindowFields" aggregation pipeline stage.
db.interactions.aggregate([
  {
    $sort: { userId: 1, timestamp: 1 }
  },
  {
    $setWindowFields: {
      partitionBy: { userId: "$userId", eventType: "$eventType" },
      output: {
        count: {
          $sum: 1,
          window: {
            range: [-30 * 60 * 1000, "current"], unit: "millisecond"
          }
        }
      }
    }
  }
  ]);

  
  // Main Solution
  db.interactions.aggregate([
  { $sort: { userId: 1, timestamp: 1 } },
  {
    $setWindowFields: {
      partitionBy: { userId: "$userId", eventType: "$eventType" },
      sortBy: { timestamp: 1 },
      output: {
        count: {
          $sum: 1,
          window: {
            range: [-30 * 60 * 1000, "current"],
            unit: "millisecond"
          }
        }
      }
    }
  },
  {
    $addFields: {
      last30Minutes: {
        $subtract: ["$timestamp", 30* 60 * 1000]
      }
    }
  }
]);


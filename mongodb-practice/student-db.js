
show dbs;
use student - db;
db.scores.insertMany([
    {
        _id: 1,
        student: "Maya",
        homework: [10, 5, 10],
        quiz: [10, 8],
        extraCredit: 0
    },
    {
        _id: 2,
        student: "Ryan",
        homework: [5, 6, 5],
        quiz: [8, 8],
        extraCredit: 8
    }
]);



db.scores.aggregate([
    {
        $count: "TotalDocuments"
    }
]);

db.scores.aggregate([
    {
        $addFields: { "quizTotal": { $sum: "$quiz" } }
    }
]);

db.scores.aggregate([
    {
        $addFields: { "quizTotal": { $sum: "$quiz" }, "homeworkTotal": { $sum: "$homework" } }
    },
    {
        $addFields: { "totalScore": { $add: ["$quizTotal", "$homeworkTotal"] } }
    }
]);


db.scores.aggregate([
    {
        $addFields: { "quizTotal": { $sum: "$quiz" } }
    },
    {
        $addFields: { "isPass": { $cond: { if: { $gte: ["$quizTotal", 17] }, then: "true", else: "false" } } }
    }
]);

db.scores.deleteMany({});

db.scores.insertMany([
    { name: "Alice", totalScore: 95 },
    { name: "Bob", totalScore: 85 },
    { name: "Charlie", totalScore: 75 },
    { name: "David", totalScore: 65 },
    { name: "Eve", totalScore: 55 }
]);


db.scores.aggregate([
    {
        $addFields: {
            grade: {
                $cond: {
                    if: { $gte: ["$totalScore", 90] },
                    then: "A",
                    else: {
                        $cond: {
                            if: { $gte: ["$totalScore", 80] },
                            then: "B",
                            else: {
                                $cond: {
                                    if: { $gte: ["$totalScore", 70] },
                                    then: "C",
                                    else: {
                                        $cond: {
                                            if: { $gte: ["$totalScore", 60] },
                                            then: "D",
                                            else: "F"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
]);



db.scores.drop();

// How can I calculate the total score from multiple nested homework records in MongoDB?
db.scores.insertMany([
    {
        _id: 1,
        student: "Hamza",
        homework: [
            {
                english: 50,
            },
            {
                physics: 70,
            },
            {
                chemistry: 80
            }
        ]
    },
    {
        _id: 2,
        student: "Raza",
        homework: [
            {
                english: 60
            },
            {
                physics: 30,
            },
            {
                chemistry: 70
            }
        ]
    }
]);

db.scores.aggregate([
    {
        $addFields: {
            totalMarks: {
                $reduce: {
                    input: "$homework",        // The array of homework documents
                    initialValue: 0,           // Starting value for the accumulator (initial sum is 0)
                    in: {
                        $add: [                // Add two values together: current sum and the sum of marks in the current homework document
                            "$$value",         // $$value refers to the current accumulated sum
                            {
                                $reduce: {
                                    input: { $objectToArray: "$$this" },  // Convert the homework document (e.g., {english: 50, physics: 70}) into an array
                                    initialValue: 0,                      // Initial sum for this homework document
                                    in: { $add: ["$$value", "$$this.v"] } // Add up all the values (marks) in the homework object
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
]);

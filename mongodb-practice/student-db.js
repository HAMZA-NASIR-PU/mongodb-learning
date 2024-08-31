
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

db.scores.insertMany([
    {
        _id: 1,
        student: "Ali",
        homework: [10, 5, 10],
        quiz: [10, 8],
        extraCredit: 0
    },
    {
        _id: 2,
        student: "Raza",
        homework: [5, 9, 8],
        quiz: [8, 8],
        extraCredit: 0
    }
]);

db.scores.aggregate([
    {
        $count: "TotalDocs"
    }
]);

db.scores.aggregate([
    {
        $addFields: {
            quizTotal: { $sum: "$quiz" }
        }
    }
]);



db.scores.aggregate([
    {
        $addFields: {
            quizTotal: { $sum: "$quiz" },
            homeworkTotal: { $sum: "$homework" }
        }
    },
    {
        $addFields: {
            totalScore: { $add: ["$quizTotal", "$homeworkTotal"] }
        }
    }
]);
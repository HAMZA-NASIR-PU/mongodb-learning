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
        $addFields: {
            totalQuizes: {
                $size: "$quiz"
            },
            totalHomeworks: {
                $size: "$homework"
            }
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
            totalScore: {
                $add: ["$quizTotal", "$homeworkTotal"]
            }
        }
    },
    {
        $project: {
            student: 0,
            _id: 0
        }
    }
]);


db.scores.aggregate([
    {
        $addFields: {
            quizTotal: {
                $sum: "$quiz"
            }
        }
    },
    {
        $addFields: {
            isPass: {
                $cond: {
                    if: {
                        $gte: ["$quizTotal", 17]
                    },
                    then: "Yes",
                    else: "No"
                }
            }
        }
    }
]);
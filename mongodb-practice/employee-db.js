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


db.scores.aggregate([
    {
        $addFields: { quizTotal: { $sum: "$quiz" } }
    },
    {
        $addFields: {
            isPass: {
                $cond: { if: { $gte: ["$quizTotal", 17] }, then: true, else: false }
            }
        }
    }
]);

db.scores.drop();

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
    },
    {
        _id: 3,
        student: "Ali",
        homework: [
            {
                english: 60
            },
            {
                physics: 35,
            },
            {
                chemistry: 70
            }
        ]
    },
    {
        _id: 4,
        student: "Fareed",
        homework: [
            {
                english: 60
            },
            {
                physics: 45,
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
                    input: "$homework",
                    initialValue: 0,
                    in: {
                        $add: ["$$value", {
                            $reduce: {
                                input: { $objectToArray: "$$this" },
                                initialValue: 0,
                                in: {
                                    $add: ["$$value", "$$this.v"]
                                }
                            }
                        }]
                    }
                }
            }
        }
    }
]);

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

// How can I calculate the total score from multiple nested homework records in MongoDB?
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


// How do you check if all elements in an array meet a specific condition using MongoDB?
// How can I compute conditional pass/fail status based on individual field values inside an array in MongoDB?
// How do you validate if all subjects' marks in a MongoDB document are greater than or equal to a specific value?
// How do you apply aggregation in MongoDB to check if values in an array of objects meet a certain threshold?
db.scores.aggregate([
    {
        $addFields: {
            status: {
                $cond: {
                    if: {
                        $allElementsTrue: {
                            $map: {
                                input: "$homework",
                                as: "subject",
                                in: {
                                    $gte: [
                                        {
                                            $reduce: {
                                                input: { $objectToArray: "$$subject" }, // { english: 60 } ==> [{k:english},{v:60}]
                                                initialValue: 0,
                                                in: { $sum: ["$$value", "$$this.v"] } //$$this.v ==> 60
                                            }
                                        },
                                        33
                                    ]
                                }
                            }
                        }
                    },
                    then: "Pass",
                    else: "Fail"
                }
            }
        }
    }
]);


db.scores.aggregate([
    {
        $project: {
            marks:
            {
                $map: {
                    input: "$homework",
                    as: "subject",
                    in: { $objectToArray: "$$subject" }
                }
            }
        }

    },
    {
        $limit: 1
    }
]);


db.students.drop();



//You have a students collection where each student has an array of exams. Each exam contains a subject and score. Write a MongoDB query to calculate the average score of each student across all exams using the $let operator, and return the student name along with their average score in the output.

db.students.insertMany([
    {
        "_id": 1,
        "name": "Alice",
        "exams": [
            { "subject": "Math", "score": 85 },
            { "subject": "English", "score": 78 },
            { "subject": "Science", "score": 92 }
        ]
    },
    {
        "_id": 2,
        "name": "Bob",
        "exams": [
            { "subject": "Math", "score": 90 },
            { "subject": "English", "score": 88 },
            { "subject": "History", "score": 75 }
        ]
    },
    {
        "_id": 3,
        "name": "Charlie",
        "exams": [
            { "subject": "Math", "score": 70 },
            { "subject": "English", "score": 85 },
            { "subject": "Science", "score": 80 }
        ]
    }
]);



db.students.aggregate([
    {
        $addFields: {
            averageScore: {
                $let: {
                    vars: {
                        totalMarks: {
                            $reduce: {
                                input: "$exams",
                                initialValue: 0,
                                in: {
                                    $add: ["$$value", "$$this.score"]
                                }
                            }
                        },
                        totalSubjects: {
                            $size: "$exams"
                        }
                    },
                    in: {
                        $cond: {
                            if: {
                                $gt: ["$$totalSubjects", 0]
                            },
                            then: { $divide: ["$$totalMarks", "$$totalSubjects"] },
                            else: null
                        }
                    }
                }
            }
        }
    }
]);


db.students.aggregate([
    {
      $project: {
        name: 1,
        averageScore: {
          $let: {
            vars: {
              totalMarks: {
                $reduce: {
                  input: "$exams",
                  initialValue: 0,
                  in: {
                    $add: ["$$value", "$$this.score"]
                  }
                }
              },
              totalSubjects: { $size: "$exams" }
            },
            in: {
              $cond: {
                if: { $gt: ["$$totalSubjects", 0] },
                then: { $divide: ["$$totalMarks", "$$totalSubjects"] },
                else: null
              }
            }
          }
        }
      }
    }
  ]);
  


db.students.aggregate([
    {
        $addFields: {
            total: {
                $sum: "$exams.score"
            }
        }
    }
]);
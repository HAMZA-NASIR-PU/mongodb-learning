
db.students.deleteMany({});

db.students.insertMany([
    { name: "Alice", age: 23, scores: { math: 85, english: 78, science: 92 }, enrolled: true },
    { name: "Bob", age: 21, scores: { math: 70, english: 67, science: 80 }, enrolled: false },
    { name: "Charlie", age: 22, scores: { math: 90, english: 88, science: 94 }, enrolled: true },
    { name: "David", age: 20, scores: { math: 60, english: 65, science: 72 }, enrolled: true },
    { name: "Eve", age: 24, scores: { math: 95, english: 92, science: 89 }, enrolled: false }
]);


// Write a query to find all students who are currently enrolled.
db.students.find({ enrolled: true });

// Write a query to find students who scored more than 80 in Math.
db.students.find({ "scores.math": { $gt: 80 } });

// Write an aggregation query to calculate and add a field averageScore to each document, 
// representing the average of the student's scores in Math, English, and Science.
db.students.aggregate([
    {
        $addFields: {
            averageScore: {
                $avg: ["$scores.math", "$scores.english", "$scores.science"]
            }
        }
    }
]);


// Write an aggregation query to group students by their enrolled status and count how many students are in each group.
db.students.aggregate([
    {
        $group: {
            _id: "$enrolled",
            count: { $sum: 1 }
        }
    }
]);


// Count the Number of Students for Each Grade (Based on Average Score)
db.students.aggregate([
    {
        $addFields: {
            averageScore: {
                $avg: ["$scores.math", "$scores.english", "$scores.science"]
            }
        }
    },
    {
        $bucket: {
            groupBy: "$averageScore",
            boundaries: [0, 60, 70, 80, 90, 100],
            default: "Other",
            output: {
                count: { $sum: 1 }
            }
        }
    }
]);


// Write an aggregation query using $project to display only the name and age fields of each student. 
//Exclude the _id field.

db.students.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            age: 1
        }
    }
]);

//Write an aggregation query using $project to add a new field totalScore that is the sum of math, 
//english, and science scores. Include the name and totalScore fields in the output.

db.students.aggregate([
    {
        $project: {
            name: 1,
            totalScore: {
                $sum: ["$scores.math", "$scores.english", "$scores.science"]
            }
        }
    }
]);

//Write an aggregation query using $project to rename the scores.math field to mathScore. 
//Include the name and mathScore fields in the output.

db.students.aggregate([
    {
        $project: {
            name: 1,
            mathScore: "$scores.math"
        }
    }
]);


// Write an aggregation query using $project to display only the name, scores, and enrolled fields. 
//Use the $cond operator to include students only if they are enrolled.

db.students.aggregate([
    {
        $project: {
            name: 1,
            scores: 1,
            enrolled: 1,
            isEnrolled: {
                $cond: { if: "$enrolled", then: true, else: false }
            }
        }
    },
    {
        $match: { isEnrolled: true }
    }
]);


//Write an aggregation query using $project to calculate the average of math, english, and science scores, 
//and display it as a new field averageScore along with the name.

db.students.aggregate([
    {
        $project: {
            name: 1,
            averageScore: { $avg: ["$scores.math", "$scores.english", "$scores.science"] }
        }
    }
]);


//Write an aggregation query using $project to exclude the science score from the scores field and include all 
//other fields.

db.students.aggregate([
    {
        $project: {
            "scores.science": 0
        }
    }
]);

//Write an aggregation query using $project to create a new field passedMath that is true if the student's math score is
// greater than 60, and false otherwise. Include name and passedMath in the output.

db.students.aggregate([
    {
        $project: {
            name: 1,
            "scores.math":1,
            passedMath: {
                $cond: {
                    if: { $gt: ["$scores.math", 60] }, then: true, else: false
                }
            }
        }
    }
]);

//Write an aggregation query using $project to combine name and age into a single field called studentInfo, 
//formatted as "name (age years)". Include only studentInfo in the output.
db.students.aggregate([
    {
        $project: {
            studentInfo: {
                $concat: [
                    "$name",
                    " (",
                    { $toString: "$age" },
                    " years)"
                ]
            }
        }
    }
]);


//Write an aggregation query using $project to include name and age, but only include the scores field if the 
//student's age is greater than 21.
db.students.aggregate([
    {
        $project: {
            name: 1,
            age: 1,
            scores: {
                $cond: { if: { $gt: ["$age", 21] }, then: "$scores", else: "$$REMOVE" }
            }
        }
    }
]);



//Write an aggregation query using $project to include the name field and add a static field status with the value 
//"active" for all students.

db.students.aggregate([
    {
        $project: {
            name: 1,
            status: {
                $literal: "active"
            }
        }
    }
]);




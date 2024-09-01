
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

# The Ultimate MongoDB Qustion Bank


## <img src="https://user-images.githubusercontent.com/74038190/212257467-871d32b7-e401-42e8-a166-fcfd7baa4c6b.gif" width ="25" style="margin-bottom: -5px;"> MongoDB Aggregation: `$addFields` Stage

### Overview

The `$addFields` stage in MongoDB's aggregation pipeline is a powerful tool that allows you to add new fields to documents as they pass through the pipeline. This stage is particularly useful for creating calculated fields based on existing data, without altering the original documents in your collection.

### Key Concepts

- **Aggregation Pipeline:** A sequence of stages that process documents and transform them into aggregated results.
- **$addFields:** A stage in the aggregation pipeline that adds one or more new fields to the documents. The new fields can be based on existing fields or can be calculated using various operators.

### Syntax

```javascript
{
   $addFields: {
      <newField1>: <expression1>,
      <newField2>: <expression2>,
      ...
   }
}
```

- **`<newField>`**: The name of the new field you want to add.
- **`<expression>`**: The expression used to calculate the value of the new field. This can include existing fields, literals, or the output of other operators.

### Example: Calculating a Total Score

Consider a collection called `scores` where each document contains a student's name and an array of quiz scores. We want to calculate the total quiz score for each student and add this as a new field called `quizTotal`.

#### Collection: `scores`

```javascript
db.scores.insertMany([
    { student: "Maya", quiz: [10, 8] },
    { student: "Ryan", quiz: [7, 9, 6] }
]);
```

#### Using `$addFields` to Calculate `quizTotal`

```javascript
db.scores.aggregate([
    {
        $addFields: {
            quizTotal: { $sum: "$quiz" }
        }
    }
]);
```

#### Explanation

- **`$addFields`:** This stage adds a new field to each document.
- **`quizTotal`:** The new field being added. It stores the sum of the values in the `quiz` array.
- **`$sum: "$quiz"`:** The `$sum` operator calculates the sum of the elements in the `quiz` array for each document.

#### Result

The result of the aggregation pipeline will be:

```javascript
[
    { student: "Maya", quiz: [10, 8], quizTotal: 18 },
    { student: "Ryan", quiz: [7, 9, 6], quizTotal: 22 }
]
```

- **`quizTotal`:** This new field shows the total score of quizzes for each student.

### Conclusion

The `$addFields` stage is an excellent way to enrich your documents with additional calculated data. Whether you're summing values, concatenating strings, or performing other transformations, `$addFields` provides a flexible and straightforward method to enhance your data in MongoDB.

Encourage your students to experiment with different expressions and operators within `$addFields` to see how they can manipulate and analyze data directly in MongoDB.

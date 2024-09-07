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

## <img src="https://user-images.githubusercontent.com/74038190/212257467-871d32b7-e401-42e8-a166-fcfd7baa4c6b.gif" width ="25" style="margin-bottom: -5px;"> Understanding MongoDB UTC Timezones and Moment.js

### MongoDB and Timezones

#### 1. Storing Timestamps in UTC
MongoDB stores all date and time fields in UTC format by default. When you insert a date into MongoDB, it automatically converts the date to UTC, regardless of the server's local timezone.

For example, if you insert a date as follows:

```javascript
db.timeTest.insertOne({ 
    name: "Test Document", 
    createdAt: new Date() 
})
```
MongoDB will store the `createdAt` field in UTC. If your local server time was `2024-09-02 11:34:01 AM` in Lahore, Pakistan (UTC+5), MongoDB will store it as:
```
"createdAt": "2024-09-02T06:34:01.297Z"
```
Here, `Z` indicates that the time is in UTC.

#### 2. Verifying UTC Storage
You can verify that MongoDB stores time in UTC by inserting a date and then retrieving it. The retrieved time will be in UTC format.

For example:
```shell
db.timeTest.find({ name: "Test Document" }).pretty()
```
Output:
```json
{
    "_id" : ObjectId("64f2b530c47c8f128f5c85b3"),
    "name" : "Test Document",
    "createdAt" : ISODate("2024-09-02T06:34:01.297Z")
}
```
This confirms that the date was stored in UTC.

### Moment.js and Timezone Conversion

#### 1. Introduction to Moment.js
[Moment.js](https://momentjs.com/) is a popular JavaScript library for parsing, validating, manipulating, and formatting dates. With the `moment-timezone` extension, you can easily convert between different timezones.

#### 2. Converting UTC to Local Time
To convert a UTC timestamp stored in MongoDB to a local timezone, you can use Moment.js. Below is an example of how to convert UTC time to New Zealand's timezone:

```javascript
const moment = require('moment-timezone');

const utcTime = "2024-09-02T06:34:01.297Z";
const localTime = moment.utc(utcTime).tz("Pacific/Auckland").format("YYYY-MM-DD HH:mm:ss");

console.log(localTime); // This will print the time in New Zealand's timezone
```
This code converts the UTC time to New Zealand Standard Time (NZST), accounting for timezone differences.

#### 3. Formatting Dates
Moment.js allows you to format dates in various ways. For example:
```javascript
const formattedDate = moment.utc(utcTime).tz("Pacific/Auckland").format("dddd, MMMM Do YYYY, h:mm:ss a");
console.log(formattedDate); // Outputs: "Monday, September 2nd 2024, 6:34:01 pm"
```
This example shows how to display the date in a more human-readable format.

### Conclusion
Understanding how MongoDB stores time in UTC and how to work with these timestamps using Moment.js is crucial for building applications that operate across multiple timezones. By storing times in UTC, you ensure consistency, and by converting them to the user's local timezone, you provide a better user experience.

### Further Reading
- [Moment.js Documentation](https://momentjs.com/docs/)
- [MongoDB Date Storage](https://docs.mongodb.com/manual/reference/method/Date/)
- [Timezone Handling in Applications](https://en.wikipedia.org/wiki/Time_zone)


## <img src="https://user-images.githubusercontent.com/74038190/212257467-871d32b7-e401-42e8-a166-fcfd7baa4c6b.gif" width ="25" style="margin-bottom: -5px;"> What is `$$this` in aggregation pipeline ?


 MongoDB's aggregation framework, $`$this` is a system variable that refers to the current element being processed in an array. It's commonly used in operators like `$map` and `$reduce` when you need to iterate over an array and perform some operation on each element.

 ### Key Points About `$$this`

 - `Inside $reduce and $map`: When you use `$reduce` or `$map`, MongoDB processes each element of the array one by one. The variable `$$this` refers to the current element of the array during each iteration.

 - `Dynamic Reference`: It's a dynamic reference that updates as the array is iterated. So, for each step in the iteration, `$$this` refers to the array element that is being worked on.

- `Used in Transformation`: In array transformation operators (e.g., `$map`, `$reduce`), you can apply transformations, filters, or calculations to the array elements using `$$this`.

### Example 

```javascript
{
    _id: 1,
    student: "Hamza",
    homework: [
        { english: 50, physics: 70 },
        { chemistry: 80, math: 90 }
    ]
}
```

If you wanted to iterate over each homework object and refer to the current element in the array, you can use `$$this`.

#### Example with `$map`


```javascript
db.scores.aggregate([
    {
        $project: {
            subjects: {
                $map: {
                    input: "$homework",  // This is the array being iterated
                    as: "subject",       // "subject" will represent each element in the array
                    in: "$$this"         // $$this refers to the current element in the array
                }
            }
        }
    }
])
```

In this case, $$this would refer to each homework object in the array. For example:

- First iteration: $$this would be `{ english: 50, physics: 70 }`
- Second iteration: $$this would be `{ chemistry: 80, math: 90 }`

#### Example with `$reduce`

When using $reduce, $$this is used in the same way to refer to the current element being processed:


```javascript
db.scores.aggregate([
    {
        $addFields: {
            totalMarks: {
                $reduce: {
                    input: "$homework",
                    initialValue: 0,
                    in: { 
                        $add: [
                            "$$value", // The accumulated value
                            { 
                                $reduce: { 
                                    input: { $objectToArray: "$$this" }, // $$this refers to the current homework object
                                    initialValue: 0,
                                    in: { $add: ["$$value", "$$this.v"] } // $$this.v refers to the value in the key-value pair
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
])
```

In this example:

- In the outer `$reduce`, `$$this` refers to each element in the homework array.
- In the inner `$reduce`, `$$this.v` refers to the value of each key-value pair (e.g., 50 for english, 70 for physics).

### Summary

- `$$this` represents the current element in the array being processed.
- It's used inside array operators like `$map` and `$reduce` to dynamically refer to each array element during the iteration.
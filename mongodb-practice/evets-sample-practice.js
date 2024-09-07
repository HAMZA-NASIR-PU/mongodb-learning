db.events.insertMany([
    { _id: 1, eventName: "New Year Party", location: "New York", date: ISODate("2024-01-01T00:00:00Z"), durationHours: 5 },
    { _id: 2, eventName: "Tech Conference", location: "San Francisco", date: ISODate("2024-03-15T09:00:00Z"), durationHours: 8 },
    { _id: 3, eventName: "Music Festival", location: "London", date: ISODate("2024-03-20T14:00:00Z"), durationHours: 10 },
    { _id: 4, eventName: "Art Exhibition", location: "Paris", date: ISODate("2024-04-10T11:00:00Z"), durationHours: 6 },
    { _id: 5, eventName: "Sports Tournament", location: "Tokyo", date: ISODate("2024-05-05T13:00:00Z"), durationHours: 12 },
    { _id: 6, eventName: "Food Fair", location: "Sydney", date: ISODate("2024-06-18T10:00:00Z"), durationHours: 7 },
    { _id: 7, eventName: "Film Screening", location: "Los Angeles", date: ISODate("2024-07-22T20:00:00Z"), durationHours: 3 },
    { _id: 8, eventName: "Cultural Fest", location: "Mumbai", date: ISODate("2024-08-15T17:00:00Z"), durationHours: 4 },
    { _id: 9, eventName: "Marathon", location: "Berlin", date: ISODate("2024-09-10T07:00:00Z"), durationHours: 5 },
    { _id: 10, eventName: "Halloween Party", location: "Toronto", date: ISODate("2024-10-31T19:00:00Z"), durationHours: 6 },
    { _id: 11, eventName: "Christmas Party", location: "London", date: ISODate("2024-12-25T18:00:00Z"), durationHours: 5 },
    { _id: 12, eventName: "Corporate Workshop", location: "Berlin", date: ISODate("2024-01-12T10:00:00Z"), durationHours: 7 },
    { _id: 13, eventName: "Carnival", location: "Rio de Janeiro", date: ISODate("2024-02-22T14:00:00Z"), durationHours: 9 },
    { _id: 14, eventName: "Independence Day Parade", location: "Washington", date: ISODate("2024-07-04T09:00:00Z"), durationHours: 4 }
]);


//Question: Write a query to find all events happening in March 2024.

db.events.aggregate([
    {
        $addFields: {
            year: { $year: "$date" },
            month: { $month: "$date" }
        }
    },
    {
        $match: {
            year: 2024,
            month: 3
        }
    }
]);


db.events.find({
    $expr: {
        $and: [
            { $eq: [{ $year: "$date" }, 2024] },
            { $eq: [{ $month: "$date" }, 3] }
        ]
    }
});


// Exmaple taken from mongodb manual
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/year/
db.sales.aggregate(
    [
        {
            $project:
            {
                year: { $year: "$date" },
                month: { $month: "$date" },
                day: { $dayOfMonth: "$date" },
                hour: { $hour: "$date" },
                minutes: { $minute: "$date" },
                seconds: { $second: "$date" },
                milliseconds: { $millisecond: "$date" },
                dayOfYear: { $dayOfYear: "$date" },
                dayOfWeek: { $dayOfWeek: "$date" },
                week: { $week: "$date" }
            }
        }
    ]
)

//Question: Write an aggregation query to calculate the end time 
//of each event by adding durationHours to the event's start time.

db.events.aggregate([
    {
        $addFields: {
            endTime: {
                $add: [
                    "$date",
                    {
                        $multiply: ["$durationHours", 60 * 60 * 1000]
                    }
                ]
            }
        }
    },
    {
        $project: {
            _id: 0,
            eventName: 1,
            location: 1,
            startTime: "$date",
            endTime: 1,
            durationHours: 1
        }
    }
]);

//Question: Write a query to find
// all events that are scheduled on weekends (Saturday and Sunday).

db.events.find({
    $expr: {
        $or: [
            { $eq: [{ $dayOfWeek: "$date" }, 1] },  //Sunday = 1
            { $eq: [{ $dayOfWeek: "$date" }, 7] }  // Saturday = 7
        ]
    }
});

db.events.find({
    $expr: {
        $in: [{ $dayOfWeek: "$date" }, [1, 7]]
    }
});



//Question: Write an aggregation query to count the number of 
//events happening each month.

db.events.aggregate([
    {
        $addFields: {
            month: {
                $month: "$date"
            }
        }
    },
    {
        $group: {
            _id: "$month",
            count: { $sum: 1 }
        }
    },
    {
        $sort: {
            "count": -1
        }
    }
]);

db.events.aggregate([
    {
        $group: {
            _id: { $month: "$date" },  // Extract the month directly in the $group stage
            count: { $sum: 1 }
        }
    },
    {
        $sort: {
            count: -1  // Sort by count in descending order
        }
    }
]);


//Question: Write a query to find the event with the 
//longest duration.

db.events.aggregate([
    {
        $sort: {
            durationHours: -1
        }
    },
    {
        $limit: 1
    }
]);




//Write a query to find all events that are scheduled within the 
//next 30 days from today.

db.events.find({
    date: {
        $gte: new Date(),  // Current date
        $lte: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)  // 30 days from now
    }
});


db.events.aggregate([
    {
        $match: {
            date: {
                $gte: new Date(),
                $lte: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
            }
        }
    },
    {
        $sort: { date: 1 }  // Sort by event date in ascending order
    }
]);




db.inventory.aggregate(
    {
        $match: {
            expireDate: {
                $gte: new Date(),
                $lte: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
            }
        }
    }
);


// Write an aggregation query to convert event dates to their respective local time zones. For example, 
//convert the date to "America/New_York" for events in New York.
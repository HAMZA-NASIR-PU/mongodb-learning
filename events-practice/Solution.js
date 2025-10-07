// Question 1

// MongoDB always store timestamps in UTC.
db.events.insertMany([
  // Start in March, End in March.
  {
    _id: 1,
    title: "Science Fair",
    startDate: ISODate("2024-03-05T10:00:00+05:00"),
    endDate: ISODate("2024-03-05T16:00:00+05:00"),
    location: "High School Auditorium",
  },
  // Start in March, End in March.
  {
    _id: 2,
    title: "Math Olympiad",
    startDate: ISODate("2024-03-15T02:00:00+05:00"),
    endDate: ISODate("2024-03-15T22:00:00+05:00"),
    location: "City Convention Center",
  },
  // Start after March, End after March.
  {
    _id: 3,
    title: "Spring Concert",
    startDate: ISODate("2024-04-01T23:00:00+05:00"),
    endDate: ISODate("2024-04-02T02:00:00+05:00"),
    location: "Town Hall",
  },
  // Start before March, End in March.
  {
    _id: 4,
    title: "Art Exhibition",
    startDate: ISODate("2024-02-28T17:00:00+05:00"),
    endDate: ISODate("2024-03-03T01:00:00+05:00"),
    location: "Community Center",
  },
  // Start in March, End after March.
  {
    _id: 5,
    title: "Tech Summit",
    startDate: ISODate("2024-03-30T13:00:00+05:00"),
    endDate: ISODate("2024-04-02T23:00:00+05:00"),
    location: "Expo Center",
  },
  // Start before March, End after March.
  {
    _id: 6,
    title: "AI Summit",
    startDate: ISODate("2024-02-25T13:00:00+05:00"),
    endDate: ISODate("2024-04-02T23:00:00+05:00"),
    location: "Expo Center",
  },
]);


db.events.insertMany([
  // Start in March, End in March.
  {
    _id: 1,
    title: "Science Fair",
    startDate: ISODate("2024-03-05T10:00:00Z"),
    endDate: ISODate("2024-03-05T16:00:00Z"),
    location: "High School Auditorium",
  },
  // Start in March, End in March.
  {
    _id: 2,
    title: "Math Olympiad",
    startDate: ISODate("2024-03-15T09:00:00Z"),
    endDate: ISODate("2024-03-15T17:00:00Z"),
    location: "City Convention Center",
  },
  // Start after March, End after March.
  {
    _id: 3,
    title: "Spring Concert",
    startDate: ISODate("2024-04-01T18:00:00Z"),
    endDate: ISODate("2024-04-01T21:00:00Z"),
    location: "Town Hall",
  },
  // Start before March, End in March.
  {
    _id: 4,
    title: "Art Exhibition",
    startDate: ISODate("2024-02-28T12:00:00Z"),
    endDate: ISODate("2024-03-02T20:00:00Z"),
    location: "Community Center",
  },
  // Start in March, End after March.
  {
    _id: 5,
    title: "Tech Summit",
    startDate: ISODate("2024-03-30T08:00:00Z"),
    endDate: ISODate("2024-04-02T18:00:00Z"),
    location: "Expo Center",
  },
  // Start before March, End after March.
  {
    _id: 6,
    title: "AI Summit",
    startDate: ISODate("2024-02-25T08:00:00Z"),
    endDate: ISODate("2024-04-02T18:00:00Z"),
    location: "Expo Center",
  },
]);

db.events.find({
  $or: [
    {
      startDate: {
        $gte: ISODate("2024-03-01T00:00:00Z"),
        $lt: ISODate("2024-04-01T00:00:00Z"),
      },
    },
    {
      endDate: {
        $gte: ISODate("2024-03-01T00:00:00Z"),
        $lt: ISODate("2024-04-01T00:00:00Z"),
      },
    },
  ],
});

db.events
  .find({
    $or: [
      // 1. startDate between :fromDate and :toDate
      {
        startDate: {
          $gte: ISODate("2024-03-01T00:00:00Z"),
          $lte: ISODate("2024-03-31T23:59:59Z"),
        },
      },
      // 2. endDate between :fromDate and :toDate
      {
        endDate: {
          $gte: ISODate("2024-03-01T00:00:00Z"),
          $lte: ISODate("2024-03-31T23:59:59Z"),
        },
      },
      // 3. event spans entire range
      {
        $and: [
          { startDate: { $lte: ISODate("2024-03-01T00:00:00Z") } },
          { endDate: { $gte: ISODate("2024-03-31T23:59:59Z") } },
        ],
      },
    ],
  })
  .sort({ startDate: 1 });

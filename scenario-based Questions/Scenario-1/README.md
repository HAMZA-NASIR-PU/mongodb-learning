You are tasked with designing a real-time analytics dashboard for an e-commerce platform that tracks user behavior. The platform collects data from millions of users across the globe, capturing events such as page views, product clicks, purchases, and search queries. This data is sent to MongoDB in near real-time, where it is stored in a user_events collection with the following fields:

- `userId`: String (unique user ID)
- `eventType`: String ('page_view', 'product_click', 'purchase', 'search_query')
- `timestamp`: ISODate (when the event occurred)
- `metadata`: Document (additional event-specific data, such as product ID for a product click or search query for a search event)
db.user_events.insertMany(
    [
        {
            "userId": "user_1",
            "eventType": "page_view",
            "timestamp": ISODate("2024-09-21T10:00:00Z"),
            "metadata": {
                "page": "homepage"
            }
        },
        {
            "userId": "user_2",
            "eventType": "product_click",
            "timestamp": ISODate("2024-09-21T10:05:00Z"),
            "metadata": {
                "productId": "prod_123",
                "productName": "Wireless Earbuds"
            }
        },
        {
            "userId": "user_3",
            "eventType": "purchase",
            "timestamp": ISODate("2024-09-21T10:10:00Z"),
            "metadata": {
                "productId": "prod_456",
                "productName": "Smartphone",
                "amount": 699.99,
                "currency": "USD"
            }
        },
        {
            "userId": "user_4",
            "eventType": "search_query",
            "timestamp": ISODate("2024-09-21T10:15:00Z"),
            "metadata": {
                "query": "best laptop 2024"
            }
        },
        {
            "userId": "user_1",
            "eventType": "product_click",
            "timestamp": ISODate("2024-09-21T10:20:00Z"),
            "metadata": {
                "productId": "prod_789",
                "productName": "Laptop"
            }
        },
        {
            "userId": "user_3",
            "eventType": "purchase",
            "timestamp": ISODate("2024-09-21T10:25:00Z"),
            "metadata": {
                "productId": "prod_123",
                "productName": "Wireless Earbuds",
                "amount": 49.99,
                "currency": "USD"
            }
        },
        {
            "userId": "user_5",
            "eventType": "page_view",
            "timestamp": ISODate("2024-09-21T10:30:00Z"),
            "metadata": {
                "page": "product_page",
                "productId": "prod_456"
            }
        },
        {
            "userId": "user_2",
            "eventType": "search_query",
            "timestamp": ISODate("2024-09-21T10:35:00Z"),
            "metadata": {
                "query": "smartphone accessories"
            }
        },
        {
            "userId": "user_6",
            "eventType": "purchase",
            "timestamp": ISODate("2024-09-20T15:45:00Z"),
            "metadata": {
                "productId": "prod_101",
                "productName": "Smartwatch",
                "amount": 199.99,
                "currency": "USD"
            }
        },
        {
            "userId": "user_7",
            "eventType": "page_view",
            "timestamp": ISODate("2024-09-21T10:40:00Z"),
            "metadata": {
                "page": "search_page"
            }
        },
        {
            "userId": "user_8",
            "eventType": "purchase",
            "timestamp": ISODate("2024-09-20T12:10:00Z"),
            "metadata": {
                "productId": "prod_102",
                "productName": "Gaming Laptop",
                "amount": 1499.99,
                "currency": "USD"
            }
        }
    ]

);
# Product
```javascript
{
    'id': 0,
    "name": "pantofla Tablet"
    "description": "cellphone",
    "price": 100.9,
    "category":"small",
    "tags": ["tag1","tag2"],
    "withdrawn": true // default false
    "company": "Cell Corp.",
    "reviewAvg": 9.5 // Το θέλουμε σαν πεδία ώστε να μην το ξαναυπολογίζουμε σε κάθε κλήση
    
    "features":[
        // This Data will be versatile, based on the product type
        // Example
        {"screenResolution": "2000x1000"},
        {"weight":"200gr"}
    ]
    
}
```

# Store
```javascript
{
    "id": 0,
    "name": "Καθαρηστήριο Ψυχών",
    "address":"athina Panepistimiou 23",
    "lng": 10.967890, // longitude,
    "lat": 10.2344, //latitude
    "tags": ["tag1","tag2"],
    "withdrawn": true //default false
}
```

# User 
```javascript
{
  "id": 0,
  "username": "Quru",
  "password": "12345",
  "email":"bakopoulos@oldtv.gr"
  "isAdmin": false
  // Και άλλα πεδία στην βάση αλλά δεν θα φαίνονται στον κόσμο
}
```

# Price 
```javascript
{
    "id": 0,
    "price": 500,
    "date.from": "ΕΕΕΕ-ΜΜ-ΗΗ",
    "date.to": "ΕΕΕΕ-ΜΜ-ΗΗ",
    "productId": 0,
    "shopId": 0
}
```
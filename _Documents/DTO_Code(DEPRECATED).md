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
# Product
```javascript
{
    'id': 0,
    "productType": "cellphone",
    "name": "pantofla Tablet"
    "price": 100.9,
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
    "City": "Αθήνα",
    "submitedBy": 666 // Id of the User who submited it.
    "submiteDate": "<TimeStamp>",
    "zipcode": 6666,
    "website": "https://kolasews.gt/rip",
    "friendlyAdress": "Κωλάσεως 22 6666"
    "location": {
        "type" : "Point",
        "coordinates": [-666.66, 666.66]
    }
}
```

# Review
```javascript
{
    "id":0,
    // We should seperate it in a different call, for performance and pagination needs
    // Sample Review Object
    "authorId":null, // If he is loggen on we keep the linked account
    "authorName": "Mike",
    "score": 10, // 
    "description": "Very good phone. God bless America"
    "createTimestamp":"10-0-0T21.00.00" // Not the final format but it should be sortable
    "lastEditTimestamp": "10-0-0T21.00.00"
}
```
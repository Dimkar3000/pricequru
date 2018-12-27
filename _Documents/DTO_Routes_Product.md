# Base URL
https://localhost:8765/observatory/api

# Format 
{baseURL}/{path-to-resource}?format={json|xml}

# Product - GET {baseURL}/products
- Request 
```javascript
{
    "start":0,
    "count":10,
    "status": "ALL | WITHDRAWN | ACTIVE, default ACTIVE",
    "sort": " id|ASC, id|DESC, name|ASC, name|DESC, default id|DESC",
} 
```
- Response
```javascript
{
    "start":0,
    "count":10,
    "total": 12,
    "poducts": [
        // Product objects 
    ]
}
```
# Utility Routes
- Product - GET {baseURL}/products/{id}
    - Μόνο η format παράμετρος υποστηρίζεται
- Product - POST {baseURL}/products
    - Product object in body

- Product - PUT {baseURL}/products/{id}
    - Product object in body
    - Full Update
- Product - PATCH {baseURL}/products/{id}
    - Update single field of product 
- Product - DELETE {baseURL}/products/{id}
    - Αν την καλεί εθελοντής τότε θέτεις το withdrawn = true, αν είναι admin τότε full delete

Επιστρέφουν:
```javascript
{
    "message":"OK"
}
```

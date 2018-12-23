# Base URL
https://localhost:8765/observatory/api

# Format 
{baseURL}/{path-to-resource}?format={json|xml}

# Shops - GET {baseURL}
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
    "shops": [
        // shop objects 
    ]
}
```
# Utility Routes
- Shop - GET {baseURL}/shops/{id}
    - Μόνο η format παράμετρος υποστηρίζεται
- Shop - POST {baseURL}/shops
    - Shop object in body

- Shop - PUT {baseURL}/shops/{id}
    - Shop object in body
    - Full Update
- Shop - PATCH {baseURL}/shops/{id}
    - Update single field of product 
- Shop - DELETE {baseURL}/shops/{id}
    - Αν την καλεί εθελοντής τότε θέτεις το withdrawn = true, αν είναι admin τότε full delete

Επιστρέφουν:
```javascript
{
    "message":"OK"
}
```
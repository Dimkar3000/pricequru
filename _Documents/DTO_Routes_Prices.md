# Base URL
https://localhost:8765/observatory/api

# Format 
{baseURL}/{path-to-resource}?format={json|xml}

# Prices - GET {baseURL}/prices
- Request
```javascript
{
    "start":0, // default 0
    "count":1, // default 20
    // Geo properties: ή όλες ή τίποτα
    "geo.dist": 100, // kilometers
    "geo.lng": 12.9, // Double
    "geo.lat": 12.8, // Double
    // Date properties: ή όλες ή τίποτα
    "date.from": "2018-01-01", // ΕΕΕΕ-ΜΜ-ΗΗ
    "date.to": "2018-01-02",// ΕΕΕΕ-ΜΜ-ΗΗ
    "shops": [/* Shop objects */], // can be empty/null
    "products": [/* Product objects */] // can be empty/null
    "tags": ["tag1", "tag2"]
    "sort": ["price|ASC","geo.dist|DESC"] // όλοι οι συνδιασμοί, default price|ASC
}
```
- Response
```javascript
{
    "start": 0,
    "count": 20,
    "total": 123,
    "prices": [/* Price Objects*/]
}
```
# Prices - POST {baseURL}/prices
- Request
```javascript
{
    "price": 123
    "date.from": "2018-01-01",
    "date.to": "2018-01-02"
    "productId": 0,
    "shopId": 0
}
```


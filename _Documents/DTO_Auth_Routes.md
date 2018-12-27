# Base URL
https://localhost:8765/observatory/api

# Format 
{baseURL}/{path-to-resource}?format={json|xml}

# Login - POST {baseURL}/login
- Request
```javascript
{
    "username":"admin",
    "password":"admin1234!"
}
```
- Response
```javascript
{
    "message":"OK"
}
```

# Logout - POST {baseURL}/logout
- Request
```javascript
{
}
```
- Response
```javascript
{
    "message":"OK"
}
```
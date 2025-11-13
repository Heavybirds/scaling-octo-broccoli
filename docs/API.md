# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "broker"
}
```

**Roles:** `broker`, `fbo`, `mro`, `operator`, `advisor`

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "broker"
  }
}
```

### Login
**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

---

## Flight Tracker Endpoints

### Get All Flights
**GET** `/flights`

Retrieve all currently tracked flights with real-time ADS-B data.

**Response:**
```json
{
  "flights": [
    {
      "id": 1,
      "callsign": "N123AB",
      "altitude": 35000,
      "speed": 450,
      "lat": 40.7128,
      "lon": -74.0060,
      "heading": 270
    }
  ],
  "timestamp": "2025-11-13T11:22:22.596Z",
  "source": "ADS-B (OpenSky Network)",
  "ads": false,
  "free": true
}
```

---

For complete API documentation, see the full API.md file.

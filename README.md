# String Analysis API

A RESTful API service that analyzes strings and stores their computed properties including length, palindrome detection, character frequency, and more.

## 🚀 Features

- **String Analysis**: Automatically compute properties for any string
  - Length
  - Palindrome detection (case-insensitive)
  - Unique character count
  - Word count
  - SHA-256 hash for unique identification
  - Character frequency mapping
- **CRUD Operations**: Create, Read, Update, and Delete analyzed strings
- **Advanced Filtering**: Filter strings by multiple criteria
- **Natural Language Queries**: Use plain English to filter strings
- **In-Memory Storage**: Fast, persistent storage during runtime
- **Interactive API Documentation**: Swagger UI for testing endpoints
- **Production Ready**: Clean code, proper error handling, and logging

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/divah21/stage-one-backend.git
cd stage-one-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=info
```

## 🏃 Running Locally

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start at `http://localhost:3000` (or your configured PORT).

## � API Documentation

### Interactive Documentation (Swagger UI)

Once the server is running, visit:

**http://localhost:3000/api-docs**

This provides a fully interactive API documentation where you can:
- View all available endpoints
- See request/response schemas
- Test endpoints directly from the browser
- Download the OpenAPI specification

### OpenAPI Specification

Access the raw OpenAPI 3.0 spec at:

**http://localhost:3000/api-docs.json**

### Endpoints

#### 1. Create/Analyze String

**POST** `/strings`

Analyzes a string and stores its computed properties.

**Request Body:**

```json
{
  "value": "string to analyze"
}
```

**Success Response (201 Created):**

```json
{
  "id": "abc123...",
  "value": "string to analyze",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body or missing "value" field
- `409 Conflict`: String already exists in the system
- `422 Unprocessable Entity`: Invalid data type for "value" (must be string)

---

#### 2. Get Specific String

**GET** `/strings/{string_value}`

Retrieves a previously analyzed string.

**Success Response (200 OK):**

```json
{
  "id": "abc123...",
  "value": "requested string",
  "properties": { /* ... */ },
  "created_at": "2025-08-27T10:00:00Z"
}
```

**Error Response:**
- `404 Not Found`: String does not exist in the system

---

#### 3. Get All Strings with Filtering

**GET** `/strings`

Retrieves all strings with optional filters.

**Query Parameters:**
- `is_palindrome` (boolean): Filter by palindrome status
- `min_length` (integer): Minimum string length
- `max_length` (integer): Maximum string length
- `word_count` (integer): Exact word count
- `contains_character` (string): Single character to search for

**Example:**

```
GET /strings?is_palindrome=true&min_length=5&max_length=20
```

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": { /* ... */ },
      "created_at": "2025-08-27T10:00:00Z"
    }
  ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20
  }
}
```

**Error Response:**
- `400 Bad Request`: Invalid query parameter values or types

---

#### 4. Natural Language Filtering

**GET** `/strings/filter-by-natural-language?query=...`

Filter strings using natural language queries.

**Query Parameter:**
- `query` (string): Natural language description of filters

**Supported Queries:**
- `"all single word palindromic strings"` → word_count=1, is_palindrome=true
- `"strings longer than 10 characters"` → min_length=11
- `"palindromic strings that contain the first vowel"` → is_palindrome=true, contains_character=a
- `"strings containing the letter z"` → contains_character=z

**Example:**

```
GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings
```

**Success Response (200 OK):**

```json
{
  "data": [ /* array of matching strings */ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Unable to parse natural language query
- `422 Unprocessable Entity`: Query parsed but resulted in conflicting filters

---

#### 5. Delete String

**DELETE** `/strings/{string_value}`

Deletes a previously analyzed string.

**Success Response:**
- `204 No Content` (Empty response body)

**Error Response:**
- `404 Not Found`: String does not exist in the system

---

#### 6. Health Check

**GET** `/health`

Check server status and statistics.

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-08-27T10:00:00Z",
  "stats": {
    "total_strings": 42,
    "palindromes": 7
  }
}
```

## 🧪 Testing

You can test the API using various methods:

### Using cURL

```bash
# Create a string
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"hello world"}'

# Get a string
curl http://localhost:3000/strings/hello%20world

# Get all strings with filters
curl "http://localhost:3000/strings?is_palindrome=true&min_length=3"

# Natural language query
curl "http://localhost:3000/strings/filter-by-natural-language?query=single%20word%20palindromes"

# Delete a string
curl -X DELETE http://localhost:3000/strings/hello%20world
```

### Using Postman or Thunder Client

Import the following collection or create requests manually:

1. Create String: POST to `/strings` with JSON body
2. Get String: GET to `/strings/{string_value}`
3. List Strings: GET to `/strings` with query params
4. Natural Language: GET to `/strings/filter-by-natural-language?query=...`
5. Delete String: DELETE to `/strings/{string_value}`

## 📦 Dependencies

### Production Dependencies

- **express**: ^4.21.1 - Web framework
- **helmet**: ^8.0.0 - Security middleware
- **cors**: ^2.8.5 - CORS middleware
- **dotenv**: ^16.4.5 - Environment variable management
- **winston**: ^3.15.0 - Logging library

### Development Dependencies

- **nodemon**: ^3.1.7 - Development auto-reload

## 🗂️ Project Structure

```
stage-one-backend/
├── app.js                    # Express app configuration
├── index.js                  # Server entry point
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (not in repo)
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── README.md                 # This file
├── config/
│   └── index.js              # Configuration management
├── controllers/
│   └── stringController.js   # HTTP request handlers
├── middlewares/
│   ├── errorHandler.js       # Error handling middleware
│   └── requestLogger.js      # Request logging middleware
├── routes/
│   └── stringRoutes.js       # API route definitions
├── services/
│   └── stringService.js      # Business logic and storage
├── utils/
│   ├── logger.js             # Winston logger configuration
│   └── stringAnalyzer.js     # String analysis utilities
├── validation/
│   └── stringValidation.js   # Request validation
└── logs/
    ├── combined.log          # All logs
    └── error.log             # Error logs only
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level (info/warn/error/debug) | `info` |

## 🚀 Deployment

This API can be deployed to various platforms:

### Railway

1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Railway will auto-detect Node.js and deploy

### Heroku

```bash
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
```

### AWS/DigitalOcean/Other VPS

1. SSH into your server
2. Clone the repository
3. Install dependencies: `npm install`
4. Set up environment variables
5. Use PM2 for process management: `pm2 start index.js`

## 🐛 Troubleshooting

### Port Already in Use

If you get a port already in use error, change the PORT in your `.env` file or kill the process:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Module Not Found Errors

Ensure all dependencies are installed:

```bash
npm install
```

## 📝 License

ISC

## 👤 Author

David Smart

- GitHub: [@divah21](https://github.com/divah21)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐️ Show Your Support

Give a ⭐️ if this project helped you!

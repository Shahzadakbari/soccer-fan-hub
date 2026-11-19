# TACTICHUB Backend Server

This is the backend server for TACTICHUB that provides SQLite database persistence.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Start the Server

```bash
node server.js
```

or for development with auto-restart:

```bash
npm run dev
```

The server will start on port `3001` (or the port specified in the `PORT` environment variable).

## 📡 API Endpoints

### POST /api/signup
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "managerName": "string",
  "clubName": "string"
}
```

**Response:**
- Success: Returns user data with fresh state (budget: 500.0, empty squad/watchlist)
- Error 400: Username already taken or missing fields

### POST /api/login
Authenticate a user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
- Success: Returns user data (managerName, clubName, budget, squad, watchlist, notes)
- Error 401: Invalid username or password

### GET /api/user/:username
Get user data by username.

**Response:**
- Success: Returns user data
- Error 404: User not found

### POST /api/save
Save user progress.

**Request Body:**
```json
{
  "username": "string",
  "budget": 500.0,
  "squad": [],
  "watchlist": [],
  "notes": {}
}
```

**Response:**
```json
{ "success": true }
```

### GET /api/status
Check server status.

**Response:**
```json
{
  "status": "running",
  "database": "SQLite",
  "timestamp": "ISO timestamp"
}
```

## 🗃️ Database Schema

The SQLite database (`tactichub.db`) is created automatically on startup with the following schema:

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    manager_name TEXT NOT NULL,
    club_name TEXT NOT NULL,
    budget REAL DEFAULT 500.0,
    squad_json TEXT DEFAULT '[]',
    watchlist_json TEXT DEFAULT '[]',
    notes_json TEXT DEFAULT '{}'
)
```

## 🔧 Configuration

- **Port**: Can be configured via `PORT` environment variable (default: 3001)
- **Database**: SQLite database file is created at `server/tactichub.db`

## 📝 Notes

- The frontend automatically connects to `http://localhost:3001/api`
- Only the username is stored in `sessionStorage` for security
- All user data is persisted in the SQLite database
- New accounts start with a fresh state (€500M budget, empty squad/watchlist)

## 💡 Demo Account

A demo account is automatically created when using the "Demo Manager Login" button:
- Username: `demo`
- Password: `demo123`
- Manager Name: `Demo Manager`
- Club Name: `Demo FC`

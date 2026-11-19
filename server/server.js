/**
 * TACTICHUB Backend Server
 * SQLite Database Persistence
 * 
 * This server provides API endpoints for user authentication and data persistence
 * using SQLite database instead of localStorage.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const DB_PATH = path.join(__dirname, 'tactichub.db');
let db;

/**
 * Initialize the SQLite database
 */
function initializeDatabase() {
    // Ensure directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create or open the database
    db = new Database(DB_PATH);
    
    // Create users table if it doesn't exist
    db.exec(`
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
    `);
    
    console.log('✅ Database initialized successfully');
    console.log(`📁 Database file: ${DB_PATH}`);
}

// Initialize database on startup
initializeDatabase();

/**
 * Helper function to get user by username
 */
function getUserByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
}

/**
 * Helper function to create a new user
 */
function createUser(username, password, managerName, clubName) {
    const stmt = db.prepare(`
        INSERT INTO users (username, password, manager_name, club_name, budget, squad_json, watchlist_json, notes_json)
        VALUES (?, ?, ?, ?, 500.0, '[]', '[]', '{}')
    `);
    return stmt.run(username, password, managerName, clubName);
}

/**
 * Helper function to update user data
 */
function updateUser(username, budget, squad_json, watchlist_json, notes_json) {
    const stmt = db.prepare(`
        UPDATE users 
        SET budget = ?, squad_json = ?, watchlist_json = ?, notes_json = ?
        WHERE username = ?
    `);
    return stmt.run(budget, squad_json, watchlist_json, notes_json, username);
}

// ============================================
// API ENDPOINTS
// ============================================

// POST /api/signup - Register a new user
app.post('/api/signup', (req, res) => {
    try {
        const { username, password, managerName, clubName } = req.body;
        
        // Validation
        if (!username || !password || !managerName || !clubName) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Check if username already exists
        const existingUser = getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        
        // Create new user
        createUser(username, password, managerName, clubName);
        
        // Return success with user data
        const newUser = getUserByUsername(username);
        res.json({
            success: true,
            user: {
                username: newUser.username,
                managerName: newUser.manager_name,
                clubName: newUser.club_name,
                budget: newUser.budget,
                squad: JSON.parse(newUser.squad_json),
                watchlist: JSON.parse(newUser.watchlist_json),
                notes: JSON.parse(newUser.notes_json)
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/login - Authenticate a user
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Find user
        const user = getUserByUsername(username);
        
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        // Return user data
        res.json({
            success: true,
            user: {
                username: user.username,
                managerName: user.manager_name,
                clubName: user.club_name,
                budget: user.budget,
                squad: JSON.parse(user.squad_json),
                watchlist: JSON.parse(user.watchlist_json),
                notes: JSON.parse(user.notes_json)
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/user/:username - Get user data by username
app.get('/api/user/:username', (req, res) => {
    try {
        const { username } = req.params;
        
        const user = getUserByUsername(username);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            user: {
                username: user.username,
                managerName: user.manager_name,
                clubName: user.club_name,
                budget: user.budget,
                squad: JSON.parse(user.squad_json),
                watchlist: JSON.parse(user.watchlist_json),
                notes: JSON.parse(user.notes_json)
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/save - Save user data
app.post('/api/save', (req, res) => {
    try {
        const { username, budget, squad, watchlist, notes } = req.body;
        
        // Validation
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }
        
        // Update user data
        updateUser(
            username,
            budget,
            JSON.stringify(squad),
            JSON.stringify(watchlist),
            JSON.stringify(notes)
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/status - Check server status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        database: 'SQLite',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 TACTICHUB Server running on port ${PORT}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   - POST /api/signup`);
    console.log(`   - POST /api/login`);
    console.log(`   - GET /api/user/:username`);
    console.log(`   - POST /api/save`);
    console.log(`   - GET /api/status`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    db.close();
    process.exit(0);
});

module.exports = app;

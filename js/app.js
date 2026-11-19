/**
 * TACTICHUB - Ultimate Football Squad & Tactics Hub
 * SQLite Database Backend Version
 * All data persistence now uses backend API instead of localStorage
 */

// Global State Object
let managerState = {
    budget: 500.0,
    squad: [],
    watchlist: []
};

// Current user and authentication state
let currentUser = null;
let currentPlayerProfile = null;

// API Configuration
const API_BASE = 'http://localhost:3001/api';

// Predefined Player Database
const playerDatabase = [
    // Forwards
    {
        id: 1,
        name: "Kylian Mbappé",
        position: "Forward",
        club: "PSG",
        marketValue: 180.0,
        transferFee: 180.0,
        rating: 91,
        nationality: "France",
        age: 25,
        attributes: {
            pace: 97,
            shooting: 92,
            passing: 85,
            dribbling: 92,
            defending: 35,
            physicality: 78
        },
        photo: "https://via.placeholder.com/150/22c55e/ffffff?text=MB"
    },
    {
        id: 2,
        name: "Erling Haaland",
        position: "Forward",
        club: "Manchester City",
        marketValue: 175.0,
        transferFee: 175.0,
        rating: 91,
        nationality: "Norway",
        age: 24,
        attributes: {
            pace: 89,
            shooting: 94,
            passing: 75,
            dribbling: 80,
            defending: 40,
            physicality: 88
        },
        photo: "https://via.placeholder.com/150/22c55e/ffffff?text=EH"
    },
    {
        id: 3,
        name: "Vinícius Júnior",
        position: "Forward",
        club: "Real Madrid",
        marketValue: 120.0,
        transferFee: 120.0,
        rating: 89,
        nationality: "Brazil",
        age: 24,
        attributes: {
            pace: 95,
            shooting: 82,
            passing: 80,
            dribbling: 93,
            defending: 30,
            physicality: 70
        },
        photo: "https://via.placeholder.com/150/22c55e/ffffff?text=VJ"
    },
    {
        id: 4,
        name: "Harry Kane",
        position: "Forward",
        club: "Bayern Munich",
        marketValue: 100.0,
        transferFee: 100.0,
        rating: 90,
        nationality: "England",
        age: 31,
        attributes: {
            pace: 75,
            shooting: 93,
            passing: 88,
            dribbling: 80,
            defending: 45,
            physicality: 85
        },
        photo: "https://via.placeholder.com/150/22c55e/ffffff?text=HK"
    },
    
    // Midfielders
    {
        id: 5,
        name: "Jude Bellingham",
        position: "Midfielder",
        club: "Real Madrid",
        marketValue: 180.0,
        transferFee: 180.0,
        rating: 90,
        nationality: "England",
        age: 21,
        attributes: {
            pace: 80,
            shooting: 88,
            passing: 86,
            dribbling: 85,
            defending: 78,
            physicality: 82
        },
        photo: "https://via.placeholder.com/150/3b82f6/ffffff?text=JB"
    },
    {
        id: 6,
        name: "Kevin De Bruyne",
        position: "Midfielder",
        club: "Manchester City",
        marketValue: 100.0,
        transferFee: 100.0,
        rating: 91,
        nationality: "Belgium",
        age: 33,
        attributes: {
            pace: 78,
            shooting: 92,
            passing: 95,
            dribbling: 88,
            defending: 65,
            physicality: 78
        },
        photo: "https://via.placeholder.com/150/3b82f6/ffffff?text=KDB"
    },
    {
        id: 7,
        name: "Rodri",
        position: "Midfielder",
        club: "Manchester City",
        marketValue: 120.0,
        transferFee: 120.0,
        rating: 90,
        nationality: "Spain",
        age: 28,
        attributes: {
            pace: 75,
            shooting: 82,
            passing: 90,
            dribbling: 80,
            defending: 85,
            physicality: 88
        },
        photo: "https://via.placeholder.com/150/3b82f6/ffffff?text=R"
    },
    {
        id: 8,
        name: "Pedri",
        position: "Midfielder",
        club: "Barcelona",
        marketValue: 150.0,
        transferFee: 150.0,
        rating: 89,
        nationality: "Spain",
        age: 22,
        attributes: {
            pace: 82,
            shooting: 78,
            passing: 90,
            dribbling: 92,
            defending: 60,
            physicality: 70
        },
        photo: "https://via.placeholder.com/150/3b82f6/ffffff?text=P"
    },
    
    // Defenders
    {
        id: 9,
        name: "Virgil van Dijk",
        position: "Defender",
        club: "Liverpool",
        marketValue: 80.0,
        transferFee: 80.0,
        rating: 89,
        nationality: "Netherlands",
        age: 33,
        attributes: {
            pace: 75,
            shooting: 65,
            passing: 80,
            dribbling: 60,
            defending: 92,
            physicality: 90
        },
        photo: "https://via.placeholder.com/150/10b981/ffffff?text=VVD"
    },
    {
        id: 10,
        name: "Rúben Dias",
        position: "Defender",
        club: "Manchester City",
        marketValue: 90.0,
        transferFee: 90.0,
        rating: 89,
        nationality: "Portugal",
        age: 27,
        attributes: {
            pace: 78,
            shooting: 55,
            passing: 82,
            dribbling: 65,
            defending: 90,
            physicality: 88
        },
        photo: "https://via.placeholder.com/150/10b981/ffffff?text=RD"
    },
    {
        id: 11,
        name: "Antonio Rüdiger",
        position: "Defender",
        club: "Real Madrid",
        marketValue: 70.0,
        transferFee: 70.0,
        rating: 87,
        nationality: "Germany",
        age: 31,
        attributes: {
            pace: 80,
            shooting: 50,
            passing: 75,
            dribbling: 60,
            defending: 88,
            physicality: 90
        },
        photo: "https://via.placeholder.com/150/10b981/ffffff?text=AR"
    },
    {
        id: 12,
        name: "Achraf Hakimi",
        position: "Defender",
        club: "PSG",
        marketValue: 85.0,
        transferFee: 85.0,
        rating: 88,
        nationality: "Morocco",
        age: 25,
        attributes: {
            pace: 95,
            shooting: 70,
            passing: 78,
            dribbling: 82,
            defending: 78,
            physicality: 75
        },
        photo: "https://via.placeholder.com/150/10b981/ffffff?text=AH"
    },
    
    // Goalkeepers
    {
        id: 13,
        name: "Thibaut Courtois",
        position: "Goalkeeper",
        club: "Real Madrid",
        marketValue: 60.0,
        transferFee: 60.0,
        rating: 89,
        nationality: "Belgium",
        age: 32,
        attributes: {
            pace: 50,
            shooting: 40,
            passing: 65,
            dribbling: 50,
            defending: 80,
            physicality: 75
        },
        photo: "https://via.placeholder.com/150/8b5cf6/ffffff?text=TC"
    },
    {
        id: 14,
        name: "Alisson Becker",
        position: "Goalkeeper",
        club: "Liverpool",
        marketValue: 65.0,
        transferFee: 65.0,
        rating: 89,
        nationality: "Brazil",
        age: 32,
        attributes: {
            pace: 55,
            shooting: 45,
            passing: 70,
            dribbling: 55,
            defending: 82,
            physicality: 78
        },
        photo: "https://via.placeholder.com/150/8b5cf6/ffffff?text=AB"
    },
    {
        id: 15,
        name: "Marc-André ter Stegen",
        position: "Goalkeeper",
        club: "Barcelona",
        marketValue: 50.0,
        transferFee: 50.0,
        rating: 88,
        nationality: "Germany",
        age: 32,
        attributes: {
            pace: 50,
            shooting: 40,
            passing: 75,
            dribbling: 55,
            defending: 80,
            physicality: 70
        },
        photo: "https://via.placeholder.com/150/8b5cf6/ffffff?text=MATS"
    },
    {
        id: 16,
        name: "Mike Maignan",
        position: "Goalkeeper",
        club: "AC Milan",
        marketValue: 55.0,
        transferFee: 55.0,
        rating: 87,
        nationality: "France",
        age: 29,
        attributes: {
            pace: 55,
            shooting: 40,
            passing: 65,
            dribbling: 50,
            defending: 85,
            physicality: 80
        },
        photo: "https://via.placeholder.com/150/8b5cf6/ffffff?text=MM"
    }
];

// Position colors for badges
const positionColors = {
    'Forward': 'bg-red-500/20 text-red-400',
    'Midfielder': 'bg-blue-500/20 text-blue-400',
    'Defender': 'bg-green-500/20 text-green-400',
    'Goalkeeper': 'bg-purple-500/20 text-purple-400'
};

// Position icons
const positionIcons = {
    'Forward': 'fa-futbol',
    'Midfielder': 'fa-running',
    'Defender': 'fa-shield-alt',
    'Goalkeeper': 'fa-hands'
};

// User notes storage (per-user scouting notes)
let userNotes = {};

// ============================================
// API HELPER FUNCTIONS
// ============================================

/**
 * Make a POST request to the API
 */
async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Make a GET request to the API
 */
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Check if the server is running
 */
async function checkServerStatus() {
    try {
        const result = await apiGet('/status');
        return result.status === 'running';
    } catch (error) {
        return false;
    }
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Switch between Sign In and Sign Up tabs
 */
function switchAuthTab(tab) {
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    
    if (tab === 'signin') {
        signinTab.classList.add('active', 'bg-emerald-600', 'text-white');
        signinTab.classList.remove('bg-slate-700', 'text-slate-400');
        signupTab.classList.remove('active', 'bg-emerald-600', 'text-white');
        signupTab.classList.add('bg-slate-700', 'text-slate-400');
    } else {
        signupTab.classList.add('active', 'bg-emerald-600', 'text-white');
        signupTab.classList.remove('bg-slate-700', 'text-slate-400');
        signinTab.classList.remove('active', 'bg-emerald-600', 'text-white');
        signinTab.classList.add('bg-slate-700', 'text-slate-400');
    }
    
    document.getElementById('signin-form').classList.add('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    
    if (tab === 'signin') {
        document.getElementById('signin-form').classList.remove('hidden');
    } else {
        document.getElementById('signup-form').classList.remove('hidden');
    }
    
    showAuthFeedback('', 'hidden');
}

/**
 * Show authentication feedback message
 */
function showAuthFeedback(message, type = 'info') {
    const feedbackEl = document.getElementById('auth-feedback');
    
    if (message === '' || type === 'hidden') {
        feedbackEl.classList.add('hidden');
        return;
    }
    
    feedbackEl.textContent = message;
    feedbackEl.classList.remove('hidden', 'bg-red-500/20', 'text-red-400', 'bg-emerald-500/20', 'text-emerald-400', 'bg-blue-500/20', 'text-blue-400');
    
    if (type === 'success') {
        feedbackEl.classList.add('bg-emerald-500/20', 'text-emerald-400');
    } else if (type === 'error') {
        feedbackEl.classList.add('bg-red-500/20', 'text-red-400');
    } else {
        feedbackEl.classList.add('bg-blue-500/20', 'text-blue-400');
    }
}

/**
 * Handle Sign In form submission
 */
async function handleSignIn(event) {
    event.preventDefault();
    
    const username = document.getElementById('signin-username').value.trim();
    const password = document.getElementById('signin-password').value;
    
    if (!username || !password) {
        showAuthFeedback('Please enter both username and password', 'error');
        return;
    }
    
    try {
        showAuthFeedback('Signing in...', 'info');
        
        const response = await apiPost('/login', { username, password });
        
        if (response.success) {
            // Store only username in sessionStorage
            sessionStorage.setItem('tactichub_username', username);
            
            // Load user data
            signInUser(response.user);
            
            showAuthFeedback('Signed in successfully!', 'success');
            
            setTimeout(() => {
                switchView('dashboard');
                showAuthFeedback('', 'hidden');
            }, 500);
        }
    } catch (error) {
        showAuthFeedback(error.message, 'error');
    }
}

/**
 * Handle Sign Up form submission
 */
async function handleSignUp(event) {
    event.preventDefault();
    
    const managerName = document.getElementById('signup-manager').value.trim();
    const clubName = document.getElementById('signup-club').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;
    
    if (!managerName || !clubName || !username || !password) {
        showAuthFeedback('All fields are required', 'error');
        return;
    }
    
    if (password.length < 4) {
        showAuthFeedback('Password must be at least 4 characters', 'error');
        return;
    }
    
    try {
        showAuthFeedback('Creating account...', 'info');
        
        const response = await apiPost('/signup', {
            username,
            password,
            managerName,
            clubName
        });
        
        if (response.success) {
            // Store only username in sessionStorage
            sessionStorage.setItem('tactichub_username', username);
            
            // Load user data
            signInUser(response.user);
            
            showAuthFeedback('Account created! Signing in...', 'success');
            
            setTimeout(() => {
                switchView('dashboard');
                showAuthFeedback('', 'hidden');
            }, 500);
        }
    } catch (error) {
        showAuthFeedback(error.message, 'error');
    }
}

/**
 * Demo login - logs into a pre-made guest profile
 */
async function demoLogin() {
    try {
        showAuthFeedback('Logging in as Demo Manager...', 'info');
        
        // Try to login as demo user
        try {
            const response = await apiPost('/login', {
                username: 'demo',
                password: 'demo123'
            });
            
            if (response.success) {
                sessionStorage.setItem('tactichub_username', 'demo');
                signInUser(response.user);
                
                setTimeout(() => {
                    switchView('dashboard');
                    showAuthFeedback('', 'hidden');
                }, 500);
                return;
            }
        } catch (error) {
            // Demo user doesn't exist, create it
            const response = await apiPost('/signup', {
                username: 'demo',
                password: 'demo123',
                managerName: 'Demo Manager',
                clubName: 'Demo FC'
            });
            
            if (response.success) {
                sessionStorage.setItem('tactichub_username', 'demo');
                signInUser(response.user);
                
                setTimeout(() => {
                    switchView('dashboard');
                    showAuthFeedback('', 'hidden');
                }, 500);
            }
        }
    } catch (error) {
        showAuthFeedback(error.message, 'error');
    }
}

/**
 * Sign in a user and load their saved state
 */
function signInUser(userData) {
    currentUser = {
        username: userData.username,
        managerName: userData.managerName,
        clubName: userData.clubName
    };
    
    managerState = {
        budget: userData.budget,
        squad: userData.squad,
        watchlist: userData.watchlist
    };
    
    userNotes = userData.notes || {};
    
    updateAuthUI();
    updateDashboardStats();
}

/**
 * Sign out the current user
 */
function signOut() {
    // Save current progress before signing out
    saveUserProgress();
    
    // Clear session
    sessionStorage.removeItem('tactichub_username');
    currentUser = null;
    
    // Reset state
    managerState = {
        budget: 500.0,
        squad: [],
        watchlist: []
    };
    
    userNotes = {};
    currentPlayerProfile = null;
    
    updateAuthUI();
    switchView('auth-view');
    
    document.getElementById('signin-form').reset();
    document.getElementById('signup-form').reset();
    switchAuthTab('signin');
}

/**
 * Save current user's progress to the database
 */
async function saveUserProgress() {
    if (!currentUser) return;
    
    try {
        await apiPost('/save', {
            username: currentUser.username,
            budget: managerState.budget,
            squad: managerState.squad,
            watchlist: managerState.watchlist,
            notes: userNotes
        });
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
}

/**
 * Update UI based on authentication state
 */
function updateAuthUI() {
    const mainNav = document.getElementById('main-nav');
    const profileSection = document.getElementById('profile-section');
    const profileBadge = document.getElementById('profile-badge');
    const signoutBtn = document.getElementById('signout-btn');
    const dbStatus = document.getElementById('db-status');
    
    if (currentUser) {
        mainNav.classList.remove('hidden');
        profileSection.classList.remove('hidden');
        profileBadge.classList.remove('hidden');
        signoutBtn.classList.remove('hidden');
        dbStatus.classList.remove('hidden');
        
        document.getElementById('manager-name').textContent = currentUser.managerName;
        document.getElementById('club-name').textContent = currentUser.clubName;
        
        const hour = new Date().getHours();
        let greeting = 'Good evening';
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        
        document.getElementById('greeting').textContent = `${greeting}, ${currentUser.managerName}.`;
        document.getElementById('dashboard-subtitle').textContent = `Welcome back to ${currentUser.clubName}!`;
    } else {
        mainNav.classList.add('hidden');
        profileSection.classList.add('hidden');
        profileBadge.classList.add('hidden');
        signoutBtn.classList.add('hidden');
        dbStatus.classList.add('hidden');
        
        document.getElementById('greeting').textContent = '';
        document.getElementById('dashboard-subtitle').textContent = 'Overview of your squad management and scouting activities';
    }
}

/**
 * Load user data from the server
 */
async function loadUserData(username) {
    try {
        const response = await apiGet(`/user/${username}`);
        
        if (response.success) {
            return response.user;
        }
        return null;
    } catch (error) {
        console.error('Failed to load user data:', error);
        return null;
    }
}

// ============================================
// VIEW SWITCHING FUNCTIONS
// ============================================

/**
 * Switch between different views in the application
 */
function switchView(viewName) {
    if (viewName !== 'auth-view' && !currentUser) {
        switchView('auth-view');
        return;
    }
    
    const viewSections = document.querySelectorAll('.view-section');
    viewSections.forEach(section => {
        section.classList.add('hidden');
    });

    const targetView = document.getElementById(viewName);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('bg-emerald-600', 'text-white');
        btn.classList.add('bg-slate-700', 'text-slate-200');
    });

    const activeButton = Array.from(navButtons).find(btn => 
        btn.getAttribute('onclick')?.includes(`'${viewName}'`)
    );
    if (activeButton) {
        activeButton.classList.remove('bg-slate-700', 'text-slate-200');
        activeButton.classList.add('bg-emerald-600', 'text-white');
    }

    if (viewName === 'dashboard') {
        updateDashboardStats();
    }
    
    if (viewName === 'player-directory') {
        renderPlayerDirectory();
    }
    
    if (viewName === 'compare-players') {
        initializeComparisonDropdowns();
    }
    
    if (viewName !== 'player-profile') {
        currentPlayerProfile = null;
    }
}

// ============================================
// PLAYER DIRECTORY FUNCTIONS
// ============================================

/**
 * Render the player directory with current filters
 */
function renderPlayerDirectory() {
    const playerGrid = document.getElementById('player-grid');
    const searchQuery = document.getElementById('player-search').value.toLowerCase();
    const positionFilter = document.getElementById('position-filter').value;
    
    const filteredPlayers = filterPlayersData(searchQuery, positionFilter);
    
    document.getElementById('player-count').textContent = filteredPlayers.length;
    
    playerGrid.innerHTML = '';
    
    filteredPlayers.forEach(player => {
        const isInWatchlist = managerState.watchlist.some(p => p.id === player.id);
        const isInSquad = managerState.squad.some(p => p.id === player.id);
        const canAfford = player.transferFee <= managerState.budget;
        
        const card = document.createElement('div');
        card.className = 'bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-emerald-500/30 transition-all duration-300 group';
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl">
                        <i class="fas ${positionIcons[player.position]} text-emerald-500"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">${player.name}</h3>
                        <p class="text-sm text-slate-400">${player.club}</p>
                    </div>
                </div>
                <span class="${positionColors[player.position]} text-xs font-bold px-2 py-1 rounded-full uppercase">
                    ${player.position}
                </span>
            </div>
            
            <div class="space-y-3 mb-4">
                <div class="flex justify-between items-center">
                    <span class="text-slate-400 text-sm">Market Value</span>
                    <span class="text-emerald-400 font-medium">€${player.marketValue.toFixed(1)}M</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-slate-400 text-sm">Rating</span>
                    <span class="text-white font-bold text-lg">${player.rating}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-slate-400 text-sm">Nationality</span>
                    <span class="text-slate-300 text-sm">${player.nationality}</span>
                </div>
            </div>
            
            <div class="flex items-center justify-between space-x-2">
                <button 
                    onclick="toggleWatchlist(${player.id})"
                    class="flex-1 bg-slate-700/50 hover:bg-emerald-500/20 border border-slate-600 text-${isInWatchlist ? 'emerald-400' : 'slate-400'} py-2 px-3 rounded-lg transition-all flex items-center justify-center space-x-2"
                >
                    <i class="fas ${isInWatchlist ? 'fa-star' : 'fa-star text-slate-500'}"></i>
                    <span>${isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
                <button 
                    onclick="viewPlayerProfile(${player.id})"
                    class="flex-1 bg-slate-700/50 hover:bg-blue-500/20 border border-slate-600 text-slate-300 hover:text-blue-400 py-2 px-3 rounded-lg transition-all flex items-center justify-center space-x-2"
                >
                    <i class="fas fa-user"></i>
                    <span>Scout</span>
                </button>
                <button 
                    onclick="addToSquad(${player.id})"
                    ${!canAfford ? 'disabled' : ''}
                    class="flex-1 ${canAfford ? 'bg-slate-700/50 hover:bg-emerald-500/20 border border-slate-600 text-slate-300 hover:text-emerald-400' : 'bg-slate-600/30 border border-slate-500 text-slate-500 cursor-not-allowed'} py-2 px-3 rounded-lg transition-all flex items-center justify-center space-x-2"
                >
                    <i class="fas ${isInSquad ? 'fa-check' : 'fa-plus'}"></i>
                    <span>${isInSquad ? 'In Squad' : 'Add to Squad'}</span>
                </button>
            </div>
        `;
        playerGrid.appendChild(card);
    });
}

/**
 * Filter players based on search query and position filter
 */
function filterPlayers() {
    const searchQuery = document.getElementById('player-search').value.toLowerCase();
    const positionFilter = document.getElementById('position-filter').value;
    
    renderPlayerDirectory();
}

/**
 * Filter player data (used internally)
 */
function filterPlayersData(searchQuery, positionFilter) {
    return playerDatabase.filter(player => {
        const matchesSearch = !searchQuery || 
            player.name.toLowerCase().includes(searchQuery) ||
            player.club.toLowerCase().includes(searchQuery) ||
            player.position.toLowerCase().includes(searchQuery) ||
            player.nationality.toLowerCase().includes(searchQuery);
        
        const matchesPosition = positionFilter === 'All' || player.position === positionFilter;
        
        return matchesSearch && matchesPosition;
    });
}

/**
 * Toggle a player in/out of the watchlist
 */
function toggleWatchlist(playerId) {
    const player = playerDatabase.find(p => p.id === playerId);
    if (!player) return;
    
    const indexInWatchlist = managerState.watchlist.findIndex(p => p.id === playerId);
    
    if (indexInWatchlist >= 0) {
        managerState.watchlist.splice(indexInWatchlist, 1);
    } else {
        managerState.watchlist.push({ ...player });
    }
    
    saveUserProgress();
    updateDashboardStats();
    renderPlayerDirectory();
}

/**
 * Add a player to the squad
 */
function addToSquad(playerId) {
    const player = playerDatabase.find(p => p.id === playerId);
    if (!player) return;
    
    const isInSquad = managerState.squad.some(p => p.id === playerId);
    if (isInSquad) {
        alert('This player is already in your squad!');
        return;
    }
    
    if (player.transferFee > managerState.budget) {
        alert(`Not enough budget! You need €${player.transferFee.toFixed(1)}M but only have €${managerState.budget.toFixed(1)}M remaining.`);
        return;
    }
    
    managerState.squad.push({ ...player });
    managerState.budget -= player.transferFee;
    
    saveUserProgress();
    updateDashboardStats();
    renderPlayerDirectory();
    
    alert(`✅ ${player.name} added to squad for €${player.transferFee.toFixed(1)}M!`);
}

/**
 * View a player's profile
 */
function viewPlayerProfile(playerId) {
    const player = playerDatabase.find(p => p.id === playerId);
    if (player) {
        currentPlayerProfile = player;
        switchView('player-profile');
        displayPlayerProfile(playerId);
    }
}

// ============================================
// PLAYER PROFILE FUNCTIONS
// ============================================

/**
 * Display a player's profile
 */
function displayPlayerProfile(playerId) {
    const player = playerDatabase.find(p => p.id === playerId);
    if (!player) return;
    
    currentPlayerProfile = player;
    
    document.getElementById('profile-name').textContent = player.name;
    document.getElementById('profile-club').textContent = player.club;
    document.getElementById('profile-value').textContent = `€${player.marketValue.toFixed(1)}M`;
    document.getElementById('profile-rating').textContent = player.rating;
    document.getElementById('profile-nationality').textContent = player.nationality;
    document.getElementById('profile-age').textContent = player.age;
    
    const positionBadge = document.getElementById('profile-position-badge');
    positionBadge.innerHTML = `
        <span class="${positionColors[player.position]} text-xs font-bold px-3 py-1 rounded-full uppercase">
            <i class="fas ${positionIcons[player.position]} mr-1"></i> ${player.position}
        </span>
    `;
    
    if (player.attributes) {
        updateAttributeBar('pace', player.attributes.pace);
        updateAttributeBar('shooting', player.attributes.shooting);
        updateAttributeBar('passing', player.attributes.passing);
        updateAttributeBar('dribbling', player.attributes.dribbling);
        updateAttributeBar('defending', player.attributes.defending);
        updateAttributeBar('physicality', player.attributes.physicality);
    }
    
    loadScoutingNotes(playerId);
    document.getElementById('scouting-note-input').value = '';
}

/**
 * Update a single attribute bar display
 */
function updateAttributeBar(attrName, value) {
    const valueEl = document.getElementById(`attr-${attrName}-value`);
    const barEl = document.getElementById(`attr-${attrName}-bar`);
    
    if (valueEl && barEl) {
        valueEl.textContent = value;
        barEl.style.width = `${value}%`;
    }
}

// ============================================
// SCOUTING NOTES CRUD FUNCTIONS
// ============================================

/**
 * Save a scouting note
 */
function saveScoutingNote() {
    if (!currentPlayerProfile) {
        alert('No player selected! Please select a player first.');
        return;
    }
    
    if (!currentUser) {
        alert('Please sign in to save scouting notes.');
        return;
    }
    
    const noteInput = document.getElementById('scouting-note-input');
    const noteText = noteInput.value.trim();
    
    if (!noteText) {
        alert('Please enter a note before saving.');
        return;
    }
    
    // Initialize notes for user if not exists
    if (!userNotes[currentUser.username]) {
        userNotes[currentUser.username] = {};
    }
    
    // Initialize notes for this player if not exists
    if (!userNotes[currentUser.username][currentPlayerProfile.id]) {
        userNotes[currentUser.username][currentPlayerProfile.id] = [];
    }
    
    const notes = userNotes[currentUser.username][currentPlayerProfile.id];
    
    const newNote = {
        id: Date.now(),
        playerId: currentPlayerProfile.id,
        content: noteText,
        timestamp: new Date().toISOString(),
        playerName: currentPlayerProfile.name
    };
    
    notes.push(newNote);
    
    noteInput.value = '';
    loadScoutingNotes(currentPlayerProfile.id);
    
    saveUserProgress();
    alert('✅ Scouting note saved successfully!');
}

/**
 * Load scouting notes from userNotes
 */
function loadScoutingNotes(playerId) {
    if (!currentUser) return;
    
    const notes = userNotes[currentUser.username]?.[playerId] || [];
    const notesList = document.getElementById('scouting-notes-list');
    
    if (notes.length === 0) {
        notesList.innerHTML = '<p class="text-slate-500 text-center py-6">No scouting notes yet. Add your first note!</p>';
        return;
    }
    
    let html = '';
    notes.forEach(note => {
        const date = new Date(note.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const noteIndex = notes.findIndex(n => n.id === note.id);
        
        html += `
            <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                        <p class="text-white font-medium mb-1">${note.content}</p>
                        <p class="text-slate-400 text-xs">
                            <i class="fas fa-clock mr-1"></i>
                            ${formattedDate}
                        </p>
                    </div>
                </div>
                <div class="flex items-center justify-end space-x-2">
                    <button 
                        onclick="editScoutingNote(${note.id}, ${playerId})"
                        class="text-slate-400 hover:text-emerald-400 text-xs transition-colors"
                    >
                        <i class="fas fa-edit mr-1"></i> Edit
                    </button>
                    <button 
                        onclick="deleteScoutingNote(${note.id}, ${playerId})"
                        class="text-slate-400 hover:text-red-400 text-xs transition-colors"
                    >
                        <i class="fas fa-trash mr-1"></i> Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    notesList.innerHTML = html;
}

/**
 * Edit a scouting note
 */
function editScoutingNote(noteId, playerId) {
    if (!currentUser) return;
    
    const notes = userNotes[currentUser.username]?.[playerId] || [];
    const noteToEdit = notes.find(n => n.id === noteId);
    if (!noteToEdit) return;
    
    const newContent = prompt('Edit your scouting note:', noteToEdit.content);
    if (newContent === null) return;
    
    if (newContent.trim() === '') {
        alert('Note cannot be empty!');
        return;
    }
    
    noteToEdit.content = newContent.trim();
    noteToEdit.timestamp = new Date().toISOString();
    
    loadScoutingNotes(playerId);
    saveUserProgress();
    alert('✅ Scouting note updated successfully!');
}

/**
 * Delete a scouting note
 */
function deleteScoutingNote(noteId, playerId) {
    if (!currentUser) return;
    
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }
    
    const notes = userNotes[currentUser.username]?.[playerId] || [];
    const filteredNotes = notes.filter(n => n.id !== noteId);
    
    userNotes[currentUser.username][playerId] = filteredNotes;
    
    loadScoutingNotes(playerId);
    saveUserProgress();
    alert('✅ Scouting note deleted successfully!');
}

/**
 * Clear the note input field
 */
function clearNoteInput() {
    document.getElementById('scouting-note-input').value = '';
}

// ============================================
// COMPARISON TOOL FUNCTIONS
// ============================================

/**
 * Initialize the comparison dropdowns with all players
 */
function initializeComparisonDropdowns() {
    const player1Select = document.getElementById('compare-player-1');
    const player2Select = document.getElementById('compare-player-2');
    
    // Clear existing options (except the first "Select a player..." option)
    player1Select.innerHTML = '<option value="">Select a player...</option>';
    player2Select.innerHTML = '<option value="">Select a player...</option>';
    
    // Add all players to both dropdowns
    playerDatabase.forEach(player => {
        const option1 = document.createElement('option');
        option1.value = player.id;
        option1.textContent = `${player.name} (${player.position}, ${player.club})`;
        player1Select.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = player.id;
        option2.textContent = `${player.name} (${player.position}, ${player.club})`;
        player2Select.appendChild(option2);
    });
    
    // Set defaults (first and second player)
    if (playerDatabase.length >= 1) {
        player1Select.value = playerDatabase[0].id;
    }
    if (playerDatabase.length >= 2) {
        player2Select.value = playerDatabase[1].id;
    }
    
    // Trigger initial comparison
    updateComparison();
}

/**
 * Update the comparison view based on selected players
 */
function updateComparison() {
    const player1Id = parseInt(document.getElementById('compare-player-1').value);
    const player2Id = parseInt(document.getElementById('compare-player-2').value);
    
    // If both players are selected, show comparison
    if (player1Id && player2Id) {
        const player1 = playerDatabase.find(p => p.id === player1Id);
        const player2 = playerDatabase.find(p => p.id === player2Id);
        
        if (player1 && player2) {
            displayComparison(player1, player2);
            document.getElementById('comparison-container').classList.remove('hidden');
            return;
        }
    }
    
    // Hide comparison if players not selected
    document.getElementById('comparison-container').classList.add('hidden');
}

/**
 * Display the comparison between two players
 */
function displayComparison(player1, player2) {
    // Update Player 1 Card
    document.getElementById('player-1-name').textContent = player1.name;
    document.getElementById('player-1-club').textContent = player1.club;
    document.getElementById('player-1-position').textContent = player1.position;
    document.getElementById('player-1-position').className = `${positionColors[player1.position]} text-xs font-bold px-3 py-1 rounded-full`;
    document.getElementById('player-1-rating').textContent = player1.rating;
    document.getElementById('player-1-value').textContent = `€${player1.marketValue.toFixed(1)}M`;
    document.getElementById('player-1-avatar').textContent = player1.name.substring(0, 2).toUpperCase();
    
    // Update Player 2 Card
    document.getElementById('player-2-name').textContent = player2.name;
    document.getElementById('player-2-club').textContent = player2.club;
    document.getElementById('player-2-position').textContent = player2.position;
    document.getElementById('player-2-position').className = `${positionColors[player2.position]} text-xs font-bold px-3 py-1 rounded-full`;
    document.getElementById('player-2-rating').textContent = player2.rating;
    document.getElementById('player-2-value').textContent = `€${player2.marketValue.toFixed(1)}M`;
    document.getElementById('player-2-avatar').textContent = player2.name.substring(0, 2).toUpperCase();
    
    // Update Add to Squad buttons
    updateComparisonAddButtons(player1, player2);
    
    // Update attribute displays for both players
    const attributes = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physicality'];
    
    attributes.forEach(attr => {
        const val1 = player1.attributes?.[attr] || 0;
        const val2 = player2.attributes?.[attr] || 0;
        
        // Update player 1 attribute
        document.getElementById(`player-1-${attr}`).textContent = val1;
        document.getElementById(`player-1-${attr}-bar`).style.width = `${val1}%`;
        
        // Update player 2 attribute
        document.getElementById(`player-2-${attr}`).textContent = val2;
        document.getElementById(`player-2-${attr}-bar`).style.width = `${val2}%`;
        
        // Update comparison row
        updateComparisonRow(attr, val1, val2, player1, player2);
    });
    
    // Update overall verdict
    updateComparisonVerdict(player1, player2);
}

/**
 * Update the Add to Squad buttons in comparison view
 */
function updateComparisonAddButtons(player1, player2) {
    const addBtn1 = document.getElementById('player-1-add-btn');
    const addBtn2 = document.getElementById('player-2-add-btn');
    
    // Player 1
    const isPlayer1InSquad = managerState.squad.some(p => p.id === player1.id);
    const canAffordPlayer1 = player1.transferFee <= managerState.budget;
    
    if (isPlayer1InSquad) {
        addBtn1.innerHTML = '<i class="fas fa-check"></i><span>In Squad</span>';
        addBtn1.classList.remove('bg-slate-700/50', 'hover:bg-emerald-500/20', 'text-slate-300', 'hover:text-emerald-400');
        addBtn1.classList.add('bg-emerald-500/20', 'text-emerald-400');
        addBtn1.onclick = null;
    } else {
        addBtn1.innerHTML = '<i class="fas fa-plus"></i><span>Add to Squad</span>';
        addBtn1.classList.remove('bg-emerald-500/20', 'text-emerald-400');
        addBtn1.classList.add('bg-slate-700/50', 'hover:bg-emerald-500/20', 'text-slate-300', 'hover:text-emerald-400');
        addBtn1.onclick = () => addPlayerToSquadFromComparison(1);
        addBtn1.disabled = !canAffordPlayer1;
    }
    
    // Player 2
    const isPlayer2InSquad = managerState.squad.some(p => p.id === player2.id);
    const canAffordPlayer2 = player2.transferFee <= managerState.budget;
    
    if (isPlayer2InSquad) {
        addBtn2.innerHTML = '<i class="fas fa-check"></i><span>In Squad</span>';
        addBtn2.classList.remove('bg-slate-700/50', 'hover:bg-emerald-500/20', 'text-slate-300', 'hover:text-emerald-400');
        addBtn2.classList.add('bg-emerald-500/20', 'text-emerald-400');
        addBtn2.onclick = null;
    } else {
        addBtn2.innerHTML = '<i class="fas fa-plus"></i><span>Add to Squad</span>';
        addBtn2.classList.remove('bg-emerald-500/20', 'text-emerald-400');
        addBtn2.classList.add('bg-slate-700/50', 'hover:bg-emerald-500/20', 'text-slate-300', 'hover:text-emerald-400');
        addBtn2.onclick = () => addPlayerToSquadFromComparison(2);
        addBtn2.disabled = !canAffordPlayer2;
    }
}

/**
 * Add a player to squad from the comparison view
 */
function addPlayerToSquadFromComparison(playerNum) {
    const playerId = playerNum === 1 ? 
        parseInt(document.getElementById('compare-player-1').value) :
        parseInt(document.getElementById('compare-player-2').value);
    
    if (playerId) {
        addToSquad(playerId);
        updateComparisonAddButtons(
            playerDatabase.find(p => p.id === parseInt(document.getElementById('compare-player-1').value)),
            playerDatabase.find(p => p.id === parseInt(document.getElementById('compare-player-2').value))
        );
    }
}

/**
 * Update a single comparison row with winner highlighting
 */
function updateComparisonRow(attr, value1, value2, player1, player2) {
    const winnerElement = document.getElementById(`${attr}-winner`);
    const bar1Element = document.getElementById(`compare-${attr}-bar-1`);
    const bar2Element = document.getElementById(`compare-${attr}-bar-2`);
    const value1Element = document.getElementById(`compare-${attr}-1`);
    const value2Element = document.getElementById(`compare-${attr}-2`);
    
    // Set values
    value1Element.textContent = value1;
    value2Element.textContent = value2;
    
    // Calculate bar widths (relative to each other)
    const maxValue = Math.max(value1, value2);
    const bar1Width = maxValue > 0 ? (value1 / maxValue * 50) : 0;
    const bar2Width = maxValue > 0 ? (value2 / maxValue * 50) : 0;
    
    bar1Element.style.width = `${bar1Width}%`;
    bar2Element.style.width = `${bar2Width}%`;
    
    // Determine winner
    if (value1 > value2) {
        winnerElement.textContent = `${player1.name} wins`;
        winnerElement.classList.remove('hidden');
        bar1Element.classList.remove('bg-emerald-500');
        bar1Element.classList.add('bg-emerald-400');
        bar2Element.classList.remove('bg-blue-500');
        bar2Element.classList.add('bg-blue-400');
    } else if (value2 > value1) {
        winnerElement.textContent = `${player2.name} wins`;
        winnerElement.classList.remove('hidden');
        bar1Element.classList.remove('bg-emerald-400');
        bar1Element.classList.add('bg-emerald-500');
        bar2Element.classList.remove('bg-blue-400');
        bar2Element.classList.add('bg-blue-500');
    } else {
        winnerElement.textContent = 'Tie';
        winnerElement.classList.remove('hidden');
        bar1Element.classList.remove('bg-emerald-400');
        bar1Element.classList.add('bg-emerald-500');
        bar2Element.classList.remove('bg-blue-400');
        bar2Element.classList.add('bg-blue-500');
    }
}

/**
 * Update the overall comparison verdict
 */
function updateComparisonVerdict(player1, player2) {
    const attributes = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physicality'];
    
    let player1Wins = 0;
    let player2Wins = 0;
    let ties = 0;
    let totalStats1 = 0;
    let totalStats2 = 0;
    
    attributes.forEach(attr => {
        const val1 = player1.attributes?.[attr] || 0;
        const val2 = player2.attributes?.[attr] || 0;
        
        totalStats1 += val1;
        totalStats2 += val2;
        
        if (val1 > val2) player1Wins++;
        else if (val2 > val1) player2Wins++;
        else ties++;
    });
    
    // Update total stats
    document.getElementById('total-stats-1').textContent = totalStats1;
    document.getElementById('total-stats-2').textContent = totalStats2;
    
    if (totalStats1 > totalStats2) {
        document.getElementById('total-stats-winner').textContent = `${player1.name} has higher total stats`;
    } else if (totalStats2 > totalStats1) {
        document.getElementById('total-stats-winner').textContent = `${player2.name} has higher total stats`;
    } else {
        document.getElementById('total-stats-winner').textContent = 'Equal total stats';
    }
    
    // Calculate value for money (stats per million)
    const value1 = totalStats1 / player1.marketValue;
    const value2 = totalStats2 / player2.marketValue;
    
    document.getElementById('value-1').textContent = value1.toFixed(1);
    document.getElementById('value-2').textContent = value2.toFixed(1);
    
    if (value1 > value2) {
        document.getElementById('value-winner').textContent = `${player1.name} is better value`;
    } else if (value2 > value1) {
        document.getElementById('value-winner').textContent = `${player2.name} is better value`;
    } else {
        document.getElementById('value-winner').textContent = 'Equal value for money';
    }
    
    // Final verdict
    if (player1Wins > player2Wins) {
        document.getElementById('final-verdict').textContent = `${player1.name} Wins`;
        document.getElementById('verdict-description').textContent = `${player1Wins} - ${player2Wins} (${ties} ties)`;
    } else if (player2Wins > player1Wins) {
        document.getElementById('final-verdict').textContent = `${player2.name} Wins`;
        document.getElementById('verdict-description').textContent = `${player2Wins} - ${player1Wins} (${ties} ties)`;
    } else {
        document.getElementById('final-verdict').textContent = 'It\'s a Tie!';
        document.getElementById('verdict-description').textContent = `Equal match: ${player1Wins} - ${player2Wins} (${ties} ties)`;
    }
}

// ============================================
// DASHBOARD FUNCTIONS
// ============================================

/**
 * Calculate and update all dashboard statistics
 */
function updateDashboardStats() {
    const budgetDisplay = `€${managerState.budget.toFixed(1)}M`;
    document.getElementById('stat-budget').textContent = budgetDisplay;

    const squadValue = managerState.squad.reduce((total, player) => {
        return total + (player.marketValue || 0);
    }, 0);
    document.getElementById('stat-squad-val').textContent = `€${squadValue.toFixed(1)}M`;

    const watchlistCount = managerState.watchlist.length;
    document.getElementById('stat-watchlist-count').textContent = watchlistCount;

    const budgetSpent = managerState.squad.reduce((total, player) => {
        return total + (player.transferFee || player.marketValue || 0);
    }, 0);
    const originalBudget = 500.0;
    const budgetUsedPercent = (budgetSpent / originalBudget * 100).toFixed(1);
    document.getElementById('stat-budget-percent').textContent = `${budgetUsedPercent}%`;
    
    const budgetBar = document.getElementById('budget-bar');
    budgetBar.style.width = `${budgetUsedPercent}%`;

    updateWatchlistDisplay();
    updateSquadDisplay();
}

/**
 * Update the watchlist container
 */
function updateWatchlistDisplay() {
    const watchlistContainer = document.getElementById('watchlist-container');
    
    if (managerState.watchlist.length === 0) {
        watchlistContainer.innerHTML = '<p class="text-slate-500 text-center py-8">No players in watchlist yet. Start scouting!</p>';
        return;
    }

    let html = '';
    managerState.watchlist.forEach((player, index) => {
        html += `
            <div class="bg-slate-700/50 rounded-lg p-4 mb-3 border border-slate-600/50">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span class="text-emerald-500 text-lg">★</span>
                        <div>
                            <p class="font-medium text-white">${player.name || 'Unknown Player'}</p>
                            <p class="text-xs text-slate-400">${player.position || 'N/A'} • ${player.club || 'Free Agent'}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-medium text-emerald-400">€${(player.marketValue || 0).toFixed(1)}M</p>
                        <button onclick="removeFromWatchlist(${index})" class="text-slate-400 hover:text-red-400 text-xs mt-1">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    watchlistContainer.innerHTML = html;
}

/**
 * Update the squad container
 */
function updateSquadDisplay() {
    const squadContainer = document.getElementById('squad-container');
    
    if (managerState.squad.length === 0) {
        squadContainer.innerHTML = '<p class="text-slate-500 text-center py-8">No players in your squad yet. Start building!</p>';
        return;
    }

    let html = '';
    managerState.squad.forEach((player, index) => {
        html += `
            <div class="bg-slate-700/50 rounded-lg p-4 mb-3 border border-slate-600/50">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span class="text-emerald-500 text-lg">⚽</span>
                        <div>
                            <p class="font-medium text-white">${player.name || 'Unknown Player'}</p>
                            <p class="text-xs text-slate-400">${player.position || 'N/A'} • ${player.club || 'Free Agent'}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-medium text-emerald-400">€${(player.marketValue || 0).toFixed(1)}M</p>
                        <button onclick="sellPlayerFromSquad(${index})" class="text-slate-400 hover:text-emerald-400 text-xs mt-1">Sell / Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    squadContainer.innerHTML = html;
}

/**
 * Remove a player from the watchlist
 */
function removeFromWatchlist(index) {
    managerState.watchlist.splice(index, 1);
    saveUserProgress();
    updateDashboardStats();
    renderPlayerDirectory();
}

/**
 * Sell a player from the squad
 */
function sellPlayerFromSquad(index) {
    const player = managerState.squad[index];
    if (!player) return;
    
    if (!confirm(`Are you sure you want to sell ${player.name} for €${player.marketValue.toFixed(1)}M?`)) {
        return;
    }
    
    managerState.budget += player.marketValue;
    managerState.squad.splice(index, 1);
    
    saveUserProgress();
    updateDashboardStats();
    renderPlayerDirectory();
    
    alert(`✅ ${player.name} sold for €${player.marketValue.toFixed(1)}M! Budget updated.`);
}

/**
 * Export the current squad as CSV
 */
function exportSquadCSV() {
    if (managerState.squad.length === 0) {
        alert('Your squad is empty! Add players to export.');
        return;
    }

    let csv = 'Position,Name,Club,Market Value (M),Transfer Fee (M),Rating\n';

    managerState.squad.forEach(player => {
        const row = [
            `"${player.position || 'N/A'}"`,
            `"${player.name || 'Unknown'}"`,
            `"${player.club || 'Free Agent'}"`,
            `"€${(player.marketValue || 0).toFixed(1)}M"`,
            `"€${(player.transferFee || 0).toFixed(1)}M"`,
            `"${player.rating || 'N/A'}"`
        ].join(',');
        csv += row + '\n';
    });

    const squadValue = managerState.squad.reduce((total, player) => {
        return total + (player.marketValue || 0);
    }, 0);
    const totalSpent = managerState.squad.reduce((total, player) => {
        return total + (player.transferFee || player.marketValue || 0);
    }, 0);
    
    csv += `\n"Total Squad Value","€${squadValue.toFixed(1)}M"\n`;
    csv += `"Total Spent","€${totalSpent.toFixed(1)}M"\n`;
    csv += `"Remaining Budget","€${managerState.budget.toFixed(1)}M"\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tactichub-squad-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Check for current user in sessionStorage
    const username = sessionStorage.getItem('tactichub_username');
    
    if (username) {
        try {
            // Load user data from the server
            const userData = await loadUserData(username);
            
            if (userData) {
                signInUser(userData);
            } else {
                // User not found, clear session
                sessionStorage.removeItem('tactichub_username');
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            sessionStorage.removeItem('tactichub_username');
        }
    }
    
    updateAuthUI();
    
    if (currentUser) {
        switchView('dashboard');
    } else {
        switchView('auth-view');
        switchAuthTab('signin');
    }
    
    updateDashboardStats();
    
    console.log('TACTICHUB initialized successfully!');
    console.log('Current User:', currentUser);
    console.log('Global State:', managerState);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        managerState, 
        currentUser,
        playerDatabase,
        currentPlayerProfile,
        switchView,
        switchAuthTab,
        handleSignIn,
        handleSignUp,
        demoLogin,
        signInUser,
        signOut,
        saveUserProgress,
        loadUserData,
        exportSquadCSV,
        filterPlayers,
        toggleWatchlist,
        addToSquad,
        viewPlayerProfile,
        displayPlayerProfile,
        saveScoutingNote,
        loadScoutingNotes,
        editScoutingNote,
        deleteScoutingNote,
        clearNoteInput
    };
}

/**
 * TACTICHUB - Ultimate Football Squad & Tactics Hub
 * Phase 1, 2, 3 & 4: Full Authentication with Saved Manager Profiles
 * Global State and Core Functions
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

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Switch between Sign In and Sign Up tabs
 * @param {string} tab - 'signin' or 'signup'
 */
function switchAuthTab(tab) {
    // Update tab buttons
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
    
    // Show/hide forms
    document.getElementById('signin-form').classList.add('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    
    if (tab === 'signin') {
        document.getElementById('signin-form').classList.remove('hidden');
    } else {
        document.getElementById('signup-form').classList.remove('hidden');
    }
    
    // Clear feedback
    showAuthFeedback('', 'hidden');
}

/**
 * Show authentication feedback message
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', or 'info'
 */
function showAuthFeedback(message, type = 'info') {
    const feedbackEl = document.getElementById('auth-feedback');
    
    if (message === '' || type === 'hidden') {
        feedbackEl.classList.add('hidden');
        return;
    }
    
    // Set message and styling based on type
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
 * @param {Event} event - The form submit event
 */
function handleSignIn(event) {
    event.preventDefault();
    
    const username = document.getElementById('signin-username').value.trim();
    const password = document.getElementById('signin-password').value;
    
    if (!username || !password) {
        showAuthFeedback('Please enter both username and password', 'error');
        return;
    }
    
    // Get users from localStorage
    const users = getUsersFromStorage();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Successful login
        signInUser(user);
        showAuthFeedback('Signing in...', 'success');
        
        // Switch to dashboard after a brief delay
        setTimeout(() => {
            switchView('dashboard');
            showAuthFeedback('', 'hidden');
        }, 500);
    } else {
        showAuthFeedback('Invalid username or password', 'error');
    }
}

/**
 * Handle Sign Up form submission
 * @param {Event} event - The form submit event
 */
function handleSignUp(event) {
    event.preventDefault();
    
    const managerName = document.getElementById('signup-manager').value.trim();
    const clubName = document.getElementById('signup-club').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;
    
    // Validation
    if (!managerName || !clubName || !username || !password) {
        showAuthFeedback('All fields are required', 'error');
        return;
    }
    
    if (password.length < 4) {
        showAuthFeedback('Password must be at least 4 characters', 'error');
        return;
    }
    
    // Check if username already exists
    const users = getUsersFromStorage();
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
        showAuthFeedback('Username already taken', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        username: username,
        password: password,
        managerName: managerName,
        clubName: clubName,
        savedState: {
            budget: 500.0,
            squad: [],
            watchlist: []
        }
    };
    
    // Add to users array and save
    users.push(newUser);
    saveUsersToStorage(users);
    
    // Auto sign in the new user
    signInUser(newUser);
    
    showAuthFeedback('Account created! Signing in...', 'success');
    
    // Switch to dashboard after a brief delay
    setTimeout(() => {
        switchView('dashboard');
        showAuthFeedback('', 'hidden');
    }, 500);
}

/**
 * Demo login - logs into a pre-made guest profile
 */
function demoLogin() {
    const demoUser = {
        username: 'demo',
        password: 'demo123',
        managerName: 'Demo Manager',
        clubName: 'Demo FC',
        savedState: {
            budget: 500.0,
            squad: [],
            watchlist: []
        }
    };
    
    // Check if demo user exists, if not create it
    const users = getUsersFromStorage();
    const existingDemo = users.find(u => u.username === 'demo');
    
    if (!existingDemo) {
        users.push(demoUser);
        saveUsersToStorage(users);
    }
    
    signInUser(demoUser);
    showAuthFeedback('Logging in as Demo Manager...', 'success');
    
    setTimeout(() => {
        switchView('dashboard');
        showAuthFeedback('', 'hidden');
    }, 500);
}

/**
 * Sign in a user and load their saved state
 * @param {Object} user - The user object
 */
function signInUser(user) {
    // Save current user to localStorage
    localStorage.setItem('tactichub_currentUser', JSON.stringify({
        username: user.username,
        managerName: user.managerName,
        clubName: user.clubName
    }));
    
    // Load user's saved state
    currentUser = {
        username: user.username,
        managerName: user.managerName,
        clubName: user.clubName
    };
    
    managerState = {
        budget: user.savedState.budget,
        squad: user.savedState.squad,
        watchlist: user.savedState.watchlist
    };
    
    // Update UI
    updateAuthUI();
    updateDashboardStats();
}

/**
 * Sign out the current user
 */
function signOut() {
    // Save current progress before signing out
    saveUserProgress();
    
    // Clear current user
    localStorage.removeItem('tactichub_currentUser');
    currentUser = null;
    
    // Reset manager state
    managerState = {
        budget: 500.0,
        squad: [],
        watchlist: []
    };
    
    // Reset current player profile
    currentPlayerProfile = null;
    
    // Update UI
    updateAuthUI();
    
    // Switch to auth view
    switchView('auth-view');
    
    // Reset forms
    document.getElementById('signin-form').reset();
    document.getElementById('signup-form').reset();
    switchAuthTab('signin');
}

/**
 * Update UI based on authentication state
 */
function updateAuthUI() {
    const mainNav = document.getElementById('main-nav');
    const profileSection = document.getElementById('profile-section');
    const profileBadge = document.getElementById('profile-badge');
    const signoutBtn = document.getElementById('signout-btn');
    
    if (currentUser) {
        // Show navigation and profile
        mainNav.classList.remove('hidden');
        profileSection.classList.remove('hidden');
        profileBadge.classList.remove('hidden');
        signoutBtn.classList.remove('hidden');
        
        // Update profile info
        document.getElementById('manager-name').textContent = currentUser.managerName;
        document.getElementById('club-name').textContent = currentUser.clubName;
        
        // Update greeting based on time of day
        const hour = new Date().getHours();
        let greeting = 'Good evening';
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        
        document.getElementById('greeting').textContent = `${greeting}, ${currentUser.managerName}.`;
        document.getElementById('dashboard-subtitle').textContent = `Welcome back to ${currentUser.clubName}!`;
    } else {
        // Hide navigation and profile
        mainNav.classList.add('hidden');
        profileSection.classList.add('hidden');
        profileBadge.classList.add('hidden');
        signoutBtn.classList.add('hidden');
        
        // Reset greeting
        document.getElementById('greeting').textContent = '';
        document.getElementById('dashboard-subtitle').textContent = 'Overview of your squad management and scouting activities';
    }
}

/**
 * Get users from localStorage
 * @returns {Array} Array of user objects
 */
function getUsersFromStorage() {
    const users = localStorage.getItem('tactichub_users');
    return users ? JSON.parse(users) : [];
}

/**
 * Save users to localStorage
 * @param {Array} users - Array of user objects
 */
function saveUsersToStorage(users) {
    localStorage.setItem('tactichub_users', JSON.stringify(users));
}

/**
 * Save current user's progress to localStorage
 */
function saveUserProgress() {
    if (!currentUser) return;
    
    const users = getUsersFromStorage();
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex >= 0) {
        users[userIndex].savedState = {
            budget: managerState.budget,
            squad: managerState.squad,
            watchlist: managerState.watchlist
        };
        saveUsersToStorage(users);
    }
}

// ============================================
// VIEW SWITCHING FUNCTIONS
// ============================================

/**
 * Switch between different views in the application
 * @param {string} viewName - The view to display
 */
function switchView(viewName) {
    // Check if user is authenticated (except for auth-view)
    if (viewName !== 'auth-view' && !currentUser) {
        switchView('auth-view');
        return;
    }
    
    // Hide all view sections
    const viewSections = document.querySelectorAll('.view-section');
    viewSections.forEach(section => {
        section.classList.add('hidden');
    });

    // Show the requested view
    const targetView = document.getElementById(viewName);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // Update active state on navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('bg-emerald-600', 'text-white');
        btn.classList.add('bg-slate-700', 'text-slate-200');
    });

    // Highlight the active button
    const activeButton = Array.from(navButtons).find(btn => 
        btn.getAttribute('onclick')?.includes(`'${viewName}'`)
    );
    if (activeButton) {
        activeButton.classList.remove('bg-slate-700', 'text-slate-200');
        activeButton.classList.add('bg-emerald-600', 'text-white');
    }

    // Refresh dashboard stats when switching to dashboard
    if (viewName === 'dashboard') {
        updateDashboardStats();
    }
    
    // Initialize player directory when switching to it
    if (viewName === 'player-directory') {
        renderPlayerDirectory();
    }
    
    // Clear current player profile when leaving profile view
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
    
    // Filter players
    const filteredPlayers = filterPlayersData(searchQuery, positionFilter);
    
    // Update player count
    document.getElementById('player-count').textContent = filteredPlayers.length;
    
    // Clear grid
    playerGrid.innerHTML = '';
    
    // Render each player card
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
    
    // Filter and render
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
 * @param {number} playerId - The ID of the player to toggle
 */
function toggleWatchlist(playerId) {
    const player = playerDatabase.find(p => p.id === playerId);
    if (!player) return;
    
    const indexInWatchlist = managerState.watchlist.findIndex(p => p.id === playerId);
    
    if (indexInWatchlist >= 0) {
        // Remove from watchlist
        managerState.watchlist.splice(indexInWatchlist, 1);
    } else {
        // Add to watchlist
        managerState.watchlist.push({ ...player });
    }
    
    // Save progress
    saveUserProgress();
    
    // Update UI
    updateDashboardStats();
    renderPlayerDirectory();
}

/**
 * Add a player to the squad
 * @param {number} playerId - The ID of the player to add
 */
function addToSquad(playerId) {
    const player = playerDatabase.find(p => p.id === playerId);
    if (!player) return;
    
    // Check if already in squad
    const isInSquad = managerState.squad.some(p => p.id === playerId);
    if (isInSquad) {
        alert('This player is already in your squad!');
        return;
    }
    
    // Check if affordable
    if (player.transferFee > managerState.budget) {
        alert(`Not enough budget! You need €${player.transferFee.toFixed(1)}M but only have €${managerState.budget.toFixed(1)}M remaining.`);
        return;
    }
    
    // Add to squad and deduct budget
    managerState.squad.push({ ...player });
    managerState.budget -= player.transferFee;
    
    // Save progress
    saveUserProgress();
    
    // Update UI
    updateDashboardStats();
    renderPlayerDirectory();
    
    // Show success message
    alert(`✅ ${player.name} added to squad for €${player.transferFee.toFixed(1)}M!`);
}

/**
 * View a player's profile (navigate to player profile view)
 * @param {number} playerId - The ID of the player to view
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
 * @param {number} playerId - The ID of the player to display
 */
function displayPlayerProfile(playerId) {
    const player = playerDatabase.find(p => p.id === playerId);
    if (!player) return;
    
    currentPlayerProfile = player;
    
    // Update profile header
    document.getElementById('profile-name').textContent = player.name;
    document.getElementById('profile-club').textContent = player.club;
    document.getElementById('profile-value').textContent = `€${player.marketValue.toFixed(1)}M`;
    document.getElementById('profile-rating').textContent = player.rating;
    document.getElementById('profile-nationality').textContent = player.nationality;
    document.getElementById('profile-age').textContent = player.age;
    
    // Update position badge
    const positionBadge = document.getElementById('profile-position-badge');
    positionBadge.innerHTML = `
        <span class="${positionColors[player.position]} text-xs font-bold px-3 py-1 rounded-full uppercase">
            <i class="fas ${positionIcons[player.position]} mr-1"></i> ${player.position}
        </span>
    `;
    
    // Update skill attributes
    if (player.attributes) {
        updateAttributeBar('pace', player.attributes.pace);
        updateAttributeBar('shooting', player.attributes.shooting);
        updateAttributeBar('passing', player.attributes.passing);
        updateAttributeBar('dribbling', player.attributes.dribbling);
        updateAttributeBar('defending', player.attributes.defending);
        updateAttributeBar('physicality', player.attributes.physicality);
    }
    
    // Load and display scouting notes for this player
    loadScoutingNotes(playerId);
    
    // Clear the note input
    document.getElementById('scouting-note-input').value = '';
}

/**
 * Update a single attribute bar display
 * @param {string} attrName - The attribute name (pace, shooting, etc.)
 * @param {number} value - The attribute value (0-100)
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
 * Save a scouting note to localStorage
 */
function saveScoutingNote() {
    if (!currentPlayerProfile) {
        alert('No player selected! Please select a player first.');
        return;
    }
    
    const noteInput = document.getElementById('scouting-note-input');
    const noteText = noteInput.value.trim();
    
    if (!noteText) {
        alert('Please enter a note before saving.');
        return;
    }
    
    // Get existing notes from localStorage
    const storageKey = `scoutingNotes_${currentPlayerProfile.id}_${currentUser?.username || 'guest'}`;
    let notes = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Create new note object
    const newNote = {
        id: Date.now(),
        playerId: currentPlayerProfile.id,
        content: noteText,
        timestamp: new Date().toISOString(),
        playerName: currentPlayerProfile.name
    };
    
    // Add to notes array
    notes.push(newNote);
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(notes));
    
    // Clear input and refresh display
    noteInput.value = '';
    loadScoutingNotes(currentPlayerProfile.id);
    
    alert('✅ Scouting note saved successfully!');
}

/**
 * Load scouting notes from localStorage and display them
 * @param {number} playerId - The player ID to load notes for
 */
function loadScoutingNotes(playerId) {
    if (!currentUser) return;
    
    const storageKey = `scoutingNotes_${playerId}_${currentUser.username}`;
    const notes = JSON.parse(localStorage.getItem(storageKey)) || [];
    
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
                        onclick="editScoutingNote(${note.id}, ${note.playerId})"
                        class="text-slate-400 hover:text-emerald-400 text-xs transition-colors"
                    >
                        <i class="fas fa-edit mr-1"></i> Edit
                    </button>
                    <button 
                        onclick="deleteScoutingNote(${note.id}, ${note.playerId})"
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
 * @param {number} noteId - The note ID to edit
 * @param {number} playerId - The player ID the note belongs to
 */
function editScoutingNote(noteId, playerId) {
    if (!currentUser) return;
    
    const storageKey = `scoutingNotes_${playerId}_${currentUser.username}`;
    const notes = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    const noteToEdit = notes.find(n => n.id === noteId);
    if (!noteToEdit) return;
    
    // Prompt user for new content
    const newContent = prompt('Edit your scouting note:', noteToEdit.content);
    if (newContent === null) return; // User cancelled
    
    if (newContent.trim() === '') {
        alert('Note cannot be empty!');
        return;
    }
    
    // Update the note
    noteToEdit.content = newContent.trim();
    noteToEdit.timestamp = new Date().toISOString();
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(notes));
    
    // Refresh display
    loadScoutingNotes(playerId);
    
    alert('✅ Scouting note updated successfully!');
}

/**
 * Delete a scouting note
 * @param {number} noteId - The note ID to delete
 * @param {number} playerId - The player ID the note belongs to
 */
function deleteScoutingNote(noteId, playerId) {
    if (!currentUser) return;
    
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }
    
    const storageKey = `scoutingNotes_${playerId}_${currentUser.username}`;
    let notes = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Filter out the note to delete
    notes = notes.filter(n => n.id !== noteId);
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(notes));
    
    // Refresh display
    loadScoutingNotes(playerId);
    
    alert('✅ Scouting note deleted successfully!');
}

/**
 * Clear the note input field
 */
function clearNoteInput() {
    document.getElementById('scouting-note-input').value = '';
}

// ============================================
// DASHBOARD FUNCTIONS
// ============================================

/**
 * Calculate and update all dashboard statistics
 */
function updateDashboardStats() {
    // Calculate remaining budget display
    const budgetDisplay = `€${managerState.budget.toFixed(1)}M`;
    document.getElementById('stat-budget').textContent = budgetDisplay;

    // Calculate squad value (sum of all squad players' market values)
    const squadValue = managerState.squad.reduce((total, player) => {
        return total + (player.marketValue || 0);
    }, 0);
    document.getElementById('stat-squad-val').textContent = `€${squadValue.toFixed(1)}M`;

    // Update watchlist count
    const watchlistCount = managerState.watchlist.length;
    document.getElementById('stat-watchlist-count').textContent = watchlistCount;

    // Calculate budget used percentage
    const budgetSpent = managerState.squad.reduce((total, player) => {
        return total + (player.transferFee || player.marketValue || 0);
    }, 0);
    const originalBudget = 500.0;
    const budgetUsedPercent = (budgetSpent / originalBudget * 100).toFixed(1);
    document.getElementById('stat-budget-percent').textContent = `${budgetUsedPercent}%`;
    
    // Update budget bar width
    const budgetBar = document.getElementById('budget-bar');
    budgetBar.style.width = `${budgetUsedPercent}%`;

    // Update watchlist display
    updateWatchlistDisplay();
}

/**
 * Update the watchlist container with current watchlist players
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
 * Remove a player from the watchlist
 * @param {number} index - Index of the player in the watchlist array
 */
function removeFromWatchlist(index) {
    managerState.watchlist.splice(index, 1);
    
    // Save progress
    saveUserProgress();
    
    updateDashboardStats();
    renderPlayerDirectory();
}

/**
 * Export the current squad lineup as a CSV file
 */
function exportSquadCSV() {
    if (managerState.squad.length === 0) {
        alert('Your squad is empty! Add players to export.');
        return;
    }

    // Create CSV header
    let csv = 'Position,Name,Club,Market Value (M),Transfer Fee (M),Rating\n';

    // Add each player as a row
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

    // Add summary row
    const squadValue = managerState.squad.reduce((total, player) => {
        return total + (player.marketValue || 0);
    }, 0);
    const totalSpent = managerState.squad.reduce((total, player) => {
        return total + (player.transferFee || player.marketValue || 0);
    }, 0);
    
    csv += `\n"Total Squad Value","€${squadValue.toFixed(1)}M"\n`;
    csv += `"Total Spent","€${totalSpent.toFixed(1)}M"\n`;
    csv += `"Remaining Budget","€${managerState.budget.toFixed(1)}M"\n`;

    // Create and download the CSV file
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
document.addEventListener('DOMContentLoaded', function() {
    // Check for current user in localStorage
    const savedUser = localStorage.getItem('tactichub_currentUser');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        // Load user's saved state
        const users = getUsersFromStorage();
        const user = users.find(u => u.username === currentUser.username);
        
        if (user) {
            managerState = {
                budget: user.savedState.budget,
                squad: user.savedState.squad,
                watchlist: user.savedState.watchlist
            };
        }
    }
    
    // Update UI based on authentication state
    updateAuthUI();
    
    // If user is authenticated, show dashboard; otherwise show auth view
    if (currentUser) {
        switchView('dashboard');
    } else {
        switchView('auth-view');
        switchAuthTab('signin');
    }
    
    // Initialize dashboard stats
    updateDashboardStats();
    
    console.log('TACTICHUB initialized successfully!');
    console.log('Current User:', currentUser);
    console.log('Global State:', managerState);
    console.log('Player Database:', playerDatabase);
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
        clearNoteInput,
        getUsersFromStorage,
        saveUsersToStorage
    };
}

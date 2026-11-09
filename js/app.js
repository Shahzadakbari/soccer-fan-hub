/**
 * TACTICHUB - Ultimate Football Squad & Tactics Hub
 * Phase 1 & 2: Manager Dashboard, Top Navigation Header, Player Directory
 * Global State and Core Functions
 */

// Global State Object
let managerState = {
    budget: 500.0,           // Remaining transfer budget in millions
    squad: [],              // Array of players in the squad
    watchlist: []           // Array of starred players for scouting
};

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
        age: 25
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
        age: 24
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
        age: 24
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
        age: 31
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
        age: 21
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
        age: 33
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
        age: 28
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
        age: 22
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
        age: 33
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
        age: 27
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
        age: 31
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
        age: 25
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
        age: 32
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
        age: 32
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
        age: 32
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
        age: 29
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

/**
 * Switch between different views in the application
 * @param {string} viewName - The view to display
 */
function switchView(viewName) {
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
}

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
        // Store the current player in state for the profile view
        window.currentPlayerProfile = player;
        switchView('player-profile');
    }
}

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
        const originalPlayer = playerDatabase.find(p => p.id === player.id);
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set initial active view
    switchView('dashboard');
    
    // Initialize dashboard stats
    updateDashboardStats();
    
    console.log('TACTICHUB initialized successfully!');
    console.log('Global State:', managerState);
    console.log('Player Database:', playerDatabase);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        managerState, 
        playerDatabase,
        switchView, 
        exportSquadCSV,
        filterPlayers,
        toggleWatchlist,
        addToSquad,
        viewPlayerProfile
    };
}

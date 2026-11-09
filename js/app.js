/**
 * TACTICHUB - Ultimate Football Squad & Tactics Hub
 * Phase 1: Manager Dashboard & Top Navigation Header
 * Global State and Core Functions
 */

// Global State Object
let managerState = {
    budget: 500.0,           // Remaining transfer budget in millions
    squad: [],              // Array of players in the squad
    watchlist: []           // Array of starred players for scouting
};

/**
 * Switch between different views in the application
 * @param {string} viewName - The view to display (dashboard, player-directory, player-profile, compare-players, squad-builder)
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
    const budgetUsedPercent = (budgetSpent / managerState.budget * 100).toFixed(1);
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
    updateDashboardStats();
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
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { managerState, switchView, exportSquadCSV };
}

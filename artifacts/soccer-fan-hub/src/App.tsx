import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  BadgeEuro,
  CircleCheck,
  CircleDot,
  ClipboardList,
  LayoutDashboard,
  Search,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
  UserPlus,
  X,
} from 'lucide-react';

type Player = {
  id: number;
  name: string;
  position: string;
  club: string;
  marketValue: number;
  transferFee: number;
  rating: number;
  nationality: string;
  age: number;
};

type ManagerState = {
  budget: number;
  squad: Player[];
  watchlist: Player[];
};

type ViewKey = 'dashboard' | 'directory' | 'profile' | 'compare' | 'builder';

const managerState: ManagerState = {
  budget: 500.0,
  squad: [],
  watchlist: [],
};

const navItems: { key: ViewKey; label: string; icon: typeof LayoutDashboard; phaseTwo?: boolean }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'directory', label: 'Player Directory', icon: UsersRound },
  { key: 'profile', label: 'Player Profile', icon: UserRound, phaseTwo: true },
  { key: 'compare', label: 'Compare Players', icon: ArrowLeftRight, phaseTwo: true },
  { key: 'builder', label: 'Squad Builder', icon: ClipboardList, phaseTwo: true },
];

const players: Player[] = [
  { id: 1, name: 'Kylian Mbappé', position: 'Forward', club: 'PSG', marketValue: 180, transferFee: 180, rating: 91, nationality: 'France', age: 25 },
  { id: 2, name: 'Erling Haaland', position: 'Forward', club: 'Manchester City', marketValue: 175, transferFee: 175, rating: 91, nationality: 'Norway', age: 24 },
  { id: 3, name: 'Vinícius Júnior', position: 'Forward', club: 'Real Madrid', marketValue: 120, transferFee: 120, rating: 89, nationality: 'Brazil', age: 24 },
  { id: 4, name: 'Harry Kane', position: 'Forward', club: 'Bayern Munich', marketValue: 100, transferFee: 100, rating: 90, nationality: 'England', age: 31 },
  { id: 5, name: 'Jude Bellingham', position: 'Midfielder', club: 'Real Madrid', marketValue: 180, transferFee: 180, rating: 90, nationality: 'England', age: 21 },
  { id: 6, name: 'Kevin De Bruyne', position: 'Midfielder', club: 'Manchester City', marketValue: 100, transferFee: 100, rating: 91, nationality: 'Belgium', age: 33 },
  { id: 7, name: 'Rodri', position: 'Midfielder', club: 'Manchester City', marketValue: 120, transferFee: 120, rating: 90, nationality: 'Spain', age: 28 },
  { id: 8, name: 'Pedri', position: 'Midfielder', club: 'Barcelona', marketValue: 150, transferFee: 150, rating: 89, nationality: 'Spain', age: 22 },
  { id: 9, name: 'Virgil van Dijk', position: 'Defender', club: 'Liverpool', marketValue: 80, transferFee: 80, rating: 89, nationality: 'Netherlands', age: 33 },
  { id: 10, name: 'Rúben Dias', position: 'Defender', club: 'Manchester City', marketValue: 90, transferFee: 90, rating: 89, nationality: 'Portugal', age: 27 },
  { id: 11, name: 'Antonio Rüdiger', position: 'Defender', club: 'Real Madrid', marketValue: 70, transferFee: 70, rating: 87, nationality: 'Germany', age: 31 },
  { id: 12, name: 'Achraf Hakimi', position: 'Defender', club: 'PSG', marketValue: 85, transferFee: 85, rating: 88, nationality: 'Morocco', age: 25 },
  { id: 13, name: 'Thibaut Courtois', position: 'Goalkeeper', club: 'Real Madrid', marketValue: 60, transferFee: 60, rating: 89, nationality: 'Belgium', age: 32 },
  { id: 14, name: 'Alisson Becker', position: 'Goalkeeper', club: 'Liverpool', marketValue: 65, transferFee: 65, rating: 89, nationality: 'Brazil', age: 32 },
  { id: 15, name: 'Marc-André ter Stegen', position: 'Goalkeeper', club: 'Barcelona', marketValue: 50, transferFee: 50, rating: 88, nationality: 'Germany', age: 32 },
  { id: 16, name: 'Mike Maignan', position: 'Goalkeeper', club: 'AC Milan', marketValue: 55, transferFee: 55, rating: 87, nationality: 'France', age: 29 },
];

const viewCopy: Record<Exclude<ViewKey, 'dashboard' | 'directory'>, { title: string; description: string; icon: typeof UsersRound }> = {
  profile: {
    title: 'Player Profile',
    description: 'The full scouting report, performance history, and valuation insights are planned for a later phase.',
    icon: UserRound,
  },
  compare: {
    title: 'Compare Players',
    description: 'Side-by-side player evaluation is planned for a later phase.',
    icon: ArrowLeftRight,
  },
  builder: {
    title: 'Squad Builder',
    description: 'Lineup selection and formation planning are planned for a later phase.',
    icon: ClipboardList,
  },
};

function euro(value: number) {
  return `€${value.toLocaleString('en', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
}

function monogram(name: string) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function Dashboard({
  state,
  onRemove,
  onExport,
  onOpenBuilder,
}: {
  state: ManagerState;
  onRemove: (name: string) => void;
  onExport: () => void;
  onOpenBuilder: () => void;
}) {
  const startingValue = state.squad.reduce((sum, player) => sum + player.marketValue, 0);
  const committed = state.squad.reduce((sum, player) => sum + player.transferFee, 0);
  const usedPercent = Math.min(100, Math.round((committed / (state.budget + committed)) * 100));
  const formattedDate = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());

  return (
    <section className="dashboard" aria-label="Manager dashboard">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Squad operations / overview</div>
          <h1 className="page-title">Good morning, Manager.</h1>
          <p className="page-subtitle">Your squad, budget, and next moves — all in one place.</p>
        </div>
        <div className="date-block">{formattedDate.toUpperCase()}</div>
      </div>

      <div className="overview-grid">
        <article className="metric-card" data-testid="metric-budget">
          <div className="metric-top">
            <span>Remaining transfer budget</span>
            <span className="metric-icon"><BadgeEuro size={16} /></span>
          </div>
          <div className="metric-value">{euro(state.budget)}</div>
          <div className="budget-row"><span>TRANSFER BUDGET USED</span><strong>{usedPercent}%</strong></div>
          <div className="progress-track" role="progressbar" aria-label="Transfer budget used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={usedPercent}>
            <div className="progress-fill" style={{ width: `${usedPercent}%` }} />
          </div>
        </article>
        <article className="metric-card" data-testid="metric-squad-value">
          <div className="metric-top">
            <span>Starting XI value</span>
            <span className="metric-icon"><Shield size={16} /></span>
          </div>
          <div className="metric-value">{euro(startingValue)}</div>
          <div className="metric-note">Based on current market valuations</div>
        </article>
        <article className="metric-card" data-testid="metric-watchlist-count">
          <div className="metric-top">
            <span>Scouting watchlist</span>
            <span className="metric-icon"><Star size={15} /></span>
          </div>
          <div className="metric-value">{String(state.watchlist.length).padStart(2, '0')}<small>players</small></div>
          <div className="metric-note">Targets saved for a closer look</div>
        </article>
      </div>

      <div className="content-grid">
        <section className="panel" aria-labelledby="watchlist-heading">
          <div className="panel-header">
            <div>
              <div className="panel-title-wrap">
                <h2 className="panel-title" id="watchlist-heading">Scouting watchlist</h2>
                <span className="panel-count">{state.watchlist.length}</span>
              </div>
              <div className="panel-kicker">Players on your radar</div>
            </div>
          </div>
          {state.watchlist.length > 0 ? (
            <>
              <div className="watchlist">
                {state.watchlist.map((player) => (
                  <div className="watch-row" key={player.name} data-testid={`row-watchlist-${player.name.toLowerCase().replaceAll(' ', '-')}`}>
                    <div className="player-monogram" aria-hidden="true">{monogram(player.name)}</div>
                    <div>
                      <div className="player-name">{player.name}</div>
                      <div className="player-meta">{player.position} <span aria-hidden="true">·</span> {player.club}</div>
                    </div>
                    <div className="watch-value">{euro(player.marketValue)}</div>
                    <button type="button" className="icon-action" onClick={() => onRemove(player.name)} aria-label={`Remove ${player.name} from watchlist`} title="Remove from watchlist" data-testid={`button-remove-${player.name.toLowerCase().replaceAll(' ', '-')}`}>
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="panel-footer">
                <span>Market values in EUR</span>
                <span>Updated for planning</span>
              </div>
            </>
          ) : (
            <div className="empty-state" data-testid="empty-watchlist">
              <div className="empty-symbol"><Star size={17} /></div>
              <div className="empty-title">Your watchlist is clear</div>
              <div className="empty-copy">Players you keep an eye on will be collected here.</div>
            </div>
          )}
        </section>

        <section className="panel action-panel" aria-labelledby="actions-heading">
          <div className="panel-header">
            <div>
              <h2 className="panel-title" id="actions-heading">Quick actions</h2>
              <div className="panel-kicker">Move the planning forward</div>
            </div>
            <SlidersHorizontal size={15} color="#718087" aria-hidden="true" />
          </div>
          <div className="action-body">
            <div className="action-card">
              <div className="action-card-main">
                <div className="action-visual"><ArrowDownToLine size={17} /></div>
                <div>
                  <strong>Take your squad with you</strong>
                  <p>Download a CSV snapshot of your current squad.</p>
                </div>
              </div>
              <button type="button" className="secondary-action" onClick={onExport} data-testid="button-export-squad">
                <ArrowDownToLine size={14} /> Export squad CSV
              </button>
            </div>
            <div className="action-card">
              <div className="action-card-main">
                <div className="action-visual"><UsersRound size={17} /></div>
                <div>
                  <strong>Shape the starting eleven</strong>
                  <p>Open your lineup workspace.</p>
                </div>
              </div>
              <button type="button" className="primary-action" onClick={onOpenBuilder} data-testid="button-open-lineup-builder">
                Open lineup builder <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="action-footer"><CircleDot size={12} /><span>Squad planning tools are ready for export</span></div>
        </section>
      </div>
    </section>
  );
}

function PlayerDirectory({
  state,
  onToggleWatchlist,
  onOpenProfile,
  onAddToSquad,
}: {
  state: ManagerState;
  onToggleWatchlist: (player: Player) => void;
  onOpenProfile: (player: Player) => void;
  onAddToSquad: (player: Player) => void;
}) {
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState('All');
  const filteredPlayers = players.filter((player) => {
    const text = `${player.name} ${player.club} ${player.position} ${player.nationality}`.toLocaleLowerCase();
    return text.includes(query.trim().toLocaleLowerCase()) && (position === 'All' || player.position === position);
  });

  return (
    <section className="directory-page" aria-label="Player directory">
      <div className="page-intro directory-intro">
        <div>
          <div className="eyebrow">Scouting / transfer market</div>
          <h1 className="page-title">Player Directory</h1>
          <p className="page-subtitle">Sixteen names worth knowing. Find your next move.</p>
        </div>
        <div className="directory-budget"><span>AVAILABLE BUDGET</span><strong>{euro(state.budget)}</strong></div>
      </div>
      <div className="directory-toolbar">
        <label className="search-field">
          <Search size={16} aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, club, position, nationality" aria-label="Search players" data-testid="input-player-search" />
        </label>
        <label className="position-field">
          <span>Position</span>
          <select value={position} onChange={(event) => setPosition(event.target.value)} aria-label="Filter by position" data-testid="select-position-filter">
            {['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <div className="results-count" aria-live="polite"><strong>{filteredPlayers.length}</strong> {filteredPlayers.length === 1 ? 'player' : 'players'} found</div>
      </div>
      {filteredPlayers.length ? (
        <div className="player-grid">
          {filteredPlayers.map((player) => {
            const watched = state.watchlist.some((item) => item.id === player.id);
            const recruited = state.squad.some((item) => item.id === player.id);
            const affordable = state.budget >= player.transferFee;
            return (
              <article className="directory-card" key={player.id} data-testid={`card-player-${player.id}`}>
                <div className="player-card-top">
                  <span className={`position-badge position-${player.position.toLowerCase()}`}>{player.position}</span>
                  <button type="button" className={`star-action${watched ? ' is-watched' : ''}`} onClick={() => onToggleWatchlist(player)} aria-label={`${watched ? 'Remove' : 'Add'} ${player.name} ${watched ? 'from' : 'to'} watchlist`} aria-pressed={watched} title={watched ? 'Remove from watchlist' : 'Add to watchlist'} data-testid={`button-watch-${player.id}`}>
                    <Star size={16} fill={watched ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="player-card-identity">
                  <div className="player-monogram directory-monogram" aria-hidden="true">{monogram(player.name)}</div>
                  <div className="player-identity-copy"><h2>{player.name}</h2><p>{player.club}</p></div>
                  <div className="rating-box"><strong>{player.rating}</strong><span>OVR</span></div>
                </div>
                <div className="player-card-facts">
                  <div><span>MARKET VALUE</span><strong>{euro(player.marketValue)}</strong></div>
                  <div><span>NATIONALITY</span><strong>{player.nationality}</strong></div>
                </div>
                <div className="player-card-actions">
                  <button type="button" className="profile-action" onClick={() => onOpenProfile(player)} data-testid={`button-profile-${player.id}`}>Scout Profile <ArrowRight size={13} /></button>
                  <button type="button" className={`squad-action${recruited ? ' is-added' : ''}`} disabled={recruited || !affordable} onClick={() => onAddToSquad(player)} data-testid={`button-add-squad-${player.id}`}>
                    {recruited ? <><CircleCheck size={14} /> In squad</> : !affordable ? 'Over budget' : <><UserPlus size={14} /> Add to Squad</>}
                  </button>
                </div>
                {!recruited && !affordable && <div className="unaffordable-note">Requires {euro(player.transferFee)}</div>}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="directory-empty" data-testid="empty-player-results">
          <div className="empty-symbol"><Search size={17} /></div>
          <h2>No players match those filters</h2>
          <p>Try another name, club, nationality, or position.</p>
          <button type="button" className="phase-back" onClick={() => { setQuery(''); setPosition('All'); }}>Clear filters</button>
        </div>
      )}
    </section>
  );
}

function PhaseTwo({ page, selectedPlayer, onBack }: { page: Exclude<ViewKey, 'dashboard' | 'directory'>; selectedPlayer: Player | null; onBack: () => void }) {
  const copy = viewCopy[page];
  const Icon = copy.icon;
  return (
    <section className="phase-screen" aria-label={`${copy.title} placeholder`}>
      <div className="phase-card">
        <div className="phase-icon"><Icon size={25} /></div>
        <div className="eyebrow">TACTICHUB / roadmap</div>
        <h1>{copy.title}</h1>
        {page === 'profile' && selectedPlayer && <div className="selected-player-chip"><span>{selectedPlayer.position}</span><strong>{selectedPlayer.name}</strong><span>{selectedPlayer.club}</span></div>}
        <p>{copy.description}</p>
        <div className="phase-stamp"><Sparkles size={12} /> NOT YET BUILT</div>
        <div>
          <button className="phase-back" type="button" onClick={onBack} data-testid="button-back-dashboard">
            <ArrowLeft size={14} /> {page === 'profile' ? 'Back to directory' : 'Back to dashboard'}
          </button>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [state, setState] = useState<ManagerState>(managerState);
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [toast, setToast] = useState('');
  const [toastError, setToastError] = useState(false);

  function notify(message: string, isError = false) {
    setToast(message);
    setToastError(isError);
    window.setTimeout(() => setToast(''), 2600);
  }

  function toggleWatchlist(player: Player) {
    const exists = state.watchlist.some((item) => item.id === player.id);
    setState((current) => ({
      ...current,
      watchlist: exists ? current.watchlist.filter((item) => item.id !== player.id) : [...current.watchlist, player],
    }));
    notify(exists ? `${player.name} removed from your watchlist` : `${player.name} added to your watchlist`);
  }

  function addToSquad(player: Player) {
    if (state.squad.some((item) => item.id === player.id)) {
      notify(`${player.name} is already in your squad`, true);
      return;
    }
    if (state.budget < player.transferFee) {
      notify(`Not enough budget to sign ${player.name}`, true);
      return;
    }
    setState((current) => ({
      ...current,
      budget: current.budget - player.transferFee,
      squad: [...current.squad, player],
    }));
    notify(`${player.name} added to your squad for ${euro(player.transferFee)}`);
  }

  function removeFromWatchlist(name: string) {
    setState((current) => ({
      ...current,
      watchlist: current.watchlist.filter((player) => player.name !== name),
    }));
    notify(`${name} removed from your watchlist`);
  }

  function exportSquad() {
    const headers = ['Name', 'Position', 'Club', 'Market Value (EUR M)', 'Transfer Fee (EUR M)', 'Rating'];
    const rows = state.squad.map((player) => [
      player.name,
      player.position,
      player.club,
      player.marketValue,
      player.transferFee,
      player.rating,
    ]);
    const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'tactichub-squad.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    notify(state.squad.length ? 'Squad CSV exported' : 'Empty squad CSV exported');
  }

  const activeLabel = navItems.find((item) => item.key === activeView)?.label ?? 'Dashboard';
  const activeIcon = navItems.find((item) => item.key === activeView)?.icon ?? LayoutDashboard;
  const BreadcrumbIcon = activeIcon;

  return (
    <div className="hub-shell">
      <aside className="hub-sidebar" aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark"><Shield size={20} strokeWidth={2.4} /></div>
          <div>
            <div className="brand-name">TACTICHUB</div>
            <div className="brand-caption">SQUAD MANAGEMENT</div>
          </div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Workspace">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.key}
                className="nav-item"
                aria-current={activeView === item.key ? 'page' : undefined}
                onClick={() => setActiveView(item.key)}
                data-testid={`nav-${item.key}`}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.phaseTwo && <small className="phase-tag">UPCOMING</small>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="season-label">CLUB WORKSPACE</div>
          <div className="season-value"><span className="online-dot" />Local squad data</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><BreadcrumbIcon size={14} /><strong>{activeLabel}</strong></div>
          <div className="topbar-right">
            <div className="live-pill"><span className="online-dot" /> PHASE TWO</div>
            <div className="user-chip"><span className="user-avatar">TM</span><span>Team Manager</span></div>
          </div>
        </header>

        {activeView === 'dashboard' ? (
          <Dashboard
            state={state}
            onRemove={removeFromWatchlist}
            onExport={exportSquad}
            onOpenBuilder={() => setActiveView('builder')}
          />
        ) : activeView === 'directory' ? (
          <PlayerDirectory state={state} onToggleWatchlist={toggleWatchlist} onOpenProfile={(player) => { setSelectedPlayer(player); setActiveView('profile'); }} onAddToSquad={addToSquad} />
        ) : (
          <PhaseTwo page={activeView} selectedPlayer={selectedPlayer} onBack={() => setActiveView(activeView === 'profile' && selectedPlayer ? 'directory' : 'dashboard')} />
        )}
      </main>
      {toast && <div role="status" className={`toast-note${toastError ? ' toast-error' : ''}`} data-testid="status-toast"><CircleCheck size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />{toast}</div>}
    </div>
  );
}

export default App;

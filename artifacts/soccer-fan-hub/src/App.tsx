import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  BadgeEuro,
  CircleCheck,
  CircleDot,
  CirclePlay,
  ClipboardList,
  Clock3,
  Edit3,
  LayoutDashboard,
  LogOut,
  Pause,
  Play,
  Plus,
  SkipBack,
  SkipForward,
  Search,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  UsersRound,
  UserPlus,
  X,
} from 'lucide-react';
import AuthScreen from './components/auth-screen';
import {
  clearManagerSession,
  createPasswordRecord,
  readManagerAccounts,
  readManagerSession,
  saveManagerProgress,
  verifyManagerPassword,
  writeManagerAccounts,
  writeManagerSession,
  type LocalManagerAccount,
  type ManagerIdentity,
} from './lib/local-auth';

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
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physicality: number;
  };
};

type ScoutingNote = { id: string; playerId: number; content: string; timestamp: string; playerName?: string };

type ManagerState = {
  budget: number;
  squad: Player[];
  watchlist: Player[];
};

type ViewKey = 'dashboard' | 'directory' | 'profile' | 'compare' | 'builder';

function createInitialManagerState(): ManagerState {
  return {
  budget: 500.0,
  squad: [],
  watchlist: [],
  };
}

const navItems: { key: ViewKey; label: string; icon: typeof LayoutDashboard; upcoming?: boolean }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'directory', label: 'Player Directory', icon: UsersRound },
  { key: 'profile', label: 'Player Profile', icon: UserRound },
  { key: 'compare', label: 'Compare Players', icon: ArrowLeftRight, upcoming: true },
  { key: 'builder', label: 'Squad Builder', icon: ClipboardList, upcoming: true },
];

const players: Player[] = [
  { id: 1, name: 'Kylian Mbappé', position: 'Forward', club: 'PSG', marketValue: 180, transferFee: 180, rating: 91, nationality: 'France', age: 25, attributes: { pace: 97, shooting: 92, passing: 85, dribbling: 92, defending: 35, physicality: 78 } },
  { id: 2, name: 'Erling Haaland', position: 'Forward', club: 'Manchester City', marketValue: 175, transferFee: 175, rating: 91, nationality: 'Norway', age: 24, attributes: { pace: 89, shooting: 94, passing: 75, dribbling: 80, defending: 40, physicality: 88 } },
  { id: 3, name: 'Vinícius Júnior', position: 'Forward', club: 'Real Madrid', marketValue: 120, transferFee: 120, rating: 89, nationality: 'Brazil', age: 24, attributes: { pace: 95, shooting: 82, passing: 80, dribbling: 93, defending: 30, physicality: 70 } },
  { id: 4, name: 'Harry Kane', position: 'Forward', club: 'Bayern Munich', marketValue: 100, transferFee: 100, rating: 90, nationality: 'England', age: 31, attributes: { pace: 75, shooting: 93, passing: 88, dribbling: 80, defending: 45, physicality: 85 } },
  { id: 5, name: 'Jude Bellingham', position: 'Midfielder', club: 'Real Madrid', marketValue: 180, transferFee: 180, rating: 90, nationality: 'England', age: 21, attributes: { pace: 80, shooting: 88, passing: 86, dribbling: 85, defending: 78, physicality: 82 } },
  { id: 6, name: 'Kevin De Bruyne', position: 'Midfielder', club: 'Manchester City', marketValue: 100, transferFee: 100, rating: 91, nationality: 'Belgium', age: 33, attributes: { pace: 78, shooting: 92, passing: 95, dribbling: 88, defending: 65, physicality: 78 } },
  { id: 7, name: 'Rodri', position: 'Midfielder', club: 'Manchester City', marketValue: 120, transferFee: 120, rating: 90, nationality: 'Spain', age: 28, attributes: { pace: 75, shooting: 82, passing: 90, dribbling: 80, defending: 85, physicality: 88 } },
  { id: 8, name: 'Pedri', position: 'Midfielder', club: 'Barcelona', marketValue: 150, transferFee: 150, rating: 89, nationality: 'Spain', age: 22, attributes: { pace: 82, shooting: 78, passing: 90, dribbling: 92, defending: 60, physicality: 70 } },
  { id: 9, name: 'Virgil van Dijk', position: 'Defender', club: 'Liverpool', marketValue: 80, transferFee: 80, rating: 89, nationality: 'Netherlands', age: 33, attributes: { pace: 75, shooting: 65, passing: 80, dribbling: 60, defending: 92, physicality: 90 } },
  { id: 10, name: 'Rúben Dias', position: 'Defender', club: 'Manchester City', marketValue: 90, transferFee: 90, rating: 89, nationality: 'Portugal', age: 27, attributes: { pace: 78, shooting: 55, passing: 82, dribbling: 65, defending: 90, physicality: 88 } },
  { id: 11, name: 'Antonio Rüdiger', position: 'Defender', club: 'Real Madrid', marketValue: 70, transferFee: 70, rating: 87, nationality: 'Germany', age: 31, attributes: { pace: 80, shooting: 50, passing: 75, dribbling: 60, defending: 88, physicality: 90 } },
  { id: 12, name: 'Achraf Hakimi', position: 'Defender', club: 'PSG', marketValue: 85, transferFee: 85, rating: 88, nationality: 'Morocco', age: 25, attributes: { pace: 95, shooting: 70, passing: 78, dribbling: 82, defending: 78, physicality: 75 } },
  { id: 13, name: 'Thibaut Courtois', position: 'Goalkeeper', club: 'Real Madrid', marketValue: 60, transferFee: 60, rating: 89, nationality: 'Belgium', age: 32, attributes: { pace: 50, shooting: 40, passing: 65, dribbling: 50, defending: 80, physicality: 75 } },
  { id: 14, name: 'Alisson Becker', position: 'Goalkeeper', club: 'Liverpool', marketValue: 65, transferFee: 65, rating: 89, nationality: 'Brazil', age: 32, attributes: { pace: 55, shooting: 45, passing: 70, dribbling: 55, defending: 82, physicality: 78 } },
  { id: 15, name: 'Marc-André ter Stegen', position: 'Goalkeeper', club: 'Barcelona', marketValue: 50, transferFee: 50, rating: 88, nationality: 'Germany', age: 32, attributes: { pace: 50, shooting: 40, passing: 75, dribbling: 55, defending: 80, physicality: 70 } },
  { id: 16, name: 'Mike Maignan', position: 'Goalkeeper', club: 'AC Milan', marketValue: 55, transferFee: 55, rating: 87, nationality: 'France', age: 29, attributes: { pace: 55, shooting: 40, passing: 65, dribbling: 50, defending: 85, physicality: 80 } },
];

function normalizeManagerState(value: unknown): ManagerState {
  const initial = createInitialManagerState();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return initial;
  const saved = value as { budget?: unknown; squad?: unknown; watchlist?: unknown };
  const byId = new Map(players.map((player) => [player.id, player]));
  const restorePlayers = (items: unknown) => {
    if (!Array.isArray(items)) return [];
    const seen = new Set<number>();
    return items.flatMap((item) => {
      if (!item || typeof item !== 'object' || !('id' in item) || typeof item.id !== 'number') return [];
      const player = byId.get(item.id);
      if (!player || seen.has(player.id)) return [];
      seen.add(player.id);
      return [player];
    });
  };
  return {
    budget: typeof saved.budget === 'number' && Number.isFinite(saved.budget) && saved.budget >= 0
      ? saved.budget
      : initial.budget,
    squad: restorePlayers(saved.squad),
    watchlist: restorePlayers(saved.watchlist),
  };
}

function restoreWorkspace(): { user: ManagerIdentity | null; state: ManagerState; message: string } {
  const state = createInitialManagerState();
  try {
    const session = readManagerSession();
    if (!session) return { user: null, state, message: '' };
    const account = readManagerAccounts().find((item) => item.username.toLowerCase() === session.username.toLowerCase());
    if (!account) {
      clearManagerSession();
      return { user: null, state, message: 'Your saved manager profile was not found. Please sign in again.' };
    }
    return {
      user: { username: account.username, managerName: account.managerName, clubName: account.clubName },
      state: normalizeManagerState(account.savedState),
      message: '',
    };
  } catch (error) {
    return {
      user: null,
      state,
      message: error instanceof Error ? error.message : 'Saved account data could not be read.',
    };
  }
}

const viewCopy: Record<Exclude<ViewKey, 'dashboard' | 'directory' | 'profile'>, { title: string; description: string; icon: typeof UsersRound }> = {
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
  manager,
  onRemove,
  onSell,
  onExport,
  onOpenBuilder,
}: {
  state: ManagerState;
  manager: ManagerIdentity;
  onRemove: (name: string) => void;
  onSell: (player: Player) => void;
  onExport: () => void;
  onOpenBuilder: () => void;
}) {
  const startingValue = state.squad.reduce((sum, player) => sum + player.marketValue, 0);
  const committed = state.squad.reduce((sum, player) => sum + player.transferFee, 0);
  const usedPercent = Math.min(100, Math.round((committed / (state.budget + committed)) * 100));
  const formattedDate = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <section className="dashboard" aria-label="Manager dashboard">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Squad operations / overview</div>
          <h1 className="page-title">{greeting}, {manager.managerName}.</h1>
          <p className="page-subtitle">Your {manager.clubName} squad, budget, and next moves — all in one place.</p>
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

      <section className="panel squad-panel" aria-labelledby="my-squad-heading">
        <div className="panel-header">
          <div>
            <div className="panel-title-wrap">
              <h2 className="panel-title" id="my-squad-heading">My squad</h2>
              <span className="panel-count">{state.squad.length}</span>
            </div>
            <div className="panel-kicker">Manage your signed players</div>
          </div>
          <span className="squad-panel-note">Sale returns market value to your budget</span>
        </div>
        {state.squad.length > 0 ? (
          <div className="squad-roster">
            {state.squad.map((player) => (
              <div className="squad-row" key={player.id} data-testid={`row-squad-${player.id}`}>
                <div className="player-monogram" aria-hidden="true">{monogram(player.name)}</div>
                <div className="squad-player-details">
                  <div className="player-name">{player.name}</div>
                  <div className="player-meta">{player.position} <span aria-hidden="true">·</span> {player.club}</div>
                </div>
                <div className="squad-player-value">
                  <span>MARKET VALUE</span>
                  <strong>{euro(player.marketValue)}</strong>
                </div>
                <button
                  type="button"
                  className="sell-player-action"
                  onClick={() => onSell(player)}
                  aria-label={`Sell ${player.name} for ${euro(player.marketValue)}`}
                  data-testid={`button-sell-${player.id}`}
                >
                  Sell / Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state squad-empty-state" data-testid="empty-squad">
            <div className="empty-symbol"><UsersRound size={17} /></div>
            <div className="empty-title">Your squad is waiting</div>
            <div className="empty-copy">Sign players from the transfer market to build your squad.</div>
          </div>
        )}
      </section>
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

function PlayerProfile({ player, onBack }: { player: Player; onBack: () => void }) {
  const [notes, setNotes] = useState<ScoutingNote[]>([]);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);
  const skills: { label: string; value: number }[] = [
    { label: 'Pace', value: player.attributes.pace },
    { label: 'Shooting', value: player.attributes.shooting },
    { label: 'Passing', value: player.attributes.passing },
    { label: 'Dribbling', value: player.attributes.dribbling },
    { label: 'Defending', value: player.attributes.defending },
    { label: 'Physicality', value: player.attributes.physicality },
  ];
  const storageKey = `scoutingNotes_${player.id}`;

  useEffect(() => {
    setDraft('');
    setEditingId(null);
    setDeleteId(null);
    setFeedback(null);
    try {
      const saved = window.localStorage.getItem(`scoutingNotes_${player.id}`);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      setNotes(Array.isArray(parsed) ? parsed.filter((note): note is ScoutingNote =>
        note && typeof note.id === 'string' && typeof note.content === 'string' && typeof note.timestamp === 'string' && !Number.isNaN(Date.parse(note.timestamp)) && note.playerId === player.id
      ) : []);
    } catch {
      setNotes([]);
      setFeedback({ text: 'Saved notes could not be read from this browser.', error: true });
    }
  }, [player.id]);

  function persist(next: ScoutingNote[]) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      setNotes(next);
      setFeedback({ text: 'Scouting notes saved on this device.', error: false });
      return true;
    } catch {
      setFeedback({ text: 'Could not save notes. Check browser storage settings and try again.', error: true });
      return false;
    }
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) {
      setFeedback({ text: 'Write a note before adding it.', error: true });
      return;
    }
    const next: ScoutingNote[] = [{ id: `${Date.now()}-${player.id}`, playerId: player.id, content, timestamp: new Date().toISOString(), playerName: player.name }, ...notes];
    if (persist(next)) setDraft('');
  }

  function saveEdit(note: ScoutingNote) {
    const content = editDraft.trim();
    if (!content) {
      setFeedback({ text: 'A scouting note cannot be empty.', error: true });
      return;
    }
    const next = notes.map((item) => item.id === note.id ? { ...item, content, timestamp: new Date().toISOString() } : item);
    if (persist(next)) {
      setEditingId(null);
      setEditDraft('');
    }
  }

  function deleteNote(id: string) {
    if (persist(notes.filter((note) => note.id !== id))) setDeleteId(null);
  }

  return (
    <section className="profile-page" aria-label={`${player.name} player profile`}>
      <div className="profile-back-row">
        <button type="button" className="phase-back" onClick={onBack} data-testid="button-back-directory"><ArrowLeft size={14} /> Back to directory</button>
        <div className="eyebrow">Scouting / player dossier</div>
      </div>

      <section className="profile-hero">
        <div className="profile-photo" aria-label={`Illustrated photo placeholder for ${player.name}`} role="img">
          <div className="photo-orbit orbit-one" /><div className="photo-orbit orbit-two" />
          <div className="photo-grid" />
          <div className="profile-monogram">{monogram(player.name)}</div>
          <span className="photo-caption">PLAYER DOSSIER / {String(player.id).padStart(2, '0')}</span>
        </div>
        <div className="profile-identity">
          <div className="profile-kicker"><span className={`position-badge position-${player.position.toLowerCase()}`}>{player.position}</span><span>TACTICHUB SCOUT REPORT</span></div>
          <h1>{player.name}</h1>
          <p className="profile-club"><Shield size={15} /> {player.club}</p>
          <div className="profile-fact-line">
            <div><span>NATIONALITY</span><strong>{player.nationality}</strong></div>
            <div><span>AGE</span><strong>{player.age} years</strong></div>
            <div><span>MARKET VALUE</span><strong>{euro(player.marketValue)}</strong></div>
          </div>
        </div>
        <div className="profile-rating"><strong>{player.rating}</strong><span>OVERALL</span><i>OVR</i></div>
      </section>

      <div className="profile-content-grid">
        <section className="profile-panel skills-panel" aria-labelledby="skills-heading">
          <div className="profile-panel-heading"><div><div className="eyebrow">Attribute breakdown</div><h2 id="skills-heading">Skill profile</h2></div><span className="skill-count">06 / 06</span></div>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <div className="skill-row" key={skill.label}>
                <div className="skill-label"><span>{skill.label}</span><strong>{skill.value}</strong></div>
                <div className="skill-track" role="progressbar" aria-label={`${skill.label} rating`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={skill.value}>
                  <div className={`skill-fill skill-fill-${index}`} style={{ width: `${skill.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="skills-footnote"><span>ATTRIBUTE SCALE</span><span>0 — 100</span></div>
        </section>

        <section className="profile-panel highlights-panel" aria-labelledby="highlights-heading">
          <div className="profile-panel-heading"><div><div className="eyebrow">On-pitch archive</div><h2 id="highlights-heading">Match Highlights</h2></div><span className="no-clips">NO CLIPS</span></div>
          <div className="video-placeholder">
            <div className="video-graphic"><div className="video-pitch"><span /><span /><span /></div><div className="video-empty-icon"><CirclePlay size={35} strokeWidth={1.2} /></div></div>
            <div className="video-copy"><strong>Highlights will appear here</strong><span>No match footage is available in this phase.</span></div>
            <div className="video-timeline"><span /></div>
          </div>
          <div className="video-controls" aria-label="Video controls">
            <button type="button" disabled aria-label="Previous clip"><SkipBack size={16} /></button>
            <button type="button" disabled aria-label="Play clip"><Play size={17} fill="currentColor" /></button>
            <button type="button" disabled aria-label="Pause clip"><Pause size={16} /></button>
            <button type="button" disabled aria-label="Next clip"><SkipForward size={16} /></button>
            <span>CLIP LIBRARY EMPTY</span>
          </div>
        </section>
      </div>

      <section className="profile-panel notes-panel" aria-labelledby="notes-heading">
        <div className="profile-panel-heading notes-heading">
          <div><div className="eyebrow">Private to this browser</div><h2 id="notes-heading">Scouting Notes <span className="notes-total">{notes.length}</span></h2><p>Keep your observations attached to {player.name}.</p></div>
          <div className="notes-storage"><span className="storage-indicator" /> LOCAL NOTES</div>
        </div>
        <form className="note-form" onSubmit={addNote}>
          <label htmlFor="scouting-note-input">New observation</label>
          <div className="note-compose"><textarea id="scouting-note-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Record a detail from your scouting..." rows={3} data-testid="input-scouting-note" /><div className="note-compose-actions"><button type="button" className="note-clear-button" onClick={() => { setDraft(''); setFeedback(null); }} disabled={!draft} data-testid="button-clear-note-input">Clear</button><button type="submit" className="primary-action" data-testid="button-add-note"><Plus size={15} /> Add note</button></div></div>
        </form>
        {feedback && <div className={`note-feedback${feedback.error ? ' is-error' : ''}`} role={feedback.error ? 'alert' : 'status'}>{feedback.error ? <CircleDot size={14} /> : <CircleCheck size={14} />}{feedback.text}</div>}
        {notes.length ? (
          <div className="notes-list">
            {notes.map((note) => (
              <article className="note-card" key={note.id} data-testid={`note-card-${note.id}`}>
                <div className="note-marker" aria-hidden="true" />
                <div className="note-card-main">
                  <div className="note-meta"><Clock3 size={13} /><time dateTime={note.timestamp}>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(note.timestamp))}</time>{editingId === note.id && <span className="editing-label">EDITING</span>}</div>
                  {editingId === note.id ? <textarea className="note-edit-input" value={editDraft} onChange={(event) => setEditDraft(event.target.value)} aria-label="Edit scouting note" autoFocus /> : <p>{note.content}</p>}
                  {deleteId === note.id && <div className="delete-confirmation" role="group" aria-label="Confirm note deletion"><span>Delete this scouting note?</span><button type="button" onClick={() => deleteNote(note.id)} data-testid={`button-confirm-delete-note-${note.id}`}>Delete note</button><button type="button" onClick={() => setDeleteId(null)}>Keep note</button></div>}
                </div>
                <div className="note-actions">
                  {editingId === note.id ? <><button type="button" className="note-action save-note" onClick={() => saveEdit(note)} data-testid={`button-save-note-${note.id}`}>Save</button><button type="button" className="note-action" onClick={() => { setEditingId(null); setEditDraft(''); }}>Cancel</button></> : <>
                    <button type="button" className="note-action" onClick={() => { setEditingId(note.id); setEditDraft(note.content); setDeleteId(null); }} aria-label={`Edit note from ${new Date(note.timestamp).toLocaleDateString()}`} data-testid={`button-edit-note-${note.id}`}><Edit3 size={14} /><span>Edit</span></button>
                    <button type="button" className="note-action delete-note" onClick={() => { setDeleteId(note.id === deleteId ? null : note.id); setEditingId(null); }} aria-expanded={deleteId === note.id} data-testid={`button-delete-note-${note.id}`}><Trash2 size={14} /><span>Delete</span></button>
                  </>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="notes-empty"><div className="notes-empty-mark"><ClipboardList size={18} /></div><div><strong>No scouting notes yet</strong><p>Your first observation will be saved to this player’s dossier.</p></div></div>
        )}
      </section>
    </section>
  );
}

function PhaseTwo({ page, onBack }: { page: Exclude<ViewKey, 'dashboard' | 'directory' | 'profile'>; onBack: () => void }) {
  const copy = viewCopy[page];
  const Icon = copy.icon;
  return (
    <section className="phase-screen" aria-label={`${copy.title} placeholder`}>
      <div className="phase-card">
        <div className="phase-icon"><Icon size={25} /></div>
        <div className="eyebrow">TACTICHUB / roadmap</div>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
        <div className="phase-stamp"><Sparkles size={12} /> UPCOMING</div>
        <div>
          <button className="phase-back" type="button" onClick={onBack} data-testid="button-back-dashboard">
            <ArrowLeft size={14} /> Back to dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [initialWorkspace] = useState(restoreWorkspace);
  const [state, setState] = useState<ManagerState>(initialWorkspace.state);
  const [currentUser, setCurrentUser] = useState<ManagerIdentity | null>(initialWorkspace.user);
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [toast, setToast] = useState('');
  const [toastError, setToastError] = useState(false);
  const [authMessage, setAuthMessage] = useState(initialWorkspace.message);
  const [authMessageTone, setAuthMessageTone] = useState<'error' | 'success' | 'info'>(initialWorkspace.message ? 'error' : 'info');
  const [authBusy, setAuthBusy] = useState(false);

  function notify(message: string, isError = false) {
    setToast(message);
    setToastError(isError);
    window.setTimeout(() => setToast(''), 2600);
  }

  useEffect(() => {
    if (!currentUser) return;
    try {
      saveManagerProgress(currentUser.username, state);
    } catch {
      notify('Your manager progress could not be saved in this browser.', true);
    }
  }, [currentUser?.username, state]);

  function enterWorkspace(account: LocalManagerAccount) {
    const identity: ManagerIdentity = {
      username: account.username,
      managerName: account.managerName,
      clubName: account.clubName,
    };
    writeManagerSession(identity);
    setState(normalizeManagerState(account.savedState));
    setCurrentUser(identity);
    setSelectedPlayer(null);
    setActiveView('dashboard');
    setAuthMessage('');
    notify(`Welcome to ${account.clubName}, ${account.managerName}`);
  }

  async function signIn(values: { username: string; password: string }) {
    setAuthBusy(true);
    setAuthMessage('');
    try {
      const username = values.username.trim().toLowerCase();
      const accounts = readManagerAccounts();
      const account = accounts.find((item) => item.username.toLowerCase() === username);
      if (!account || !(await verifyManagerPassword(account, values.password))) {
        setAuthMessage('We could not find a matching manager profile and password.');
        setAuthMessageTone('error');
        return;
      }

      if (account.password !== undefined && !account.passwordHash) {
        const passwordRecord = await createPasswordRecord(values.password);
        account.passwordSalt = passwordRecord.passwordSalt;
        account.passwordHash = passwordRecord.passwordHash;
        delete account.password;
        writeManagerAccounts(accounts);
      }

      enterWorkspace(account);
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Sign-in could not be completed.');
      setAuthMessageTone('error');
    } finally {
      setAuthBusy(false);
    }
  }

  async function signUp(values: { managerName: string; clubName: string; username: string; password: string }) {
    setAuthBusy(true);
    setAuthMessage('');
    try {
      const managerName = values.managerName.trim();
      const clubName = values.clubName.trim();
      const username = values.username.trim().toLowerCase();
      const password = values.password;
      if (!managerName || !clubName || !username || !password) {
        setAuthMessage('Complete every field to create your manager profile.');
        setAuthMessageTone('error');
        return;
      }
      if (password.length < 4) {
        setAuthMessage('Password must be at least 4 characters.');
        setAuthMessageTone('error');
        return;
      }
      if (username === 'demo') {
        setAuthMessage('That username is reserved for the demo manager.');
        setAuthMessageTone('error');
        return;
      }

      const accounts = readManagerAccounts();
      if (accounts.some((item) => item.username.toLowerCase() === username)) {
        setAuthMessage('That username is already in use on this browser.');
        setAuthMessageTone('error');
        return;
      }

      const passwordRecord = await createPasswordRecord(password);
      const account: LocalManagerAccount = {
        username,
        managerName,
        clubName,
        ...passwordRecord,
        savedState: createInitialManagerState(),
      };
      accounts.push(account);
      writeManagerAccounts(accounts);
      enterWorkspace(account);
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Your manager profile could not be created.');
      setAuthMessageTone('error');
    } finally {
      setAuthBusy(false);
    }
  }

  function demoLogin() {
    setAuthBusy(true);
    setAuthMessage('');
    try {
      const accounts = readManagerAccounts();
      let account = accounts.find((item) => item.username.toLowerCase() === 'demo');
      if (!account) {
        account = {
          username: 'demo',
          managerName: 'Demo Manager',
          clubName: 'Demo FC',
          savedState: createInitialManagerState(),
          isDemo: true,
        };
        accounts.push(account);
      } else {
        account.managerName = 'Demo Manager';
        account.clubName = 'Demo FC';
        account.isDemo = true;
        delete account.password;
        delete account.passwordSalt;
        delete account.passwordHash;
      }
      writeManagerAccounts(accounts);
      enterWorkspace(account);
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Demo access could not be opened.');
      setAuthMessageTone('error');
    } finally {
      setAuthBusy(false);
    }
  }

  function signOut() {
    if (!currentUser) return;
    try {
      saveManagerProgress(currentUser.username, state);
      clearManagerSession();
      setCurrentUser(null);
      setState(createInitialManagerState());
      setSelectedPlayer(null);
      setActiveView('dashboard');
      setAuthMessage('Signed out of your manager profile.');
      setAuthMessageTone('success');
    } catch {
      notify('Could not save your progress, so you are still signed in.', true);
    }
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

  function sellFromSquad(player: Player) {
    const currentPlayer = state.squad.find((item) => item.id === player.id);
    if (!currentPlayer) return;
    const refund = currentPlayer.marketValue;
    if (!window.confirm(`Sell ${currentPlayer.name} for ${euro(refund)} and return them to the market?`)) return;

    setState((current) => {
      const stillOwned = current.squad.some((item) => item.id === currentPlayer.id);
      if (!stillOwned) return current;
      return {
        ...current,
        budget: current.budget + refund,
        squad: current.squad.filter((item) => item.id !== currentPlayer.id),
      };
    });
    notify(`${currentPlayer.name} sold for ${euro(refund)}. Budget refunded.`);
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

  if (!currentUser) {
    return (
      <AuthScreen
        onSignIn={signIn}
        onSignUp={signUp}
        onDemoLogin={demoLogin}
        message={authMessage}
        messageTone={authMessageTone}
        busy={authBusy}
      />
    );
  }

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
                onClick={() => setActiveView(item.key === 'profile' && !selectedPlayer ? 'directory' : item.key)}
                data-testid={`nav-${item.key}`}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.upcoming && <small className="phase-tag">UPCOMING</small>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="season-label">CLUB WORKSPACE</div>
          <div className="season-value"><span className="online-dot" />Saved to this browser</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><BreadcrumbIcon size={14} /><strong>{activeLabel}</strong></div>
          <div className="topbar-right">
            <div className="live-pill"><span className="online-dot" /> PHASE FOUR</div>
            <div className="user-chip" data-testid="manager-profile-chip"><span className="user-avatar">{monogram(currentUser.managerName)}</span><span>{currentUser.managerName}<small className="user-club">{currentUser.clubName}</small></span></div>
            <button type="button" className="signout-button" onClick={signOut} data-testid="button-sign-out"><LogOut size={14} /><span>Sign out</span></button>
          </div>
        </header>

        {activeView === 'dashboard' ? (
          <Dashboard
            state={state}
            manager={currentUser}
            onRemove={removeFromWatchlist}
            onSell={sellFromSquad}
            onExport={exportSquad}
            onOpenBuilder={() => setActiveView('builder')}
          />
        ) : activeView === 'directory' ? (
          <PlayerDirectory state={state} onToggleWatchlist={toggleWatchlist} onOpenProfile={(player) => { setSelectedPlayer(player); setActiveView('profile'); }} onAddToSquad={addToSquad} />
        ) : activeView === 'profile' ? (
          selectedPlayer
            ? <PlayerProfile key={selectedPlayer.id} player={selectedPlayer} onBack={() => setActiveView('directory')} />
            : <PlayerDirectory state={state} onToggleWatchlist={toggleWatchlist} onOpenProfile={(player) => { setSelectedPlayer(player); setActiveView('profile'); }} onAddToSquad={addToSquad} />
        ) : (
          <PhaseTwo page={activeView} onBack={() => setActiveView('dashboard')} />
        )}
      </main>
      {toast && <div role="status" className={`toast-note${toastError ? ' toast-error' : ''}`} data-testid="status-toast"><CircleCheck size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />{toast}</div>}
    </div>
  );
}

export default App;

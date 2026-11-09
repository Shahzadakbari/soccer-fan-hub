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
  Shield,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

type Player = {
  name: string;
  position: string;
  club: string;
  marketValue: number;
  transferFee: number;
  rating: number;
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
  { key: 'directory', label: 'Player Directory', icon: UsersRound, phaseTwo: true },
  { key: 'profile', label: 'Player Profile', icon: UserRound, phaseTwo: true },
  { key: 'compare', label: 'Compare Players', icon: ArrowLeftRight, phaseTwo: true },
  { key: 'builder', label: 'Squad Builder', icon: ClipboardList, phaseTwo: true },
];

const viewCopy: Record<Exclude<ViewKey, 'dashboard'>, { title: string; description: string; icon: typeof UsersRound }> = {
  directory: {
    title: 'Player Directory',
    description: 'Browse and filter the player market when scouting tools arrive in the next phase.',
    icon: UsersRound,
  },
  profile: {
    title: 'Player Profile',
    description: 'A focused view of player details, performance, and valuation is planned for Phase Two.',
    icon: UserRound,
  },
  compare: {
    title: 'Compare Players',
    description: 'Side-by-side player evaluation is planned for Phase Two.',
    icon: ArrowLeftRight,
  },
  builder: {
    title: 'Squad Builder',
    description: 'Lineup selection and formation planning are planned for Phase Two.',
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

function PhaseTwo({ page, onBack }: { page: Exclude<ViewKey, 'dashboard'>; onBack: () => void }) {
  const copy = viewCopy[page];
  const Icon = copy.icon;
  return (
    <section className="phase-screen" aria-label={`${copy.title} placeholder`}>
      <div className="phase-card">
        <div className="phase-icon"><Icon size={25} /></div>
        <div className="eyebrow">TACTICHUB / roadmap</div>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
        <div className="phase-stamp"><Sparkles size={12} /> PHASE TWO</div>
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
  const [state, setState] = useState<ManagerState>(managerState);
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [toast, setToast] = useState('');

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
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
                {item.phaseTwo && <small className="phase-tag">PHASE 2</small>}
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
            <div className="live-pill"><span className="online-dot" /> PHASE ONE</div>
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
        ) : (
          <PhaseTwo page={activeView} onBack={() => setActiveView('dashboard')} />
        )}
      </main>
      {toast && <div role="status" className="toast-note" data-testid="status-toast"><CircleCheck size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />{toast}</div>}
    </div>
  );
}

export default App;

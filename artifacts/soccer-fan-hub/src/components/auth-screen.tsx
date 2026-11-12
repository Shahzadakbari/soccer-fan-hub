import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  LockKeyhole,
  Shield,
  UserRound,
} from 'lucide-react';

type SignInValues = { username: string; password: string };
type SignUpValues = { managerName: string; clubName: string; username: string; password: string };

export type AuthScreenProps = {
  onSignIn: (values: SignInValues) => void;
  onSignUp: (values: SignUpValues) => void;
  onDemoLogin: () => void;
  message?: string;
  messageTone?: 'error' | 'success' | 'info';
  busy?: boolean;
};

type AuthMode = 'signin' | 'signup';

export function AuthScreen({
  onSignIn,
  onSignUp,
  onDemoLogin,
  message,
  messageTone = 'info',
  busy = false,
}: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [managerName, setManagerName] = useState('');
  const [clubName, setClubName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (mode === 'signin') onSignIn({ username: username.trim(), password });
    else onSignUp({ managerName: managerName.trim(), clubName: clubName.trim(), username: username.trim(), password });
  }

  const isSignUp = mode === 'signup';

  return (
    <main className="auth-screen">
      <div className="auth-frame">
        <section className="auth-side" aria-label="TacticHub introduction">
          <div className="auth-side-top">
            <div className="auth-brand">
              <span className="auth-brand-mark" aria-hidden="true"><Shield size={19} strokeWidth={2.4} /></span>
              <span className="auth-brand-word">TACTIC<span>HUB</span></span>
            </div>
            <span className="auth-season">SEASON 24 / 25</span>
          </div>

          <div className="auth-pitch-art" aria-hidden="true">
            <div className="auth-pitch">
              <span className="pitch-halfway" />
              <span className="pitch-circle" />
              <span className="pitch-box pitch-box-left" />
              <span className="pitch-box pitch-box-right" />
              <span className="pitch-player player-one" />
              <span className="pitch-player player-two" />
              <span className="pitch-player player-three" />
              <span className="pitch-player player-four" />
              <span className="pitch-ball" />
              <span className="pitch-route route-one" />
              <span className="pitch-route route-two" />
            </div>
            <div className="auth-pitch-label"><span className="auth-live-dot" /> SCOUTING BOARD / ACTIVE</div>
          </div>

          <div className="auth-story">
            <p className="auth-kicker">THE CLUB IS YOURS TO SHAPE</p>
            <h1>See the game<br /><em>before it happens.</em></h1>
            <p className="auth-story-copy">A clear view of the market. A sharper plan for the squad. Your next move starts here.</p>
          </div>

          <div className="auth-side-bottom">
            <div className="auth-stat"><strong>16</strong><span>SCOUTED PROFILES</span></div>
            <div className="auth-stat-rule" />
            <div className="auth-stat"><strong>€500<span>M</span></strong><span>STARTING BUDGET</span></div>
            <div className="auth-side-note">BUILT FOR THE TOUCHLINE<br />AND THE TRANSFER WINDOW.</div>
          </div>
        </section>

        <section className="auth-main" aria-labelledby="auth-title">
          <div className="auth-mobile-brand">
            <div className="auth-brand">
              <span className="auth-brand-mark" aria-hidden="true"><Shield size={18} strokeWidth={2.4} /></span>
              <span className="auth-brand-word">TACTIC<span>HUB</span></span>
            </div>
            <span className="auth-season">SEASON 24 / 25</span>
          </div>

          <div className="auth-form-wrap">
            <div className="auth-welcome">
              <div className="auth-welcome-line"><span className="auth-welcome-icon"><UserRound size={15} /></span> MANAGER ACCESS</div>
              <h2 id="auth-title">{isSignUp ? 'Build your club.' : 'Welcome back.'}</h2>
              <p>{isSignUp ? 'Set up your place in the dugout.' : 'Your next window is waiting.'}</p>
            </div>

            <div className="auth-tabs" role="tablist" aria-label="Account access">
              <button type="button" role="tab" aria-selected={!isSignUp} className={!isSignUp ? 'is-active' : ''} onClick={() => setMode('signin')} data-testid="button-auth-signin-tab">
                Sign in
              </button>
              <button type="button" role="tab" aria-selected={isSignUp} className={isSignUp ? 'is-active' : ''} onClick={() => setMode('signup')} data-testid="button-auth-signup-tab">
                Create account
              </button>
            </div>

            {message && (
              <div className={`auth-message auth-message-${messageTone}`} role={messageTone === 'error' ? 'alert' : 'status'} aria-live={messageTone === 'error' ? 'assertive' : 'polite'} data-testid="status-auth-message">
                <span className="auth-message-mark" aria-hidden="true">{messageTone === 'success' ? <Check size={14} /> : <CircleHelp size={14} />}</span>
                {message}
              </div>
            )}

            <form className="auth-form" onSubmit={submit}>
              {isSignUp && (
                <>
                  <div className="auth-field">
                    <label htmlFor="auth-manager-name">Manager name</label>
                    <div className="auth-input-wrap">
                      <UserRound size={16} aria-hidden="true" />
                      <input id="auth-manager-name" type="text" value={managerName} onChange={(event) => setManagerName(event.target.value)} placeholder="Your name" autoComplete="name" required disabled={busy} data-testid="input-manager-name" />
                    </div>
                  </div>
                  <div className="auth-field">
                    <label htmlFor="auth-club-name">Club name</label>
                    <div className="auth-input-wrap">
                      <Building2 size={16} aria-hidden="true" />
                      <input id="auth-club-name" type="text" value={clubName} onChange={(event) => setClubName(event.target.value)} placeholder="Name your club" autoComplete="organization" required disabled={busy} data-testid="input-club-name" />
                    </div>
                  </div>
                </>
              )}

              <div className="auth-field">
                <label htmlFor="auth-username">{isSignUp ? 'Username' : 'Username'}</label>
                <div className="auth-input-wrap">
                  <span className="auth-at" aria-hidden="true">@</span>
                  <input id="auth-username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Your manager handle" autoComplete="username" required disabled={busy} data-testid="input-auth-username" />
                </div>
              </div>

              <div className="auth-field">
                <div className="auth-label-row">
                  <label htmlFor="auth-password">Password</label>
                  {isSignUp && <span className="auth-field-hint">4 characters minimum</span>}
                </div>
                <div className="auth-input-wrap">
                  <LockKeyhole size={16} aria-hidden="true" />
                  <input id="auth-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignUp ? 'Choose a password' : 'Enter your password'} autoComplete={isSignUp ? 'new-password' : 'current-password'} minLength={isSignUp ? 4 : undefined} required disabled={busy} data-testid="input-auth-password" />
                </div>
              </div>

              <button className="auth-submit" type="submit" disabled={busy} data-testid={isSignUp ? 'button-create-account' : 'button-sign-in'}>
                <span>{busy ? 'Working…' : isSignUp ? 'Create manager account' : 'Sign in to TacticHub'}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </form>

            <div className="auth-divider"><span>OR TAKE A LOOK AROUND</span></div>
            <button className="auth-demo" type="button" onClick={onDemoLogin} disabled={busy} data-testid="button-demo-manager-login">
              <span className="auth-demo-mark"><Shield size={15} /></span>
              <span className="auth-demo-copy"><strong>Demo manager login</strong><small>Explore the workspace with a sample squad</small></span>
              <ChevronRight size={16} className="auth-demo-arrow" aria-hidden="true" />
            </button>

            <p className="auth-prototype-note">Profiles and progress stay in this browser. This demo is not secure authentication.</p>
          </div>
          <footer className="auth-footer"><span>TACTICHUB / MANAGER WORKSPACE</span><span>PLAN THE NEXT MOVE <i /></span></footer>
        </section>
      </div>
    </main>
  );
}

export default AuthScreen;

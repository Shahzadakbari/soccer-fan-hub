export type ManagerIdentity = {
  username: string;
  managerName: string;
  clubName: string;
};

export type LocalManagerAccount = ManagerIdentity & {
  savedState: unknown;
  passwordSalt?: string;
  passwordHash?: string;
  isDemo?: boolean;
  /** Read only to migrate accounts created by the earlier Phase Four prototype. */
  password?: string;
};

const USERS_KEY = 'tactichub_users';
const CURRENT_USER_KEY = 'tactichub_currentUser';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAccount(value: unknown): value is LocalManagerAccount {
  if (!isRecord(value)) return false;
  return typeof value.username === 'string'
    && typeof value.managerName === 'string'
    && typeof value.clubName === 'string'
    && 'savedState' in value
    && (value.password === undefined || typeof value.password === 'string')
    && (value.passwordSalt === undefined || typeof value.passwordSalt === 'string')
    && (value.passwordHash === undefined || typeof value.passwordHash === 'string')
    && (value.isDemo === undefined || typeof value.isDemo === 'boolean');
}

export function readManagerAccounts(): LocalManagerAccount[] {
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Saved manager profiles are unreadable in this browser.');
  }

  if (!Array.isArray(parsed) || !parsed.every(isAccount)) {
    throw new Error('Saved manager profiles have an unsupported format.');
  }
  return parsed;
}

export function writeManagerAccounts(accounts: LocalManagerAccount[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

export function readManagerSession(): ManagerIdentity | null {
  const raw = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('The saved sign-in session is unreadable. Sign in again.');
  }

  if (!isRecord(parsed)
    || typeof parsed.username !== 'string'
    || typeof parsed.managerName !== 'string'
    || typeof parsed.clubName !== 'string') {
    throw new Error('The saved sign-in session has an unsupported format. Sign in again.');
  }

  return {
    username: parsed.username,
    managerName: parsed.managerName,
    clubName: parsed.clubName,
  };
}

export function writeManagerSession(identity: ManagerIdentity) {
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(identity));
}

export function clearManagerSession() {
  window.localStorage.removeItem(CURRENT_USER_KEY);
}

export function saveManagerProgress(username: string, savedState: unknown) {
  const accounts = readManagerAccounts();
  const account = accounts.find((item) => item.username.toLowerCase() === username.toLowerCase());
  if (!account) throw new Error('The active manager profile could not be found.');
  account.savedState = savedState;
  writeManagerAccounts(accounts);
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function fromHex(value: string) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(value)) return null;
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

async function derivePasswordHash(password: string, salt: Uint8Array) {
  if (!window.crypto?.subtle) {
    throw new Error('This browser cannot securely prepare a local password. Use the HTTPS preview.');
  }
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await window.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuffer, iterations: 210_000, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}

export async function createPasswordRecord(password: string) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  return {
    passwordSalt: toHex(salt),
    passwordHash: await derivePasswordHash(password, salt),
  };
}

export async function verifyManagerPassword(account: LocalManagerAccount, password: string) {
  if (account.passwordSalt && account.passwordHash) {
    const salt = fromHex(account.passwordSalt);
    if (!salt) return false;
    const actual = await derivePasswordHash(password, salt);
    if (actual.length !== account.passwordHash.length) return false;
    let difference = 0;
    for (let index = 0; index < actual.length; index += 1) {
      difference |= actual.charCodeAt(index) ^ account.passwordHash.charCodeAt(index);
    }
    return difference === 0;
  }

  // Allow existing demo accounts to sign in once, then the caller can replace this
  // legacy plaintext value with a salted hash.
  return typeof account.password === 'string' && account.password === password;
}

const ACCOUNTS_KEY = 'blog_accounts';
const USER_KEY = 'blog_user';

export function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveAccounts(list) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
}

export function registerAccount({ name, email, password, avatar }) {
  if (!email || !password) return { success: false, message: 'Email and password required' };
  const accounts = loadAccounts();
  const exists = accounts.find((a) => a.email === email.toLowerCase());
  if (exists) return { success: false, message: 'Email already registered' };
  const acc = { email: email.toLowerCase(), password, name: name || email.split('@')[0], avatar };
  accounts.push(acc);
  saveAccounts(accounts);
  return { success: true, account: acc };
}

export function authenticateAccount({ email, password }) {
  if (!email || !password) return { success: false, message: 'Email and password required' };
  const accounts = loadAccounts();
  const acc = accounts.find((a) => a.email === email.toLowerCase() && a.password === password);
  if (!acc) return { success: false, message: 'Invalid credentials' };
  return { success: true, account: acc };
}

export function saveUserSession(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function loadUserSession() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

export function clearUserSession() {
  localStorage.removeItem(USER_KEY);
}

const authService = {
  loadAccounts,
  saveAccounts,
  registerAccount,
  authenticateAccount,
  saveUserSession,
  loadUserSession,
  clearUserSession,
};

export default authService;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerAccount, authenticateAccount, saveUserSession, loadUserSession, clearUserSession } from '../services/authService';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => loadUserSession());

  useEffect(() => {
    if (user) saveUserSession(user);
    else clearUserSession();
  }, [user]);

  // register a new account (demo-only, stores credentials in localStorage)
  const register = ({ name, email, password, avatar }) => {
    const res = registerAccount({ name, email, password, avatar });
    if (!res.success) return res;
    const acc = res.account;
    const userObj = { name: acc.name, email: acc.email, avatar: acc.avatar || `https://i.pravatar.cc/150?u=${acc.email}` };
    setUser(userObj);
    return { success: true };
  };

  // credential-based login
  const loginWithCredentials = ({ email, password }) => {
    const res = authenticateAccount({ email, password });
    if (!res.success) return res;
    const acc = res.account;
    setUser({ name: acc.name, email: acc.email, avatar: acc.avatar || `https://i.pravatar.cc/150?u=${acc.email}` });
    return { success: true };
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      saveUserSession(next);
      return next;
    });
  };

  // legacy/simple login (by passing a user object)
  const login = (u) => setUser(u);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout, register, loginWithCredentials, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

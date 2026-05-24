import { createContext, useContext, useState } from 'react';

interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'mjl_user';

const loadUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const login = async (email: string, _password: string) => {
    // Mock — replace with real API call
    const loggedIn: AuthUser = {
      firstName: 'Anna',
      lastName: 'Kowalska',
      email,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
  };

  const register = async (firstName: string, lastName: string, email: string, _password: string) => {
    // Mock — replace with real API call
    const registered: AuthUser = { firstName, lastName, email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registered));
    setUser(registered);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

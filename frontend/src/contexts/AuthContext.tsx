import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import apiClient from "../services/api-client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  created_at?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  setAuthState: (state: {
    user: AuthUser | null;
    token: string | null;
  }) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "job-board-auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { user: AuthUser; token: string };
      setAuthState(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const applyTokenHeader = (nextToken: string | null) => {
    if (nextToken) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
    } else {
      delete apiClient.defaults.headers.common.Authorization;
    }
  };

  const setAuthState = useCallback(
    ({
      user: nextUser,
      token: nextToken,
    }: {
      user: AuthUser | null;
      token: string | null;
    }) => {
      setUser(nextUser);
      setToken(nextToken);
      applyTokenHeader(nextToken);
      if (nextUser && nextToken) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user: nextUser, token: nextToken })
        );
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    []
  );

  const clearAuth = useCallback(() => {
    setAuthState({ user: null, token: null });
  }, [setAuthState]);

  const value: AuthContextValue = {
    user,
    token,
    setAuthState,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, tokenStore, type Profile } from "../api/client";

interface AuthState {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: Profile) => void;
}

const AuthContext = createContext<AuthState | null>(null);

function identifyPendoVisitor(profile: Profile): void {
  pendo.identify({
    visitor: {
      id: profile.id,
      email: profile.email,
      full_name: profile.name,
      role: profile.role,
      organizationId: profile.organization.id,
      active: profile.active,
      createdAt: profile.createdAt,
    },
    account: {
      id: profile.organization.id,
      name: profile.organization.name,
      plan: profile.organization.plan,
      seats: profile.organization.seats,
    },
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(() => tokenStore.get() !== null);

  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .me()
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  // Covers sign-in, session hydration from the stored token and profile edits.
  useEffect(() => {
    if (user) identifyPendoVisitor(user);
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const { token, user: profile } = await api.login(email, password);
    tokenStore.set(token);
    setUser(profile);
  };

  const signOut = async () => {
    try {
      await api.logout();
    } finally {
      tokenStore.clear();
      setUser(null);
      pendo.clearSession();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

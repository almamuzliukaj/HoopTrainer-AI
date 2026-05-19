"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthCtx = { user: User | null; session: Session | null; loading: boolean };
const AuthContext = createContext<AuthCtx>({ user: null, session: null, loading: true });
export const useAuth = () => useContext(AuthContext);

function isInvalidRefreshTokenError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const message = "message" in error && typeof error.message === "string"
    ? error.message
    : "";

  return message.toLowerCase().includes("invalid refresh token");
}

async function clearStaleAuthSession() {
  if (typeof window !== "undefined") {
    for (const storage of [window.localStorage, window.sessionStorage]) {
      for (let i = storage.length - 1; i >= 0; i -= 1) {
        const key = storage.key(i);
        if (key?.startsWith("sb-") && key.endsWith("-auth-token")) {
          storage.removeItem(key);
        }
      }
    }
  }

  await supabase.auth.signOut({ scope: "local" });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (isInvalidRefreshTokenError(error)) {
        await clearStaleAuthSession();
        if (!mounted) return;

        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(error ? null : data.session ?? null);
      setUser(error ? null : data.session?.user ?? null);
      setLoading(false);
    };

    void loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!mounted) return;
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false); // ensure loading clears after any auth event
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

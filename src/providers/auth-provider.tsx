"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { fetchGoogleLogin, fetchLogin } from "@/lib/services/client";

import { fetchLogout } from "@/lib/services/server";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "@/i18n/routing";

interface IAuthContextType {
  data?: TSession;
  update: (__props: TSession) => void;
  login: (__data: { email: string; password: string }) => Promise<void>;
  googleLogin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({
  data,
  children,
}: {
  data: TSession | undefined;
  children: ReactNode;
}) => {
  const router = useRouter();
  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      const session = await fetchGoogleLogin(res);
      setUser(session);
      router.refresh();
    },
  });
  const [user, setUser] = useState(data);
  const logout = useCallback(async () => {
    await fetchLogout();
    setUser(undefined);
  }, []);
  const login = useCallback(
    async (data: { email: string; password: string }) => {
      const session = await fetchLogin(data);
      setUser(session);
      router.refresh();
    },
    [router]
  );

  return (
    <AuthContext.Provider
      value={{ data: user, update: setUser, login, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

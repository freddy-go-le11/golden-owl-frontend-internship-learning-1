"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { fetchLogout } from "@/lib/services/server";

interface IAuthContextType {
  data?: TSession;
  update: (__props: TSession) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({
  data,
  children,
}: {
  data: TSession | undefined;
  children: ReactNode;
}) => {
  const [user, setUser] = useState(data);
  const logout = useCallback(() => {
    fetchLogout();
    setUser(undefined);
  }, []);

  return (
    <AuthContext.Provider value={{ data: user, update: setUser, logout }}>
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

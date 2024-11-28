"use client";

import { Button } from "./ui/button";
import { ToggleTheme } from "./toggle-theme";
import { useAuth } from "@/providers/auth-provider";

export function Header() {
  const { data: session, logout } = useAuth();
  return (
    <header className="top-0 sticky flex justify-center items-center w-full h-16">
      <div className="w-full max-w-6xl flex justify-between mx-2">
        <div className="flex gap-2 ml-auto">
          <ToggleTheme />
          {session?.id && (
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

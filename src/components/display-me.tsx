"use client";

import { useAuth } from "@/providers/auth-provider";

export function DisplayMe() {
  const { data: session } = useAuth();

  return session?.id ? (
    <div>
      <p>Your email is {session.email}</p>
    </div>
  ) : (
    <div>
      <p>You are not logged in</p>
    </div>
  );
}

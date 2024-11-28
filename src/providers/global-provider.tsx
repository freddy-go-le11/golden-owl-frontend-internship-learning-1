import { AuthProvider } from "./auth-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextIntlClientProvider } from "next-intl";
import { OAUTH2_CLIENT_ID } from "@/common/constants";
import { QueryProvider } from "./query-client-provider";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { fetchAuthSession } from "@/lib/services/server";
import { getMessages } from "next-intl/server";

export default async function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, session] = await Promise.all([
    getMessages(),
    fetchAuthSession(),
  ]);

  return (
    <GoogleOAuthProvider clientId={OAUTH2_CLIENT_ID}>
      <AuthProvider data={session}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
              <Toaster richColors />
            </NextIntlClientProvider>
          </QueryProvider>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

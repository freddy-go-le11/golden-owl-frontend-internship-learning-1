import { NextIntlClientProvider } from "next-intl";
import { QueryProvider } from "./query-client-provider";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getMessages } from "next-intl/server";

export default async function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages] = await Promise.all([getMessages()]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <QueryProvider>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster richColors />
        </NextIntlClientProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

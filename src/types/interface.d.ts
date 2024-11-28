import { NextRequest } from "next/server";

interface IDefaultLayoutProps {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

interface NextAuthRequest extends NextRequest {
  auth?: TSession;
}

import { NextRequest } from "next/server";

interface NextAuthRequest extends NextRequest {
  auth?: TSession;
}

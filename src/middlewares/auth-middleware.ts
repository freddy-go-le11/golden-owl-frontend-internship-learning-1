import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from "@/common/constants";
import { NextFetchEvent, NextMiddleware, NextResponse } from "next/server";

import { NextAuthRequest } from "@/types/interface";
import { fetchAuthSession } from "@/lib/services/server";

const ONLY_UNAUTHENTICATED_PAGES = ["/login", "/register"];

const isMatchPathname = (pathname: string, matchers: string[]) => {
  return matchers.some((matcher) => new RegExp(matcher).test(pathname));
};

export const authMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
  return async (req: NextAuthRequest, _next: NextFetchEvent) => {
    const res = await next(req, _next);

    const refreshToken = req.cookies.get(COOKIE_REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      req.cookies.delete(COOKIE_REFRESH_TOKEN_KEY);
      req.cookies.delete(COOKIE_ACCESS_TOKEN_KEY);
    } else {
      const payloadAuth = await fetchAuthSession();
      req.auth = payloadAuth;
    }

    const isUnauthenticatedPage = isMatchPathname(
      req.nextUrl.pathname,
      ONLY_UNAUTHENTICATED_PAGES
    );

    if (req.auth && isUnauthenticatedPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return res;
  };
};

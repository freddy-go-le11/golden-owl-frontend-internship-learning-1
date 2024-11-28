"use server";

import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from "@/common/constants";

import { cookies as getCookies } from "next/headers";

export const fetchAuthSession = async () => {
  const cookiesString = (await getCookies()).toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
    method: "POST",
    credentials: "include",
    headers: { Cookie: cookiesString },
  });

  if (!res.ok) return null;

  const payload = await res.json();
  return payload.data;
};

export const fetchLogout = async () => {
  const cookie = await getCookies();
  cookie.delete(COOKIE_REFRESH_TOKEN_KEY);
  cookie.delete(COOKIE_ACCESS_TOKEN_KEY);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { Cookie: cookie.toString() },
  });

  if (!res.ok) return null;

  const payload = await res.json();
  return payload.data;
};

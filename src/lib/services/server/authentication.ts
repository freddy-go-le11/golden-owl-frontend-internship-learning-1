"use server";

import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from "@/common/constants";

import { customizeFetch } from "@/common/functions";
import { cookies as getCookies } from "next/headers";

export const fetchAuthSession = async () => {
  const cookiesString = (await getCookies()).toString();

  const [payload, error] = await customizeFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
    method: "POST",
    metadata: { headers: { Cookie: cookiesString } },
  });

  if (error) return null;
  return payload;
};

export const fetchLogout = async () => {
  const cookie = await getCookies();
  cookie.delete(COOKIE_REFRESH_TOKEN_KEY);
  cookie.delete(COOKIE_ACCESS_TOKEN_KEY);

  const [payload, error] = await customizeFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    method: "POST",
    metadata: { headers: { Cookie: cookie.toString() } },
  });

  if (error) return null;
  return payload;
};

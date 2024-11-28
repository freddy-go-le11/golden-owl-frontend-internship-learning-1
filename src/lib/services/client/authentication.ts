"use client";

import { StatusCodes } from "http-status-codes";
import { TokenResponse } from "@react-oauth/google";

export const fetchRegister = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === StatusCodes.CONFLICT) {
      throw new Error("email-exists");
    }

    throw new Error("register-error");
  }

  const payload = await res.json();
  return payload;
};

export const fetchLogin = async (data: { email: string; password: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    if (
      [StatusCodes.UNAUTHORIZED, StatusCodes.NOT_FOUND].includes(res.status)
    ) {
      throw new Error("invalid-credentials");
    }

    throw new Error("login-error");
  }

  const payload = await res.json();
  return payload.data;
};

export const fetchGoogleLogin = async (
  params: Omit<TokenResponse, "error" | "error_description" | "error_uri">
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("google-login-error");

  const payload = await res.json();
  return payload.data;
};

"use client";

import { StatusCodes } from "http-status-codes";
import { TokenResponse } from "@react-oauth/google";
import { customizeFetch } from "@/common/functions";

const MAP_REGISTER_ERRORS = {
  [StatusCodes.CONFLICT]: "email-exists",
};

export const fetchRegister = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const [payload, error] = await customizeFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    method: "POST",
    metadata: { body: JSON.stringify(data) },
  });

  if (error)
    throw new Error(
      MAP_REGISTER_ERRORS[error.code as keyof typeof MAP_REGISTER_ERRORS] ??
        "register-error"
    );

  return payload;
};

const MAP_LOGIN_ERRORS = {
  [StatusCodes.UNAUTHORIZED]: "invalid-credentials",
  [StatusCodes.NOT_FOUND]: "invalid-credentials",
};

export const fetchLogin = async (data: { email: string; password: string }) => {
  const [payload, error] = await customizeFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    method: "POST",
    metadata: { body: JSON.stringify(data) },
  });

  if (error)
    throw new Error(
      MAP_LOGIN_ERRORS[error.code as keyof typeof MAP_LOGIN_ERRORS] ??
        "login-error"
    );

  return payload;
};

export const fetchGoogleLogin = async (
  params: Omit<TokenResponse, "error" | "error_description" | "error_uri">
) => {
  const [payload, error] = await customizeFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`,
    method: "POST",
    metadata: { body: JSON.stringify(params) },
  });

  if (error) throw new Error("google-login-error");

  return payload;
};

export const fetchResetPassword = async (data: { email: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("reset-password-error");

  const payload = await res.json();
  return payload.data;
};

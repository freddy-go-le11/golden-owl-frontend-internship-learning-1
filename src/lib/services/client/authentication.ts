"use client";

import { StatusCodes } from "http-status-codes";

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
};

export const fetchLogin = async () => {
  await new Promise((resolve, reject) => setTimeout(reject, 1000));
};

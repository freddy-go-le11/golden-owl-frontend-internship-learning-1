"use client";

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
    if (res.status === 409) {
      throw new Error("email-exists");
    }

    throw new Error("register-error");
  }
};

export const fetchLogin = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if ([401, 404].includes(res.status)) {
      throw new Error("invalid-credentials");
    }

    throw new Error("login-error");
  }
};

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Link, useRouter } from "@/i18n/routing";

const DEFAULT_VALUES = {
  email: "",
  password: "",
};

export function LoginForm() {
  const t = useTranslations("login-form");
  const [, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const formSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("email-invalid")),
        password: z.string().min(8, t("password-invalid")),
      }),
    [t]
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked) {
      timer = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setFailedAttempts(0);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBlocked]);

  const onSubmit = useCallback(() => {
    // TODO: Replace this with your own API call
    const promise = async () => {
      try {
        setIsProcessing(true);

        // Simulate API call
        await new Promise((resolve, reject) => setTimeout(reject, 1000));

        setFailedAttempts(0);
      } catch {
        setFailedAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= 5) {
            setIsBlocked(true);
            setBlockTimeRemaining(5);
          }
          return newAttempts;
        });
        throw new Error("Invalid credentials");
      } finally {
        setIsProcessing(false);
      }
    };

    toast.promise(promise, {
      loading: t("login-loading"),
      success: t("login-success"),
      error: t("login-error"),
    });
  }, [t]);

  return (
    <Card className="min-w-[400px]">
      <CardHeader>
        <CardTitle>{t("form-title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="m@example.com"
                      disabled={isProcessing || isBlocked}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      tabIndex={-1}
                      href="/reset-password"
                      className="inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      disabled={isProcessing || isBlocked}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing || isBlocked}
            >
              {isBlocked
                ? `${t("blocked")} (${blockTimeRemaining}s)`
                : t("submit")}
            </Button>
          </form>
        </Form>

        <Button variant="outline" className="mt-4">
          {t("google-login")}
        </Button>

        <Button
          onClick={() => router.replace("/register")}
          variant="ghost"
          className="mt-8"
        >
          {t("don't-have-account")}{" "}
          <span className="text-bold">{t("register")}</span>
        </Button>
      </CardContent>
    </Card>
  );
}

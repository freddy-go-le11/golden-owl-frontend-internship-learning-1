"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const DEFAULT_VALUES = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export function RegisterForm() {
  const t = useTranslations("register-form");
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const formSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(3, t("name-invalid")),
          email: z.string().email(t("email-invalid")),
          password: z.string().min(8, t("password-invalid")),
          passwordConfirm: z.string().min(8, t("password-invalid")),
        })
        .refine(
          ({ password, passwordConfirm }) => password === passwordConfirm,
          {
            message: t("password-confirm-invalid"),
            path: ["passwordConfirm"],
          }
        ),
    [t]
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      // TODO: Replace this with your own API call
      const promise = new Promise((resolve) => {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          resolve(data);
        }, 2000);
      });

      toast.promise(promise, {
        loading: t("register-loading"),
        success: t("register-success"),
        error: t("register-error"),
      });
    },
    [t]
  );

  return (
    <Card className="min-w-[400px]">
      <CardHeader>
        <CardTitle>{t("form-title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email-label")}:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="freddy.le@gmail.com"
                      disabled={isProcessing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name-label")}:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Freddy"
                      disabled={isProcessing}
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
                  <FormLabel>{t("password-label")}:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      disabled={isProcessing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password-confirm-label")}:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      disabled={isProcessing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isProcessing}>
              {t("submit")}
            </Button>
          </form>
        </Form>

        <Button
          onClick={() => router.replace("/login")}
          variant="ghost"
          className="mt-8 w-full"
        >
          {t("have-account")} <span className="text-bold">{t("login")}</span>
        </Button>
      </CardContent>
    </Card>
  );
}

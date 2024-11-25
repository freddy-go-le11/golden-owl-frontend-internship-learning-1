"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useCallback, useMemo } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { fetchRegister } from "@/lib/client-functions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const DEFAULT_VALUES = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export function RegisterForm() {
  const t = useTranslations("register-form");
  const router = useRouter();
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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: fetchRegister,
    onSuccess: () => router.replace("/login"),
  });

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      toast.promise(mutateAsync(data), {
        loading: t("register-loading"),
        success: t("register-success"),
        error: (error: Error) => t(error?.message ?? "register-error"),
      });
    },
    [mutateAsync, t]
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isPending}>
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

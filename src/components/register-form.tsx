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
import { useCallback, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

const DEFAULT_VALUES = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const formSchema = z
    .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
      passwordConfirm: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    })
    .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = useCallback((data: z.infer<typeof formSchema>) => {
    // TODO: Replace this with your own API call
    const promise = new Promise((resolve) => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        resolve(data);
      }, 2000);
    });

    toast.promise(promise, {
      loading: "Registering...",
      success: "Registered successfully!",
      error: "Failed to register",
    });
  }, []);

  return (
    <Card className="min-w-[400px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
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
                  <FormLabel>Name:</FormLabel>
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
                  <FormLabel>Password:</FormLabel>
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
                  <FormLabel>Password Confirm:</FormLabel>
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
              Register
            </Button>
          </form>
        </Form>

        <Button
          onClick={() => router.replace("/login")}
          variant="ghost"
          className="mt-8 w-full"
        >
          Already have an account? <span className="text-bold">Login</span>
        </Button>
      </CardContent>
    </Card>
  );
}
"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import z from "zod";
import { getSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginSchema } from "@/app/schemas/schemas";
import { generateTenantURL } from "@/app/lib/utils";

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

interface LoginViewParams {
  gymName: string;
  gymSlug: string;
  role: "Admin" | "Student";
}

export const LoginView = ({ gymName, gymSlug, role }: LoginViewParams) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const otherLogin = role === "Admin" ? "Student" : "Admin";

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        setCheckingSession(false);
        return;
      }

      const base = generateTenantURL(gymSlug);

      if (session.user.role === "ADMIN" && role === "Admin") {
        router.replace(`${base}/admin/dashboard`);
        return;
      }

      if (session.user.role === "VISITOR") {
        router.replace(`${base}/student/dashboard`);
        return;
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [gymSlug, role, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!response?.ok) {
        toast.error("Invalid email or password");
        return;
      }

      const session = await getSession();
      toast.success("Welcome back");

      const base = generateTenantURL(gymSlug);

      if (session?.user.role === "ADMIN") {
        router.push(`${base}/admin/dashboard`);
      } else {
        router.push(`${base}/student/dashboard`);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ⏳ Prevent flash while checking session
  if (checkingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-100">
        <p className="text-sm text-neutral-500">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 min-h-screen">
      {/* Left */}
      <div className="bg-neutral-100 lg:col-span-3 flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-12">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <Link
                  href={generateTenantURL(gymSlug)}
                  className={cn("text-2xl font-bold", poppins.className)}
                >
                  {gymName}
                </Link>

                <Link
                  href={`${generateTenantURL(gymSlug)}/${otherLogin.toLowerCase()}`}
                  className="text-sm underline text-neutral-600 hover:text-neutral-900"
                >
                  {otherLogin} login
                </Link>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-semibold text-neutral-900">
                  {role} login
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Access your {role.toLowerCase()} dashboard
                </p>
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="you@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                disabled={isLoading}
                type="submit"
                size="lg"
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
              >
                {isLoading ? "Logging in…" : "Log in"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Right image */}
      <div
        className="hidden lg:block lg:col-span-2"
        style={{
          backgroundImage: "url('/loginview-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
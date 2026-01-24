"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "../schemas/schemas";
import Link from "next/link";
import { cn } from "@/lib/utils";
import z from "zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

export const SignInView = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (response?.ok) {
        toast.success("Welcome back");
        router.push("/post-login");
      } else {
        toast.error("Invalid email or password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      {/* Left */}
      <div className="bg-neutral-100 h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-6 lg:p-16"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <Link href="/" className={cn("text-2xl font-bold", poppins.className)}>
                BJJ Mat
              </Link>
              <Link href="/list-your-gym" className="text-sm underline">
                List your gym
              </Link>
            </div>

            {/* Copy */}
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold">Log in</h1>
              <p className="text-neutral-600">
                Login to BJJ Mat
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
                    <Input {...field} />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CTA */}
            <Button
              disabled={isLoading}
              type="submit"
              size="lg"
              className="bg-black text-white hover:bg-neutral-800"
            >
              {isLoading ? "Logging in…" : "Log in"}
            </Button>

            <p className="text-xs text-neutral-500">
              New here?{" "}
              <Link href="/list-your-gym" className="underline">
                List your gym
              </Link>{" "}
              or explore academies.
            </p>
          </form>
        </Form>
      </div>

      {/* Right image */}
      <div
        className="hidden lg:block lg:col-span-2 h-screen"
        style={{
          backgroundImage: "url('/login-view-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
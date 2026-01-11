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
import { useState } from "react";
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

  const otherLogin = role === "Admin" ? "Student" : "Admin";

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (response?.ok) {
        const session = await getSession();

        toast.success("Login successful");
        if (session?.user.role === "ADMIN") {
          router.push(`${generateTenantURL(gymSlug)}/admin/dashboard`);
        } else {
          router.push(`${generateTenantURL(gymSlug)}/student/dashboard`);
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href={`${generateTenantURL(gymSlug)}`}>
                <span
                  className={cn("text-2xl font-sefmibold", poppins.className)}
                >
                  {gymName}
                </span>
              </Link>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-base border-none underline"
              >
                <Link
                  prefetch
                  href={`${generateTenantURL(
                    gymSlug
                  )}/${otherLogin.toLowerCase()}`}
                >
                  {otherLogin} Login
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">{role} Login</h1>

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
            <Button
              disabled={isLoading}
              type="submit"
              size="lg"
              variant="elevated"
              className="bg-black text-white hover:bg-blue-600 hover:text-black mt-4"
            >
              {isLoading ? "Logging in" : "Log in"}
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/loginview-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

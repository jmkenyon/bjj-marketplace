"use client";

import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterInput, registerSchema } from "../schemas/schemas";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { slugifyGymName } from "../lib/slugify";
import { useRouter } from "next/navigation";
import { generateTenantURL } from "../lib/utils";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

export const ListGymView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gymName: "",
      email: "",
      password: "",
    },
  });

  const gymName = useWatch({ control: form.control, name: "gymName" });
  const gymSlug = gymName ? slugifyGymName(gymName) : "";
  const showPreview = gymName && !form.formState.errors.gymName;

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    setIsLoading(true);
    const gymSlug = slugifyGymName(data.gymName);

    try {
      await axios.post("/api/register", {
        ...data,
        gymSlug,
      });

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      toast.success("Your gym is live 🎉");
      router.push(generateTenantURL(gymSlug));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        form.setError("gymName", {
          message: "This gym name is already listed",
        });
        return;
      }

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
              <Link
                href="/"
                className={cn("text-2xl font-bold", poppins.className)}
              >
                BJJ Mat
              </Link>
              <Link href="/login" className="text-sm underline">
                Log in
              </Link>
            </div>

            {/* Hero copy */}
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold">
                List your gym.
                <br />
                Get discovered by travelers.
              </h1>
              <p className="text-neutral-600 max-w-md">
                Join the marketplace for drop-ins and free trials. No contracts.
                Free to list.
              </p>
            </div>

            {/* Gym name */}
            <FormField
              control={form.control}
              name="gymName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gym name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jiu Jitsu Academy" />
                  </FormControl>
                  <FormDescription
                    className={cn("hidden", showPreview && "block")}
                  >
                    Your public page:
                    <strong className="ml-1">{gymSlug}.bjjmat.io</strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="owner@gym.com" />
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
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
                      >
                        {showPassword ? (
                          /* eye-off */
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.3 21.3 0 0 1 5.06-6.94" />
                            <path d="M1 1l22 22" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.3 21.3 0 0 1-5.06 6.94" />
                          </svg>
                        ) : (
                          /* eye */
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
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
              {isLoading ? "Creating gym..." : "List your gym for free"}
            </Button>

            <p className="text-xs text-neutral-500">
              You’ll be able to add drop-in pricing, waivers, and schedules
              after signup.
            </p>
          </form>
        </Form>
      </div>

      {/* Right image */}
      <div
        className="hidden lg:block lg:col-span-2 h-screen"
        style={{
          backgroundImage: "url('/list-your-gym.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

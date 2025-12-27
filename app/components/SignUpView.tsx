"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { registerSchema } from "../schemas/schemas";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useWatch } from "react-hook-form";





const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

export const SignUpView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()


  const form = useForm<z.infer<typeof registerSchema>>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });



  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    axios
      .post("/api/register", data)
      .then(() => {
        signIn("credentials", {
          username: data.username,
          email: data.email,
          password: data.password,
          redirect: false, 
        }).then((response) => {
          setIsLoading(false);
          if (response?.ok) {
            toast.success("Account created succesfully");
          }
        });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || "Something went wrong");
        if (error.response.status === 409) {
          router.push("/login")
        }
        setIsLoading(false);
      });
  };


  const username = useWatch({
    control: form.control,
    name: "username",
  });
  const usernameEror = form.formState.errors.username;

  const showPreview = username && !usernameEror;

  return (
    <div className="">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span
                  className={cn("text-2xl font-sefmibold", poppins.className)}
                >
                  BJJ Desk 
                </span>
              </Link>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-base border-none underline"
              >
                <Link prefetch href="/login">
                  Log in
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">
              Making management easy for bjj gyms
            </h1>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gym name</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-"/>
                  </FormControl>
                  <FormDescription
                    className={cn("hidden", showPreview && "block")}
                  >
                    Your gym will be available at&nbsp;
                    <strong>{username}</strong>.bjjdesk.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                className="bg-black text-white hover:bg-blue-600 mt-4"
            >
                Start your free trial
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

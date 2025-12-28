"use client";
import {  SubmitHandler, useForm } from "react-hook-form";
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

import { RegisterInput, registerSchema } from "../schemas/schemas";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

import axios from "axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useWatch } from "react-hook-form";
import { slugifyGymName } from "../lib/slugify";





const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

export const SignUpView = () => {
  const [isLoading, setIsLoading] = useState(false);



  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      gymName: "",
    },
  });


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
  
      toast.success("Account created successfully");
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };


  const gymName = useWatch({
    control: form.control,
    name: "gymName",
  });
  
  const gymSlug = gymName ? slugifyGymName(gymName) : "";

  const gymNameEror = form.formState.errors.gymName;

  const showPreview = gymName && !gymNameEror;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
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
              name="gymName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gym name</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-"/>
                  </FormControl>
                  <FormDescription
                    className={cn("hidden", showPreview && "block")}
                  >
                     Your gym will be available at{" "}
                     <strong>{gymSlug}.bjjdesk.com</strong>
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
          backgroundImage: "url('/free-trial-background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

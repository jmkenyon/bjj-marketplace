"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Gym } from "@prisma/client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface SettingsFormParams {
  gym: Gym;
}

const SettingsForm = ({ gym }: SettingsFormParams) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FieldValues>({
    defaultValues: {
      about: gym.about ?? "",
      address: gym.address ?? "",
      currency: gym.currency ?? "USD",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const payload = {
      ...data,
      gymId: gym.id,
    };
    try {
      await axios.put("/api/gym/information", payload);
      toast.success("Gym info saved!");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? "Request failed");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Gym information
          </h2>
          <p className="mt-1 max-w-prose text-sm text-slate-600">
            Update information displayed on your public gym page.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* About */}
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About the gym</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your gym, coaching style, and atmosphere"
                      className="min-h-30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123 Main Street, City, Country"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="GBP">£ GBP</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="pt-2">
              <Button
                disabled={isLoading}
                type="submit"
                size="lg"
                className="bg-black text-white hover:bg-neutral-800 transition"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </section>

      {/* PAYMENTS */}
      <section className="rounded-xl border bg-white p-6 shadow-sm mt-4">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Payments</h3>
            <p className="mt-1 text-sm text-neutral-600 max-w-prose">
              Connect Stripe to accept drop-in payments. We never see or store
              your bank details.
            </p>

            <p className="mt-3 text-sm">
              Status:{" "}
              {gym.stripeEnabled ? (
                <span className="font-medium text-green-600">Connected</span>
              ) : (
                <span className="font-medium text-neutral-500">
                  Not connected
                </span>
              )}
            </p>
          </div>

          <div className="shrink-0">
            {gym.stripeEnabled ? (
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "/api/stripe/dashboard";
                }}
              >
                Manage in Stripe
              </Button>
            ) : (
              <Button
                className="bg-black text-white hover:bg-neutral-800"
                onClick={() => {
                  window.location.href = "/api/stripe/connect";
                }}
              >
                Connect Stripe
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SettingsForm;

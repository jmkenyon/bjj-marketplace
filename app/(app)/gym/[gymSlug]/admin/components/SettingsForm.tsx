"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";

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
import LocationSelect, {
  CountrySelectValue,
} from "../../../components/LocationSelect";

import StripeBox from "./StripeBox";

interface SettingsFormParams {
  gym: Gym;
  adminEmail: string;
}

const SettingsForm = ({ gym, adminEmail }: SettingsFormParams) => {
  const router = useRouter();
  const [editingAddress, setEditingAddress] = useState(false);
  const [location, setLocation] = useState<CountrySelectValue | undefined>(
    undefined
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);

  const form = useForm<FieldValues>({
    defaultValues: {
      about: gym.about ?? "",
      address: gym.address ?? "",
      currency: gym.currency ?? "USD",
      country: gym.country ?? "",
      latitude: gym.latitude,
      longitude: gym.longitude,
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

  const handleCreateAccount = async () => {
    if (!gym.country) {
      toast.error("Please select a valid address");
      return;
    }
    setIsLoadingStripe(true);
    try {
      const res = await fetch("/api/gym/create-connect-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail, // OR admin email
          country: gym.country,
        }),
      });

      if (!res.ok) throw new Error("Failed to create Stripe account");

      const { onboardingUrl } = await res.json();

      // Redirect to Stripe onboarding
      window.location.href = onboardingUrl;
    } catch {
      toast.error("Failed to connect Stripe");
    } finally {
      setIsLoadingStripe(false);
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
              render={() => (
                <FormItem>
                  <FormLabel>Address</FormLabel>

                  {!editingAddress && gym.address ? (
                    <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                      <span className="text-neutral-700">{gym.address}</span>

                      <button
                        type="button"
                        onClick={() => setEditingAddress(true)}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <LocationSelect
                      value={location}
                      onChange={(val) => {
                        setLocation(val ?? undefined);

                        form.setValue("address", val?.label ?? "");
                        form.setValue("country", val?.country ?? "");
                        form.setValue("latitude", val?.latlng[0] ?? null);
                        form.setValue("longitude", val?.latlng[1] ?? null);
                      }}
                      placeholder="Search gym address"
                    />
                  )}
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
      <StripeBox
        gym={gym}
        isLoadingStripe={isLoadingStripe}
        handleCreateAccount={handleCreateAccount}
      />
    </>
  );
};

export default SettingsForm;

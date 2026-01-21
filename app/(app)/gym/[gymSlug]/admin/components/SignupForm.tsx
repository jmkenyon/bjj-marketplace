"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { RequiredLabel } from "@/app/lib/helpers";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Gym, Waiver } from "@prisma/client";

import CardPaymentMethod from "../../../components/CardPaymentMethod";
import PersonDetailsSection from "../../../components/PersonDetailsSection";
import WaiverCard from "./WaiverCard";
import SignUpCard from "./SignUpCard";
import { generateTenantURL } from "@/app/lib/utils";

interface SignupFormProps {
  waiver: Waiver | null;
  gym: Gym;
  freeTrial?: boolean;
}

const SignupForm = ({ waiver, gym, freeTrial }: SignupFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      street: "",
      city: "",
      postCode: "",
      county: "",
      country: "",
      contactName: "",
      contactNumber: "",
      relationship: "",
      signedWaiver: false,
      signature: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (waiver && (!data.signedWaiver || !data.signature)) {
      toast.error("Please sign the waiver to continue");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`/api/access?gym=${gym.slug}`, {
        ...data,
        isFreeTrial: freeTrial === true,
      });

      toast.success(freeTrial ? "Free trial booked!" : "Drop-in booked!");
      router.push(`${generateTenantURL(gym.slug)}/success`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? "Request failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-5xl space-y-12"
      >
        {/* NOTICE */}
        <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-neutral-900">
            {freeTrial
              ? "This is a free trial — no payment required"
              : "One-time drop-in visit"}
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            {freeTrial
              ? "You won’t be charged or subscribed to anything."
              : "Payment is required to confirm your visit."}
          </p>
        </div>

        {/* PERSONAL DETAILS */}
        <section className="rounded-xl border bg-white p-8 md:p-10 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold text-neutral-900">
            Your details
          </h2>
          <p className="mb-6 text-sm text-neutral-600">
            Let the gym know who to expect.
          </p>

          <PersonDetailsSection control={form.control} />
        </section>

        {/* ADDRESS */}
        <section className="rounded-xl border bg-white p-8 md:p-10 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold text-neutral-900">
            Address
          </h2>
          <p className="mb-6 text-sm text-neutral-600">
            Required for safety and insurance purposes.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "street", label: "Street address" },
              { name: "city", label: "City" },
              { name: "postCode", label: "Post code / ZIP" },
              { name: "county", label: "County / State" },
            ].map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                rules={{ required: `${label} is required` }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>{label}</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="country"
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Country</RequiredLabel>
                  </FormLabel>
                  <CountryDropdown
                    placeholder="Select country"
                    defaultValue={field.value}
                    onChange={(c) => field.onChange(c.alpha3)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* EMERGENCY CONTACT */}
        <section className="rounded-xl border bg-white p-8 md:p-10 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold text-neutral-900">
            Emergency contact
          </h2>
          <p className="mb-6 text-sm text-neutral-600">
            In case of injury during training.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="contactName"
              rules={{ required: "Contact name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Contact name</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              rules={{ required: "Contact number is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Contact number</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Relationship</SelectLabel>
                        <SelectItem value="PARENT">Parent</SelectItem>
                        <SelectItem value="SPOUSE">Spouse</SelectItem>
                        <SelectItem value="FAMILY_MEMBER">
                          Family member
                        </SelectItem>
                        <SelectItem value="FRIEND">Friend</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="rounded-xl border bg-white p-8 md:p-10 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold text-neutral-900">
            Create an account
          </h2>
          <p className="mb-6 text-sm text-neutral-600">
            So you can manage future visits easily.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* password + confirm password fields (unchanged) */}
          </div>
        </section>

        {waiver && <WaiverCard waiver={waiver} form={form} />}

        {!freeTrial && <CardPaymentMethod control={form.control} />}

        <SignUpCard
          isLoading={isLoading}
          title={freeTrial ? "Book your free trial" : "Confirm your drop-in"}
          subtitle={
            freeTrial
              ? "No payment required — just turn up and train"
              : "Payment required to secure your spot"
          }
        />
      </form>
    </Form>
  );
};

export default SignupForm;

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
import { DOBPicker } from "./DOBPicker";
import { RequiredLabel } from "@/app/lib/helpers";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Membership, Waiver } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePad } from "./SignaturePad";

interface SignupFormProps {
  memberships: Membership[];
  waiver: Waiver | null;
}

const SignupForm = ({ memberships, waiver }: SignupFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FieldValues>({
    defaultValues: {
      signedWaiver: false,
      signature: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (!data.signedWaiver || !data.signature) {
      toast.error("You must sign the waiver");
      return;
    }
    try {
      await axios.put("/api/new-user", data);
      toast.success("Update sent");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-6">Personal details</h2>

          <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              rules={{ required: "First name is required" }}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>First name</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input placeholder="e.g. John" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Last name</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Smith" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Gender</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-45 bg-white">
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                          <SelectItem value="OMITTED">
                            Prefer not to say
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              rules={{ required: "Phone number is required" }}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Phone number</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 07700 900000"
                      {...field}
                      type="tel"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Email</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. johnsmith@gmail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              rules={{ required: "Date of birth is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Date of birth</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <DOBPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-6">Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              rules={{ required: "Street Address is required" }}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Street Address</RequiredLabel>
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
              rules={{ required: "City is required" }}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>City</RequiredLabel>
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
              rules={{ required: "Post code is required" }}
              name="postCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Post Code/ Zip</RequiredLabel>
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
              rules={{ required: "County is required" }}
              name="county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>County</RequiredLabel>
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
              rules={{ required: "Country is required" }}
              name="county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <CountryDropdown
                    placeholder="Country"
                    defaultValue={field.value}
                    onChange={(country) => {
                      field.onChange(country.alpha3);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-6">Emergency contact</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              rules={{ required: "Contact name is required" }}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Contact name</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              rules={{ required: "Contact number is required" }}
              name="contactNumber"
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
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-45 bg-white">
                        <SelectValue placeholder="Relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value="PARENT">Parent</SelectItem>
                          <SelectItem value="SPOUSE">Spouse</SelectItem>
                          <SelectItem value="FAMILY MEMBER">
                            Family member
                          </SelectItem>
                          <SelectItem value="FRIEND">Friend</SelectItem>
                          <SelectItem value="GUARDIAN">Guadian</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-6">Membership</h2>

          <FormField
            control={form.control}
            name="membershipId"
            rules={{ required: "Please select a membership" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabel>Choose a membership</RequiredLabel>
                </FormLabel>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memberships.map((membership) => {
                    const selected = field.value === membership.id;

                    return (
                      <button
                        key={membership.id}
                        type="button"
                        onClick={() => field.onChange(membership.id)}
                        className={`
                rounded-lg border p-5 text-left transition
                cursor-pointer
                ${
                  selected
                    ? "border-black bg-slate-50 ring-2 ring-black"
                    : "hover:border-slate-400"
                }
              `}
                      >
                        <h3 className="text-lg font-semibold">
                          {membership.title}
                        </h3>

                        {membership.description && (
                          <p className="mt-1 text-sm text-slate-600">
                            {membership.description}
                          </p>
                        )}

                        <div className="mt-4 text-xl font-bold">
                          ${membership.price}
                          <span className="text-sm font-normal text-slate-500">
                            / month
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-6">Waiver</h2>

          <FormItem>
            <FormLabel>
              <RequiredLabel>Waiver</RequiredLabel>
            </FormLabel>

            <Textarea
              className="border p-3 rounded mb-4"
              readOnly
              value={waiver?.content}
            />
            <SignaturePad
              onSign={async (signature) => {
                form.setValue("signature", signature);
                form.setValue("signedWaiver", true);
                toast.success("Signature captured");
              }}
            />

            <FormMessage />
          </FormItem>
        </section>

        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-6">Account password</h2>

          <div className="flex flex-row gap-8">
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Create a password</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === form.getValues("password") ||
                  "Passwords do not match",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Confirm password</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>
      </form>
    </Form>
  );
};

export default SignupForm;

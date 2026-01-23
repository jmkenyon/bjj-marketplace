"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

interface StudentProfileFormProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    gender?: string | null;
    phone?: string | null;
    dateOfBirth?: string | null;
    street?: string | null;
    city?: string | null;
    postCode?: string | null;
    county?: string | null;
    country?: string | null;
    contactName?: string | null;
    contactNumber?: string | null;
    relationship?: string | null;
    email: string;
    belt: string | null;
  };
}

const BELTS = ["WHITE", "BLUE", "PURPLE", "BROWN", "BLACK"] as const;

export const StudentProfileForm = ({ user }: StudentProfileFormProps) => {
  const form = useForm<FieldValues>({
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      gender: user.gender ?? "UNSPECIFIED",
      phone: user.phone ?? "",
      dateOfBirth: user.dateOfBirth ?? "",
      street: user.street ?? "",
      city: user.city ?? "",
      postCode: user.postCode ?? "",
      county: user.county ?? "",
      country: user.country ?? "",
      contactName: user.contactName ?? "",
      contactNumber: user.contactNumber ?? "",
      relationship: user.relationship ?? "",
      belt: user.belt ?? "WHITE",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await axios.patch("/api/student/profile", data);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const selectedBelt = form.watch("belt") ?? "WHITE";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* PERSONAL INFO */}
        <section>
          <h3 className="mb-4 text-lg font-semibold">Personal information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField name="firstName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )} />

            <FormField name="lastName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )} />

            <FormField name="gender" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                    <SelectItem value="UNSPECIFIED">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            <FormField name="phone" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )} />

            <FormField name="dateOfBirth" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )} />
          </div>
        </section>


        {/* EMERGENCY CONTACT */}
        <section>
          <h3 className="mb-2 text-lg font-semibold">Emergency contact</h3>
          <p className="mb-4 text-sm text-slate-500">
            Optional, but recommended when training away from home.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField name="contactName" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><Input {...field} /></FormItem>
            )} />
            <FormField name="contactNumber" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Number</FormLabel><Input {...field} /></FormItem>
            )} />
            <FormField name="relationship" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Relationship</FormLabel><Input {...field} /></FormItem>
            )} />
          </div>
        </section>

        {/* BELT */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Belt</h3>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <Image
              src={`/${selectedBelt.toLowerCase()}.png`}
              alt={selectedBelt}
              width={80}
              height={20}
            />
            <div className="text-sm text-slate-600">
              Current belt: <span className="font-medium">{selectedBelt}</span>
            </div>
          </div>

          <FormField
            name="belt"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select belt</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BELTS.map((belt) => (
                      <SelectItem key={belt} value={belt}>
                        <div className="flex items-center gap-3">
                          <Image
                            src={`/${belt.toLowerCase()}.png`}
                            alt={belt}
                            width={50}
                            height={12}
                          />
                          <span>{belt}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </section>

        {/* ACCOUNT */}
        <section className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">
          <p><strong>Email:</strong> {user.email}</p>
          <p className="mt-1">
            Your account is portable across gyms you train at.
          </p>
        </section>

        <Button type="submit" className="bg-black text-white">
          Save changes
        </Button>
      </form>
    </Form>
  );
};
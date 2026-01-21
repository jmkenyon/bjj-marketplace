"use client";

import { RequiredLabel } from "@/app/lib/helpers";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { DOBPicker } from "./DOBPicker";
import { Control, FieldValues } from "react-hook-form";

interface PersonDetailsSectionProps {
  control: Control<FieldValues>;
}

const PersonDetailsSection = ({ control }: PersonDetailsSectionProps) => {
  return (
    <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
      <h2 className="text-xl font-bold mb-6">Personal details</h2>
      <p className="text-sm text-neutral-600 mb-6">
        Let the gym know who to expect on the mat.
      </p>

      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
                      <SelectItem value="OMITTED">Prefer not to say</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          rules={{ required: "Phone number is required" }}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel>Phone number</RequiredLabel>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. 07700 900000" {...field} type="tel" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
          control={control}
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
  );
};

export default PersonDetailsSection;

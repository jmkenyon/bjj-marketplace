"use client";

import { Form } from "@/components/ui/form";
import PersonDetailsSection from "../components/PersonDetailsSection";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Class, DropIn, Gym, Waiver } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import WaiverCard from "../[gymSlug]/admin/components/WaiverCard";
import SignUpCard from "../[gymSlug]/admin/components/SignUpCard";
import CardPaymentMethod from "../components/CardPaymentMethod";
import { generateTenantURL } from "@/app/lib/utils";

interface DropInViewProps {
  gym: Gym;
  waiver: Waiver | null;
  dropIn: DropIn;
  classes: Class[];
}

const DropInView = ({ gym, waiver, dropIn, classes }: DropInViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const router = useRouter();

  const form = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      signedWaiver: false,
      signature: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (waiver && (!data.signedWaiver || !data.signature)) {
      toast.error("Please sign the waiver to continue");
      setIsLoading(false);
      return;
    }

    if (!selectedClass) {
      toast.error("Please select a class");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`/api/access?gym=${gym.slug}`, {
        ...data,
        classId: selectedClass.id,
      });
      toast.success("Drop-in booked!");
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

  const currencySymbol =
    gym.currency === "GBP" ? "£" : gym.currency === "EUR" ? "€" : "$";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-4xl"
      >
        {/* Personal details */}

        {/* CLASS SELECTION */}
        <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">
            Choose a class
          </h2>
          <p className="mt-1 mb-4 text-sm text-neutral-600">
            Select the class you want to attend.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {classes.map((classItem) => {
              const isSelected = selectedClass?.id === classItem.id;

              return (
                <button
                  key={classItem.id}
                  type="button"
                  onClick={() => setSelectedClass(classItem)}
                  className={`rounded-lg border p-4 text-left transition
            ${
              isSelected
                ? "border-black bg-neutral-50 ring-2 ring-black"
                : "hover:border-neutral-400"
            }
          `}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-neutral-900">
                      {classItem.title}
                    </h3>

                    {classItem.isFree && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                        FREE
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-neutral-600">
                    {classItem.dayOfWeek} · {classItem.startTime} ·{" "}
                    {classItem.duration} min
                  </p>
                </button>
              );
            })}
          </div>

          {!selectedClass && (
            <p className="mt-3 text-sm text-red-600">
              Please select a class to continue
            </p>
          )}
        </section>

        <PersonDetailsSection control={form.control} />

        {/* Waiver */}
        {waiver && <WaiverCard waiver={waiver} form={form} />}

        {/* Payment */}
        {dropIn.fee > 0 && !selectedClass?.isFree && (
          <CardPaymentMethod
            control={form.control}
            title={`Drop-in fee: ${currencySymbol}${dropIn.fee}`}
            subtitle="Secure payment required to complete your booking"
          />
        )}

        {/* Confirm */}
        <SignUpCard
          isLoading={isLoading}
          title="Confirm drop-in"
          subtitle={
            selectedClass?.isFree
              ? "This class is free — no payment required"
              : "Review your details and complete your booking"
          }
        />
      </form>
    </Form>
  );
};

export default DropInView;

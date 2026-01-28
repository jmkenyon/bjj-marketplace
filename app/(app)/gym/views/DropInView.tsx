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
      sessionDate: "",
      email: "",
      dateOfBirth: "",
      signedWaiver: false,
      signature: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!data.sessionDate) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    if (waiver && (!data.signedWaiver || !data.signature)) {
      toast.error("Please sign the waiver");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ FREE CLASS
      if (selectedClass.isFree || dropIn.fee === 0) {
        await axios.post(`/api/access?gym=${gym.slug}`, {
          ...data,
          classId: selectedClass.id,
        });

        toast.success("Drop-in booked!");
        router.push(`${generateTenantURL(gym.slug)}/success`);
        return;
      }

      if (!gym.stripeAccountId) {
        toast.error("This gym has not set up payments yet");
        setIsLoading(false);
        return;
      }

      // 💳 PAID CLASS → Stripe
      const res = await axios.post("/api/stripe/checkout", {
        amount: dropIn.fee * 100,
        currency: gym.currency.toLowerCase(),
        gymStripeAccountId: gym.stripeAccountId,
        successUrl: `${generateTenantURL(gym.slug)}/success`,
        cancelUrl: window.location.href,
        metadata: {
          gymId: gym.id,
          classId: selectedClass.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          sessionDate: data.sessionDate,
        },
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch {
      toast.error("Something went wrong");
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

        <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Select a date
          </h2>

          <input
            type="date"
            {...form.register("sessionDate", { required: true })}
            className="mt-3 w-64 rounded-md border px-3 py-2 text-sm"
          />

          {form.formState.errors.sessionDate && (
            <p className="mt-2 text-sm text-red-600">Please select a date</p>
          )}
        </section>

        <PersonDetailsSection control={form.control} />

        {/* Waiver */}
        {waiver && <WaiverCard waiver={waiver} form={form} />}

        {/* Confirm */}
        <SignUpCard
          isLoading={isLoading}
          title={
            selectedClass?.isFree
              ? "Confirm drop-in"
              : `Pay ${currencySymbol}${dropIn.fee} & book`
          }
          subtitle={
            selectedClass?.isFree
              ? "This class is free — no payment required"
              : "Secure payment required to complete booking"
          }
        />
      </form>
    </Form>
  );
};

export default DropInView;

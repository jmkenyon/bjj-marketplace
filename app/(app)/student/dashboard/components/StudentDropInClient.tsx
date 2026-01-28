"use client";

import { useState } from "react";
import { Gym, Class, DropIn, Waiver } from "@prisma/client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

interface Props {
  gym: Gym;
  classes: Class[];
  dropIn: DropIn;
  waiver: Waiver | null;
  waiverSigned: boolean;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  };
}

export default function StudentDropInClient({
  gym,
  classes,
  dropIn,
  waiver,
  waiverSigned,
  user,
}: Props) {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionDate, setSessionDate] = useState<string>("");

  const currency =
    gym.currency === "GBP" ? "£" : gym.currency === "EUR" ? "€" : "$";

  const handleBook = async () => {
    if (!selectedClass) {
      toast.error("Select a class");
      return;
    }

    if (!sessionDate) {
      toast.error("Select a date");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/student/drop-in", {
        classId: selectedClass.id,
        sessionDate,
      });

      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
        return;
      }

      toast.success("Drop-in booked 🎉");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Book a drop-in</h1>
        <p className="text-neutral-600">
          Train at <span className="font-medium">{gym.name}</span>
        </p>
      </header>

      {/* Student summary */}
      <section className="rounded-xl border bg-white p-6 text-sm">
        <p className="text-neutral-600">Booking as</p>
        <p className="font-medium">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-neutral-500">{user.email ?? ""}</p>
      </section>

      {/* Class selection */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Choose a class</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {classes.map((c) => {
            const active = selectedClass?.id === c.id;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedClass(c)}
                className={`rounded-lg border p-4 text-left transition ${
                  active
                    ? "border-black bg-neutral-50 ring-2 ring-black"
                    : "hover:border-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{c.title}</p>
                  {c.isFree && (
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">
                      FREE
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {c.dayOfWeek} · {c.startTime} · {c.duration} min
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Date selection */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Choose a date</h2>

        <input
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full max-w-xs rounded-md border px-3 py-2 text-sm"
        />

        {!sessionDate && (
          <p className="text-sm text-red-600">Please select a date</p>
        )}
      </section>

      {/* Waiver */}
      {waiver && !waiverSigned && (
        <section className="rounded-xl border bg-yellow-50 p-6 text-sm">
          <p className="font-medium">Waiver required</p>
          <p className="text-neutral-600 mt-1">
            You’ll be asked to sign the waiver before completing your booking.
          </p>
        </section>
      )}

      {/* CTA */}
      <section className="rounded-xl border bg-white p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Drop-in fee</p>
          <p className="text-xl font-semibold">
            {selectedClass?.isFree ? "Free" : `${currency}${dropIn.fee}`}
          </p>
        </div>

        <Button
          disabled={loading || !selectedClass}
          onClick={handleBook}
          className="bg-black text-white"
        >
          {selectedClass?.isFree ? "Confirm booking" : "Pay & book"}
        </Button>
      </section>
    </main>
  );
}

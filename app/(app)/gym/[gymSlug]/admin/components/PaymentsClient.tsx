"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StripeBox from "./StripeBox";
import { Gym } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PaymentsClientProps {
  gym: Gym;
  stripeAccountId: string | null;
  stripeEnabled: boolean;
  adminEmail: string
}

export default function PaymentsClient({
  gym,
  stripeAccountId,
  stripeEnabled,
  adminEmail
}: PaymentsClientProps) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(stripeEnabled);
  const router = useRouter();

  // 🔁 Check Stripe status after redirect from onboarding
  useEffect(() => {
    if (!stripeAccountId || stripeEnabled) return;

    fetch("/api/gym/stripe-status")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setConnected(true);
          toast.success("Stripe connected 🎉");
        }
      })
      .catch(() => {
        toast.error("Failed to verify Stripe connection");
      });
  }, [stripeAccountId, stripeEnabled]);

  const handleCreateAccount = async () => {
    if (!gym.country) {
      toast.error("Please select a valid address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/gym/create-connect-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:  adminEmail,// OR admin email
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
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900">Payments</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Accept drop-in payments at {gym.name}. Payments go directly to your bank
        account.
      </p>

      <StripeBox
        isLoadingStripe={loading}
        handleCreateAccount={handleCreateAccount}
        gym={gym}
      />
      {connected && (
        <>
          <div className="mt-6 rounded-xl border bg-green-50 p-4 text-sm text-green-700">
            ✅ You’re ready to accept drop-ins. Customers pay you directly — we
            take a small platform fee automatically.
          </div>
          <div className="mt-6">
            <Button
              variant="destructive"
              onClick={async () => {
                await fetch("/api/stripe/disconnect", { method: "POST" });
                toast.success("Stripe disconnected");
                router.refresh();
              }}
            >
              Disconnect Stripe
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

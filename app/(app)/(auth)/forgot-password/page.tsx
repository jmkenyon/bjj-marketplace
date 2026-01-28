"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Enter your email");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/forgot-password", { email });
      toast.success("If an account exists, a reset link was sent");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 space-y-6">
        <h1 className="text-2xl font-semibold">Reset your password</h1>

        <p className="text-sm text-neutral-600">
          Enter your email and we’ll send you a reset link.
        </p>

        <Input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white"
        >
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </div>
    </main>
  );
}
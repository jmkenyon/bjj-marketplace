"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token || !password) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/reset-password", {
        token,
        password,
      });

      toast.success("Password updated");
      router.push("/login");
    } catch {
      toast.error("Reset link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 space-y-6">
        <h1 className="text-2xl font-semibold">Set new password</h1>

        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-black text-white"
        >
          {loading ? "Updating…" : "Update password"}
        </Button>
      </div>
    </main>
  );
}
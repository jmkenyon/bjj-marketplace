"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function CreatePasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (

        <div className="mx-auto mt-32 max-w-md text-center">
          <h1 className="text-xl font-semibold">Invalid link</h1>
          <p className="mt-2 text-sm text-neutral-600">
            This password link is invalid or expired.
          </p>
        </div>

    );
  }

  const handleSubmit = async () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/create-password", {
        token,
        password,
      });

      toast.success("Password created!");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Create your password
        </h1>

        <p className="mt-2 text-sm text-neutral-600">
          Set a password to manage bookings and skip forms next time.
        </p>

        <div className="mt-6 space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white hover:bg-neutral-800"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </div>
    </div>
  );
}

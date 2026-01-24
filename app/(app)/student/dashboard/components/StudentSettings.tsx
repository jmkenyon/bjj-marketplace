"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function StudentSettingsClient({
  user,
}: {
  user: {
    email: string;
    emailVerified: Date | null;
    createdAt: Date;
  };
}) {
  const deleteAccount = async () => {
    if (!confirm("This will permanently delete your account. Continue?")) {
      return;
    }

    try {
      await axios.delete("/api/student/account");
      toast.success("Account deleted");
      signOut({ callbackUrl: "/" });
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-neutral-600">
          Manage your account and security
        </p>
      </div>

      {/* ACCOUNT */}
      <section className="rounded-xl border bg-white p-6 space-y-3">
        <h2 className="font-semibold">Account</h2>

        <div className="text-sm text-neutral-600 space-y-1">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {user.emailVerified ? "Verified" : "Unverified"}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* SECURITY */}
      <section className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="font-semibold">Security</h2>
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => toast("Password reset coming soon")}
            className="bg-black text-white hover:bg-black/80 hover:text-white"
          >
            Change password
          </Button>

          <Button variant="outline" onClick={() => signOut()}>
            Log out
          </Button>
        </div>
      </section>

      {/* DANGER ZONE */}
      <section className="rounded-xl border border-red-200 bg-red-50 p-6 space-y-4">
        <h2 className="font-semibold text-red-700">Danger zone</h2>

        <p className="text-sm text-red-600">
          Deleting your account removes your profile, access passes, and history
          across all gyms.
        </p>

        <Button variant="destructive" onClick={deleteAccount}>
          Delete account
        </Button>
      </section>
    </div>
  );
}

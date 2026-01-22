
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import React from "react";

interface StudentsModalProps {
  user: User;
  children: React.ReactNode;
}

export function StudentsModal({ user, children }: StudentsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        {" "}
        <DialogHeader>
          <DialogTitle>
            {user.firstName} {user.lastName}
          </DialogTitle>
          <DialogDescription>
            Student details, access status, and actions
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          <div className="space-y-6">
            {/* Identity */}
            <section className="space-y-3">
              <h4 className="font-semibold text-sm text-slate-700">Identity</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>First name</Label>
                  <Input defaultValue={user.firstName ?? ""} readOnly/>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Last name</Label>
                  <Input defaultValue={user.lastName ?? ""} readOnly/>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input value={user.email} readOnly />
              </div>
            </section>

            {/* Contact */}
            <section className="space-y-3">
              <h4 className="font-semibold text-sm text-slate-700">Contact</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Phone</Label>
                  <Input defaultValue={user.phone ?? ""} readOnly/>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Gender</Label>
                  <Input value={user.gender ?? "—"} readOnly />
                </div>
              </div>
            </section>


            <div className="flex flex-col gap-2">
              <Label>Belt</Label>
          <Input value={user.belt ?? "WHITE"} readOnly />
            </div>

            {/* Meta */}
            <section className="text-sm text-slate-500">
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </section>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}

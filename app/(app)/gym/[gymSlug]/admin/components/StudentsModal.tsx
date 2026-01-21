import { GymWStudents } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface StudentsModalProps {
  user: GymWStudents["users"][number];
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
                <Input defaultValue={user.firstName ?? ""}/>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Last name</Label>
                <Input defaultValue={user.lastName ?? ""} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-3">
            <h4 className="font-semibold text-sm text-slate-700">Contact</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Phone</Label>
                <Input defaultValue={user.phone ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Gender</Label>
                <Input value={user.gender ?? "—"} disabled />
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="space-y-3">
            <h4 className="font-semibold text-sm text-slate-700">Address</h4>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Street" defaultValue={user.street ?? ""} />
              <Input placeholder="City" defaultValue={user.city ?? ""} />
              <Input
                placeholder="Postcode"
                defaultValue={user.postCode ?? ""}
              />
              <Input placeholder="Country" defaultValue={user.country ?? ""} />
            </div>
          </section>

          {/* Emergency contact */}
          <section className="space-y-3">
            <h4 className="font-semibold text-sm text-slate-700">
              Emergency contact
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="Name" defaultValue={user.contactName ?? ""} />
              <Input
                placeholder="Number"
                defaultValue={user.contactNumber ?? ""}
              />
              <Input
                placeholder="Relationship"
                defaultValue={user.relationship ?? ""}
              />
            </div>
          </section>

          {/* Access & membership */}
          <section className="space-y-3">
            <h4 className="font-semibold text-sm text-slate-700">
              Access & membership
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Access type</Label>
                <Input value={user.type} disabled />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Belt</Label>
                <Select defaultValue={user.belt ?? "WHITE"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["WHITE", "BLUE", "PURPLE", "BROWN", "BLACK"].map(
                      (belt) => (
                        <SelectItem key={belt} value={belt}>
                          {belt}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Membership</Label>
              <Input
                value={user.membership?.title ?? "No active membership"}
                disabled
              />
            </div>

            <div className="text-sm text-slate-500">
              Free trial used:{" "}
              <span className="font-medium">
                {user.hasUsedFreeTrial ? "Yes" : "No"}
              </span>
            </div>
          </section>

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
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="bg-black text-white hover:bg-slate-800">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

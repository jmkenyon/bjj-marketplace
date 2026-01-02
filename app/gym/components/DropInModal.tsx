"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Document, DropIn, Gym } from "@prisma/client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface DropInModalProps {
  gym: Gym;
  docs: Document[];
  dropIn: DropIn | null;
  dropInDocIds: string[] | undefined;
}

export function DropInModal({
  gym,
  docs,
  dropIn,
  dropInDocIds,
}: DropInModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  useEffect(() => {
    if (dropInDocIds) {
      setSelectedDocs(dropInDocIds);
    }
  }, [dropInDocIds]);

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      fee: dropIn?.fee,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        fee: data.fee,
        documents: selectedDocs,
        gymId: gym.id,
      };
      if (!dropIn) {
        await axios.post("/api/drop-in", {...payload, gymSlug: gym.slug});
        toast.success("Drop in settings created!");
      } else {
        await axios.put("/api/drop-in", {...payload, dropInId: dropIn.id});
        toast.success("Drop in settings updated!");
      }
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? "Request failed");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open && dropInDocIds) {
          setSelectedDocs(dropInDocIds);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-black hover:text-white">
          Drop-in Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Drop-in Settings</DialogTitle>
            <DialogDescription>
              Update fee and documents required
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4">
            <Label htmlFor="fee-1">Drop-in fee</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                $
              </span>
              <Input
                id="fee-1"
                type="text"
                className="pl-7"
                {...register("fee")}
              />
            </div>
            <Label htmlFor="documents">Documents to sign</Label>
            {docs.length === 0 ? (
              <p>No docs uploaded</p>
            ) : (
              <div>
                {docs.map((doc) => (
                  <div key={doc.id} className="mb-2">
                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked::bg-blue-950">
                      <Checkbox
                        id={doc.id}
                        value={doc.id}
                        checked={selectedDocs.includes(doc.id)}
                        onCheckedChange={(checked) => {
                          setSelectedDocs((prev) =>
                            checked
                              ? [...prev, doc.id]
                              : prev.filter((id) => id !== doc.id)
                          );
                        }}
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                      />
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                          {doc.title}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="pt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-black" disabled={isLoading}>
              {isLoading ? "Saving" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

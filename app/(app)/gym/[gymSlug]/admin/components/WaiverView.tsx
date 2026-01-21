"use client";


import { Textarea } from "@/components/ui/textarea";
import {  Waiver } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


import { WaiverModal } from "./WaiverModal";

interface WaiverViewProps {
  waiverContent: Waiver | null;
}

export function WaiverView({ waiverContent }: WaiverViewProps) {
  const router = useRouter();
  const [waiver, setWaiver] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (waiverContent?.content) {
      setWaiver(waiverContent.content);
    }
  }, [waiverContent]);

  const handleSave = async () => {
    if (!waiver.trim()) {
      toast.error("Waiver cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("/api/gym/waiver", { content: waiver });
      toast.success("Waiver saved");
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
    <section className="mt-10 rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Waiver</h2>
        <p className="mt-1 max-w-prose text-sm text-slate-600">
          Students must sign this before training.
        </p>
        <p className="mt-2 text-sm text-red-500">
          Updating this waiver will require all students to re-sign.
        </p>
      </div>

      <Textarea
        className="border p-3 rounded min-h-75"
        value={waiver}
        onChange={(e) => setWaiver(e.target.value)}
      />

      <div className="mt-6 flex justify-end">
    

      <WaiverModal isLoading={isLoading} handleSave={handleSave}/>
      </div>
    </section>
  );
}

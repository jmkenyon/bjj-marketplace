"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

import { DropIn, Gym } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserQRCode from "./QRCode";

interface QrViewProps {
  gym: Gym;
  dropIn: DropIn | null;
}

const QrView = ({ gym, dropIn }: QrViewProps) => {
  const [fee, setFee] = useState<number | "">(dropIn?.fee ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Title",
    contentRef: printRef,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/gym/drop-in", { fee });
      toast.success("Fee updated!");
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
    <section className="h-full bg-neutral-100">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Drop-in access</h2>
        <p className="mt-1 mb-2 text-sm text-slate-600 max-w-prose">
        Set your drop-in price for online bookings. The QR code can be displayed in your gym so walk-in visitors can sign the waiver and pay online.
        </p>
      </div>

      <section className="mt-5 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-row">
          <div className="max-w-50 mb-5">
            <Label className="mb-1  text-sm ">Drop-in fee</Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                {gym.currency === "GBP"
                  ? "£"
                  : gym.currency === "USD"
                  ? "$"
                  : "€"}
              </span>

              <Input
                type="number"
                min={0}
                step={1}
                value={fee}
                onChange={(e) =>
                  setFee(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="pl-7"
                placeholder="0"
              />
            </div>
          </div>
          <div className="ml-3 flex items-center">
            <Button
              className="bg-black"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Saving" : "Save fee"}
            </Button>
          </div>
        </div>

        {!dropIn ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border  bg-slate-50  text-center p-10">
            <h2 className="text-base font-semibold text-slate-800">
              Drop-in setup required
            </h2>
            <p className="max-w-sm text-sm text-slate-600">
              Please save your drop-in fee and required documents before
              generating a QR code.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-md border bg-slate-50 p-6">
            <div ref={printRef}>
              {dropIn.qrCode && <UserQRCode value={dropIn.qrCode} />}
            </div>

            <Button
              variant="outline"
              className="hover:bg-black hover:text-white"
              onClick={handlePrint}
            >
              Print QR Code
            </Button>
          </div>
        )}
      </section>
    </section>
  );
};

export default QrView;

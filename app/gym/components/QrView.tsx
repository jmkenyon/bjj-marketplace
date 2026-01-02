"use client";

import UserQRCode from "@/app/gym/components/QRCode";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { DropInModal } from "./DropInModal";
import { Document, DropIn, Gym } from "@prisma/client";

interface QrViewProps {
  gym: Gym;
  docs: Document[];
  dropIn: DropIn | null;
  dropInDocIds: string[] | undefined;
}

const QrView = ({ gym, docs, dropIn, dropInDocIds }: QrViewProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Title",
    contentRef: printRef,
  });
  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Drop-In Student QR Code</h2>
        <p className="mt-1 mb-2 text-sm text-slate-600 max-w-prose">
          Students can scan this QR code to sign required documents and pay for
          a drop-in class.
        </p>
        <DropInModal
          gym={gym}
          docs={docs}
          dropIn={dropIn}
          dropInDocIds={dropInDocIds}
        />
      </div>

      {!dropIn ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border  bg-slate-50  text-center p-10">
          <h2 className="text-base font-semibold text-slate-800">
            Drop-in setup required
          </h2>
          <p className="max-w-sm text-sm text-slate-600">
            Please save your drop-in fee and required documents before generating a QR code.
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
    </>
  );
};

export default QrView;

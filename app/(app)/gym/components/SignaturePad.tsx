"use client";

import SignatureCanvas from "react-signature-canvas";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import toast from "react-hot-toast";

interface SignaturePadProps {
  onSign: (signature: string) => Promise<void>;
  disabled?: boolean;
}



export function SignaturePad({ onSign, disabled }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      toast.error("Please provide a signature");
      return;
    }

    const signature = sigRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    setIsLoading(true);
    await onSign(signature);
    setIsLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed rounded-md p-2 max-w-md">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          minWidth={2}
          maxWidth={4}
          canvasProps={{ className: "w-full h-32" }}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => sigRef.current?.clear()}
          disabled={disabled || isLoading}
        >
          Clear
        </Button>

        <Button
          onClick={handleSave}
          type="button"
          disabled={disabled || isLoading}
          className="bg-black text-white"
        >
          {isLoading ? "Signing…" : "Sign Waiver"}
        </Button>
      </div>
    </div>
  );
}
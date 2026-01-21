import { RequiredLabel } from "@/app/lib/helpers";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePad } from "../../../components/SignaturePad";
import toast from "react-hot-toast";
import { Waiver } from "@prisma/client";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface WaiverCardProps {
    waiver: Waiver
    form: UseFormReturn<FieldValues>;

}


const WaiverCard = ({waiver, form}: WaiverCardProps) => {
  return (
    <section className="shadow-sm border bg-white p-8 md:p-10 rounded-lg mb-10">
    <h2 className="text-xl font-bold mb-2">Waiver</h2>
    <p className="text-sm text-slate-600 mb-6 max-w-prose">
      Please read and sign the waiver below before continuing.
    </p>

    <FormItem>
      <FormLabel className="mb-2 block">
        <RequiredLabel>Liability waiver</RequiredLabel>
      </FormLabel>

      {/* Waiver text */}
      <div className="mb-6 rounded-md border bg-slate-50">
        <Textarea
          className="border-0 bg-transparent p-4 text-sm leading-relaxed resize-none min-h-55"
          readOnly
          value={waiver.content}
        />
      </div>

      {/* Signature */}

      <p className="mb-3 text-sm font-medium text-slate-700">Signature</p>

      <SignaturePad
        onSign={async (signature) => {
          form.setValue("signature", signature);
          form.setValue("signedWaiver", true);
          toast.success("Signature captured");
        }}
      />

      <FormMessage />
    </FormItem>
  </section>
  )
}

export default WaiverCard
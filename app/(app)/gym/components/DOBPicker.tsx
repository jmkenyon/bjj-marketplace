"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DOBPickerProps {
  value?: string | Date;
  onChange: (value: string) => void; // always return string
}

export function DOBPicker({ value, onChange }: DOBPickerProps) {
  const [open, setOpen] = React.useState(false);

  // normalize to Date for UI
  const dateValue =
    typeof value === "string" ? (value ? new Date(value) : undefined) : value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-48 justify-between font-normal"
        >
          {dateValue ? dateValue.toLocaleDateString("en-GB") : "dd/mm/yyyy"}
          <ChevronDownIcon className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (!date) return;

            // emit YYYY-MM-DD string
            // emit YYYY-MM-DD string using local date (avoids UTC shift)
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            onChange(`${yyyy}-${mm}-${dd}`);

            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

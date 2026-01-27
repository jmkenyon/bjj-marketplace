"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Filters({
  showFreeClassesOnly,
  setShowFreeClassesOnly,
}: {
  showFreeClassesOnly: boolean;
  setShowFreeClassesOnly: (v: boolean) => void;
}) {
  const checkboxId = "free-classes-only";
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={checkboxId}
        checked={showFreeClassesOnly}
        onCheckedChange={(v) => setShowFreeClassesOnly(Boolean(v))}
      />
      <Label htmlFor={checkboxId}>Free classes available</Label>
    </div>
  );
}

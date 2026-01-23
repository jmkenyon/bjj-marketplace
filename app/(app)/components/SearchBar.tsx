"use client";

import { Input } from "@/components/ui/input";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Input
      placeholder="Search gyms or locations..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:max-w-sm"
    />
  );
}
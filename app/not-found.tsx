"use client";

import { Suspense } from "react";
import EmptyState from "./(app)/components/EmptyState";

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmptyState />
    </Suspense>
  );
}

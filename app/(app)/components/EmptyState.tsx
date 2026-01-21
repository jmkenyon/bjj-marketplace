"use client";

import { memo } from "react";

interface EmptyState {
  title?: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyState> = ({
  title = "Page not found",
  subtitle = "The page you are looking for does not exist",
}) => {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="flex flex-col items-center text-center gap-3 px-4">
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-md">{subtitle}</p>
      </div>
    </div>
  );
};
export default memo(EmptyState);

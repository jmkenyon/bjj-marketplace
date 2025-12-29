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
    <div className="bg-neutral-100 h-screen"
        
    >
     

      <div
        className="
        flex
        flex-col
        gap-2
        justify-center
        sm:items-center
        items-start
         h-[60vh]
    "
      >
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-lg">{subtitle}</p>
      </div>
    </div>
  );
};

export default memo(EmptyState);

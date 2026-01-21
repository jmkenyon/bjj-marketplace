"use client";

import { generateTenantURL } from "@/app/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

interface PanelItemProps {
  icon: IconType;
  title: string;
  URLOveride?: string;
  gymSlug: string;
  type: "admin" | "student";
}

const PanelItem = ({
  icon: Icon,
  title,
  URLOveride,
  gymSlug,
  type,
}: PanelItemProps) => {
  const pathname = usePathname();
  const slug = URLOveride ?? title.toLowerCase();
  const href = `${generateTenantURL(gymSlug)}/${type}/dashboard/${slug}`;

  const active =
    pathname === href || pathname.endsWith(`/${slug}`);

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-center md:justify-start gap-3 rounded-lg px-3 py-3 text-sm font-medium transition",
        "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        active && "bg-neutral-900! text-white!"
      )}
    >
      <Icon
        size={18}
        className={cn(
          "shrink-0 transition-colors",
          active
            ? "text-white"
            : "text-neutral-400 group-hover:text-neutral-700"
        )}
      />

      {/* Hide text on mobile */}
      <span className="hidden md:block truncate">
        {title}
      </span>
    </Link>
  );
};

export default PanelItem;
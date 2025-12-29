"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons/lib";

interface PanelItemProps {
  icon: IconType;
  title: string;
  URLOveride?: string;
  gymSlug: string;
}

const PanelItem = ({
  icon: Icon,
  title,
  URLOveride,
  gymSlug
}: PanelItemProps) => {
    const pathname = usePathname()
    const active = pathname.endsWith(URLOveride ? URLOveride : title.toLowerCase())

  return (
    <Link href={`/gym/${gymSlug}/admin/dashboard/${URLOveride ?? title.toLowerCase()}`}>
      <li className={cn("flex flex-row items-center gap-3 cursor-pointer transition-colors hover:bg-blue-600 p-5",
      active && "bg-blue-600  font-semibold text-white/90"

      )}>
        <Icon size={20} />
        <p>{title}</p>
      </li>
    </Link>
  );
};

export default PanelItem;

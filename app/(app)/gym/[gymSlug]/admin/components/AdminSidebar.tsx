"use client";

import PanelItem from "./PanelItem";
import { PiStudent } from "react-icons/pi";
import { BsQrCode } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";
import { IconType } from "react-icons";

interface AdminSidebarProps {
  gymSlug: string;
}

interface SidebarItem {
  title: string;
  icon: IconType;
  URLOveride?: string;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Gym",
    items: [
      {
        title: "Gym Info",
        icon: IoMdInformationCircleOutline,
        URLOveride: "information",
      },
      {
        title: "Students",
        icon: PiStudent,
      },
      {
        title: "Timetable",
        icon: FaRegCalendarAlt,
      },
    ],
  },
  {
    label: "Access",
    items: [
      {
        title: "Drop-in Settings",
        icon: BsQrCode,
        URLOveride: "drop-in",
      },
      {
        title: "Waiver",
        icon: IoDocumentTextOutline,
      },
    ],
  },
  // {
  //   label: "Settings",
  //   items: [
  //     {
  //       title: "Payments",
  //       icon: MdOutlinePayments,
  //     },
  //   ],
  // },
];

const AdminSidebar = ({ gymSlug }: AdminSidebarProps) => {
  return (
    <nav className="flex flex-col sm:gap-6 p-4">
      {SIDEBAR_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400 hidden md:block">
            {section.label}
          </p>

          <div className="flex flex-col gap-1">
            {section.items.map((item) => (
              <PanelItem
                key={item.title}
                title={item.title}
                icon={item.icon}
                URLOveride={item.URLOveride}
                gymSlug={gymSlug}
                type="admin"
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default AdminSidebar;
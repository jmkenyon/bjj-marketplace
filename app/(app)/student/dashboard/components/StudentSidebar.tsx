"use client";

import PanelItem from "../../../gym/[gymSlug]/admin/components/PanelItem";
import { IconType } from "react-icons";
import { CgProfile } from "react-icons/cg";
import { MdOutlinePayments } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

interface SidebarItem {
  title: string;
  icon: IconType;
  URLOveride?: string;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const STUDENT_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Training",
    items: [
      {
        title: "Gyms Trained At",
        icon: FaHistory,
        URLOveride: "gyms",
      },
    ],
  },
  {
    label: "Payments",
    items: [
      {
        title: "Payments",
        icon: MdOutlinePayments,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile",
        icon: CgProfile,
      },
      {
        title: "Settings",
        icon: IoSettingsOutline,
      },
    ],
  },
];

const StudentSidebar = () => {
  return (
    <nav className="flex flex-col sm:gap-6 p-4">
      {STUDENT_SIDEBAR_SECTIONS.map((section) => (
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
                type="student"
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default StudentSidebar;

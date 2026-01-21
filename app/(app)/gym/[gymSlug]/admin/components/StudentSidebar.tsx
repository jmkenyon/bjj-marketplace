"use client";

import PanelItem from "./PanelItem";
import { CgProfile } from "react-icons/cg";



interface StudentSidebarProps {
  gymSlug: string;
}

const StudentSidebar = ({ gymSlug }: StudentSidebarProps) => {
  return (
    <ul className="flex flex-col">
      <PanelItem
        title="Profile"
        icon={CgProfile}
        gymSlug={gymSlug}
        type="student"
      />
            <PanelItem
        title="test"
        icon={CgProfile}
        gymSlug={gymSlug}
        type="student"
      />
    </ul>
  );
};

export default StudentSidebar;

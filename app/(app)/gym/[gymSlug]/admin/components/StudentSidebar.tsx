"use client";

import PanelItem from "./PanelItem";
import { CgProfile } from "react-icons/cg";

const StudentSidebar = () => {
  return (
    <ul className="flex flex-col">
      <PanelItem title="Profile" icon={CgProfile} type="student" />
      <PanelItem title="test" icon={CgProfile} type="student" />
    </ul>
  );
};

export default StudentSidebar;

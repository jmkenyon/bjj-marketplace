"use client";

import { PiStudent } from "react-icons/pi";
import { MdOutlinePayments } from "react-icons/md";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { BsQrCode } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { CiCreditCard1 } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";


import PanelItem from "./PanelItem";

interface OptionsPanelProps {
  gymSlug: string;
}

const OptionsPanel = ({ gymSlug }: OptionsPanelProps) => {
  return (
    <section className="w-75 border-r-2 border-black h-full shadow-accent bg-blue-400">
      <ul className="flex flex-col">
        <PanelItem title="Students" icon={PiStudent} gymSlug={gymSlug} />
        <PanelItem
          title="Memberships"
          icon={MdOutlinePayments}
          gymSlug={gymSlug}
        />
        <PanelItem
          title="Documents"
          icon={MdOutlineDocumentScanner}
          gymSlug={gymSlug}
        />
        <PanelItem
          title="QR drop-in"
          icon={BsQrCode}
          URLOveride="qr-code"
          gymSlug={gymSlug}
        />
        <PanelItem
          title="Classes"
          icon={FaRegCalendarAlt}
          gymSlug={gymSlug}
        />
        <PanelItem
          title="Settings"
          icon={IoSettingsOutline}
          gymSlug={gymSlug}
        />
        <PanelItem
          title="Subscription"
          icon={CiCreditCard1}
          gymSlug={gymSlug}
        />
      </ul>
    </section>
  );
};

export default OptionsPanel;

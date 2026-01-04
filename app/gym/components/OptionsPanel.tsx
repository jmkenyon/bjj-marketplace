"use client";

import { PiStudent } from "react-icons/pi";
import { MdOutlinePayments } from "react-icons/md";

import { BsQrCode } from "react-icons/bs";
import { CiCreditCard1 } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";


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
          title="Waiver"
          icon={IoDocumentTextOutline}
          gymSlug={gymSlug}
        />
        <PanelItem
          title="QR drop-in"
          icon={BsQrCode}
          URLOveride="qr-code"
          gymSlug={gymSlug}
        />
        <PanelItem
          title="Timetable"
          icon={FaRegCalendarAlt}
          gymSlug={gymSlug}
        />

        <PanelItem
          title="Subscription"
          icon={CiCreditCard1}
          gymSlug={gymSlug}
        />
        <PanelItem
          title="Gym info"
          URLOveride="information"
          icon={IoMdInformationCircleOutline}
          gymSlug={gymSlug}
        />
      </ul>
    </section>
  );
};

export default OptionsPanel;

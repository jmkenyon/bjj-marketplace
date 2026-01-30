"use client";

import dynamic from "next/dynamic";

const GymMap = dynamic(() => import("../components/Map"), { ssr: false });

interface GymMapClientProps {
  lat: number;
  lng: number;
}

const GymMapClient = ({ lat, lng }: GymMapClientProps) => {

  return <GymMap center={[lat, lng]} />;
};

export default GymMapClient;

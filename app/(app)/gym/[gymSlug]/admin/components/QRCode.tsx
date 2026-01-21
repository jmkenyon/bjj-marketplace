"use client";

import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function UserQRCode({ value }: { value: string }) {
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: 256,
      margin: 2,
    }).then(setQr);
  }, [value]);

  if (!qr) return null;

  return <Image src={qr} alt="QR Code" width={200} height={200}   className="print:w-200 print:h-200"/>;
}
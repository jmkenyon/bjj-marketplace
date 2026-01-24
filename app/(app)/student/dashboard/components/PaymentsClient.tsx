"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  gym: { name: string };
}

export default function PaymentsClient() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/student/payments")
      .then(res => setPayments(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-neutral-500">Loading payments…</p>;
  }

  if (!payments.length) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-neutral-600">
        You haven’t made any payments yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-neutral-50">
          <tr>
            <th className="p-3 text-left">Gym</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-right">Amount</th>
            <th className="p-3 text-right">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-3">{p.gym.name}</td>
              <td className="p-3">{p.description}</td>
              <td className="p-3 text-right">
                {(p.amount / 100).toFixed(2)} {p.currency}
              </td>
              <td className="p-3 text-right">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
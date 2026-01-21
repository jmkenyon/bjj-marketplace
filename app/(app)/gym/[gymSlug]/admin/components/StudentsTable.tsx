"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { StudentsModal } from "./StudentsModal";
import { User } from "@prisma/client";

interface StudentsTableProps {
  students: User[];
}

const StudentsTable = ({ students }: StudentsTableProps) => {
  return (
    <section className="rounded-xl border bg-white shadow-sm p-6">
      <Table>
        <TableCaption>
          People who have trained at your gym
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Belt</TableHead>
            <TableHead>First visit</TableHead>
            <TableHead className="text-right">History</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((user) => (
            <StudentsModal key={user.id} user={user}>
              <TableRow className="cursor-pointer hover:bg-neutral-50 transition">
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>

                <TableCell className="text-neutral-600">
                  {user.email}
                </TableCell>

                <TableCell>
                  <Image
                    alt={`${user.belt ?? "WHITE"} belt`}
                    src={`/${(user.belt ?? "WHITE").toLowerCase()}.png`}
                    width={32}
                    height={32}
                  />
                </TableCell>

                <TableCell className="text-sm text-neutral-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <button
                    className="
                      inline-flex h-9 w-9 items-center justify-center
                      rounded-md border text-neutral-600
                      hover:bg-neutral-100 hover:text-neutral-900
                      transition
                    "
                    aria-label="View training history"
                  >
                    <FaFileInvoiceDollar size={18} />
                  </button>
                </TableCell>
              </TableRow>
            </StudentsModal>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total trained</TableCell>
            <TableCell className="text-right">
              {students.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
};

export default StudentsTable;
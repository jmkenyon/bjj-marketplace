import { GymWStudents } from "@/app/types/types";
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

interface StudentsTableProps {
  gym: GymWStudents;
}

const StudentsTable = ({ gym }: StudentsTableProps) => {
  return (
    <section className="mt-5 rounded-lg border bg-white p-6 shadow-sm mb-6">
      <Table>
        <TableCaption>A list of your current students.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Belt</TableHead>
            <TableHead>Joined on</TableHead>
            <TableHead className="text-right">Payment history</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gym.users.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{user.firstName}{" "}{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Image
                  alt={`${user.belt?.toLowerCase()} belt`}
                  src={`/${user.belt?.toLowerCase()}.png`}
                  width={50}
                  height={50}
                  className="relative -left-2"
                />
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                <button
                  className="inline-flex items-center justify-center mr-4
               h-11 w-11
               rounded-full
               border border-slate-300
               bg-white
               text-slate-700
               hover:bg-slate-100
               hover:border-slate-400
               cursor-pointer
               transition"
                  aria-label="View invoice"
                >
                  <FaFileInvoiceDollar size={20} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Students</TableCell>
            <TableCell className="text-right">{gym.users.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
};

export default StudentsTable;

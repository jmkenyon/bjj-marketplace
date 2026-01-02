import { start_time } from "@/app/free-trial/data";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Class } from "@prisma/client";

interface CalenderProps {
  classes: Class[];
}

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const Calendar = ({ classes }: CalenderProps) => {
  const HOURS = start_time;

  const getClassForSlot = (day: string, time: string) =>
    classes.find((c) => c.dayOfWeek === day && c.startTime === time);

  const ClassExistsAtTime = (time: string) =>
    classes.find((c) => c.startTime === time);

  return (
    <section className=" bg-white p-6 shadow-sm mb-6">
      <Table>
        <TableCaption>Your weekly timetable</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Monday</TableHead>
            <TableHead>Tuesday</TableHead>
            <TableHead>Wednesday</TableHead>
            <TableHead>Thursday</TableHead>
            <TableHead>Friday</TableHead>
            <TableHead>Saturday</TableHead>
            <TableHead>Sunday</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {HOURS.filter(ClassExistsAtTime).map((hour) => (
            <TableRow key={hour}>
              {/* Time column */}

              <TableCell className="sticky left-0 bg-white font-medium text-slate-600 h-20">
                {hour}
              </TableCell>

              {/* Days */}
              {DAYS.map((day) => {
                const classItem = getClassForSlot(day, hour);

                return (
                  <TableCell key={day} className="align-center">
                    {classItem ? (
                      <div className="rounded-md bg-blue-100 p-2 text-sm font-medium">
                        {classItem.title}
                        <div className="text-xs text-slate-600">
                          {classItem.duration} min
                        </div>
                      </div>
                    ) : null}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>Total classes</TableCell>
            <TableCell className="text-right">15</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
};

export default Calendar;

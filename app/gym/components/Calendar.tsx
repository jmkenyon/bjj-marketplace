import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell, TableFooter } from "@/components/ui/table";


const Calendar = () => {
  return (

  <section className="mt- bg-white p-6 shadow-sm mb-6">
  <Table>
    <TableCaption>Your weekly timetable</TableCaption>
    <TableHeader>
      <TableRow>
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
        <TableRow>
          <TableCell className="font-medium"></TableCell>
          <TableCell></TableCell>
          <TableCell>
          </TableCell>
          <TableCell>

          </TableCell>
          <TableCell className="text-right">
       
          </TableCell>
        </TableRow>

    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={7}>Total classes</TableCell>
        <TableCell className="text-right"></TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</section>
  )
}

export default Calendar
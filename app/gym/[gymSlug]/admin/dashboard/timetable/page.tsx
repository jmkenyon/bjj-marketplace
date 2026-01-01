import Calendar from "@/app/gym/components/Calendar";


const page = () => {
  return (
    <section className="mt-5 rounded-lg border bg-white p-6 shadow-sm mb-6">
    <div className="mb-6">
    <h2 className="text-lg font-semibold">Weekly timetable</h2>
    <p className="mt-1 max-w-prose text-sm text-slate-600">
      Update your weekly timetable here
    </p>
  </div>
  <Calendar/>

    </section>
  );
};

export default page;

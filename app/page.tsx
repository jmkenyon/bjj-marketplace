import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="h-screen bg-neutral-100">
      <Navbar />
      <section>
        <div className="flex flex-col mt-20 pl-20  max-w-2xl">
          <h2 className="text-4xl font-semibold mb-10">
            BJJ gym management software at an affordable price
          </h2>
          <h3 className="text-base mb-20">
            Become a founding member and sign up for a{" "}
            <span className="font-bold">
              locked-in lifetime fee of $15 a month
            </span>
          </h3>
          <h3 className="text-base mb-20">
          Try it out today with out{" "}
            <span className="font-bold">
            30-day free trial!
            </span>
          </h3>

        </div>
     
      </section>
    </main>
  );
}

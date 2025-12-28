import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="h-screen bg-neutral-100">
      <Navbar />
      <section className="flex flex-row mt-20">
        <div className="flex flex-col pl-20 pt-15 max-w-2xl">
          <h2 className="text-4xl font-semibold mb-10">
            BJJ gym management software at an affordable price
          </h2>
          <h3 className="text-base mb-5">
            Become a founding member and sign up for a locked-in{" "}
            <span className="font-bold">
               lifetime fee of $15 a month
            </span>
          </h3>
          <h3 className="text-base">
            Try it out today with out{" "}
            <span className="font-bold">30-day free trial!</span>
          </h3>
        </div>
        <div className="px-20 ">
          <Image
            src={"/hero-image.jpg"}
            alt="hero image"
            className="object-cover rounded-2xl"
            width={800}
            height={800}
          />
        </div>
      </section>
    </main>
  );
}

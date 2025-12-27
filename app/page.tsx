import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="h-screen bg-neutral-100">
      <Navbar />
      <section className="flex flex-row">
        <div className="flex flex-col mt-20 pl-20 items-center max-w-2xl">
          <h2 className="text-4xl font-semibold mb-10">
            Management software tailored for BJJ gyms at an affordable price
          </h2>
          <h3 className="text-base mb-20">
            Become a founding member and sign up for a{" "}
            <span className="font-bold">
              locked-in lifetime fee of $50 a month
            </span>
          </h3>
          <h4>Try it out today with out <span className="font-bold">30-day free trial!</span></h4>
        </div>
        <div className="overflow-hidden  p-10">
          <Image
            alt="hero image of a jiu jitsu match"
            src={"/hero-image.webp"}
            priority
            width={800}
            height={800}
            className="rounded-3xl opacity-90"
          />
        </div>
      </section>
    </main>
  );
}

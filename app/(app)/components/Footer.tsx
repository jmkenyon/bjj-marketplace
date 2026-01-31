import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href={process.env.NEXT_PUBLIC_APP_URL ?? "https://bjjmat.io"} className="text-lg font-semibold cursor-pointer">
              BJJ Mat
            </Link>
            <p className="text-sm text-neutral-600">
              The easiest way to find drop-ins and free trials at BJJ gyms
              worldwide.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className="hover:underline">
                  Find gyms
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:underline">
                  How it works
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Gym Owners */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Gym Owners
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/list-your-gym" className="hover:underline">
                  List your gym
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:underline">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} BJJ Mat. All rights reserved.</p>
          <p>Built by practitioners, for practitioners 🥋</p>
        </div>
      </div>
    </footer>
  );
}

export default function PrivacyPage() {
  const LAST_UPDATED = "24 January 2026"
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-neutral-800">
        <h1 className="text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
  
        <p className="mt-4 text-sm text-neutral-600">
          Last updated: {LAST_UPDATED}
        </p>
  
        <section className="mt-10 space-y-6 text-sm leading-relaxed">
          <p>
            Your privacy matters to us. This policy explains how BJJ Mat collects,
            uses, and protects your information.
          </p>
  
          <h2 className="text-lg font-semibold">1. Information we collect</h2>
          <p>
            We may collect:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email, and contact details</li>
            <li>Booking and attendance data</li>
            <li>Waiver signatures (stored securely)</li>
            <li>Basic usage and analytics data</li>
          </ul>
  
          <h2 className="text-lg font-semibold">2. How we use your data</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process bookings and payments</li>
            <li>To send booking confirmations and account emails</li>
            <li>To help gyms manage attendance</li>
            <li>To improve the platform</li>
          </ul>
  
          <h2 className="text-lg font-semibold">3. Payments</h2>
          <p>
            Payment information is handled by third-party providers such as Stripe.
            BJJ Mat does not store full payment details.
          </p>
  
          <h2 className="text-lg font-semibold">4. Data sharing</h2>
          <p>
            Your data is shared only when necessary:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With gyms you book classes at</li>
            <li>With service providers (email, payments)</li>
            <li>If legally required</li>
          </ul>
  
          <h2 className="text-lg font-semibold">5. Data retention</h2>
          <p>
            We retain personal data only as long as necessary to provide the service
            or meet legal requirements.
          </p>
  
          <h2 className="text-lg font-semibold">6. Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal
            data by contacting us.
          </p>
  
          <h2 className="text-lg font-semibold">7. Security</h2>
          <p>
            We take reasonable measures to protect your data, but no system is
            completely secure.
          </p>
  
          <h2 className="text-lg font-semibold">8. Contact</h2>
          <p>
            Questions about privacy? Email{" "}
            <a
              href="mailto:contact@bjjdesk.io"
              className="font-medium underline"
            >
              contact@bjjdesk.io
            </a>
            .
          </p>
        </section>
      </div>
    );
  }
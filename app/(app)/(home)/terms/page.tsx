const TermsPage = ()  => {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-neutral-800">
        <h1 className="text-3xl font-semibold tracking-tight">
          Terms of Service
        </h1>
  
        <p className="mt-4 text-sm text-neutral-600">
          Last updated: {new Date().toLocaleDateString("en-GB")}
        </p>
  
        <section className="mt-10 space-y-6 text-sm leading-relaxed">
          <p>
            Welcome to <strong>BJJ Desk</strong>. By accessing or using our platform,
            you agree to be bound by these Terms of Service.
          </p>
  
          <h2 className="text-lg font-semibold">1. What BJJ Desk does</h2>
          <p>
            BJJ Desk is a marketplace that helps Brazilian Jiu-Jitsu gyms manage
            drop-ins, bookings, waivers, and payments, and helps students discover
            and book training sessions.
          </p>
  
          <h2 className="text-lg font-semibold">2. Accounts</h2>
          <p>
            You may use BJJ Desk without creating an account for drop-in bookings.
            Creating an account allows you to manage bookings and personal details.
          </p>
  
          <p>
            You are responsible for keeping your account secure and for all activity
            under your account.
          </p>
  
          <h2 className="text-lg font-semibold">3. Payments</h2>
          <p>
            Payments are processed securely via third-party providers (e.g. Stripe).
            BJJ Desk does not store your card or bank details.
          </p>
  
          <p>
            Drop-in prices, refunds, and class availability are determined by each gym.
          </p>
  
          <h2 className="text-lg font-semibold">4. Waivers & training risk</h2>
          <p>
            Brazilian Jiu-Jitsu is a physical sport with inherent risks. By booking or
            attending a class, you acknowledge that you participate at your own risk.
          </p>
  
          <p>
            Any waivers you sign are between you and the gym, not BJJ Desk.
          </p>
  
          <h2 className="text-lg font-semibold">5. Gym responsibilities</h2>
          <p>
            Gyms are responsible for the accuracy of their listings, schedules,
            pricing, and compliance with local laws.
          </p>
  
          <h2 className="text-lg font-semibold">6. Prohibited use</h2>
          <p>
            You agree not to misuse the platform, attempt unauthorised access,
            scrape data, or interfere with the service.
          </p>
  
          <h2 className="text-lg font-semibold">7. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, BJJ Desk is not liable for
            injuries, losses, or disputes arising between students and gyms.
          </p>
  
          <h2 className="text-lg font-semibold">8. Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the platform
            means you accept the updated terms.
          </p>
  
          <h2 className="text-lg font-semibold">9. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
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


  export default TermsPage
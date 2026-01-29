import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendDropInConfirmationEmail({
  to,
  gymName,
  classTitle,
  date,
  token, // optional
}: {
  to: string;
  gymName: string;
  classTitle: string;
  date: string;
  token?: string;
}) {
  const createAccountSection = token
    ? `
    <p style="margin:0 0 24px; color:#555; font-size:15px;">
      Want to manage your bookings, sign waivers faster, and skip forms next time?
    </p>

    <a
      href="${process.env.NEXT_PUBLIC_APP_URL}/create-password?token=${token}"
      style="
        display:inline-block;
        background:#000;
        color:#fff;
        text-decoration:none;
        padding:14px 22px;
        border-radius:8px;
        font-weight:600;
        font-size:15px;
      "
    >
      Create your account
    </a>

    <p style="margin-top:24px; font-size:13px; color:#888;">
      This link expires in 24 hours.
    </p>
  `
    : `
    <p style="margin-top:24px; font-size:14px; color:#555;">
      You can manage your bookings anytime from your dashboard.
    </p>
  `;

  const { data, error } = await resend.emails.send({
    from: "BJJ Mat <noreply@bjjmat.io>",
    to,
    subject: `You're booked at ${gymName}`,
    text: `You're booked!\n\n${classTitle}\n${date}\n\nCreate an account to manage bookings.`,
    html: `
    <div style="font-family: Inter, system-ui, -apple-system, sans-serif; background:#f5f5f5; padding:40px;">
      <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; padding:32px;">
        <h1>You're booked 🎉</h1>
  
        <p>Your drop-in at <strong>${gymName}</strong> is confirmed.</p>
  
        <div>
          <strong>${classTitle}</strong><br/>
          <span>${date}</span>
        </div>
  
        ${createAccountSection}
  
        <hr />
  
        <p>See you on the mats,<br/><strong>BJJ Mat</strong></p>
      </div>
    </div>
  `,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}

export async function sendPasswordResetEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  const resetUrl = `${
    process.env.NEXT_PUBLIC_APP_URL
  }/reset-password?token=${encodeURIComponent(token)}`;

  const { data, error } = await resend.emails.send({
    from: "BJJ Mat <noreply@bjjmat.io>",
    to,
    subject: "Reset your BJJ Mat password",
    text: `Reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
    html: `
      <div style="font-family: Inter, system-ui, -apple-system, sans-serif; background:#f5f5f5; padding:40px;">
        <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; padding:32px;">
          
          <h1 style="margin-top:0;">Reset your password</h1>

          <p style="font-size:15px; color:#555;">
            We received a request to reset your password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              background:#000;
              color:#fff;
              text-decoration:none;
              padding:14px 22px;
              border-radius:8px;
              font-weight:600;
              font-size:15px;
              margin:16px 0;
            "
          >
            Reset password
          </a>

          <p style="font-size:13px; color:#888; margin-top:16px;">
            This link expires in 1 hour. If you didn’t request a password reset,
            you can safely ignore this email.
          </p>

          <hr style="margin:32px 0;" />

          <p style="font-size:14px;">
            See you on the mats,<br/>
            <strong>BJJ Mat</strong>
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send password reset email", error);
    throw new Error("Email send failed");
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("Password reset email sent", { id: data?.id });
  }
}


export async function sendGymDropInNotificationEmail({
  to,
  gymName,
  classTitle,
  date,
  studentName,
  studentEmail,
  isPaid,
}: {
  to: string;
  gymName: string;
  classTitle: string;
  date: string;
  studentName: string;
  studentEmail: string;
  isPaid: boolean;
}) {
  const { data, error } = await resend.emails.send({
    from: "BJJ Mat <noreply@bjjmat.io>",
    to,
    subject: `New drop-in booked at ${gymName}`,
    text: `
New drop-in booking

Gym: ${gymName}
Class: ${classTitle}
Date: ${date}

Student: ${studentName}
Email: ${studentEmail}

Payment: ${isPaid ? "PAID" : "FREE"}
`,
    html: `
      <div style="font-family: Inter, system-ui, -apple-system, sans-serif; background:#f5f5f5; padding:40px;">
        <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; padding:32px;">
          
          <h1 style="margin-top:0;">New drop-in booked 🥋</h1>

          <p style="font-size:15px; color:#555;">
            A new drop-in has been booked at <strong>${gymName}</strong>.
          </p>

          <div style="margin:24px 0; font-size:15px;">
            <strong>Class</strong><br/>
            ${classTitle}<br/>
            <span style="color:#555;">${date}</span>
          </div>

          <div style="margin:24px 0; font-size:15px;">
            <strong>Student</strong><br/>
            ${studentName}<br/>
            <a href="mailto:${studentEmail}" style="color:#2563eb; text-decoration:none;">
              ${studentEmail}
            </a>
          </div>

          <div style="margin:24px 0; font-size:15px;">
            <strong>Payment</strong><br/>
            ${isPaid ? "✅ Paid" : "🆓 Free"}
          </div>

          <hr style="margin:32px 0;" />

          <p style="font-size:14px;">
            Manage bookings in your dashboard.<br/>
            <strong>BJJ Mat</strong>
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send gym notification email", error);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("Gym drop-in notification sent", { id: data?.id });
  }
}
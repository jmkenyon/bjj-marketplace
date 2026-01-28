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
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

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

  console.log("Password reset email sent", data);
}
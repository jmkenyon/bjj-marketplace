import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendDropInConfirmationEmail({
  to,
  gymName,
  classTitle,
  date,
}: {
  to: string;
  gymName: string;
  classTitle: string;
  date: string;
}) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: to,
    subject: `You're booked at ${gymName}`,
    html: `
      <h2>You're booked 🎉</h2>
      <p><strong>${classTitle}</strong></p>
      <p>${date}</p>
      <p>See you on the mats at <strong>${gymName}</strong>.</p>
    `,
  });

  if (error) {
    throw error
  }

  return data
}

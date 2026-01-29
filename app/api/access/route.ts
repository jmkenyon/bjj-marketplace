import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import {
  sendDropInConfirmationEmail,
  sendGymDropInNotificationEmail,
} from "@/lib/email";
import crypto from "crypto";
import { parseSessionDate } from "@/app/lib/helpers";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const gymSlug = searchParams.get("gym");

  if (!gymSlug) {
    return NextResponse.json({ error: "Gym not found" }, { status: 400 });
  }

  const gym = await prisma.gym.findUnique({
    where: { slug: gymSlug },
    include: { waiver: true, dropIn: true },
  });

  if (!gym) {
    return NextResponse.json({ error: "Gym not found" }, { status: 404 });
  }

  const {
    firstName,
    lastName,
    gender,
    phone,
    sessionDate,
    email,
    dateOfBirth,
    signature,
    classId,
  } = await req.json();

  if (!classId || !sessionDate) {
    return NextResponse.json(
      { error: "Class and session date are required" },
      { status: 400 }
    );
  }

  const parsedSessionDate = parseSessionDate(sessionDate);

  if (!parsedSessionDate) {
    return NextResponse.json(
      { error: "Invalid session date" },
      { status: 400 }
    );
  }

  const selectedClass = await prisma.class.findUnique({
    where: { id: classId },
  });

  if (!selectedClass || selectedClass.gymId !== gym.id) {
    return NextResponse.json(
      { error: "Invalid class selection" },
      { status: 400 }
    );
  }

  const normalizedEmail = email?.toLowerCase().trim();
  if (!normalizedEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (gym.waiver && typeof signature !== "string") {
    return NextResponse.json(
      { error: "Waiver must be signed" },
      { status: 400 }
    );
  }

  try {
    /* -------------------------
       USER RESOLUTION
    -------------------------- */
    let user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        gymId: gym.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email: normalizedEmail,
          gender,
          phone,
          dateOfBirth,
          gymId: gym.id,
          role: "VISITOR",
        },
      });
    }

    /* -------------------------
       DUPLICATE CHECK (DATE-SAFE)
    -------------------------- */
    const existingPass = await prisma.accessPass.findFirst({
      where: {
        userId: user.id,
        gymId: gym.id,
        classId,
        sessionDate: parsedSessionDate,
      },
    });

    if (existingPass) {
      return NextResponse.json(
        { error: "You are already booked for this session" },
        { status: 409 }
      );
    }

    /* -------------------------
       CREATE ACCESS PASS
    -------------------------- */
    const isPaid = selectedClass.isFree || gym.dropIn?.fee === 0;

    await prisma.accessPass.create({
      data: {
        type: "DROP_IN",
        userId: user.id,
        gymId: gym.id,
        classId,
        sessionDate: parsedSessionDate,
        isPaid,
      },
    });

    /* -------------------------
       SAVE WAIVER (ONCE)
    -------------------------- */
    if (gym.waiver) {
      const alreadySigned = await prisma.signedWaiver.findFirst({
        where: {
          userId: user.id,
          waiverId: gym.waiver.id,
        },
      });

      if (!alreadySigned) {
        await prisma.signedWaiver.create({
          data: {
            userId: user.id,
            gymId: gym.id,
            waiverId: gym.waiver.id,
            waiverText: gym.waiver.content,
            signature,
          },
        });
      }
    }

    /* -------------------------
       PASSWORD TOKEN (OPTIONAL)
    -------------------------- */
    let token: string | undefined;

    if (!user.hashedPassword) {
      token = crypto.randomBytes(32).toString("hex");

      await prisma.passwordToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });
    }

    /* -------------------------
       EMAILS
    -------------------------- */
    const formattedDate = `${selectedClass.dayOfWeek} at ${selectedClass.startTime} (${sessionDate})`;

    await sendDropInConfirmationEmail({
      to: user.email,
      gymName: gym.name,
      classTitle: selectedClass.title,
      date: formattedDate,
      token,
    });

    const gymOwner = await prisma.user.findFirst({
      where: {
        gymId: gym.id,
        role: "ADMIN",
      },
      select: {
        email: true,
      },
    });
    if (gymOwner?.email) {
      await sendGymDropInNotificationEmail({
        to: gymOwner.email,
        gymName: gym.name,
        classTitle: selectedClass.title,
        date: formattedDate,
        studentName:
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Guest",
        studentEmail: user.email,
        isPaid,
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[DROP_IN_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

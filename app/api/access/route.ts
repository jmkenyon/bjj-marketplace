import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { sendDropInConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const gymSlug = searchParams.get("gym");

  if (!gymSlug) {
    return NextResponse.json({ error: "Gym not found" }, { status: 400 });
  }

  const gym = await prisma.gym.findUnique({
    where: { slug: gymSlug },
    include: { waiver: true },
  });

  if (!gym) {
    return NextResponse.json({ error: "Gym not found" }, { status: 404 });
  }

  const {
    firstName,
    lastName,
    gender,
    phone,
    email,
    dateOfBirth,
    signature,
    classId,
  } = await req.json();

  if (!classId) {
    return NextResponse.json(
      { error: "Class selection is required" },
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

    // Prevent duplicate booking for same class
    const existingPass = await prisma.accessPass.findFirst({
      where: {
        userId: user.id,
        gymId: gym.id,
        classId,
        status: "ACTIVE",
      },
    });

    if (existingPass) {
      return NextResponse.json(
        { error: "You are already booked for this class" },
        { status: 409 }
      );
    }

    await prisma.accessPass.create({
      data: {
        type: "DROP_IN",
        userId: user.id,
        gymId: gym.id,
        classId,
        isPaid: selectedClass.isFree, // free classes auto-paid
      },
    });

    // Save waiver once per user
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

    await sendDropInConfirmationEmail({
      to: user.email,
      gymName: gym.name,
      classTitle: selectedClass.title,
      date: `${selectedClass.dayOfWeek} at ${selectedClass.startTime}`,
      token, // undefined for existing users
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[DROP_IN_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

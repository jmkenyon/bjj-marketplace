import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/route";

const VALID_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, dayOfWeek, startTime, duration, isFree } = await req.json();

    const gymId = session.user.gymId;

    if (!gymId) {
      return NextResponse.json({ error: "Gym ID not found" }, { status: 400 });
    }

    if (!title || !startTime || duration === undefined || duration === null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const durationNumber = Number(duration);
    if (!Number.isFinite(durationNumber) || durationNumber <= 0) {
      return NextResponse.json(
        { error: "Duration must be a positive number" },
        { status: 400 }
      );
    }

    if (!VALID_DAYS.includes(dayOfWeek)) {
      return NextResponse.json(
        { error: "Invalid day of week" },
        { status: 400 }
      );
    }

    await prisma.class.create({
      data: {
        title,
        dayOfWeek,
        startTime,
        duration: durationNumber,
        gymId,
        isFree,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

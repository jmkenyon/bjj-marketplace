// app/api/student/profile/route.ts
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      contactName: data.contactName,
      contactNumber: data.contactNumber,
      relationship: data.relationship,
      belt: data.belt
    },
  });

  return NextResponse.json({ success: true });
}

import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, description, price, gymId } = await req.json();
  try {
    await prisma.membership.create({
      data: {
        title,
        description,
        price: Number(price),
        gymId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { title, description, price, membershipId } = await req.json();
  try {
    await prisma.membership.update({
      where: { id: membershipId },
      data: {
        title,
        description,
        price: Number(price)
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

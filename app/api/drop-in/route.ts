import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { fee, documents, gymId, gymSlug } = await req.json();

  const documentIds = Array.isArray(documents) ? documents : [documents];

  try {
    await prisma.dropIn.create({
      data: {
        fee: Number(fee),
        gymId,
         qrCode: `https://${gymSlug}.bjjdesk.com/drop-in`,
        documents: {
          connect: documentIds.map((id: string) => ({ id })),
        },
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
  const { fee, documents, gymId, dropInId } = await req.json();

  const documentIds = Array.isArray(documents) ? documents : [documents];

  try {
    await prisma.dropIn.update({
      where: {
        id: dropInId,
      },
      data: {
        fee: Number(fee),
        gymId,
        documents: {
          set: documentIds.map((id: string) => ({ id })),
        },
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

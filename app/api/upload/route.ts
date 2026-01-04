import { NextRequest, NextResponse } from "next/server";
import { getSignedUrlForUpload } from "@/app/lib/r2";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, fileName, fileType } = await request.json();
  const gymId = session.user.gymId;

  if (!title || !fileName || !fileType) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const objectKey = `gyms/${gymId}/documents/${crypto.randomUUID()}-${fileName}`;

  try {
    const signedUrl = await getSignedUrlForUpload(objectKey, fileType);

    

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error generating signed URL" },
      { status: 500 }
    );
  }
}
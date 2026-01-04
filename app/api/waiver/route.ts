import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const {content} = await req.json()

    const gym = await prisma.gym.findUnique({
        where: {id: session.user.gymId},
        select: {id: true, slug: true}
    })

    if (!gym) {
        return NextResponse.json({error: "Gym not found"}, {status: 404})
    }

    try {
        await prisma.waiver.upsert({
            where: {gymId: gym.id},
            update: {
                content,
            },
            create: {
                content,
                gymId: gym.id
            }
        })

        return NextResponse.json({success: true})
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        )
    }
}
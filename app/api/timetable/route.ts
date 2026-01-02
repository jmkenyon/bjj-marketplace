import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const {title, dayOfWeek, startTime, duration, gymId} = await req.json()
    try {
        await prisma.class.create({
            data: {
                title, 
                dayOfWeek,
                startTime,
                duration: Number(duration),
                gymId
            }
        })
         return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }
}
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Fetch user's most recent generated website
    const website = await prisma.generatedWebsite.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    if (!website) {
      return NextResponse.json(
        { website: null, message: "No website found" },
        { status: 200 }
      )
    }

    return NextResponse.json({ website }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user website:", error)
    return NextResponse.json(
      { error: "Failed to fetch website" },
      { status: 500 }
    )
  }
}

import { prisma } from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "admin@hireai.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Verify credentials
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if admin user exists in database, if not create one
    let adminUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email,
          name: "Admin",
          role: "ADMIN",
        },
      });
    } else if (adminUser.role !== "ADMIN") {
      // Update role to ADMIN if not already
      adminUser = await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" },
      });
    }

    // For now, return a simple token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({ email, role: "ADMIN" })).toString("base64");

    return NextResponse.json({
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

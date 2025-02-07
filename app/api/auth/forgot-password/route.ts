// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
// import { createResetToken } from "@/lib/tokens";
import prisma from "@/app/utils/db";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link shortly.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
      },
    });

    // Create reset URL
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Send email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 
        (process.env.NODE_ENV === "development" 
          ? "test@resend.dev" 
          : "noreply@yourdomain.com"),
      to: process.env.NODE_ENV === "development"
        ? process.env.DEVELOPMENT_EMAIL || "henrycoffie22@gmail.com"
        : email,
      subject: "Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}

"use server";

import bcrypt from "bcryptjs";
import prisma from "./utils/db";
import { requireUser } from "./utils/requireuser";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { PostSchema, TaskCreationSchema, taskSchema } from "./utils/zodSchemas";

import { Resend } from "resend";
import { generateToken } from "./utils/tokengen";
import { toast } from "sonner";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function registerUser({
  email,
  password,
  name,
  image,
}: {
  email: string;
  password: string;
  name: string;
  image?: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    toast.error("Email already exists");
  }

  // Generate verification token
  const verificationToken = generateToken();
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user with verification token
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      image,
      emailVerified: null,
      verificationToken,
    },
  });

  // Send verification email
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

  try {
    await resend.emails.send({
      from: "noreply@yourdomain.com",
      to:
        process.env.NODE_ENV === "development"
          ? "henrycoffie22@gmail.com" // Your verified email
          : email,
      subject: "Verify your email address",
      html: `
        <h1>Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || "Our App"}!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you didn't create this account, you can safely ignore this email.</p>
      `,
    });

    return {
      success: true,
      message:
        process.env.NODE_ENV === "development"
          ? "Registration successful. Verification email sent to developer address."
          : "Registration successful. Please check your email to verify your account.",
      // Include verification URL only in development
      ...(process.env.NODE_ENV === "development" && { verificationUrl }),
      email:
        process.env.NODE_ENV === "development"
          ? "henrycoffie22@gmail.com"
          : email,
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: true,
      message:
        "Account created but there was an issue sending the verification email. Please try again or contact support.",
      ...(process.env.NODE_ENV === "development" && {
        verificationUrl,
        error: error instanceof Error ? error.message : "Email sending failed",
      }),
    };
  }
}

export async function CreateSiteAction(prevState: any, formData: FormData) {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: taskSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const response = await prisma.task.create({
    data: {
      description: submission.value.description,
      name: submission.value.name,
      subdirectory: submission.value.subdirectory,
      userId: user.user.id,
    },
  });

  return redirect("/dashboard/tasks");
}

export async function CreatePostAction(prevState: any, formData: FormData) {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.post.create({
    data: {
      title: submission.value.title,
      smallDescription: submission.value.smallDescription,
      slug: submission.value.slug,
      articleContent: JSON.parse(submission.value.articleContent),
      image: submission.value.coverImage,
      userId: user.user.id,
      taskId: formData.get("taskId") as string,
    },
  });

  return redirect(`/dashboard/tasks/${formData.get("taskId")}`);
}

export async function UpdatePostStatus(formData: FormData) {
  "use server";

  const user = await requireUser();

  const status = formData.get("status") as
    | "PENDING"
    | "UPCOMING"
    | "ONGOING"
    | "COMPLETED";

  const data = await prisma.post.update({
    where: {
      userId: user.user.id,
      id: formData.get("articleId") as string,
    },
    data: {
      status,
    },
  });

  return redirect(`/dashboard/tasks/${formData.get("taskId")}`);
}

export async function EditPostAction(prevState: any, formData: FormData) {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.post.update({
    where: {
      userId: user.user.id,
      id: formData.get("articleId") as string,
    },
    data: {
      title: submission.value.title,
      smallDescription: submission.value.smallDescription,
      slug: submission.value.slug,
      articleContent: JSON.parse(submission.value.articleContent),
      image: submission.value.coverImage,
    },
  });

  return redirect(`/dashboard/tasks/${formData.get("taskId")}`);
}

export async function DeletePost(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.post.delete({
    where: {
      userId: user.user.id,
      id: formData.get("articleId") as string,
    },
  });

  return redirect(`/dashboard/tasks/${formData.get("taskId")}`);
}

export async function UpdateImage(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.task.update({
    where: {
      userId: user.user.id,
      id: formData.get("taskId") as string,
    },
    data: {
      imageUrl: formData.get("imageUrl") as string,
    },
  });

  return redirect(`/dashboard/tasks/${formData.get("taskId")}`);
}

export async function DeleteTask(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.task.delete({
    where: {
      userId: user.user.id,
      id: formData.get("taskId") as string,
    },
  });

  return redirect("/dashboard/tasks");
}

export async function searchUsers(query: string) {
  // Don't search if query is too short
  if (query.length < 2) return [];

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return users;
}

export async function addAttendee(formData: FormData) {
  const user = requireUser();
  if (!user) return redirect("/login");

  const email = formData.get("email") as string;
  const taskId = formData.get("taskId") as string;

  // Check if user already exists
  const attendeeUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!attendeeUser) {
    return { error: "User not found" };
  }

  // Check if already an attendee
  const existingAttendee = await prisma.taskAttendee.findFirst({
    where: {
      taskId,
      userId: attendeeUser.id,
    },
  });

  if (existingAttendee) {
    return { error: "User is already an attendee" };
  }

  await prisma.taskAttendee.create({
    data: {
      taskId,
      userId: attendeeUser.id,
    },
  });

  redirect(`/dashboard/tasks/${taskId}/attendees`);
}

export async function removeAttendee(formData: FormData) {
  const user = requireUser();
  if (!user) return redirect("/login");

  const taskId = formData.get("taskId") as string;
  const attendeeId = formData.get("attendeeId") as string;

  await prisma.taskAttendee.delete({
    where: {
      id: attendeeId,
    },
  });

  return { success: true };
}

export async function getTaskWithAttendees(taskId: string) {
  const data = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      attendees: {
        include: {
          user: true,
        },
      },
    },
  });

  return data;
}

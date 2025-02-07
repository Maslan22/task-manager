"use server";

import bcrypt from "bcryptjs";
import prisma from "./utils/db";
import { requireUser } from "./utils/requireuser";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { PostSchema, taskSchema } from "./utils/zodSchemas";

import { Resend } from "resend";
import { generateToken } from "./utils/tokengen";
import { toast } from "sonner";
import { SubmissionResult } from "@conform-to/react";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// interface PrevState {
//   success?: boolean;
//   message?: string;
//   errors?: Record<string, string[]>;
// }

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
  await prisma.user.create({
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
      from: process.env.RESEND_FROM_EMAIL || 
        (process.env.NODE_ENV === "development" 
          ? "test@resend.dev" 
          : "noreply@yourdomain.com"),
      to: process.env.NODE_ENV === "development"
        ? process.env.DEVELOPMENT_EMAIL || "henrycoffie22@gmail.com"
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

export async function CreateSiteAction(
  formData: FormData
): Promise<SubmissionResult<string[]>> {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: taskSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      formErrors: ["Please check the form for errors"]
    });
  }

  try {
    await prisma.task.create({
      data: {
        description: submission.value.description,
        name: submission.value.name,
        subdirectory: submission.value.subdirectory,
        userId: user.user.id,
      },
    });

    return submission.reply();

  } catch (err) {
    return submission.reply({
      formErrors: [err instanceof Error ? err.message : "Failed to create task"]
    });
  }
}

export async function CreatePostAction(
  formData: FormData
): Promise<SubmissionResult<string[]>> {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      formErrors: ["Please check the form for errors"]
    });
  }

  try {
    await prisma.post.create({
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

    return submission.reply();

  } catch (err) {
    return submission.reply({
      formErrors: [err instanceof Error ? err.message : "Failed to create post"]
    });
  }
}

export async function EditPostActions(
  formData: FormData
): Promise<SubmissionResult<string[]>> {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      formErrors: ["Please check the form for errors"]
    });
  }

  try {
    await prisma.post.update({
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

    return submission.reply();

  } catch (err) {
    return submission.reply({
      formErrors: [err instanceof Error ? err.message : "Failed to update post"]
    });
  }
}

export async function UpdatePostStatus(formData: FormData) {
  "use server";

  const user = await requireUser();

  const status = formData.get("status") as
    | "PENDING"
    | "UPCOMING"
    | "ONGOING"
    | "COMPLETED";

  await prisma.post.update({
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

export async function DeletePost(formData: FormData) {
  const user = await requireUser();

  await prisma.post.delete({
    where: {
      userId: user.user.id,
      id: formData.get("articleId") as string,
    },
  });

  return redirect(`/dashboard/tasks/${formData.get("taskId")}`);
}

export async function UpdateImage(formData: FormData) {
  const user = await requireUser();

  await prisma.task.update({
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

  await prisma.task.delete({
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

  const attendeeUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!attendeeUser) {
    return { error: "User not found" };
  }

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

  return { success: true };
}

export async function removeAttendee(formData: FormData) {
  const user = requireUser();
  if (!user) return redirect("/login");

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

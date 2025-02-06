import { auth } from "./auth";

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}
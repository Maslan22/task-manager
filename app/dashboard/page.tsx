import { requireUser } from "../utils/requireuser";
import prisma from "../utils/db";
import { DashboardContent } from "../components/dashboard/DashboardContent";

async function getData(userId: string) {
  const [tasks, articles] = await Promise.all([
    prisma.task.findMany({
      where: {
        OR: [
          { userId: userId }, // Tasks they created
          {
            attendees: {
              some: {
                userId: userId // Tasks where they are an attendee
              }
            }
          }
        ]
      },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
    prisma.post.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
  ]);

  return { tasks, articles };
}

export default async function DashboardIndexPage() {
  const user = await requireUser();
  const { articles, tasks } = await getData(user.user.id);
  
  return <DashboardContent tasks={tasks} articles={articles} />;
}
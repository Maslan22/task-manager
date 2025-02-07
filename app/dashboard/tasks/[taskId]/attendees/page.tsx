import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserSearch } from "@/app/components/dashboard/UserSearch";
import prisma from "@/app/utils/db";
import { AttendeeList } from "@/app/components/dashboard/AttendeeList";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type PageParams = Promise<{
  taskId: string;
}>;

async function getTask(taskId: string) {
  return await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      attendees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
}

export default async function AttendeesPage({
  params,
}: {
  params: PageParams;
}) {
  const user = await auth();
  if (!user) return redirect("/login");

  const resolvedParams = await params;
  const task = await getTask(resolvedParams.taskId);
  if (!task) return redirect("/dashboard/tasks");

  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/tasks/${resolvedParams.taskId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h3 className="text-xl font-semibold">Go back</h3>
      </div>
      <div className="container max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Manage Attendees</CardTitle>
                <CardDescription>
                  Add or remove attendees for {task.name}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="w-fit">
                {task.attendees.length}{" "}
                {task.attendees.length === 1 ? "Attendee" : "Attendees"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <UserSearch taskId={task.id} attendees={task.attendees} />
            <AttendeeList attendees={task.attendees} taskId={task.id} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

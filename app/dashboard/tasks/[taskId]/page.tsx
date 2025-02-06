import React from "react";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireuser";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Book,
  MoreHorizontal,
  PlusCircle,
  Settings,
  GridIcon,
  ListIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchInput } from "@/app/components/dashboard/SearchInput";
import NoTasks from "@/app/components/tasks/NoTasks";
import TaskList from "@/app/components/tasks/TaskList";
import TaskGrid from "@/app/components/tasks/TaskGrid";
import Pagination from "@/app/components/tasks/Pagination";

interface PageProps {
  params: { taskId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function getData(
  userId: string,
  taskId: string,
  page: number = 1,
  search: string = "",
  limit: number = 10
) {
  const skipValue = (page - 1) * limit;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      OR: [
        { userId: userId },
        { attendees: { some: { userId: userId } } },
      ],
    },
    select: {
      subdirectory: true,
      id: true,
      name: true,
      userId: true,
      attendees: {
        select: {
          userId: true,
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

  if (!task) {
    throw new Error("Task not found or unauthorized");
  }

  const isOwner = task.userId === userId;

  const whereClause = {
    taskId: taskId,
    ...(search.trim() !== "" && {
      OR: [
        {
          title: {
            contains: search.trim(),
            mode: "insensitive" as const,
          },
        },
        {
          smallDescription: {
            contains: search.trim(),
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      select: {
        image: true,
        title: true,
        smallDescription: true,
        createdAt: true,
        id: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skipValue,
      take: limit,
    }),
    prisma.post.count({
      where: whereClause,
    }),
  ]);

  return {
    data,
    total,
    task,
    isOwner,
  };
}

export default async function TaskIdRoute({ params, searchParams }: PageProps) {
  const user = await requireUser();
  if (!user) {
    return redirect("/login");
  }

  const taskId = params.taskId;
  const page = parseInt(String(searchParams?.page || "1"));
  const search = String(searchParams?.search || "");
  const view = String(searchParams?.view || "list") as "grid" | "list";

  const { data, total, task } = await getData(
    user.user.id,
    taskId,
    page,
    search
  );
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Top Actions Bar */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
        {/* Search and Mobile Menu */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <SearchInput defaultValue={search} />
          </div>

          {/* Mobile Dropdown Menu */}
          <div className="block sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/blog/${task?.subdirectory}`}
                    className="flex items-center"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    View Task
                  </Link>
                </DropdownMenuItem>
                {task.userId === user.user.id && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/tasks/${taskId}/attendees`}
                        className="flex items-center"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Attendees ({task?.attendees?.length ?? 0})
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/tasks/${taskId}/settings`}
                        className="flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/tasks/${taskId}/create`}
                        className="flex items-center"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Task
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop View Toggle */}
          <div className="hidden sm:flex h-10 border rounded-md">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              asChild
              className="flex-1"
            >
              <Link href={`?view=grid&page=${page}&search=${search}`}>
                <GridIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              asChild
              className="flex-1"
            >
              <Link href={`?view=list&page=${page}&search=${search}`}>
                <ListIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:grid sm:grid-cols-2 md:flex md:flex-row gap-2">
          <Button className="w-full md:w-auto" asChild>
            <Link href={`/blog/${task?.subdirectory}`}>
              <Book className="h-4 w-4 mr-2" />
              View Task
            </Link>
          </Button>
          {task.userId === user.user.id && (
            <>
              <Button className="w-full md:w-auto" variant="secondary" asChild>
                <Link href={`/dashboard/tasks/${taskId}/attendees`}>
                  <Users className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">
                    Attendees ({task?.attendees?.length ?? 0})
                  </span>
                </Link>
              </Button>
              <Button className="w-full md:w-auto" variant="secondary" asChild>
                <Link href={`/dashboard/tasks/${taskId}/settings`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button className="w-full md:w-auto" asChild>
                <Link href={`/dashboard/tasks/${taskId}/create`}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Task
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full">
        {data.length === 0 ? (
          <NoTasks search={search} isOwner={task.userId === user.user.id} taskId={taskId} />
        ) : (
          <div className="space-y-6">
            {/* Mobile View - Always Grid */}
            <div className="block sm:hidden">
              <TaskGrid data={data} isOwner={task.userId === user.user.id} taskId={taskId} />
            </div>
            {/* Desktop View - Respects User Choice */}
            <div className="hidden sm:block">
              {view === "list" ? (
                <TaskList data={data} isOwner={task.userId === user.user.id} taskId={taskId} />
              ) : (
                <TaskGrid data={data} isOwner={task.userId === user.user.id} taskId={taskId} />
              )}
            </div>
            {data.length > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                view={view}
                search={search}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
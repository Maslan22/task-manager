import React from "react";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireuser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Book,
  FileIcon,
  MoreHorizontal,
  PlusCircle,
  Settings,
  GridIcon,
  ListIcon,
  Search,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UpdatePostStatus } from "@/app/actions";
import { SearchInput } from "@/app/components/dashboard/SearchInput";
import NoTasks from "@/app/components/tasks/NoTasks";
import TaskList from "@/app/components/tasks/TaskList";
import TaskGrid from "@/app/components/tasks/TaskGrid";
import Pagination from "@/app/components/tasks/Pagination";

// Utility functions
function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-gray-500/10 text-gray-500";
    case "UPCOMING":
      return "bg-blue-500/10 text-blue-500";
    case "ONGOING":
      return "bg-yellow-500/10 text-yellow-500";
    case "COMPLETED":
      return "bg-green-500/10 text-green-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

async function getData(
  userId: string,
  taskId: string,
  page: number = 1,
  search: string = "",
  limit: number = 10
) {
  // Calculate skip value
  const skipValue = (page - 1) * limit;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      OR: [
        { userId: userId }, // Task owner
        { attendees: { some: { userId: userId } } }, // Attendee
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

interface PageProps {
  params: { taskId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TaskIdRoute({ params, searchParams }: PageProps) {
  const user = await requireUser();
  async function getParams() {
    const user = await requireUser();
    const resolvedParams = await Promise.resolve(params);
    const resolvedSearch = await Promise.resolve(searchParams);

    const task = await prisma.task.findFirst({
      where: {
        id: resolvedParams.taskId,
      },
      select: {
        userId: true,
      },
    });

    return {
      taskId: resolvedParams.taskId,
      page: parseInt(String(resolvedSearch?.page || "1")),
      search: String(resolvedSearch?.search || ""),
      view: String(resolvedSearch?.view || "list") as "grid" | "list",
      isOwner: task?.userId === user.user.id,
    };
  }

  const { taskId, page, search, view, isOwner } = await getParams();

  if (!user) {
    return redirect("/login");
  }

  const { data, total, task } = await getData(
    user.user.id,
    taskId,
    page,
    search
  );
  const totalPages = Math.ceil(total / 10);

  const getDisplayView = () => {
    return typeof window !== "undefined" && window.innerWidth <= 630
      ? "grid"
      : view;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Top Actions Bar - Stack on mobile, row on larger screens */}
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
                {isOwner && (
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
          {isOwner && (
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
          <NoTasks search={search} isOwner={isOwner} taskId={taskId} />
        ) : (
          <div className="space-y-6">
            {/* Mobile View - Always Grid */}
            <div className="block sm:hidden">
              <TaskGrid data={data} isOwner={isOwner} taskId={taskId} />
            </div>
            {/* Desktop View - Respects User Choice */}
            <div className="hidden sm:block">
              {view === "list" ? (
                <TaskList data={data} isOwner={isOwner} taskId={taskId} />
              ) : (
                <TaskGrid data={data} isOwner={isOwner} taskId={taskId} />
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

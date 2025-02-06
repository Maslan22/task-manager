import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { UpdatePostStatus } from "@/app/actions";

interface TaskItem {
  id: string;
  image: string;
  title: string;
  smallDescription: string;
  createdAt: Date; // Updated to Date type
  status: string;
}

interface TaskGridProps {
  data: TaskItem[]; // Updated to use TaskItem[]
  isOwner: boolean;
  taskId: string;
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING": return "bg-gray-500/10 text-gray-500";
    case "UPCOMING": return "bg-blue-500/10 text-blue-500";
    case "ONGOING": return "bg-yellow-500/10 text-yellow-500";
    case "COMPLETED": return "bg-green-500/10 text-green-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function TaskGrid({ data, isOwner, taskId }: TaskGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <Card key={item.id} className="flex flex-col">
          <CardHeader>
            <div className="aspect-video relative">
              <Image
                src={item.image}
                fill
                alt="Task Cover"
                className="rounded-md object-cover"
              />
            </div>
            <CardTitle className="mt-4 line-clamp-2">{item.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {item.smallDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className={getStatusColor(item.status)}>
                {formatStatus(item.status)}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Created:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(item.createdAt))}
              </p>
            </div>
          </CardContent>
          {isOwner && (
            <CardFooter className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <form action={UpdatePostStatus}>
                    <input type="hidden" name="articleId" value={item.id} />
                    <input type="hidden" name="taskId" value={taskId} />
                    <DropdownMenuItem asChild>
                      <button
                        type="submit"
                        name="status"
                        value="UPCOMING"
                        className="w-full text-left cursor-pointer px-2 py-1.5 text-sm"
                      >
                        Upcoming
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        type="submit"
                        name="status"
                        value="ONGOING"
                        className="w-full text-left cursor-pointer px-2 py-1.5 text-sm"
                      >
                        Ongoing
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        type="submit"
                        name="status"
                        value="COMPLETED"
                        className="w-full text-left cursor-pointer px-2 py-1.5 text-sm"
                      >
                        Completed
                      </button>
                    </DropdownMenuItem>
                  </form>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/tasks/${taskId}/${item.id}`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/tasks/${taskId}/${item.id}/delete`}>
                      Delete
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
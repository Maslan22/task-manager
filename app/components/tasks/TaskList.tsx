import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface TaskListProps {
  data: any[];
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

export default function TaskList({ data, isOwner, taskId }: TaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>
          Manage your tasks in a simple and intuitive interface
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell w-24">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Created At</TableHead>
                {isOwner && <TableHead className="w-16">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      src={item.image}
                      width={64}
                      height={64}
                      alt="Task Cover"
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="sm:hidden">
                        <Image
                          src={item.image}
                          width={40}
                          height={40}
                          alt="Task Cover"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium line-clamp-2">{item.title}</span>
                        <span className="text-sm text-muted-foreground line-clamp-2 sm:hidden">
                          {item.smallDescription}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="line-clamp-2 text-sm text-muted-foreground">
                      {item.smallDescription}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {formatStatus(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.createdAt))}
                  </TableCell>
                  {isOwner && (
                    <TableCell>
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
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
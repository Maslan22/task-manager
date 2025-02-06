
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatDistance } from "date-fns";

interface Task {
  id: string;
  name: string;
  subdirectory: string;
  createdAt: Date;
  User: {
    name: string | null;
  } | null;
  attendees: any[];
  posts: any[];
}

interface AdminTasksTableProps {
  data: Task[];
}

export function AdminTasksTable({ data }: AdminTasksTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Event Name</TableHead>
              <TableHead className="min-w-[120px]">Created By</TableHead>
              <TableHead className="min-w-[120px]">Task</TableHead>
              <TableHead className="min-w-[100px]">Attendees</TableHead>
              <TableHead className="min-w-[100px]">Posts</TableHead>
              <TableHead className="min-w-[140px]">Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium whitespace-nowrap">{task.name}</TableCell>
                <TableCell className="whitespace-nowrap">{task.User?.name || "No creator"}</TableCell>
                <TableCell className="whitespace-nowrap">{task.subdirectory}</TableCell>
                <TableCell className="whitespace-nowrap">{task.attendees.length}</TableCell>
                <TableCell className="whitespace-nowrap">{task.posts.length}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDistance(new Date(task.createdAt), new Date(), { 
                    addSuffix: true 
                  })}
                </TableCell>
                {/* <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit task</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
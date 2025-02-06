"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  _count: {
    tasks: number;
    posts: number;
    taskAttendees: number;
  };
}

export function AdminUsersTable({ data }: { data: User[] }) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="min-w-40">User</TableHead>
            <TableHead className="min-w-40">Email</TableHead>
            <TableHead className="min-w-24 text-right">Tasks</TableHead>
            <TableHead className="min-w-24 text-right">Posts</TableHead>
            <TableHead className="min-w-32 text-right">
              Participations
            </TableHead>
            <TableHead className="min-w-32">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-6 w-6 md:h-8 md:w-8">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="text-xs">
                    {user.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm md:text-base truncate max-w-32">
                  {user.name}
                </span>
              </TableCell>
              <TableCell className="text-sm truncate max-w-40">
                {user.email}
              </TableCell>
              <TableCell className="text-right text-sm">
                {user._count.tasks}
              </TableCell>
              <TableCell className="text-right text-sm">
                {user._count.posts}
              </TableCell>
              <TableCell className="text-right text-sm">
                {user._count.taskAttendees}
              </TableCell>
              <TableCell className="text-sm">
                {formatDistance(new Date(user.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  Settings,
  Users,
  PlusCircle,
  Menu,
  GridIcon,
  ListIcon,
} from "lucide-react";
import { SearchInput } from "@/app/components/dashboard/SearchInput";

interface TopActionsBarProps {
  search: string;
  view: string;
  page: number;
  taskId: string;
  isOwner: boolean;
  task: any;
}

export default function TopActionsBar({ search, view, page, taskId, isOwner, task }: TopActionsBarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <SearchInput defaultValue={search} />
        </div>
        
        <div className="block lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/blog/${task?.subdirectory}`} className="flex items-center">
                  <Book className="h-4 w-4 mr-2" />
                  View Task
                </Link>
              </DropdownMenuItem>
              {isOwner && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/tasks/${taskId}/attendees`} className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Attendees ({task?.attendees?.length ?? 0})
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/tasks/${taskId}/settings`} className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/tasks/${taskId}/create`} className="flex items-center">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Task
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex h-10 gap-1 border rounded-md">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            asChild
            className="flex-1 sm:flex-none"
          >
            <Link href={`?view=grid&page=${page}&search=${search}`}>
              <GridIcon className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            asChild
            className="flex-1 sm:flex-none"
          >
            <Link href={`?view=list&page=${page}&search=${search}`}>
              <ListIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="hidden lg:flex gap-4">
        <Button className="w-auto" asChild>
          <Link href={`/blog/${task?.subdirectory}`}>
            <Book className="h-4 w-4 mr-2" />
            View Task
          </Link>
        </Button>
        {isOwner && (
          <>
            <Button className="w-auto" variant="secondary" asChild>
              <Link href={`/dashboard/tasks/${taskId}/attendees`}>
                <Users className="h-4 w-4 mr-2" />
                Attendees ({task?.attendees?.length ?? 0})
              </Link>
            </Button>
            <Button className="w-auto" variant="secondary" asChild>
              <Link href={`/dashboard/tasks/${taskId}/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button className="w-auto" asChild>
              <Link href={`/dashboard/tasks/${taskId}/create`}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Task
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
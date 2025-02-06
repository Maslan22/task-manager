"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RecentActivityProps {
  data: {
    id: string;
    name: string;
    createdAt: Date;
    User: {
      name: string | null;
    } | null;
    _count: {
      attendees: number;
    };
  }[];
}

export function RecentActivity({ data }: RecentActivityProps) {
  // Helper function to format date without date-fns
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {data.map((item) => (
        <div key={item.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {item.User?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              Created by {item.User?.name || "Unknown"}
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <p className="text-sm font-medium">
              {item._count.attendees} attendees
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(item.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
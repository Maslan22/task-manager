'use client'

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { removeAttendee } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified?: Date | null;
  password?: string;
  verificationToken?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type Attendee = {
  id: string;
  user: User;
};

interface AttendeeListProps {
  attendees: Attendee[];
  taskId: string;
}

export function AttendeeList({ attendees, taskId }: AttendeeListProps) {
  const router = useRouter();

  const handleRemove = async (formData: FormData) => {
    try {
      await removeAttendee(formData);
      toast.success("Attendee removed successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to remove attendee:", error);
      toast.error("Failed to remove attendee");
    }
  };

  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="space-y-4">
        {attendees.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No attendees yet. Add some users to get started!
          </div>
        ) : (
          attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar>
                  <AvatarImage src={attendee.user.image || undefined} />
                  <AvatarFallback>
                    {attendee.user.name?.[0]?.toUpperCase() || 
                     attendee.user.email?.[0]?.toUpperCase() || 
                     '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {attendee.user.name || 'Unnamed User'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {attendee.user.email || 'No email'}
                  </p>
                </div>
              </div>

              <form action={handleRemove}>
                <input type="hidden" name="taskId" value={taskId} />
                <input type="hidden" name="attendeeId" value={attendee.id} />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="submit" 
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
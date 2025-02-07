'use client'

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronsUpDown, Loader2, Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { addAttendee, searchUsers } from "@/app/actions";
import { useRouter } from "next/navigation";
import { AttendeeList } from "./AttendeeList";
import { toast } from "sonner";

interface User {
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
}

interface TaskAttendee {
  id: string;
  userId: string;
  taskId: string;
  user: User;
}

type AddAttendeeResult = {
  success?: boolean;
  error?: string;
  taskId?: string;
};

interface UserSearchProps {
  taskId: string;
  attendees: TaskAttendee[];
}

export function UserSearch({ taskId, attendees }: UserSearchProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    
    if (!value || value.length < 2) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchUsers(value);
      setUsers(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error("Search error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await addAttendee(formData) as AddAttendeeResult;
  
      if (result?.error) {
        toast.error(result.error);
        return;
      }
  
      toast.success("Attendee added successfully");
      router.refresh();
      setOpen(false);
      setSearchTerm("");
      setUsers([]);
  
      if (result?.success && result?.taskId) {
        router.push(`/dashboard/tasks/${result.taskId}/attendees`);
      }
    } catch (error) {
      console.error("Failed to add attendee:", error);
      toast.error("Failed to add attendee");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddUser = async (email: string) => {
    const formData = new FormData();
    formData.append('taskId', taskId);
    formData.append('email', email);
    await handleSubmit(formData);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center gap-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              View Attendees ({attendees.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Event Attendees</DialogTitle>
            </DialogHeader>
            <AttendeeList attendees={attendees} taskId={taskId} />
          </DialogContent>
        </Dialog>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="truncate">
              {searchTerm || "Search users or enter email..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <div className="space-y-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users or enter email..."
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            
            <div className="max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  {searchTerm.length < 2 ? (
                    "Type at least 2 characters to search..."
                  ) : searchTerm.includes('@') ? (
                    <Button
                      type="button"
                      onClick={() => handleAddUser(searchTerm)}
                      variant="secondary"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      Add by email: {searchTerm}
                    </Button>
                  ) : (
                    "No users found"
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback>
                            {user.name?.[0]?.toUpperCase() || 
                             user.email?.[0]?.toUpperCase() || 
                             '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {user.name || 'Unnamed User'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.email || 'No email'}
                          </div>
                        </div>
                      </div>
                      {user.email && (
                        <Button
                          type="button"
                          onClick={() => handleAddUser(user.email!)}
                          size="sm"
                          variant="ghost"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Add'
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
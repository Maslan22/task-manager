import { Button } from "@/components/ui/button";
import { FileIcon, Link, PlusCircle } from "lucide-react";

export default function NoTasks({ search, isOwner, taskId }:any) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <FileIcon className="h-10 w-10 text-primary" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No tasks found</h2>
        <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-sm">
          {search ? "No tasks match your search criteria." : "You don't have any tasks. Create one to get started!"}
        </p>
        {isOwner && (
          <Button className="w-full sm:w-auto" asChild>
            <Link href={`/dashboard/tasks/${taskId}/create`}>
              <PlusCircle className="h-4 w-4 mr-2" /> Create Task
            </Link>
          </Button>
        )}
      </div>
    );
  }
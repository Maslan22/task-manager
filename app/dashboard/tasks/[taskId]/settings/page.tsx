import { DeleteTask } from "@/app/actions";
import { UploadImageForm } from "@/app/components/dashboard/forms/UploadImageForm";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default async function SettingsSiteRoute({
  params,
}: PageProps) {
  const resolvedParams = await params;

  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/tasks/${resolvedParams.taskId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h3 className="text-xl font-semibold">Go back</h3>
      </div>

      <UploadImageForm taskId={resolvedParams.taskId} />

      <Card className="border-red-500 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Danger</CardTitle>
          <CardDescription>
            This will delete your task and all task associated with it.
            Click the button below to delete everything
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form action={DeleteTask}>
            <input type="hidden" name="taskId" value={resolvedParams.taskId} />
            <SubmitButton text="Delete Everything" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
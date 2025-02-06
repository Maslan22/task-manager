import { DeletePost } from "@/app/actions";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function DeleteForm({
  params,
}: {
  params: { taskId: string; articleId: string };
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Confirm Deletion</CardTitle>
          <CardDescription>
            Are you sure you want to delete this article? Once deleted, all
            associated content will be permanently removed.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant={"secondary"} asChild>
            <Link href={`/dashboard/tasks/${params.taskId}`}>Cancel</Link>
          </Button>
          <form action={DeletePost}>
            <input type="hidden" name="articleId" value={params.articleId} />
            <input type="hidden" name="taskId" value={params.taskId} />
            <SubmitButton variant="destructive" text="Delete Article" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

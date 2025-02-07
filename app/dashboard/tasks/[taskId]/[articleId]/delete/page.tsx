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

type PageParams = Promise<{
  taskId: string;
  articleId: string;
}>;

export default async function DeleteForm({
  params,
}: {
  params: PageParams;
}) {
  const resolvedParams = await params;

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will delete this task and
            remove all data from our server
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/tasks/${resolvedParams.taskId}`}>Cancel</Link>
          </Button>
          <form action={DeletePost}>
            <input type="hidden" name="articleId" value={resolvedParams.articleId} />
            <input type="hidden" name="taskId" value={resolvedParams.taskId} />
            <SubmitButton variant="destructive" text="Delete Article" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
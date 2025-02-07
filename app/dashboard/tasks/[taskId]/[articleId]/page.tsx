import { EditArticleForm } from "@/app/components/dashboard/forms/EditArticleForm";
import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";

type PageParams = Promise<{
  articleId: string;
  taskId: string;
}>;

async function getData(postId: string) {
  const data = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      image: true,
      title: true,
      smallDescription: true,
      slug: true,
      articleContent: true,
      id: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return {
    ...data,
    articleContent: data.articleContent as JSONContent,
  };
}

export default async function EditRoute({ params }: { params: PageParams }) {
  const resolvedParams = await params;
  const data = await getData(resolvedParams.articleId);

  return (
    <div className="">
      <div className="flex items-center">
        <Button size="sm" variant="outline" asChild className="mr-3">
          <Link href={`/dashboard/tasks/${resolvedParams.taskId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit Task</h1>
      </div>

      <EditArticleForm data={data} taskId={resolvedParams.taskId} />
    </div>
  );
}

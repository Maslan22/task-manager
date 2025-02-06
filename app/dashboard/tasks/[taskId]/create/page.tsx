"use client";
import { CreatePostAction } from "@/app/actions";
import TailwindEditor from "@/app/components/dashboard/EditorWrapper";
import { PostSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ArrowLeft, Atom } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import slugify from "react-slugify";
import { title } from "process";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { UploadDropzone } from "@/app/utils/UploadthingComponents";

import { use } from "react";
import { JSONContent } from "novel";

interface ArticleCreationRouteProps {
  params: Promise<{ taskId: string }>;
}

export default function ArticleCreationRoute({
  params,
}: ArticleCreationRouteProps) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.taskId;
  const [imageUrl, setImageUrl] = useState< string>("");
  const [value, setValue] = useState<JSONContent>({
    type: 'doc',
    content: []
  });
  const [slug, setSlugValue] = useState< string>("");
  const [title, setTitle] = useState< string>("");
  const [lastResult, action] = useActionState(CreatePostAction, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  function handleSlugGeneration() {
    const titleInput = title;

    if (titleInput?.length === 0 || titleInput === undefined) {
      return toast.error("Please add a title first");
    }

    setSlugValue(slugify(titleInput));

    return toast.success("Slug has been generated");
  }
  return (
    <>
      <div className="flex items-center">
        <Button size={"sm"} variant={"outline"} className="mr-3" asChild>
          <Link href={`/dashboard/tasks/${taskId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Create Task</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Lorem ipsum dolor sit.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
          >
            <input type="hidden" name="taskId" value={taskId} />
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                key={fields.title.key}
                name={fields.title.name}
                defaultValue={fields.title.initialValue}
                placeholder="Task Title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                key={fields.slug.key}
                name={fields.slug.name}
                defaultValue={fields.slug.initialValue}
                placeholder="Task Slug"
                onChange={(e) => setSlugValue(e.target.value)}
                value={slug}
              />
              <Button
                onClick={handleSlugGeneration}
                className="w-fit"
                variant={"secondary"}
                type="button"
              >
                <Atom className="size-4 mr-2" /> Generate Slug
              </Button>
              <p className="text-red-500 text-sm">{fields.slug.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Small Description</Label>
              <Textarea
                key={fields.smallDescription.key}
                name={fields.smallDescription.name}
                defaultValue={fields.smallDescription.initialValue}
                placeholder="Small Description for your task..."
                className="h-32"
              />
              <p className="text-red-500 text-sm">
                {fields.smallDescription.errors}
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Cover Image</Label>
              <input
                type="hidden"
                key={fields.coverImage.key}
                name={fields.coverImage.name}
                defaultValue={fields.coverImage.initialValue}
                value={imageUrl || ""}
              />
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Uploaded Image"
                  className="object-cover w-[200px] h-[200px] rounded-lg"
                  width={200}
                  height={200}
                />
              ) : (
                <UploadDropzone
                  onClientUploadComplete={(res) => {
                    setImageUrl(res[0].url);
                    toast.success("Image uploaded successfully");
                  }}
                  endpoint={"imageUploader"}
                  onUploadError={() => {
                    toast.error("Something went wrong, Failed to upload image");
                  }}
                />
              )}

              <p className="text-red-500 text-sm">{fields.coverImage.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Task Content</Label>
              <input
                type="hidden"
                key={fields.articleContent.key}
                name={fields.articleContent.name}
                defaultValue={fields.articleContent.initialValue}
                value={JSON.stringify(value)}
              />
              <TailwindEditor onChange={setValue} initialValue={value} />
              <p className="text-red-500 text-sm">
                {fields.articleContent.errors}
              </p>
            </div>

            <SubmitButton text="Create Task" />
          </form>
        </CardContent>
      </Card>
    </>
  );
}

"use client";

import { UploadDropzone } from "@/app/utils/UploadthingComponents";
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
import { Atom } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import TailwindEditor from "../EditorWrapper";
import { SubmitButton } from "../SubmitButtons";
import { useState } from "react";
import { JSONContent } from "novel";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { PostSchema } from "@/app/utils/zodSchemas";
import { EditPostActions } from "@/app/actions";
import slugify from "react-slugify";
import { useRouter } from "next/navigation";

interface iAppProps {
  data: {
    slug: string;
    title: string;
    smallDescription: string;
    articleContent: JSONContent;
    id: string;
    image: string;
  };
  taskId: string;
}

export function EditArticleForm({ data, taskId }: iAppProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(data.image);
  const [value, setValue] = useState<JSONContent>(data.articleContent);
  const [slug, setSlugValue] = useState<string>(data.slug);
  const [title, setTitle] = useState<string>(data.title);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleSubmit = async (formData: FormData) => {
    const result = await EditPostActions(formData);
    
    if (result?.status === "success") {
      toast.success("Post updated successfully!");
      router.push(`/dashboard/tasks/${taskId}`);
    } else if (result?.error) {
      toast.error("Failed to update post");
    }
  };

  function handleSlugGeneration() {
    if (!title || title.length === 0) {
      return toast.error("Please create a title first");
    }

    setSlugValue(slugify(title));
    return toast.success("Slug has been created");
  }

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Task Details</CardTitle>
        <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6"
          id={form.id}
          onSubmit={form.onSubmit}
          action={handleSubmit}
        >
          <input type="hidden" name="articleId" value={data.id} />
          <input type="hidden" name="taskId" value={taskId} />
          
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              key={fields.title.key}
              name={fields.title.name}
              defaultValue={fields.title.initialValue}
              placeholder="Nextjs blogging application"
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
              variant="secondary"
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
              defaultValue={data.smallDescription}
              placeholder="Small Description for your blog task..."
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
              name={fields.coverImage.name}
              key={fields.coverImage.key}
              defaultValue={fields.coverImage.initialValue}
              value={imageUrl}
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
                  toast.success("Image has been uploaded");
                }}
                endpoint="imageUploader"
                onUploadError={() => {
                  toast.error("Something went wrong...");
                }}
              />
            )}
            <p className="text-red-500 text-sm">{fields.coverImage.errors}</p>
          </div>

          <div className="grid gap-2">
            <Label>Task Content</Label>
            <input
              type="hidden"
              name={fields.articleContent.name}
              key={fields.articleContent.key}
              defaultValue={fields.articleContent.initialValue}
              value={JSON.stringify(value)}
            />
            <TailwindEditor onChange={setValue} initialValue={value} />
            <p className="text-red-500 text-sm">
              {fields.articleContent.errors}
            </p>
          </div>

          <SubmitButton text="Edit Task" />
        </form>
      </CardContent>
    </Card>
  );
}
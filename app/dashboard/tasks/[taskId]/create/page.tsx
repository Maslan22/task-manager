"use client";

import { CreatePostAction } from "@/app/actions";
import TailwindEditor from "@/app/components/dashboard/EditorWrapper";
import { UploadDropzone } from "@/app/utils/UploadthingComponents";
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
import { JSONContent } from "novel";
import { use, useState } from "react";
import { toast } from "sonner";
import slugify from "react-slugify";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { useRouter } from "next/navigation";

type ArticleCreationRouteProps = {
  params: Promise<{ taskId: string }>;
};

export default function ArticleCreationRoute({
  params,
}: ArticleCreationRouteProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [value, setValue] = useState<JSONContent | undefined>();
  
  // Initialize form state with empty strings instead of undefined
  const [formState, setFormState] = useState({
    title: "",
    slug: ""
  });

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleSubmit = async (formData: FormData) => {
    const result = await CreatePostAction(formData);
    
    if (result?.status === "success") {
      toast.success("Post created successfully!");
      router.push(`/dashboard/tasks/${formData.get("taskId")}`);
    } else if (result?.error) {
      toast.error("Failed to create post");
    }
  };

  const handleInputChange = (field: 'title' | 'slug', value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSlugGeneration = () => {
    if (formState.title.length === 0) {
      return toast.error("Please create a title first");
    }

    const newSlug = slugify(formState.title);
    handleInputChange('slug', newSlug);
    return toast.success("Slug has been created");
  };

  return (
    <>
      <div className="flex items-center">
        <Button size="icon" variant="outline" className="mr-3" asChild>
          <Link href={`/dashboard/tasks/${resolvedParams.taskId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Create Task</h1>
      </div>

      <Card>
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
            <input type="hidden" name="taskId" value={resolvedParams.taskId} />

            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                value={formState.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nextjs Event Manager application"
              />
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                name={fields.slug.name}
                value={formState.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="Task Slug"
              />
              <Button
                onClick={handleSlugGeneration}
                className="w-fit"
                variant="secondary"
                type="button"
              >
                <Atom className="size-4 mr-2" />
                Generate Slug
              </Button>
              <p className="text-red-500 text-sm">{fields.slug.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Small Description</Label>
              <Textarea
                key={fields.smallDescription.key}
                name={fields.smallDescription.name}
                defaultValue={fields.smallDescription.initialValue}
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
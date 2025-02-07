"use client";

import { CreateSiteAction } from "@/app/actions";
import { taskSchema } from "@/app/utils/zodSchemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";

export default function NewTaskRoute() {
  const router = useRouter();
  const [form, fields] = useForm({
    onValidate({ formData }) {
      const result = parseWithZod(formData, {
        schema: taskSchema,
      });

      if (result.status === "error") {
        toast.error("Please check the form for errors");
      }

      return result;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleSubmit = async (formData: FormData) => {
    const result = await CreateSiteAction(formData);
    
    if (result?.status === "success") {
      toast.success("Task created successfully!");
      router.push("/dashboard/tasks");
    } else if (result?.error) {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Card className="max-w-[450px]">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>
            Create your Event here. Once you are finished, click the button
            below...
          </CardDescription>
        </CardHeader>
        
        <form id={form.id} onSubmit={form.onSubmit} action={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-y-6">
              <div className="grid gap-2">
                <Label>Event Name</Label>
                <Input
                  name={fields.name.name}
                  key={fields.name.key}
                  defaultValue={fields.name.initialValue}
                  placeholder="Event Name"
                />
                <p className="text-red-500 text-sm">{fields.name.errors}</p>
              </div>

              <div className="grid gap-2">
                <Label>Subdirectory</Label>
                <Input
                  name={fields.subdirectory.name}
                  key={fields.subdirectory.key}
                  defaultValue={fields.subdirectory.initialValue}
                  placeholder="Subdirectory"
                />
                <p className="text-red-500 text-sm">
                  {fields.subdirectory.errors}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  name={fields.description.name}
                  key={fields.description.key}
                  defaultValue={fields.description.initialValue}
                  placeholder="Add a brief description of your event"
                />
                <p className="text-red-500 text-sm">
                  {fields.description.errors}
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <SubmitButton text="Submit" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
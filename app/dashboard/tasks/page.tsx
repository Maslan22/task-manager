import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileIcon, PlusCircle, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import DefaultImage from "@/public/default.png";
import { auth } from "@/app/utils/auth";

async function getData(userId: string) {
  const data = await prisma.task.findMany({
    where: {
      userId: userId,
    },
    include: {
      attendees: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function TasksRoute() {
  const user = await auth();
  if (!user) {
    return redirect("/login");
  }

  const data = await getData(user.user.id);
  return (
    <>
      <div className="flex w-full justify-end">
        <Button asChild>
          <Link href={"/dashboard/tasks/new"}>
            <PlusCircle className="size-4 mr-2" /> Create Event
          </Link>
        </Button>
      </div>

      {data === undefined || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
            <FileIcon className="size-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">
            You don't have any Task created
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground max-w-sm mx-auto">
            You don't have any Task. Please create some to view them!
          </p>

          <Button asChild>
            <Link href={"/dashboard/tasks/new"}>
              <PlusCircle className="size-4 mr-2" /> Create Task
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {data.map((item) => (
            <Card key={item.id}>
              <Image
                src={item.imageUrl ?? DefaultImage}
                alt={item.name}
                className="rounded-t-lg object-cover w-full h-[200px]"
                width={400}
                height={200}
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="truncate">{item.name}</CardTitle>
                  <Link href={`/dashboard/tasks/${item.id}/attendees`}>
                    <Button variant="ghost" size="icon" className="relative">
                      <Users className="size-4" />
                      {item.attendees.length > 0 && (
                        <span className="absolute -top-2 -right-2 size-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                          {item.attendees.length}
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </CardHeader>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/tasks/${item.id}`}>
                    View Task
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
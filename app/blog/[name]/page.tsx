import prisma from "@/app/utils/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/app/components/dashboard/ThemeToggle";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Defaultimage from "@/public/default.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getData(subDir: string) {
  // Decode the URL-encoded subdirectory
  const decodedSubDir = decodeURIComponent(subDir);

  console.log("Looking up subdirectory:", decodedSubDir);

  const data = await prisma.task.findUnique({
    where: {
      subdirectory: decodedSubDir,
    },
    select: {
      name: true,
      posts: {
        select: {
          smallDescription: true,
          title: true,
          image: true,
          createdAt: true,
          slug: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!data) {
    console.log("No data found for subdirectory:", decodedSubDir);
    return notFound();
  }

  return data;
}

export default async function BlogIndexPage({
  params,
}: {
  params: { name: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const data = await getData(resolvedParams.name);

  return (
    <>
      <div className="flex items-center gap-x-3 pt-10 pb-5">
        <Button size="icon" variant="outline" asChild>
          <Link href={`/dashboard/tasks`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-medium">Go Back</h1>
      </div>

      <nav className="grid grid-cols-3 my-10">
        <div className="col-span-1" />
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-semibold tracking-tight px-2 whitespace-normal break-normal text-center leading-normal">
            {data.name}
          </h1>
        </div>

        <div className="col-span-1 flex w-full justify-end">
          <ThemeToggle />
        </div>
      </nav>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {data.posts.map((item) => (
          <Card key={item.id}>
            <Image
              src={item.image ?? Defaultimage}
              alt={item.title}
              className="rounded-t-lg object-cover w-full h-[200px]"
              width={400}
              height={200}
            />
            <CardHeader>
              <CardTitle className="truncate">{item.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {item.smallDescription}
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/blog/${resolvedParams.name}/${item.slug}`}>
                  Read more
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

"use client"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Defaultimage from "@/public/default.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { GridIcon, ListIcon, Search, Users } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "./EmptyState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Attendee {
  user: {
    name: string;
    email: string;
  };
}

interface Task {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  attendees: Attendee[];
}

interface Article {
  id: string;
  title: string;
  smallDescription: string;
  image: string;
  taskId: string;
}

interface DashboardContentProps {
  tasks:any;
  articles: any;
}

interface AttendeesBadgeProps {
  attendees: Attendee[];
}

const AttendeesBadge = ({ attendees }: AttendeesBadgeProps) => {
  if (!attendees?.length) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{attendees.length}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {attendees.map((attendee: Attendee, index: number) => (
              <div key={index}>{attendee.user.name}</div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function DashboardContent({ tasks, articles }: DashboardContentProps) {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter((task: Task) => 
    task.name.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredArticles = articles.filter((article: Article) => 
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.smallDescription.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-5">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 border rounded-md">
          <Button
            variant={view === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('grid')}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-5">Your Events</h1>
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description={search ? "No tasks match your search criteria." : "You currently dont have any Tasks. Please create some so that you can see them right here."}
          href="/dashboard/tasks/new"
          buttonText="Create Task"
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {filteredTasks.map((item: Task) => (
            <Card key={item.id}>
              <Image
                src={item.imageUrl ?? Defaultimage}
                alt={item.name}
                className="rounded-t-lg object-cover w-full h-[200px]"
                width={400}
                height={200}
              />
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="truncate">{item.name}</CardTitle>
                  <AttendeesBadge attendees={item.attendees} />
                </div>
                <CardDescription className="line-clamp-3">
                  {item.description}
                </CardDescription>
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
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Task Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[100px]">Attendees</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((item: Task) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        src={item.imageUrl ?? Defaultimage}
                        alt={item.name}
                        className="rounded object-cover w-16 h-16"
                        width={64}
                        height={64}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="line-clamp-2">{item.description}</span>
                    </TableCell>
                    <TableCell>
                      <AttendeesBadge attendees={item.attendees} />
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm">
                        <Link href={`/dashboard/tasks/${item.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <h1 className="text-2xl mt-10 font-semibold mb-5">Recent Task</h1>
      {filteredArticles.length === 0 ? (
        <EmptyState
          title="No articles found"
          description={search ? "No articles match your search criteria." : "Your currently dont have any articles created. Please create some so that you can see them right here"}
          buttonText="Create Task"
          href="/dashboard/tasks"
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {filteredArticles.map((item: Article) => (
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
                  <Link href={`/dashboard/tasks/${item.taskId}/${item.id}`}>
                    Edit Article
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((item: Article) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        src={item.image ?? Defaultimage}
                        alt={item.title}
                        className="rounded object-cover w-16 h-16"
                        width={64}
                        height={64}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="line-clamp-2">{item.smallDescription}</span>
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm">
                        <Link href={`/dashboard/tasks/${item.taskId}/${item.id}`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
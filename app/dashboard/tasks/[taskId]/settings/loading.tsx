import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="size-4" />
        </Button>
        <Skeleton className="h-7 w-24" />
      </div>

      {/* Image Upload Form Skeleton */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Upload Button */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Danger Zone Card */}
      <Card className="border-red-500 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">
            <Skeleton className="h-6 w-24 bg-red-500/20" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full bg-red-500/20" />
            <Skeleton className="h-4 w-4/5 mt-1 bg-red-500/20" />
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Skeleton className="h-10 w-36 bg-red-500/20" />
        </CardFooter>
      </Card>
    </div>
  );
}
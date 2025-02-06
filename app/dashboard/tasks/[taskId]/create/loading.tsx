import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Button size="icon" variant="outline" className="mr-3" disabled>
          <ArrowLeft className="size-4" />
        </Button>
        <Skeleton className="h-7 w-36" />
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-40" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Title Field */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Slug Field */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
              <div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Small Description Field */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Cover Image Field */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>

            {/* Article Content Field */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>

            {/* Submit Button */}
            <Skeleton className="h-10 w-full max-w-[200px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

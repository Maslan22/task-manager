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
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button size="icon" variant="outline" className="mr-3" disabled>
          <ArrowLeft className="size-4" />
        </Button>
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>

            {/* Slug Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Image Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>

            {/* Editor Content */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[400px] w-full" />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
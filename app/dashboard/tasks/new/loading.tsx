import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Card className="max-w-[450px]">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-28" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-6">
            {/* Task Name Field */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>

            {/* Subdirectory Field */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description Field */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" /> {/* Textarea */}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-20" /> {/* Submit Button */}
        </CardFooter>
      </Card>
    </div>
  );
}
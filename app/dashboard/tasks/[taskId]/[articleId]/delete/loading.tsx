import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-36" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5 mt-1" />
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    </div>
  );
}
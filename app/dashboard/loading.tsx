import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Search and View Controls Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-5">
        <Skeleton className="h-10 w-full sm:w-64" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Tasks Section */}
      <div>
        <Skeleton className="h-8 w-32 mb-5" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="border">
              <Skeleton className="h-[200px] rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-4/5 mt-1" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Articles Section */}
      <div>
        <Skeleton className="h-8 w-40 mt-10 mb-5" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="border">
              <Skeleton className="h-[200px] rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-4/5 mt-1" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
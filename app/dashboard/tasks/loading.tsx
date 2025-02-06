import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full sm:w-64" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-x-4">
          <Skeleton className="h-10 w-full sm:w-[130px]" />
          <Skeleton className="h-10 w-full sm:w-[120px]" />
          <Skeleton className="h-10 w-full sm:w-[120px]" />
          <Skeleton className="h-10 w-full sm:w-[140px]" />
        </div>
      </div>

      {/* Content Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-96 mt-1.5" />
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell w-[100px]">
                    <Skeleton className="h-4 w-12" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-14" />
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="sm:hidden">
                          <Skeleton className="h-10 w-10 rounded-md" />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-4/5 sm:hidden" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-4 w-full max-w-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <Skeleton className="h-5 w-48 order-2 sm:order-1" />
            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
              <Skeleton className="h-10 w-full sm:w-24" />
              <Skeleton className="h-10 w-full sm:w-24" />
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Grid View Alternative */}
      <div className="hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <Skeleton className="aspect-video rounded-md" />
                <Skeleton className="h-6 w-4/5 mt-4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-4/5 mt-1" />
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Skeleton className="h-8 w-8" />
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-5 w-48 order-2 sm:order-1" />
          <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
            <Skeleton className="h-10 w-full sm:w-24" />
            <Skeleton className="h-10 w-full sm:w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
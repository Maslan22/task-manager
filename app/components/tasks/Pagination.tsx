import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  view: string;
  search: string;
}

export default function Pagination({
  page,
  totalPages,
  total,
  view,
  search,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground order-2 sm:order-1">
        Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, total)} of {total}{" "}
        results
      </p>
      <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
        <Button
          className="flex-1 sm:flex-none"
          variant="outline"
          disabled={page === 1}
        >
          <Link href={`?view=${view}&page=${page - 1}&search=${search}`}>
            Previous
          </Link>
        </Button>
        <Button
          className="flex-1 sm:flex-none"
          variant="outline"
          disabled={page === totalPages}
        >
          <Link href={`?view=${view}&page=${page + 1}&search=${search}`}>
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
}

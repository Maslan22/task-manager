'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

export function SearchInput({ defaultValue = '' }: { defaultValue?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page on search
    replace(`${pathname}?${params.toString()}`);
  }, 100);

  return (
    <div className="relative w-64">
      <Input
        type="text"
        placeholder="Search tasks..."
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="pr-8"
      />
      <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
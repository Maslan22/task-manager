'use client';

import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
}

function SearchInputContent({
  defaultValue = '',
  placeholder = "Search tasks..."
}: SearchInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    
    // Maintain existing view parameter if it exists
    const currentView = params.get('view');
    params.delete('search');
    params.delete('page');
    params.delete('view');

    if (term) {
      params.set('search', term);
    }
    
    // Reset to first page
    params.set('page', '1');
    
    // Restore view parameter if it existed
    if (currentView) {
      params.set('view', currentView);
    }

    // Clean URL by removing empty search params
    const newParams = params.toString();
    replace(`${pathname}${newParams ? `?${newParams}` : ''}`);
  }, 300);

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-8"
        aria-label="Search"
      />
    </div>
  );
}

export function SearchInput(props: SearchInputProps) {
  return (
    <Suspense fallback={
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={props.placeholder}
          className="pl-8"
          disabled
          aria-label="Loading search..."
        />
      </div>
    }>
      <SearchInputContent {...props} />
    </Suspense>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavLinks } from "@/app/admin/layout";
import { cn } from "@/lib/utils";

export function AdminItems() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      {adminNavLinks.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-x-2 text-slate-600 dark:text-slate-400 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors",
              isActive && "text-primary dark:text-primary bg-slate-100 dark:bg-slate-800"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
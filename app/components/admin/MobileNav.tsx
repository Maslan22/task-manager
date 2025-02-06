"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { adminNavLinks } from './AdminNavLinks';



export const MobileNav = () => {
  const pathname = usePathname();
  const navItems = adminNavLinks.slice(0, 2); // Only show first 2 items in bottom nav

  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t bg-background md:hidden">
        <div className="mx-auto grid h-full max-w-lg grid-cols-3 font-medium">
          {navItems.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{link.name}</span>
              </Link>
            );
          })}
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50">
                <Menu className="h-5 w-5" />
                <span className="text-xs">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  Admin<span className="text-primary">Panel</span>
                </SheetTitle>
                <SheetDescription>
                  Navigate through admin dashboard
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex flex-col gap-4 py-4">
                <nav className="flex flex-col gap-2">
                  {adminNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted ${
                          isActive ? "bg-muted" : ""
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="pb-16 md:pb-0" />
    </>
  );
};

export default MobileNav;
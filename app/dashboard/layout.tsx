import Link from "next/link";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import { CircleUser, DollarSign, Globe, Home } from "lucide-react";
import { ThemeToggle } from "../components/dashboard/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DashboardItems } from "../components/dashboard/DashboardItems";
import { auth } from "../utils/auth";
import { UserDropdown } from "../components/dashboard/UserMenu";
import MobileNav from "../components/dashboard/MobileNav";

export const navLinks = [
  {
    name: "Events",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Tasks",
    href: "/dashboard/tasks",
    icon: Globe,
  },
  // {
  //   name: "Pricing",
  //   href: "/dashboard/pricing",
  //   icon: DollarSign,
  // },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  const username = user?.user?.name;
  return (
    <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <h3 className="text-2xl">
                Task<span className="text-primary">Manager</span>
              </h3>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 font-medium lg:px-4">
              <DashboardItems />
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Show logo on mobile */}
          <div className="md:hidden">
            <h3 className="text-xl font-semibold">
              Task<span className="text-primary">Manager</span>
            </h3>
          </div>
          
          <div className="ml-auto flex items-center gap-x-5">
            <ThemeToggle />
            <UserDropdown username={username} />
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>

        {/* Mobile Navigation */}
        <MobileNav username={username} />
      </div>
    </section>
  );
}
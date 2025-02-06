import Link from "next/link";
import { Users, BarChart3, Layout } from "lucide-react";
import { auth } from "../utils/auth";
import { ThemeToggle } from "../components/dashboard/ThemeToggle";
import { UserDropdown } from "../components/dashboard/UserMenu";
import { AdminItems } from "../components/admin/AdminItems";
import MobileNav from "../components/admin/MobileNav";

export const adminNavLinks = [
  {
    name: "Overview",
    href: "/admin",
    icon: Layout,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export default async function AdminLayout({
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
                Admin<span className="text-primary">Panel</span>
              </h3>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 font-medium lg:px-4">
              <AdminItems />
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
              Admin<span className="text-primary">Panel</span>
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
        <MobileNav  />
      </div>
    </section>
  );
}

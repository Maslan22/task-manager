import { Users, BarChart3, Layout } from "lucide-react";

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
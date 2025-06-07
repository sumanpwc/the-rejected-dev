// Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, BarChart, Settings } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Articles", href: "/admin/articles", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 bg-white shadow-md p-4">
      <div className="text-xl font-semibold mb-6">Admin Panel</div>
      <nav className="space-y-2">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-4 py-2 rounded-xl transition hover:bg-gray-100",
              pathname?.startsWith(href) && "bg-gray-200 font-semibold"
            )}
          >
            <Icon className="h-5 w-5" />
            {name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

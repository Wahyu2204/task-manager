"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Settings,
  LogOut,
  CheckSquare,
  Timer,
  Archive,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { signOut } from "@/app/login/actions";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false); // Default terbuka

  const menuItems = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/dashboard/archive", label: "Archive", icon: Archive },
    { href: "/dashboard/pomodoro", label: "Timer", icon: Timer },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "bg-white border-r border-zinc-200 hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* HEADER SIDEBAR */}
      <div
        className={cn(
          "flex items-center border-b border-zinc-200 h-16 transition-all",
          isCollapsed ? "justify-center" : "justify-between px-6",
        )}
      >
        {/* Judul */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 animate-in fade-in duration-300">
            {/* Logo Kotak Hitam */}
            <div className="h-8 w-8 bg-zinc-900 rounded-md flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
              <span className="text-white font-bold text-lg">S</span>
            </div>

            <span className="text-xl font-bold tracking-tight text-zinc-900 whitespace-nowrap">
              SudoDo.
            </span>
          </div>
        )}

        {/* Tombol Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-500 hover:text-black"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* MENU NAVIGASI */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full transition-all duration-300 border-2",
                  isCollapsed
                    ? "justify-center px-0 h-10 w-10 mx-auto"
                    : "justify-start px-3",

                  isActive
                    ? "border-black text-black font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white"
                    : "border-transparent text-zinc-600 hover:text-black hover:bg-zinc-200",
                )}
                title={isCollapsed ? item.label : ""} // Tooltip sederhana pas collapsed
              >
                <item.icon
                  className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")}
                />

                {/* Text Menu (Cuma muncul kalau expanded) */}
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
                    {item.label}
                  </span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER (LOGOUT) */}
      <div className="p-4 border-t border-zinc-200">
        <form action={signOut}>
          <Button
            variant="destructive"
            className={cn(
              "w-full transition-all",
              isCollapsed
                ? "justify-center px-0 h-10 w-10 mx-auto"
                : "justify-start px-4",
            )}
            title="Logout"
          >
            <LogOut className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
          </Button>
        </form>
      </div>
    </aside>
  );
}

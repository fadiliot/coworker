"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Users, Settings, Mail, Clock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/emails", label: "Inbox Monitor", icon: Mail },
  { href: "/tasks", label: "Task Approvals", icon: CheckSquare },
  { href: "/leads", label: "Lead Tracking", icon: Users },
  { href: "/followups", label: "Follow-ups", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">SalesHub <span className="text-primary">AI</span></span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3 pb-2 pt-1">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
                {item.href === "/tasks" && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-black">3</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
              FA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Fadil Anwar</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>AI Sales Assistant</span>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">{pathname.replace("/", "") || "dashboard"}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative h-9 w-9 rounded-lg border border-border bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-yellow-500"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              FA
            </div>
          </div>
        </header>
        <div className="p-6 overflow-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

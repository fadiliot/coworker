import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckSquare, Mail, Clock, Activity, TrendingUp, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Total Leads", value: "248", change: "+12 today", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Pending Tasks", value: "3", change: "Needs approval", icon: CheckSquare, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { title: "Emails Monitored", value: "1,084", change: "Last 30 days", icon: Mail, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Follow-ups Queued", value: "7", change: "Next 7 days", icon: Clock, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  const recentActivity = [
    { action: "Lead Detected", detail: "Alice Freeman from TechCorp", time: "5 min ago", type: "lead" },
    { action: "Draft Response Generated", detail: "For Alice Freeman · Demo Request", time: "5 min ago", type: "task" },
    { action: "Email Approved & Sent", detail: "To Bob Smith at Acme Inc", time: "1 hr ago", type: "sent" },
    { action: "Follow-up Scheduled", detail: "BigCorp · Partnership Opportunity", time: "2 hr ago", type: "followup" },
    { action: "Lead Detected", detail: "Charlie Davis from Startup.co", time: "3 hr ago", type: "lead" },
    { action: "Task Rejected", detail: "Marketing email to Diana Prince", time: "4 hr ago", type: "rejected" },
  ];

  const activityColors: Record<string, string> = {
    lead: "bg-blue-500",
    task: "bg-yellow-500",
    sent: "bg-green-500",
    followup: "bg-purple-500",
    rejected: "bg-red-500",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">AI Sales Assistant is actively monitoring your inbox.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:border-primary/40 transition-colors">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.title === "Pending Tasks" ? "text-yellow-400" : "text-muted-foreground"}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity feed */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" /> Recent AI Activity
            </CardTitle>
            <span className="text-xs text-primary font-medium flex items-center gap-1">Live <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" /></span>
          </CardHeader>
          <CardContent className="space-y-0">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${activityColors[item.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">{item.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Review Pending Tasks", href: "/tasks", badge: "3", badgeVariant: "warning" as const },
              { label: "View Inbox Monitor", href: "/emails", badge: null, badgeVariant: undefined },
              { label: "Check Follow-ups", href: "/followups", badge: "2", badgeVariant: "default" as const },
              { label: "Lead Tracking", href: "/leads", badge: null, badgeVariant: undefined },
              { label: "Connect Email Account", href: "/settings", badge: "!", badgeVariant: "destructive" as const },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-secondary transition-colors group"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge && item.badgeVariant && (
                    <Badge variant={item.badgeVariant} className="text-[10px] px-1.5 py-0">{item.badge}</Badge>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

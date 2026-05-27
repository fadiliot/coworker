"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Search, ChevronDown, Eye, Mail } from "lucide-react";

const DUMMY_LEADS = [
  { id: 1, name: "Alice Freeman", email: "alice.freeman@techcorp.io", company: "TechCorp", intent: "Demo Request", status: "CONTACTED", createdAt: "2026-05-11", tasks: 2 },
  { id: 2, name: "Bob Smith", email: "bob.smith@acme.com", company: "Acme Inc", intent: "Pricing Inquiry", status: "NEW", createdAt: "2026-05-11", tasks: 1 },
  { id: 3, name: "Charlie Davis", email: "cdavis@startup.co", company: "Startup.co", intent: "API Integration Help", status: "QUALIFIED", createdAt: "2026-05-10", tasks: 3 },
  { id: 4, name: "BigCorp Marketing", email: "marketing@bigcorp.com", company: "BigCorp", intent: "Partnership Opportunity", status: "NEW", createdAt: "2026-05-10", tasks: 1 },
  { id: 5, name: "Diana Prince", email: "diana@enterprise.io", company: "Enterprise IO", intent: "Enterprise Plan Inquiry", status: "QUALIFIED", createdAt: "2026-05-09", tasks: 2 },
  { id: 6, name: "Ethan Grey", email: "ethan@pixelworks.io", company: "PixelWorks", intent: "Trial Request", status: "LOST", createdAt: "2026-05-08", tasks: 0 },
];

const STATUS_STYLES: Record<string, "default" | "success" | "secondary" | "destructive" | "warning"> = {
  NEW: "default",
  CONTACTED: "warning",
  QUALIFIED: "success",
  LOST: "destructive",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = DUMMY_LEADS.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL: DUMMY_LEADS.length,
    NEW: DUMMY_LEADS.filter((l) => l.status === "NEW").length,
    CONTACTED: DUMMY_LEADS.filter((l) => l.status === "CONTACTED").length,
    QUALIFIED: DUMMY_LEADS.filter((l) => l.status === "QUALIFIED").length,
    LOST: DUMMY_LEADS.filter((l) => l.status === "LOST").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lead Tracking</h1>
          <p className="text-muted-foreground text-sm mt-1">Leads automatically extracted from inbound emails by the AI.</p>
        </div>
        <Button size="sm">
          <Users className="h-4 w-4 mr-2" />Export Leads
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              statusFilter === status
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {status} <span className="ml-1 opacity-70">({count})</span>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />{filtered.length} Leads
          </CardTitle>
          <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              className="bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground w-44"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-b-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-muted-foreground border-y border-border">
                <tr>
                  <th className="px-5 py-3 font-medium text-left">Lead</th>
                  <th className="px-5 py-3 font-medium text-left">Company</th>
                  <th className="px-5 py-3 font-medium text-left">Intent Detected</th>
                  <th className="px-5 py-3 font-medium text-left">Tasks</th>
                  <th className="px-5 py-3 font-medium text-left">Added</th>
                  <th className="px-5 py-3 font-medium text-right">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-accent/10 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{lead.company}</td>
                    <td className="px-5 py-3.5 text-muted-foreground max-w-[200px] truncate">{lead.intent}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {lead.tasks} task{lead.tasks !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{lead.createdAt}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Badge variant={STATUS_STYLES[lead.status] || "default"}>{lead.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="h-7 w-7 rounded-md hover:bg-secondary flex items-center justify-center" title="View">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="h-7 w-7 rounded-md hover:bg-secondary flex items-center justify-center" title="Send Email">
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

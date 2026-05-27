"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Check, Mail, Calendar, RefreshCw } from "lucide-react";

const DUMMY_FOLLOWUPS = [
  {
    id: "1",
    lead: "Alice Freeman",
    company: "TechCorp",
    email: "alice.freeman@techcorp.io",
    subject: "Re: Demo Request for Your AI Platform",
    scheduledFor: "2026-05-13T10:00:00Z",
    draftText: "Hi Alice,\n\nJust following up on my previous email about the demo. I'd love to connect and show you how our platform can help TechCorp streamline your sales pipeline.\n\nAre you available for a 30-minute call this week?\n\nBest regards",
    status: "APPROVED",
  },
  {
    id: "2",
    lead: "Bob Smith",
    company: "Acme Inc",
    email: "bob.smith@acme.com",
    subject: "Pricing Information Follow-up",
    scheduledFor: "2026-05-14T14:00:00Z",
    draftText: "Hi Bob,\n\nI wanted to follow up on your pricing inquiry. I've attached our latest pricing guide and would be happy to walk you through a customized plan.\n\nLet me know if you have any questions!\n\nBest",
    status: "PENDING_APPROVAL",
  },
  {
    id: "3",
    lead: "BigCorp Marketing",
    company: "BigCorp",
    email: "marketing@bigcorp.com",
    subject: "Partnership Opportunity - Next Steps",
    scheduledFor: "2026-05-16T09:00:00Z",
    draftText: "Hi,\n\nThank you for reaching out about a potential partnership! I'd love to explore this further.\n\nWould you be available for an introductory call next week?\n\nLooking forward to hearing from you!",
    status: "PENDING_APPROVAL",
  },
];

export default function FollowupsPage() {
  const [followups, setFollowups] = useState(DUMMY_FOLLOWUPS);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleApprove = (id: string) => {
    setFollowups((prev) => prev.map((f) => f.id === id ? { ...f, status: "APPROVED" } : f));
  };

  const isPast = (iso: string) => new Date(iso) < new Date();
  const pending = followups.filter((f) => f.status === "PENDING_APPROVAL");
  const approved = followups.filter((f) => f.status === "APPROVED");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Follow-up Scheduling</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-scheduled follow-ups awaiting approval and execution.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />Schedule Manually
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Approval", value: pending.length, color: "text-yellow-500" },
          { label: "Approved & Scheduled", value: approved.length, color: "text-green-500" },
          { label: "Total Scheduled", value: followups.length, color: "text-primary" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" /> Awaiting Approval
          </h2>
          <div className="space-y-3">
            {pending.map((f) => (
              <Card key={f.id} className="border-yellow-500/30 hover:border-yellow-500/60 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold shrink-0">
                        {f.lead.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{f.lead}</p>
                          {f.company && <span className="text-muted-foreground text-sm">· {f.company}</span>}
                          <Badge variant="warning">Pending</Badge>
                        </div>
                        <p className="text-sm font-medium mt-0.5">{f.subject}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Scheduled: {formatDate(f.scheduledFor)}</span>
                          {isPast(f.scheduledFor) && <Badge variant="destructive" className="text-[10px] px-1 py-0">Overdue</Badge>}
                        </div>
                        <div className="mt-3 bg-secondary/50 rounded-lg p-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap border border-border/50 max-h-24 overflow-hidden">
                          {f.draftText}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" onClick={() => handleApprove(f.id)}>
                        <Check className="h-3.5 w-3.5 mr-1" />Approve
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-3.5 w-3.5 mr-1" />Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" /> Approved & Scheduled
          </h2>
          <div className="space-y-3">
            {approved.map((f) => (
              <Card key={f.id} className="opacity-75 border-green-500/20">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold shrink-0">
                      {f.lead.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{f.lead}</p>
                        <Badge variant="success">Approved</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{f.subject}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>Will send: {formatDate(f.scheduledFor)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

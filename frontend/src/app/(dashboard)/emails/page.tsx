"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Search, ChevronRight, RefreshCw, Bot, Clock } from "lucide-react";

const DUMMY_EMAILS = [
  {
    id: "1",
    from: "alice.freeman@techcorp.io",
    name: "Alice Freeman",
    subject: "Demo Request for Your AI Platform",
    preview: "Hi there, I came across your platform and would love to schedule a demo. We're a 50-person tech company looking for...",
    body: "Hi there,\n\nI came across your platform and would love to schedule a demo. We're a 50-person tech company looking for a better way to manage our sales pipeline and I think your AI assistant could be a great fit.\n\nLet me know your availability this week!\n\nBest,\nAlice Freeman\nHead of Growth, TechCorp",
    receivedAt: "2026-05-11T12:30:00Z",
    isProcessed: true,
    lead: { name: "Alice Freeman", intent: "Demo Request" },
    taskGenerated: true,
  },
  {
    id: "2",
    from: "bob.smith@acme.com",
    name: "Bob Smith",
    subject: "Pricing Inquiry",
    preview: "Hello, Can you send over your pricing plans? We're currently evaluating vendors and your product looks promising...",
    body: "Hello,\n\nCan you send over your pricing plans? We're currently evaluating vendors and your product looks promising.\n\nBest,\nBob Smith",
    receivedAt: "2026-05-11T11:00:00Z",
    isProcessed: true,
    lead: { name: "Bob Smith", intent: "Pricing Inquiry" },
    taskGenerated: true,
  },
  {
    id: "3",
    from: "cdavis@startup.co",
    name: "Charlie Davis",
    subject: "API Integration Help",
    preview: "Hey team, We're trying to integrate your API into our existing system but running into some issues with the authentication...",
    body: "Hey team,\n\nWe're trying to integrate your API into our existing system but running into some issues with the authentication flow. Can someone help?\n\nThanks,\nCharlie",
    receivedAt: "2026-05-11T09:00:00Z",
    isProcessed: false,
    lead: null,
    taskGenerated: false,
  },
  {
    id: "4",
    from: "marketing@bigcorp.com",
    name: "BigCorp Marketing",
    subject: "Partnership Opportunity",
    preview: "We're interested in exploring a potential partnership. Our company serves 10,000+ SMBs and we believe...",
    body: "We're interested in exploring a potential partnership. Our company serves 10,000+ SMBs and we believe there's a strong synergy between our products.",
    receivedAt: "2026-05-10T15:00:00Z",
    isProcessed: true,
    lead: { name: "BigCorp", intent: "Partnership" },
    taskGenerated: true,
  },
];

export default function EmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState<typeof DUMMY_EMAILS[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = DUMMY_EMAILS.filter(
    (e) =>
      e.from.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Email List */}
      <div className="w-96 shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Inbox Monitor</h1>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            className="bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground w-full"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                selectedEmail?.id === email.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-accent/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                    {email.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{email.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{email.from}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">{formatTime(email.receivedAt)}</p>
                </div>
              </div>
              <p className="text-sm font-medium mt-1 truncate">{email.subject}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{email.preview}</p>
              <div className="flex gap-1.5 mt-2">
                {email.isProcessed ? (
                  <Badge variant="success" className="text-[10px] px-1.5 py-0">
                    <Bot className="h-2.5 w-2.5 mr-1" /> AI Processed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">Pending</Badge>
                )}
                {email.taskGenerated && (
                  <Badge variant="warning" className="text-[10px] px-1.5 py-0">Task Queued</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Detail */}
      <div className="flex-1 min-w-0">
        {selectedEmail ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">{selectedEmail.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    From: <span className="font-medium text-foreground">{selectedEmail.from}</span> · {formatTime(selectedEmail.receivedAt)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {selectedEmail.lead && (
                    <Badge variant="success">Lead Detected</Badge>
                  )}
                  {selectedEmail.taskGenerated && (
                    <Badge variant="warning">Task Queued</Badge>
                  )}
                </div>
              </div>
              {selectedEmail.lead && (
                <div className="mt-3 rounded-lg bg-primary/10 border border-primary/20 p-3">
                  <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5" /> AI Analysis
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    <span className="font-medium">Lead:</span> {selectedEmail.lead.name} ·{" "}
                    <span className="font-medium">Intent:</span> {selectedEmail.lead.intent}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-6">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {selectedEmail.body}
              </pre>
            </CardContent>
          </Card>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Select an email to read</h3>
            <p className="text-sm text-muted-foreground mt-1">Click any email on the left to view its full content and AI analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
}

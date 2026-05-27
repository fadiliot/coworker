"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchTasks, approveTask } from "@/lib/api";
import { Check, X, Mail, Edit3 } from "lucide-react";
import { useEffect } from "react";

// Edit Modal Component
function EditModal({ task, onClose, onSave }: { task: any; onClose: () => void; onSave: (text: string) => void }) {
  const [draft, setDraft] = useState<string>(task.payload?.draftText || JSON.stringify(task.payload, null, 2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold">Edit AI Draft</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Edit the draft before approving and sending.</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 flex-1 overflow-auto">
          <textarea
            className="w-full h-64 bg-secondary/50 border border-border rounded-lg p-4 text-sm font-mono text-foreground resize-y outline-none focus:border-primary transition-colors"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(draft)}>
            <Check className="h-4 w-4 mr-2" />
            Approve & Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await fetchTasks();
    setTasks(data);
    setLoading(false);
  };

  const handleAction = async (taskId: string, action: string, editedText?: string) => {
    const editedPayload = editedText ? { draftText: editedText } : undefined;
    await approveTask(taskId, action, editedPayload);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Task Approvals</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {editingTask && (
        <EditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(text) => handleAction(editingTask.id, "EDIT_AND_APPROVE", text)}
        />
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Task Approvals</h1>
            <p className="text-muted-foreground text-sm mt-1">Review and approve AI-generated actions before execution.</p>
          </div>
          <Badge variant="warning" className="text-sm px-3 py-1">{tasks.length} Pending</Badge>
        </div>

        {tasks.length === 0 ? (
          <Card className="bg-card/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-16 text-center">
              <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <Check className="h-7 w-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold">All Caught Up!</h3>
              <p className="text-muted-foreground mt-1">No pending tasks waiting for approval right now.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {tasks.map((task) => {
              const lead = task.emailMessage?.leads?.[0];
              const leadName = lead?.name || lead?.email || task.emailMessage?.from || "Unknown Lead";
              const company = lead?.company;

              return (
                <Card key={task.id} className="flex flex-col border-border hover:border-primary/40 transition-colors duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base leading-tight">
                            {task.type.replace(/_/g, " ")}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {leadName}{company ? ` · ${company}` : ""}
                          </p>
                        </div>
                      </div>
                      <Badge variant="warning" className="shrink-0">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="bg-secondary/40 rounded-lg p-4 text-sm font-mono text-secondary-foreground whitespace-pre-wrap border border-border/50 max-h-48 overflow-y-auto leading-relaxed">
                      {task.payload?.draftText || JSON.stringify(task.payload, null, 2)}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 justify-end border-t border-border pt-4">
                    <Button variant="outline" size="sm" className="text-red-400 hover:text-red-500 hover:border-red-500/50" onClick={() => handleAction(task.id, "REJECT")}>
                      <X className="h-3.5 w-3.5 mr-1.5" />Reject
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditingTask(task)}>
                      <Edit3 className="h-3.5 w-3.5 mr-1.5" />Edit Draft
                    </Button>
                    <Button size="sm" onClick={() => handleAction(task.id, "APPROVE")}>
                      <Check className="h-3.5 w-3.5 mr-1.5" />Approve & Send
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

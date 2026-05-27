"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Mail, Bot, Shield, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    pollingInterval: "2",
    maxEmailsPerRun: "10",
    autoProcess: true,
  });
  const [aiSettings, setAiSettings] = useState({
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    temperature: "0.7",
    autoGenerateFollowups: true,
  });
  const [azureConnected] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure your AI Sales Assistant system.</p>
      </div>

      {/* Azure Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-4 w-4" /> Email Account (Azure / Microsoft 365)
          </CardTitle>
          <CardDescription>Connect your Outlook inbox for automated monitoring.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${azureConnected ? "bg-green-500/10" : "bg-secondary"}`}>
                <Mail className={`h-5 w-5 ${azureConnected ? "text-green-500" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="font-medium text-sm">{azureConnected ? "Microsoft 365 Connected" : "Not Connected"}</p>
                <p className="text-xs text-muted-foreground">
                  {azureConnected ? "Monitoring your Outlook inbox" : "Connect your account to enable email monitoring"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={azureConnected ? "success" : "destructive"}>
                {azureConnected ? (
                  <><CheckCircle className="h-3 w-3 mr-1" />Connected</>
                ) : (
                  <><AlertCircle className="h-3 w-3 mr-1" />Disconnected</>
                )}
              </Badge>
              <Button
                size="sm"
                variant={azureConnected ? "outline" : "default"}
                onClick={() => window.open("http://localhost:3001/api/auth/microsoft", "_blank")}
              >
                {azureConnected ? "Reconnect" : "Connect Account"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Monitoring Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" /> Email Monitoring
          </CardTitle>
          <CardDescription>Configure how the system polls and processes inbound emails.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Polling Interval (minutes)</label>
              <input
                type="number"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                value={emailSettings.pollingInterval}
                onChange={(e) => setEmailSettings({ ...emailSettings, pollingInterval: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Emails Per Run</label>
              <input
                type="number"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                value={emailSettings.maxEmailsPerRun}
                onChange={(e) => setEmailSettings({ ...emailSettings, maxEmailsPerRun: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">Auto-process new emails</p>
              <p className="text-xs text-muted-foreground">Automatically run AI analysis when a new email arrives</p>
            </div>
            <button
              onClick={() => setEmailSettings({ ...emailSettings, autoProcess: !emailSettings.autoProcess })}
              className={`relative w-11 h-6 rounded-full transition-colors ${emailSettings.autoProcess ? "bg-primary" : "bg-secondary border border-border"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${emailSettings.autoProcess ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-4 w-4" /> AI Engine Configuration
          </CardTitle>
          <CardDescription>Configure the AI models used for lead detection and response drafting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary AI Model</label>
              <select
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                value={aiSettings.model}
                onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
              >
                <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Groq)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gpt-4o">GPT-4o (OpenAI)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Temperature</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                value={aiSettings.temperature}
                onChange={(e) => setAiSettings({ ...aiSettings, temperature: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">Auto-generate follow-up tasks</p>
              <p className="text-xs text-muted-foreground">AI will automatically schedule follow-up emails for unresponsive leads</p>
            </div>
            <button
              onClick={() => setAiSettings({ ...aiSettings, autoGenerateFollowups: !aiSettings.autoGenerateFollowups })}
              className={`relative w-11 h-6 rounded-full transition-colors ${aiSettings.autoGenerateFollowups ? "bg-primary" : "bg-secondary border border-border"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${aiSettings.autoGenerateFollowups ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" /> Security & API Keys
          </CardTitle>
          <CardDescription>Manage your API keys and security configuration in the backend <code className="text-xs bg-secondary px-1 rounded">.env</code> file.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { label: "Groq API Key", key: "GROQ_API_KEY", status: "configured" },
              { label: "Gemini API Key", key: "GEMINI_API_KEY", status: "configured" },
              { label: "Azure Client ID", key: "AZURE_CLIENT_ID", status: "not-set" },
              { label: "Azure Client Secret", key: "AZURE_CLIENT_SECRET", status: "not-set" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.key}</p>
                </div>
                <Badge variant={item.status === "configured" ? "success" : "destructive"}>
                  {item.status === "configured" ? "Configured" : "Not Set"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="min-w-32">
          {saved ? <><CheckCircle className="h-4 w-4 mr-2" />Saved!</> : <><Save className="h-4 w-4 mr-2" />Save Settings</>}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const save = () => toast.success("Settings saved successfully");

  return (
    <AdminPageShell title="Settings" subtitle="Manage your cafe settings" icon={<Settings className="w-5 h-5" />}>
      <div className="max-w-2xl space-y-8">
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Business Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
              <Input defaultValue="+212 656480972" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
              <Input defaultValue="contact@dawdicafe.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Instagram URL</label>
              <Input defaultValue="https://www.instagram.com/cafe_dawdi/" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Google Maps URL</label>
              <Input defaultValue="https://maps.app.goo.gl/z2hZuQ2UtCsZoZDGA" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Working Hours</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Weekdays</label>
              <Input defaultValue="8:00 AM - 11:00 PM" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Weekends</label>
              <Input defaultValue="9:00 AM - 12:00 AM" />
            </div>
          </div>
        </div>

        <Button onClick={save} className="gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </AdminPageShell>
  );
}

function AdminPageShell({ children, title, subtitle, icon }: { children: React.ReactNode; title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">{icon}</div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

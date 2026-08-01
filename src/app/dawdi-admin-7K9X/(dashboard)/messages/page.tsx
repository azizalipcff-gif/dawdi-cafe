import { MessageSquare } from "lucide-react";
import { getMessages } from "@/lib/data";
import { MessagesManager } from "./MessagesManager";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted">Contact form submissions</p>
        </div>
      </div>
      <MessagesManager messages={messages} />
    </div>
  );
}

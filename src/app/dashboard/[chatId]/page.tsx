import { use } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatLayout } from "@/components/layout/ChatLayout";

interface ChatPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = use(params);

  return (
    <ChatLayout>
      <ChatInterface chatId={resolvedParams.chatId} />
    </ChatLayout>
  );
}
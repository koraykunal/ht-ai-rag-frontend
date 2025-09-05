import {ChatInterface} from "@/components/chat/ChatInterface";
import {ChatLayout} from "@/components/layout/ChatLayout";

export default function DashboardPage() {
    return (
        <ChatLayout>
            <ChatInterface/>
        </ChatLayout>
    );
}

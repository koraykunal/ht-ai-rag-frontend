"use client";

import { useEffect, useRef, useState } from "react";
import { ragApi } from "@/lib/api";
import { AiInput } from "./ai-input";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/Button";
import { Scale } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

// Court name mapping
const COURT_NAMES: Record<number, string> = {
  38: 'Adana Bölge Adliye Mahkemesi 1. Hukuk Dairesi',
  39: 'Adana Bölge Adliye Mahkemesi 2. Hukuk Dairesi',
  40: 'Adana Bölge Adliye Mahkemesi 3. Hukuk Dairesi',
  41: 'Adana Bölge Adliye Mahkemesi 4. Hukuk Dairesi',
  42: 'Adana Bölge Adliye Mahkemesi 5. Hukuk Dairesi',
  43: 'Adana Bölge Adliye Mahkemesi 6. Hukuk Dairesi',
  44: 'Adana Bölge Adliye Mahkemesi 7. Hukuk Dairesi',
  45: 'Adana Bölge Adliye Mahkemesi 8. Hukuk Dairesi',
  46: 'Adana Bölge Adliye Mahkemesi 9. Hukuk Dairesi',
  47: 'Adana Bölge Adliye Mahkemesi 10. Hukuk Dairesi',
  48: 'Adana Bölge Adliye Mahkemesi 11. Hukuk Dairesi',
  49: 'Adana Bölge Adliye Mahkemesi 12. Hukuk Dairesi',
  50: 'Adana Bölge Adliye Mahkemesi 13. Hukuk Dairesi',
  51: 'Adana Bölge Adliye Mahkemesi 14. Hukuk Dairesi',
  4056: 'Yargıtay Hukuk Genel Kurulu',
  4057: 'Yargıtay 1. Hukuk Dairesi',
  4058: 'Yargıtay 2. Hukuk Dairesi',
  4059: 'Yargıtay 3. Hukuk Dairesi',
  4060: 'Yargıtay 4. Hukuk Dairesi',
  4061: 'Yargıtay 5. Hukuk Dairesi',
  4062: 'Yargıtay 6. Hukuk Dairesi',
  4063: 'Yargıtay 7. Hukuk Dairesi',
  4064: 'Yargıtay 8. Hukuk Dairesi',
  4065: 'Yargıtay 9. Hukuk Dairesi',
  4066: 'Yargıtay 10. Hukuk Dairesi',
  4067: 'Yargıtay 11. Hukuk Dairesi',
  4068: 'Yargıtay 12. Hukuk Dairesi',
  4069: 'Yargıtay 13. Hukuk Dairesi',
  4070: 'Yargıtay 14. Hukuk Dairesi',
  4071: 'Yargıtay 15. Hukuk Dairesi',
  4072: 'Yargıtay 16. Hukuk Dairesi',
  4073: 'Yargıtay 17. Hukuk Dairesi',
  4074: 'Yargıtay 18. Hukuk Dairesi',
  4075: 'Yargıtay 19. Hukuk Dairesi',
  4076: 'Yargıtay 20. Hukuk Dairesi',
  4077: 'Yargıtay 21. Hukuk Dairesi',
  4091: 'Anayasa Mahkemesi',
  4554: 'Danıştay 1. Dairesi',
  4555: 'Danıştay 2. Dairesi',
  4556: 'Danıştay 3. Dairesi',
  4557: 'Danıştay 4. Dairesi',
  4558: 'Danıştay 5. Dairesi',
  4559: 'Danıştay 6. Dairesi',
  4560: 'Danıştay 7. Dairesi',
  4561: 'Danıştay 8. Dairesi',
  4562: 'Danıştay 9. Dairesi',
  4563: 'Danıştay 10. Dairesi',
  4564: 'Danıştay 11. Dairesi',
  4565: 'Danıştay 12. Dairesi',
  4566: 'Danıştay 13. Dairesi',
  2402: 'Yayında - Tasnifsiz',
  2403: 'Gözden Geçirilecek',
  2404: 'Onaylandı',
  2405: 'Yayında',
};

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export function ChatInterface() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await ragApi.ask({ question: content });

      let formattedContent = "";
      
      if (response.data?.short_conclusion) {
        formattedContent += `**${t("chat.summary")}:**\n${response.data.short_conclusion}\n\n`;
      }
      
      if (response.data?.detailed_reasoning) {
        let detailedText = response.data.detailed_reasoning;
        
        detailedText = detailedText
          .replace(/DETAILED EXPLANATION:?-?\s*/i, '')
          .replace(/SOURCE \d+/g, '')
          .replace(/Confidence Level:.*$/s, '')
          .replace(/Register for more queries.*$/s, '')
          .trim();
        
        if (detailedText) {
          formattedContent += `**${t("chat.detailed_explanation")}:**\n${detailedText}\n\n`;
        }
      }
      
      if (response.data?.sources && response.data.sources.length > 0) {
        formattedContent += `---\n\n📚 **${t("chat.used_sources")}**\n\n`;
        
        response.data.sources.forEach((source, index) => {
          if (source.type === 'decision') {
            formattedContent += `**${index + 1}.** ${source.title}`;
            
            let courtName = '';
            if (source.court_id && COURT_NAMES[source.court_id]) {
              courtName = COURT_NAMES[source.court_id];
            } else if (source.court) {
              const courtId = parseInt(source.court);
              if (!isNaN(courtId) && COURT_NAMES[courtId]) {
                courtName = COURT_NAMES[courtId];
              } else {
                courtName = source.court;
              }
            }
            
            if (courtName) {
              formattedContent += `\n   *${courtName}*`;
            }
            
            // Add excerpt if available
            if (source.excerpt && source.excerpt.trim()) {
              formattedContent += `\n   > ${source.excerpt.trim()}`;
            }
            
            formattedContent += `\n\n`;
          } else if (source.type === 'law') {
            formattedContent += `**${index + 1}.** ${source.title}`;
            if (source.law_article) {
              formattedContent += `\n   *${source.law_article}*`;
            }
            
            // Add excerpt if available
            if (source.excerpt && source.excerpt.trim()) {
              formattedContent += `\n   > ${source.excerpt.trim()}`;
            }
            
            formattedContent += `\n\n`;
          }
        });
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: formattedContent,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error occured`,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <div className="mb-4">
              <Scale className="h-12 w-12 mx-auto mb-4 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-foreground">{t("dashboard.welcome_message")}</h3>
            <p className="text-sm max-w-md mx-auto">
              {t("dashboard.welcome_description")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendMessage(t("dashboard.sample_questions.severance"))}
                disabled={isLoading}
              >
                {t("dashboard.sample_questions.severance")}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendMessage(t("dashboard.sample_questions.worker_rights"))}
                disabled={isLoading}
              >
                {t("dashboard.sample_questions.worker_rights")}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendMessage(t("dashboard.sample_questions.marriage"))}
                disabled={isLoading}
              >
                {t("dashboard.sample_questions.marriage")}
              </Button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background/50">
        <AiInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder={t("dashboard.ask_placeholder")}
        />
      </div>
    </div>
  );
}

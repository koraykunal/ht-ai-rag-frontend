"use client";

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {ragApi, chatApi} from "@/lib/api";
import {AiInput} from "./ai-input";
import {ChatMessage} from "./ChatMessage";
import {Button} from "@/components/ui/Button";
import {Scale} from "lucide-react";
import {useTranslation} from "@/contexts/TranslationContext";
import type {ChatMessageResponse, ChatSessionWithMessages} from "@/types";

interface ChatInterfaceProps {
    chatId?: string;
}

export function ChatInterface({chatId}: ChatInterfaceProps) {
    const {t} = useTranslation();
    const router = useRouter();
    const [session, setSession] = useState<ChatSessionWithMessages | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSession, setIsLoadingSession] = useState(!!chatId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [session?.messages]);

    useEffect(() => {
        if (chatId) {
            const loadSession = async () => {
                try {
                    setIsLoadingSession(true);
                    const response = await chatApi.getSession(chatId);
                    setSession(response.data);
                } catch (error) {
                    console.error("Error loading session:", error);
                    router.push("/dashboard");
                } finally {
                    setIsLoadingSession(false);
                }
            };

            loadSession();
        } else {
            setIsLoadingSession(false);
        }
    }, [chatId, router]);

    const handleSendMessage = async (content: string) => {
        try {
            setIsLoading(true);
            let currentSessionId = session?.id;

            if (!currentSessionId) {
                try {
                    const sessionResponse = await chatApi.createSession({
                        title: content.slice(0, 50) + (content.length > 50 ? '...' : '')
                    });
                    currentSessionId = sessionResponse.data.id;

                    setSession({
                        ...sessionResponse.data,
                        messages: []
                    });
                } catch (sessionError) {

                    const userMessage: ChatMessageResponse = {
                        id: `temp-user-${Date.now()}`,
                        role: "user",
                        content,
                        created_at: new Date().toISOString(),
                    };

                    setSession({
                        id: `temp-session-${Date.now()}`,
                        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
                        created_at: new Date().toISOString(),
                        last_activity: new Date().toISOString(),
                        message_count: 1,
                        is_archived: false,
                        messages: [userMessage]
                    });

                    const response = await ragApi.ask({
                        question: content,
                        include_laws: true,
                        include_decisions: true
                    });

                    let formattedContent = "";
                    if (response.data?.short_conclusion) {
                        formattedContent += `**${t("chat.summary")}:**\n${response.data.short_conclusion}\n\n`;
                    }
                    if (response.data?.detailed_reasoning) {
                        let detailedText = response.data.detailed_reasoning
                            .replace(/DETAILED EXPLANATION:?-?\s*/i, "")
                            .replace(/SOURCE \d+/g, "")
                            .replace(/Confidence Level:.*$/s, "")
                            .replace(/Register for more queries.*$/s, "")
                            .trim();
                        if (detailedText) {
                            formattedContent += `**${t("chat.detailed_explanation")}:**\n${detailedText}\n\n`;
                        }
                    }

                    const assistantMessage: ChatMessageResponse = {
                        id: `temp-assistant-${Date.now()}`,
                        role: "assistant",
                        content: formattedContent || response.data?.short_conclusion || "Yanıt alınamadı",
                        response_data: response.data,
                        confidence_score: response.data?.confidence_score,
                        response_time_ms: response.data?.response_time_ms,
                        created_at: new Date().toISOString(),
                    };

                    setSession(prev => prev ? {
                        ...prev,
                        messages: [...prev.messages, assistantMessage],
                        message_count: 2
                    } : null);

                    return;
                }
            }

            const userMessage: ChatMessageResponse = {
                id: `temp-user-${Date.now()}`,
                role: "user",
                content,
                created_at: new Date().toISOString(),
            };

            setSession(prev => prev ? {
                ...prev,
                messages: [...prev.messages, userMessage]
            } : null);

            const response = await ragApi.ask({
                question: content,
                session_id: currentSessionId,
                include_laws: true,
                include_decisions: true
            });

            const updatedSessionResponse = await chatApi.getSession(currentSessionId);
            setSession(updatedSessionResponse.data);

            const currentPath = window.location.pathname;
            const expectedPath = `/dashboard/${currentSessionId}`;
            if (currentPath !== expectedPath) {
                router.push(expectedPath);
            }

        } catch (error) {
            console.error("Error sending message:", error);

            const errorMessage: ChatMessageResponse = {
                id: `temp-error-${Date.now()}`,
                role: "assistant",
                content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
                created_at: new Date().toISOString(),
            };

            setSession(prev => prev ? {
                ...prev,
                messages: [...(prev.messages || []), errorMessage]
            } : null);
        } finally {
            setIsLoading(false);
        }
    };


    const goodExamples = [
        "Telif hakkı miras yoluyla intikal eder mi",
        "Alacak davasında vekalet ücreti hesaplaması nasıl yapılır ve dava nerede açılır",
        "Reşit olmayan çocuğa ebeveyinlerin birinin imzasıyla yetki verilir mi",
        "Nüfus ile ilgili davalar hangi mahkemede açılır"
    ];

    const badExamples = [
        "İzin",
        "Sözleşmenin sona ermesi",
        "İş sözleşmesinin feshi",
        "4857 sayılı Kanunu",
        "Müruruzaman",
        "Velayet davası",
        "Kıdem Tazminatı"
    ];

    if (isLoadingSession) {
        return (
            <div className="flex flex-col h-full bg-transparent items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading conversation...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {(!session || session.messages.length === 0) && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="text-center">
                            <div className="mb-4">
                                <Scale className="h-10 w-10 mx-auto mb-3 text-primary"/>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">
                                {t("chat.guidance.title")}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                                {t("chat.guidance.subtitle")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="rounded-lg p-4">
                                <h4 className="font-medium text-sm mb-3">
                                    {t("chat.guidance.good_examples_title")}
                                </h4>
                                <div className="space-y-2">
                                    {goodExamples.slice(0, 4).map((example, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => handleSendMessage(example)}
                                            disabled={isLoading}
                                            variant={"outline"}
                                            className="w-full text-center p-3 text-xs leading-relaxed h-auto whitespace-normal"
                                        >
                                            {example}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-lg p-4">
                                <h4 className="mb-3 text-sm">
                                    {t("chat.guidance.bad_examples_title")}
                                </h4>
                                <div className="space-y-1.5">
                                    {badExamples.slice(0, 5).map((example, index) => (
                                        <div
                                            key={index}
                                            className="p-3 text-xs rounded-md border text-muted-foreground break-words"
                                        >
                                            {example}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {session?.messages.map((message) => (
                    <ChatMessage key={message.id} message={message}/>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                    style={{animationDelay: "0.1s"}}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                    style={{animationDelay: "0.2s"}}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef}/>
            </div>

            <div className="p-4 border-t bg-background/50">
                <AiInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                    placeholder={t("chat.input.placeholder")}
                />
            </div>
        </div>
    );
}

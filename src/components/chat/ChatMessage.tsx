import {useState} from "react";
import {Bot, User, FileText, Scale, Clock, Target, ExternalLink} from "lucide-react";
import {cn} from "@/lib/utils";
import {useTranslation} from "@/contexts/TranslationContext";
import {SourceDetailModal} from "./SourceDetailModal";
import type {ChatMessageResponse} from "@/types";

interface ChatMessageProps {
    message: ChatMessageResponse;
}

export function ChatMessage({message}: ChatMessageProps) {
    const {t} = useTranslation();
    const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
    const isUser = message.role === "user";

    const handleSourceClick = (sourceId: string) => {
        setSelectedSourceId(sourceId);
    };

    return (
        <div
            className={cn(
                "flex gap-3 py-4",
                isUser ? "justify-end" : "justify-start",
            )}
        >
            {!isUser && (
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary-foreground"/>
                    </div>
                </div>
            )}

            <div
                className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                )}
            >
                <div className="text-sm whitespace-pre-wrap">
                    {message.content.split("\n").map((line, index) => {
                        if (line.includes("**")) {
                            const parts = line.split("**");
                            return (
                                <p key={index} className="mb-2">
                                    {parts.map((part, partIndex) =>
                                        partIndex % 2 === 1 ? (
                                            <strong key={partIndex}>{part}</strong>
                                        ) : (
                                            <span key={partIndex}>{part}</span>
                                        ),
                                    )}
                                </p>
                            );
                        } else if (
                            line.trim().startsWith("•") ||
                            line.trim().startsWith("-")
                        ) {
                            return (
                                <p key={index} className="mb-1 ml-4">
                                    {line}
                                </p>
                            );
                        } else if (line.trim() === "") {
                            return <div key={index} className="mb-2"></div>;
                        } else {
                            return (
                                <p key={index} className="mb-2">
                                    {line}
                                </p>
                            );
                        }
                    })}
                </div>

                {!isUser && message.response_data?.sources && message.response_data.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-xs font-medium text-muted-foreground">
                {message.response_data.sources.length} {t("chat.sources_found")}
              </span>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {message.response_data.sources.map((source) => (
                                <div
                                    key={source.id}
                                    className="bg-background/50 border border-border/30 rounded-md p-2 text-xs group hover:bg-background/70 transition-colors cursor-pointer"
                                    onClick={() => handleSourceClick(source.id)}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        {source.type === "law" ? (
                                            <Scale className="h-3 w-3 text-blue-500"/>
                                        ) : (
                                            <FileText className="h-3 w-3 text-green-500"/>
                                        )}
                                        <span className="font-medium text-foreground flex-1">
                                          {source.title}
                                        </span>
                                        <span className="text-muted-foreground mr-2">
                                          {Math.round(source.score * 100)}%
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSourceClick(source.id);
                                                }}
                                                className="text-primary hover:text-primary/80 transition-colors p-1 rounded"
                                                title="Kaynak detayını görüntüle"
                                            >
                                                <FileText className="h-3 w-3"/>
                                            </button>
                                        </div>
                                    </div>
                                    {source.court && (
                                        <p className="text-muted-foreground mb-1">
                                            {source.court}
                                        </p>
                                    )}
                                    {source.law_article && (
                                        <p className="text-muted-foreground mb-1">
                                            Madde: {source.law_article}
                                        </p>
                                    )}
                                    <p className="text-muted-foreground line-clamp-2">
                                        {source.excerpt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                        {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                    {!isUser && (message.confidence_score !== undefined || message.response_time_ms !== undefined) && (
                        <div className="flex items-center gap-3 text-xs opacity-70">
                            {message.confidence_score !== undefined && (
                                <div className="flex items-center gap-1">
                                    <Target className="h-3 w-3"/>
                                    <span>{Math.round(message.confidence_score * 100)}%</span>
                                </div>
                            )}
                            {message.response_time_ms !== undefined && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3"/>
                                    <span>{message.response_time_ms}ms</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isUser && (
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-secondary-foreground"/>
                    </div>
                </div>
            )}

            <SourceDetailModal
                sourceId={selectedSourceId}
                onClose={() => setSelectedSourceId(null)}
            />
        </div>
    );
}

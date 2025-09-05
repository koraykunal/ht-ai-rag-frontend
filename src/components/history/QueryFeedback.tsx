"use client";

import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/Button";
import {Textarea} from "@/components/ui/textarea";
import {historyApi, chatApi} from "@/lib/api";
import {useTranslation} from "@/contexts/TranslationContext";
import type {UserQuery} from "@/types";
import {Star, X, Clock, ExternalLink, MessageSquare} from "lucide-react";
import {useRouter} from "next/navigation";

interface QueryFeedbackProps {
    query: UserQuery;
    onClose: () => void;
}

export function QueryFeedback({query, onClose}: QueryFeedbackProps) {
    const {t} = useTranslation();
    const [rating, setRating] = useState(query.user_rating || 0);
    const [feedback, setFeedback] = useState(query.feedback || "");
    const queryClient = useQueryClient();
    const router = useRouter();

    const feedbackMutation = useMutation({
        mutationFn: historyApi.submitFeedback,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryHistory"]});
            onClose();
        },
    });

    const handleSubmitFeedback = () => {
        if (rating === 0) return;

        feedbackMutation.mutate({
            query_id: query.id,
            rating: rating,
            feedback: feedback.trim() || undefined,
            is_helpful: rating >= 3, // 3+ rating considered helpful
        });
    };

    const handleContinueConversation = async () => {
        try {
            // Get detailed query data if needed
            let queryData = query;
            if (!query.response_data) {
                const response = await historyApi.getQueryDetail(query.id);
                queryData = response.data;
            }

            if (!queryData.response_data) {
                throw new Error("No response data available");
            }

            // Create a new chat session
            const sessionResponse = await chatApi.createSession({
                title: query.query_text.slice(0, 50) + (query.query_text.length > 50 ? '...' : '')
            });

            const sessionId = sessionResponse.data.id;

            // Create user message
            await chatApi.createMessage(sessionId, {
                role: "user",
                content: query.query_text
            });

            // Create assistant message with response data (backend will format content)
            await chatApi.createMessage(sessionId, {
                role: "assistant",
                content: queryData.response_data.short_conclusion || "Yanıt bulunamadı",
                response_data: queryData.response_data,
                confidence_score: query.confidence_score,
                response_time_ms: query.response_time_ms
            });

            // Close the feedback modal first
            onClose();

            // Navigate to the new chat session
            router.push(`/dashboard/${sessionId}`);

        } catch (error) {
            console.error("Error continuing conversation:", error);

            // Fallback: Create session with error message
            try {
                const sessionResponse = await chatApi.createSession({
                    title: query.query_text.slice(0, 50) + (query.query_text.length > 50 ? '...' : '')
                });

                await chatApi.createMessage(sessionResponse.data.id, {
                    role: "user",
                    content: query.query_text
                });

                await chatApi.createMessage(sessionResponse.data.id, {
                    role: "assistant",
                    content: "Bu konuşmayı yüklerken bir hata oluştu. Sorunuzu tekrar sorabilirsiniz."
                });

                onClose();
                router.push(`/dashboard/${sessionResponse.data.id}`);
            } catch (fallbackError) {
                console.error("Fallback error:", fallbackError);
                // If everything fails, just navigate to dashboard
                onClose();
                router.push("/dashboard");
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t("history.query_detail")}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4"/>
                    </Button>
                </CardHeader>
                <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">{t("history.question")}</h3>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {query.query_text}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground"/>
                                <span>{formatDate(query.created_at)}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Güven: </span>
                                <span className="font-medium">
                  {Math.round(query.confidence_score * 100)}%
                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Yanıt süresi: </span>
                                <span className="font-medium">{query.response_time_ms}ms</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Kaynak: </span>
                                <span className="font-medium">{query.sources_count} adet</span>
                            </div>
                        </div>

                        {query.response_data?.short_conclusion && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2">{t("history.short_result")}</h3>
                                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                                    {query.response_data.short_conclusion}
                                </p>
                            </div>
                        )}

                        {query.response_data?.detailed_reasoning && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2">{t("history.detailed_explanation")}</h3>
                                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                                    {query.response_data.detailed_reasoning}
                                </div>
                            </div>
                        )}

                        {query.response_data?.sources && query.response_data.sources.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-3">{t("history.sources")}</h3>
                                <div className="space-y-3">
                                    {query.response_data.sources.map((source) => (
                                        <div key={source.id} className="border rounded-lg p-3">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{source.title}</h4>
                                                    <div
                                                        className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                  source.type === "law"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-green-100 text-green-700"
                              }`}
                          >
                            {source.type === "law" ? "Kanun" : "Karar"}
                          </span>
                                                        {source.court && <span>{source.court}</span>}
                                                        {source.law_article && (
                                                            <span>Madde {source.law_article}</span>
                                                        )}
                                                        <span>Skor: {Math.round(source.score * 100)}%</span>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <ExternalLink className="h-3 w-3"/>
                                                </Button>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-3">
                                                {source.excerpt}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-lg mb-3">Değerlendirme</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Bu yanıtı nasıl değerlendirirsiniz?
                                    </label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                onClick={() => setRating(value)}
                                                className={`p-1 rounded ${
                                                    value <= rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300 hover:text-yellow-400"
                                                }`}
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${value <= rating ? "fill-current" : ""}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Ek yorumunuz (isteğe bağlı)
                                    </label>
                                    <Textarea
                                        placeholder="Bu yanıt hakkında düşüncelerinizi paylaşın..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-3 flex-wrap">
                                    <Button
                                        onClick={handleContinueConversation}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2"/>
                                        Konuşmaya Devam Et
                                    </Button>
                                    <Button
                                        onClick={handleSubmitFeedback}
                                        disabled={rating === 0 || feedbackMutation.isPending}
                                        variant="outline"
                                    >
                                        {feedbackMutation.isPending
                                            ? "Gönderiliyor..."
                                            : "Değerlendirmeyi Gönder"}
                                    </Button>
                                    <Button variant="outline" onClick={onClose}>
                                        Kapat
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/Button";
import {chatApi} from "@/lib/api";
import {useTranslation} from "@/contexts/TranslationContext";
import {Clock, MessageSquare, ChevronLeft, ChevronRight} from "lucide-react";

interface QueryHistoryProps {
    limit?: number;
    showPagination?: boolean;
}

export function QueryHistory({
                                 limit = 10,
                                 showPagination = true,
                             }: QueryHistoryProps) {
    const {t} = useTranslation();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: sessionsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["chatSessions"],
        queryFn: () => chatApi.getSessions(),
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSessionClick = (sessionId: string) => {
        router.push(`/dashboard/${sessionId}`);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5"/>
                        {t("history.query_history_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-red-600">{t("history.loading_error")}</p>
                </CardContent>
            </Card>
        );
    }

    const sessions = Array.isArray(sessionsData?.data) ? sessionsData.data : [];
    
    // Frontend pagination
    const totalSessions = sessions.length;
    const startIndex = (currentPage - 1) * limit;
    const paginatedSessions = sessions.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(totalSessions / limit);

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5"/>
                        Chat Geçmişi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {paginatedSessions.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                {t("history.no_history_yet")}
                            </p>
                        ) : (
                            paginatedSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="border rounded-lg p-4 hover:bg-gray-950 cursor-pointer transition-colors"
                                    onClick={() => handleSessionClick(session.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="h-4 w-4 text-primary flex-shrink-0"/>
                                                <h4 className="font-medium text-sm line-clamp-2 flex-1">
                                                    {session.title}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3"/>
                                                    {formatDate(session.last_activity)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3"/>
                                                    {session.message_count} mesaj
                                                </div>
                                                <div className="text-xs">
                                                    Oluşturulma: {formatDate(session.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {showPagination && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <p className="text-sm text-muted-foreground">
                                Toplam {totalSessions} chat session'ı - Sayfa {currentPage} / {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4"/>
                                    {t("history.previous")}
                                </Button>
                                <span className="px-3 py-2 text-sm">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    {t("history.next")}
                                    <ChevronRight className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
"use client";

import {useQuery} from "@tanstack/react-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {historyApi} from "@/lib/api";
import {useTranslation} from "@/contexts/TranslationContext";
import {
    BarChart3,
    Clock,
    Target,
    MessageSquare,
    Star,
    TrendingUp,
} from "lucide-react";

export function UserStats() {
    const {t} = useTranslation();
    const {
        data: statsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["userStats"],
        queryFn: historyApi.getStats,
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="pt-6">
                            <div className="h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-red-600">{t("stats.loading_error")}</p>
                </CardContent>
            </Card>
        );
    }

    const stats = statsData?.data;
    if (!stats) return null;
    
    // Debug: API response'unu kontrol et
    console.log("UserStats API Response:", stats);
    console.log("avg_response_time:", stats.avg_response_time, "(type:", typeof stats.avg_response_time, ")");

    const statCards = [
        {
            title: t("stats.total_queries"),
            value: stats.total_queries,
            icon: MessageSquare,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            subtitle: `${stats.successful_queries} ${t("admin.successful")}`,
        },
        {
            title: t("stats.this_month"),
            value: stats.monthly_queries_current,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
            subtitle: `${t("stats.today")}: ${stats.daily_queries_today}`,
        },
        {
            title: t("stats.avg_response"),
            value: stats.avg_response_time ? `${Math.round(stats.avg_response_time)}${t("stats.ms")}` : "—",
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            subtitle: `${Math.round(stats.avg_confidence_score * 100)}% ${t("history.confidence").toLowerCase()}`,
        },
        {
            title: t("stats.user_rating"),
            value: stats.avg_rating > 0 ? stats.avg_rating.toFixed(1) : "—",
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            subtitle: `${stats.total_ratings} ${t("stats.evaluations")}`,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stat.subtitle}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5"/>
                            {t("stats.category_distribution")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{t("stats.laws")}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${(stats.laws_queries / stats.total_queries) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium w-8">
                    {stats.laws_queries}
                  </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm">{t("stats.decisions")}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{
                                                width: `${(stats.decisions_queries / stats.total_queries) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium w-8">
                    {stats.decisions_queries}
                  </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm">{t("stats.constitution")}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-500 h-2 rounded-full"
                                            style={{
                                                width: `${(stats.constitution_queries / stats.total_queries) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium w-8">
                    {stats.constitution_queries}
                  </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("stats.usage_summary")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("stats.success_rate_summary")}
                </span>
                                <span className="font-semibold">
                  {stats.total_queries > 0
                      ? Math.round(
                          (stats.successful_queries / stats.total_queries) * 100,
                      )
                      : 0}
                                    %
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("stats.helpful_responses")}
                </span>
                                <span className="font-semibold">
                  {stats.helpful_responses} / {stats.total_ratings}
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("stats.average_confidence")}
                </span>
                                <span className="font-semibold">
                  {Math.round(stats.avg_confidence_score * 100)}%
                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

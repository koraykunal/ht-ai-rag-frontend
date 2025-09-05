"use client";

import {useQuery} from "@tanstack/react-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {adminApi} from "@/lib/api";
import {useTranslation} from "@/contexts/TranslationContext";
import {
    Activity,
    Users,
    MessageSquare,
    Clock,
} from "lucide-react";

export function SystemStats() {
    const {t} = useTranslation();
    const {
        data: statsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["systemStats"],
        queryFn: adminApi.getSystemStats,
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <Card key={`skeleton-${i}`} className="animate-pulse">
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
                    <p className="text-red-600">{t("admin.loading_error")}</p>
                </CardContent>
            </Card>
        );
    }

    const stats = statsData?.data;
    if (!stats) return null;

    const mainStats = [
        {
            title: t("admin.total_users"),
            value: stats.total_users,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            subtitle: `${stats.active_users_today} ${t("admin.active_today")}`,
        },
        {
            title: t("admin.todays_queries"),
            value: stats.total_queries_today,
            icon: MessageSquare,
            color: "text-green-600",
            bgColor: "bg-green-50",
            subtitle: `${stats.successful_queries_today} ${t("admin.successful")}`,
        },
        {
            title: t("admin.average_response"),
            value: `${Math.round(stats.avg_response_time_today)}ms`,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            subtitle: t("admin.today_average"),
        },
        {
            title: t("admin.user_rating"),
            value: stats.avg_user_rating_today ? stats.avg_user_rating_today.toFixed(1) : "—",
            icon: Activity,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            subtitle: `${Math.round((stats.successful_queries_today / Math.max(stats.total_queries_today, 1)) * 100)}% ${t("admin.success_rate")}`,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainStats.map((stat, index) => (
                    <Card key={`stat-${index}`}>
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

            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t("admin.daily_summary")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{t("admin.success_rate_label")}</span>
                                <span className="font-semibold">
                  {stats.total_queries_today > 0
                      ? Math.round((stats.successful_queries_today / stats.total_queries_today) * 100)
                      : 0
                  }%
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{t("admin.failed_queries")}</span>
                                <span className="font-semibold text-red-600">
                  {stats.failed_queries_today}
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{t("admin.user_satisfaction")}</span>
                                <span className="font-semibold">
                  ⭐ {stats.avg_user_rating_today ? stats.avg_user_rating_today.toFixed(1) : "—"}
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{t("admin.active_user_rate")}</span>
                                <span className="font-semibold">
                  {stats.total_users > 0
                      ? Math.round((stats.active_users_today / stats.total_users) * 100)
                      : 0
                  }%
                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
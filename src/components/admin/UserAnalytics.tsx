"use client";

import {useQuery} from "@tanstack/react-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {adminApi} from "@/lib/api";
import {
    TrendingUp,
    UserPlus,
    Award,
    Calendar, MessageSquare,
} from "lucide-react";
import {Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal} from "react";
import {useTranslation} from "@/contexts/TranslationContext";

export function UserAnalytics() {
    const {t} = useTranslation();
    const {
        data: analyticsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["userAnalytics"],
        queryFn: adminApi.getUserAnalytics,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={`skeleton-${i}`} className="animate-pulse">
                            <CardContent className="pt-6">
                                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <Card key={`skeleton-chart-${i}`} className="animate-pulse">
                            <CardHeader>
                                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-red-600">{t("admin.analytics_error")}</p>
                </CardContent>
            </Card>
        );
    }

    const analytics = analyticsData?.data;
    if (!analytics) return null;

    const formatDate = (dateString: React.Key | null | undefined) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            month: "short",
            day: "numeric",
        });
    };

    const totalNewUsers = analytics.new_users_daily?.reduce((sum: any, day: {
        count: any;
    }) => sum + day.count, 0) || 0;
    const totalQueries = analytics.top_users?.reduce((sum: any, user: {
        query_count: any;
    }) => sum + user.query_count, 0) || 0;

    const summaryStats = [
        {
            title: t("admin.recent_new_users"),
            value: totalNewUsers,
            icon: UserPlus,
            color: "text-green-600",
            bgColor: "bg-green-50",
            subtitle: `${analytics.new_users_daily?.length || 0} ${t("admin.days_data")}`,
        },
        {
            title: t("admin.total_queries_analytics"),
            value: totalQueries,
            icon: MessageSquare,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            subtitle: t("admin.top_users"),
        },
        {
            title: t("admin.most_active_user"),
            value: analytics.top_users?.[0]?.query_count || 0,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            subtitle: analytics.top_users?.[0]?.username || t("admin.none"),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryStats.map((stat) => (
                    <Card key={`summary-${stat.title}`}>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5"/>
                            {t("admin.top_active_users")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {(!analytics.top_users || analytics.top_users.length === 0) ? (
                                <p className="text-muted-foreground text-center py-4">
                                    {t("admin.no_active_users")}
                                </p>
                            ) : (
                                analytics.top_users.map((user, index) => (
                                    <div key={`${user.username}-${index}`}
                                         className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">@{user.username}</p>
                                                <p className="text-xs text-muted-foreground">{t("admin.most_active_prefix")} #{index + 1}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-sm">{user.query_count} {t("admin.query_count")}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {((user.query_count / totalQueries) * 100).toFixed(1)}% {t("admin.share_percentage")}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5"/>
                            {t("admin.new_users_trend")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {(!analytics.new_users_daily || analytics.new_users_daily.length === 0) ? (
                                <p className="text-muted-foreground text-center py-4">
                                    {t("admin.no_new_users_data")}
                                </p>
                            ) : (
                                analytics.new_users_daily.slice(-7).map((day: {
                                    date: Key | null | undefined;
                                    count: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
                                }) => (
                                    <div key={day.date}
                                         className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                                        <div>
                                            <p className="font-medium text-sm">{formatDate(day.date)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {t("admin.registration_day")}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-green-600">
                                                    {day.count}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{t("admin.new_user_single")}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
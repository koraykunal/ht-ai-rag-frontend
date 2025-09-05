"use client";

import {useRouter} from "next/navigation";
import {useTranslation} from "@/contexts/TranslationContext";
import {AuthGuard} from "@/components/auth/AuthGuard";
import {SystemStats} from "@/components/admin/SystemStats";
import {UserAnalytics} from "@/components/admin/UserAnalytics";
import {UserManagement} from "@/components/admin/UserManagement";
import {ArrowLeft, Shield} from "lucide-react";
import {Button} from "@/components/ui/Button";

export default function AdminPage() {
    const {t} = useTranslation();
    const router = useRouter();

    return (
        <AuthGuard requiredRole="admin">
            <div className="container mx-auto py-6 px-4">
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/dashboard")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        {t("admin.back_to_dashboard")}
                    </Button>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-8 w-8 text-primary"/>
                        <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
                    </div>
                    <p className="text-muted-foreground">
                        {t("admin.description")}
                    </p>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">{t("admin.system_stats")}</h2>
                        <SystemStats/>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">{t("admin.user_analytics")}</h2>
                        <UserAnalytics/>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">{t("admin.user_management")}</h2>
                        <UserManagement/>
                    </section>
                </div>
            </div>
        </AuthGuard>
    );
}
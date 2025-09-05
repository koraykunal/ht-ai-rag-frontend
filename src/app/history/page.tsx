"use client";

import {useRouter} from "next/navigation";
import {AuthGuard} from "@/components/auth/AuthGuard";
import {useTranslation} from "@/contexts/TranslationContext";
import {QueryHistory} from "@/components/history/QueryHistory";
import {UserStats} from "@/components/history/UserStats";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/Button";

export default function HistoryPage() {
    const {t} = useTranslation();
    const router = useRouter();

    return (
        <AuthGuard>
            <div className="container mx-auto py-6 px-4">
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/dashboard")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        {t("history.back_to_dashboard")}
                    </Button>
                    <h1 className="text-3xl font-bold mb-2">{t("history.title")}</h1>
                    <p className="text-muted-foreground">
                        {t("history.description")}
                    </p>
                </div>

                <div className="space-y-8">
                    <UserStats/>
                    <QueryHistory/>
                </div>
            </div>
        </AuthGuard>
    );
}

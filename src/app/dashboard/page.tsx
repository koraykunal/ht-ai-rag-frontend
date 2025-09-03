"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {ChatInterface} from "@/components/chat/ChatInterface";
import {useAuth} from "@/contexts/AuthContext";
import {WavyBackground} from "@/components/ui/PrismaticBurst";

export default function DashboardPage() {
    const {isAuthenticated, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="container mx-auto py-6 h-full relative">
            <WavyBackground
                backgroundFill="transparent"
                waveOpacity={0.7}
                blur={15}
                colors={[
                    "rgba(59, 130, 246, 0.3)",
                    "rgba(147, 51, 234, 0.2)",
                    "rgba(236, 72, 153, 0.2)",
                    "rgba(14, 165, 233, 0.1)",
                    "rgba(99, 102, 241, 0.2)",
                ]}
            />
            <div className="max-w-6xl mx-auto h-full relative z-10">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border h-[calc(100vh-200px)]">
                    <ChatInterface/>
                </div>
            </div>
        </div>
    );
}

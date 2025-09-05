"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {Button} from "@/components/ui/Button";
import {useAuth} from "@/contexts/AuthContext";
import {ArrowRight, Scale, Zap, Shield} from "lucide-react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Home() {
    const {isAuthenticated, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-24">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        Hukukturk AI Legal Assistant
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        AI-powered legal consultation with Turkish law expertise. Get
                        instant answers backed by comprehensive legal databases.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Button
                            size="lg"
                            onClick={() => router.push("/register")}
                            className="group"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => router.push("/login")}
                        >
                            Sign In
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <Card>
                        <CardHeader>
                            <Scale className="h-8 w-8 text-primary mb-2"/>
                            <CardTitle>Legal Expertise</CardTitle>
                            <CardDescription>
                                Comprehensive Turkish law database with up-to-date regulations
                                and court decisions
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Zap className="h-8 w-8 text-primary mb-2"/>
                            <CardTitle>Instant Answers</CardTitle>
                            <CardDescription>
                                Get immediate responses to legal questions with source
                                references and confidence scores
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Shield className="h-8 w-8 text-primary mb-2"/>
                            <CardTitle>Reliable Sources</CardTitle>
                            <CardDescription>
                                All responses backed by official legal documents and verified
                                court precedents
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>
        </div>
    );
}

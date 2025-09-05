import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Header} from "@/components/layout/Header";
import {Footer} from "@/components/layout/Footer";
import {AuthProvider} from "@/contexts/AuthContext";
import {TranslationProvider} from "@/contexts/TranslationContext";
import {ReactQueryProvider} from "@/contexts/ReactQueryProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "HT-AI",
    description: "",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
        <ReactQueryProvider>
            <TranslationProvider>
                <AuthProvider>
                    <Header/>
                    <main className="flex-1">{children}</main>
                    <Footer/>
                </AuthProvider>
            </TranslationProvider>
        </ReactQueryProvider>
        </body>
        </html>
    );
}

"use client";

import {ExternalLink, Heart} from "lucide-react";
import {useAuth} from "@/contexts/AuthContext";
import {useTranslation} from "@/contexts/TranslationContext";

export function Footer() {
    const {isAuthenticated} = useAuth();
    const {t} = useTranslation();

    if (!isAuthenticated) return null;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
            <div className="container max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    {/* Left side - Copyright */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              © {currentYear} {t("footer.copyright")}
            </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
              <span>{t("footer.made_with_love")}</span>
            </span>
                    </div>

                    {/* Right side - Links */}
                    <div className="flex items-center space-x-6 text-sm">
                        <a
                            href="https://hukukturk.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <span>HukukTurk.com</span>
                            <ExternalLink className="h-3 w-3"/>
                        </a>

                        <span className="text-muted-foreground/50">|</span>

                        <span className="text-muted-foreground">
              {t("footer.powered_by")}
            </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

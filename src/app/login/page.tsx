"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/TranslationContext";
import { Button } from "@/components/ui/Button";
import { Languages } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-4 relative">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
          className="flex items-center space-x-1"
        >
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">
            {language === "tr" ? "EN" : "TR"}
          </span>
        </Button>
      </div>

      <div className="flex justify-center pt-8 pb-12">
        <Image
          width={180}
          height={60}
          src="/logo.svg"
          alt="Hukukturk AI Legal Assistant"
          className="h-12 w-auto"
        />
      </div>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{t("auth.welcome_back")}</h1>
            <p className="text-muted-foreground">
              {t("auth.welcome_description")}
            </p>
          </div>
        
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">{t("auth.login")}</CardTitle>
              <CardDescription>
                {t("auth.login_description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {t("auth.no_account")}{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    {t("auth.create_account")}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

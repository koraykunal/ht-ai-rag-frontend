"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { AlertCircle, Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { t } = useTranslation();

  const validateForm = () => {
    if (!email.trim()) {
      setError("E-posta adresi gereklidir");
      return false;
    }
    
    if (!password.trim()) {
      setError("Şifre gereklidir");
      return false;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir e-posta adresi giriniz");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error: any) {
      console.log("Login form error:", error);
      setError(error.message || "Giriş işlemi başarısız");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.email_placeholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            required
            disabled={isLoading}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("auth.password_placeholder")}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            required
            disabled={isLoading}
            className="h-10"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full h-10" 
        disabled={isLoading || !email.trim() || !password.trim()}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? t("auth.signing_in") : t("auth.login")}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { AlertCircle, Loader2 } from "lucide-react";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { register } = useAuth();
  const { t } = useTranslation();

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Ad soyad gereklidir");
      return false;
    }

    if (!username.trim()) {
      setError("Kullanıcı adı gereklidir");
      return false;
    }

    if (username.length < 3) {
      setError("Kullanıcı adı en az 3 karakter olmalıdır");
      return false;
    }

    if (!email.trim()) {
      setError("E-posta adresi gereklidir");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir e-posta adresi giriniz");
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

    if (!confirmPassword.trim()) {
      setError("Şifre tekrarı gereklidir");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
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
      await register(email, username, password, fullName);
    } catch (error: any) {
      setError(error.message || "Kayıt işlemi başarısız");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t("auth.full_name")}</Label>
            <Input
              id="fullName"
              type="text"
              placeholder={t("auth.full_name_placeholder")}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError("");
              }}
              required
              disabled={isLoading}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">{t("auth.username")}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t("auth.username_placeholder")}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
              required
              disabled={isLoading}
              className="h-10"
            />
          </div>
        </div>

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
            placeholder={t("auth.password_create_placeholder")}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
              if (confirmPassword) {
                setPasswordsMatch(e.target.value === confirmPassword);
              }
            }}
            required
            disabled={isLoading}
            minLength={6}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("auth.confirm_password")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t("auth.confirm_password_placeholder")}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
              setPasswordsMatch(password === e.target.value);
            }}
            required
            disabled={isLoading}
            minLength={6}
            className={`h-10 ${
              confirmPassword && !passwordsMatch 
                ? "border-red-500 focus:border-red-500" 
                : ""
            }`}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-sm text-red-600 mt-1">
              Şifreler eşleşmiyor
            </p>
          )}
          {confirmPassword && passwordsMatch && password && (
            <p className="text-sm text-green-600 mt-1">
              Şifreler eşleşiyor ✓
            </p>
          )}
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
        disabled={isLoading || (confirmPassword && !passwordsMatch) || !fullName || !username || !email || !password || !confirmPassword}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? t("auth.creating_account") : t("auth.create_account")}
      </Button>
    </form>
  );
}

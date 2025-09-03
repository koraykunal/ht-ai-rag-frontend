"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { authApi } from "@/lib/api";
import { X } from "lucide-react";
import {Label} from "@/components/ui/label";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDialog({ isOpen, onClose }: ProfileDialogProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage(t("profile.password_mismatch"));
      return;
    }

    if (newPassword.length < 6) {
      setMessage(t("profile.password_min_length"));
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      
      setMessage(t("profile.password_success"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage(error.response?.data?.message || t("profile.password_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t("profile.title")}</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="space-y-2 text-sm">
              <div><strong>{t("profile.full_name")}:</strong> {user?.full_name}</div>
              <div><strong>{t("profile.email")}:</strong> {user?.email}</div>
              <div><strong>{t("profile.username")}:</strong> {user?.username}</div>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h3 className="font-medium">{t("profile.change_password")}</h3>
            
            <div className="space-y-2">
              <Label htmlFor="current-password">{t("profile.current_password")}</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">{t("profile.new_password")}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t("profile.confirm_password")}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {message && (
              <div className={`text-sm p-2 rounded ${
                message.includes(t("profile.password_success")) 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? t("profile.changing") : t("profile.change_button")}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                {t("profile.cancel")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
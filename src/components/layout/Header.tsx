"use client";

import { useState } from "react";
import { LogOut, Settings, ChevronDown, Languages } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown";
import { ProfileDialog } from "@/components/profile/ProfileDialog";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image 
              width={120} 
              height={40} 
              src="/logo.svg" 
              alt="Hukukturk AI Legal Assistant"
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex items-center space-x-4">
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

            <Dropdown
              align="right"
              trigger={
                <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{user?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              }
            >
              <DropdownItem onClick={() => setIsProfileOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                {t("header.profile_settings")}
              </DropdownItem>
              
              <DropdownSeparator />
              
              <DropdownItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("header.logout")}
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </header>

      <ProfileDialog
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
}
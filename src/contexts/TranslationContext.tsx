"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "tr" | "en";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = {
  tr: {
    // Header
    "header.profile_settings": "Profil Ayarları",
    "header.logout": "Çıkış Yap",
    
    // Dashboard
    "dashboard.welcome": "Hoş geldiniz",
    "dashboard.welcome_message": "Hukuktürk AI",
    "dashboard.welcome_description": "Türk hukuku, mevzuat ve mahkeme kararları hakkında herhangi bir soru sorun. Kaynak referansları ile anında cevaplar alın.",
    "dashboard.sample_questions.severance": "Kıdem tazminatı şartları",
    "dashboard.sample_questions.worker_rights": "İşçi hakları",
    "dashboard.sample_questions.marriage": "Evlilik şartları",
    "dashboard.ask_placeholder": "Türk hukuku hakkında sorun...",
    
    // Chat
    "chat.summary": "Özet",
    "chat.detailed_explanation": "Detaylı Açıklama",
    "chat.used_sources": "Kullanılan Kaynaklar",
    "chat.error": "Hata",
    "chat.error_message": "Sorunuz işlenirken bir hata oluştu. Lütfen tekrar deneyin.",
    "chat.error_unknown": "Bilinmeyen hata",
    
    // Profile Dialog
    "profile.title": "Profil Ayarları",
    "profile.full_name": "Ad Soyad",
    "profile.email": "Email",
    "profile.username": "Kullanıcı Adı",
    "profile.change_password": "Şifre Değiştir",
    "profile.current_password": "Mevcut Şifre",
    "profile.new_password": "Yeni Şifre",
    "profile.confirm_password": "Yeni Şifre (Tekrar)",
    "profile.password_mismatch": "Yeni şifreler eşleşmiyor",
    "profile.password_min_length": "Şifre en az 6 karakter olmalıdır",
    "profile.password_success": "Şifre başarıyla değiştirildi",
    "profile.password_error": "Şifre değiştirilirken hata oluştu",
    "profile.changing": "Değiştiriliyor...",
    "profile.change_button": "Şifre Değiştir",
    "profile.cancel": "İptal",
    
    // Footer
    "footer.copyright": "HT AI Hukuk Asistanı",
    "footer.made_with_love": "Hukuk uzmanları için",
    "footer.powered_by": "Hukukturkun altyapısıyla üretilmiştir",
    
    // Auth
    "auth.login": "Giriş Yap",
    "auth.register": "Kayıt Ol",
    "auth.email": "Email",
    "auth.password": "Şifre",
    "auth.username": "Kullanıcı Adı",
    "auth.full_name": "Ad Soyad",
    "auth.confirm_password": "Şifre Tekrar",
    "auth.welcome_back": "Tekrar Hoş Geldiniz",
    "auth.welcome_description": "HT AI Hukuk Asistanı hesabınıza giriş yapın",
    "auth.login_description": "Hesabınıza erişmek için kimlik bilgilerinizi girin",
    "auth.create_account_title": "Hesap Oluştur",
    "auth.register_description": "HT AI Hukuk Asistanı'na başlayın",
    "auth.register_card_description": "AI destekli hukuki yardıma erişmek için hesabınızı oluşturun",
    "auth.create_account": "Hesap Oluştur",
    "auth.email_placeholder": "Email adresinizi girin",
    "auth.password_placeholder": "Şifrenizi girin",
    "auth.full_name_placeholder": "Ad Soyad",
    "auth.username_placeholder": "kullaniciadi",
    "auth.password_create_placeholder": "Şifre oluşturun (en az 6 karakter)",
    "auth.confirm_password_placeholder": "Şifrenizi tekrar girin",
    "auth.signing_in": "Giriş yapılıyor...",
    "auth.creating_account": "Hesap oluşturuluyor...",
    "auth.login_error": "Geçersiz email veya şifre. Bilgilerinizi kontrol edip tekrar deneyin.",
    "auth.register_error": "Kayıt başarısız. Bilgilerinizi kontrol edip tekrar deneyin.",
    "auth.password_mismatch": "Şifreler eşleşmiyor. Kontrol edip tekrar deneyin.",
    "auth.password_min_length": "Şifre en az 6 karakter olmalıdır.",
    "auth.no_account": "Hesabınız yok mu?",
    "auth.have_account": "Zaten hesabınız var mı?",
  },
  en: {
    // Header
    "header.profile_settings": "Profile Settings",
    "header.logout": "Logout",
    
    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.welcome_message": "Welcome to Hukukturk AI Legal Assistant",
    "dashboard.welcome_description": "Ask any question about Turkish law, regulations, and court decisions. Get instant answers with source references.",
    "dashboard.sample_questions.severance": "Severance payment conditions",
    "dashboard.sample_questions.worker_rights": "Worker rights",
    "dashboard.sample_questions.marriage": "Marriage conditions",
    "dashboard.ask_placeholder": "Ask about Turkish law...",
    
    // Chat
    "chat.summary": "Summary",
    "chat.detailed_explanation": "Detailed Explanation",
    "chat.used_sources": "Used Sources",
    "chat.error": "Error",
    "chat.error_message": "An error occurred while processing your question. Please try again.",
    "chat.error_unknown": "Unknown error",
    
    // Profile Dialog
    "profile.title": "Profile Settings",
    "profile.full_name": "Full Name",
    "profile.email": "Email",
    "profile.username": "Username",
    "profile.change_password": "Change Password",
    "profile.current_password": "Current Password",
    "profile.new_password": "New Password",
    "profile.confirm_password": "Confirm New Password",
    "profile.password_mismatch": "New passwords don't match",
    "profile.password_min_length": "Password must be at least 6 characters",
    "profile.password_success": "Password changed successfully",
    "profile.password_error": "Error changing password",
    "profile.changing": "Changing...",
    "profile.change_button": "Change Password",
    "profile.cancel": "Cancel",
    
    // Footer
    "footer.copyright": "HT AI Legal Assistant",
    "footer.made_with_love": "For legal professionals",
    "footer.powered_by": "Powered by Hukukturk",
    
    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.username": "Username",
    "auth.full_name": "Full Name",
    "auth.confirm_password": "Confirm Password",
    "auth.welcome_back": "Welcome back",
    "auth.welcome_description": "Sign in to your HT AI Legal Assistant account",
    "auth.login_description": "Enter your credentials to access your account",
    "auth.create_account_title": "Create account",
    "auth.register_description": "Get started with HT AI Legal Assistant",
    "auth.register_card_description": "Create your account to access AI-powered legal assistance",
    "auth.create_account": "Create account",
    "auth.email_placeholder": "Enter your email",
    "auth.password_placeholder": "Enter your password",
    "auth.full_name_placeholder": "John Doe",
    "auth.username_placeholder": "johndoe",
    "auth.password_create_placeholder": "Create a password (min. 6 characters)",
    "auth.confirm_password_placeholder": "Confirm your password",
    "auth.signing_in": "Signing in...",
    "auth.creating_account": "Creating account...",
    "auth.login_error": "Invalid email or password. Please check your credentials and try again.",
    "auth.register_error": "Registration failed. Please check your information and try again.",
    "auth.password_mismatch": "Passwords do not match. Please check and try again.",
    "auth.password_min_length": "Password must be at least 6 characters long.",
    "auth.no_account": "Don't have an account?",
    "auth.have_account": "Already have an account?",
  }
};

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<Language>("tr");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
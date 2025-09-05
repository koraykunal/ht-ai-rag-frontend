"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Language = "tr" | "en";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

const translations = {
  tr: {
    // Header
    "header.profile_settings": "Profil Ayarları",
    "header.logout": "Çıkış Yap",

    // Dashboard
    "dashboard.welcome": "Hoş geldiniz",
    "dashboard.welcome_message": "Hukuktürk AI",
    "dashboard.welcome_description":
      "Türk hukuku, mevzuat ve mahkeme kararları hakkında herhangi bir soru sorun. Kaynak referansları ile anında cevaplar alın.",
    "dashboard.sample_questions.severance": "Kıdem tazminatı şartları",
    "dashboard.sample_questions.worker_rights": "İşçi hakları",
    "dashboard.sample_questions.marriage": "Evlilik şartları",
    "dashboard.ask_placeholder": "Türk hukuku hakkında sorun...",

    // Chat
    "chat.summary": "Özet",
    "chat.detailed_explanation": "Detaylı Açıklama",
    "chat.used_sources": "Kullanılan Kaynaklar",
    "chat.error": "Hata",
    "chat.error_message":
      "Sorunuz işlenirken bir hata oluştu. Lütfen tekrar deneyin.",
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
    "auth.login_description":
      "Hesabınıza erişmek için kimlik bilgilerinizi girin",
    "auth.create_account_title": "Hesap Oluştur",
    "auth.register_description": "HT AI Hukuk Asistanı'na başlayın",
    "auth.register_card_description":
      "AI destekli hukuki yardıma erişmek için hesabınızı oluşturun",
    "auth.create_account": "Hesap Oluştur",
    "auth.email_placeholder": "Email adresinizi girin",
    "auth.password_placeholder": "Şifrenizi girin",
    "auth.full_name_placeholder": "Ad Soyad",
    "auth.username_placeholder": "kullaniciadi",
    "auth.password_create_placeholder": "Şifre oluşturun (en az 6 karakter)",
    "auth.confirm_password_placeholder": "Şifrenizi tekrar girin",
    "auth.signing_in": "Giriş yapılıyor...",
    "auth.creating_account": "Hesap oluşturuluyor...",
    "auth.login_error":
      "Geçersiz email veya şifre. Bilgilerinizi kontrol edip tekrar deneyin.",
    "auth.register_error":
      "Kayıt başarısız. Bilgilerinizi kontrol edip tekrar deneyin.",
    "auth.password_mismatch":
      "Şifreler eşleşmiyor. Kontrol edip tekrar deneyin.",
    "auth.password_min_length": "Şifre en az 6 karakter olmalıdır.",
    "auth.no_account": "Hesabınız yok mu?",
    "auth.have_account": "Zaten hesabınız var mı?",

    // Chat Interface
    "chat.guidance.title": "Sormak istediğiniz hukuki konuyu veya soruyu buraya yazın",
    "chat.guidance.subtitle": "Kaynak referanslarıyla anında cevabınıza ulaşın",
    "chat.guidance.good_examples_title": "✓ Detaylı ve açık sorular sorun",
    "chat.guidance.bad_examples_title": "✗ Tek kelime veya genel ifadeler kullanmayın",
    "chat.input.placeholder": "Sormak istediğiniz hukuki konuyu veya soruyu buraya yazın...",
    "chat.sources_found": "Kaynak Bulundu",
    "chat.source_link_title": "Kaynağa git",

    // History
    "history.title": "Sorgu Geçmişi",
    "history.description": "Geçmiş sorgularınızı görüntüleyin ve değerlendirin",
    "history.back_to_dashboard": "Dashboard'a Dön",
    "history.no_queries": "Henüz sorgu geçmişiniz bulunmuyor",
    "history.query_detail": "Sorgu Detayı",
    "history.question": "Soru",
    "history.short_result": "Kısa Sonuç",
    "history.detailed_explanation": "Detaylı Açıklama",
    "history.sources": "Kaynaklar",
    "history.confidence": "Güven",
    "history.response_time": "Yanıt süresi",
    "history.sources_count": "adet",
    "history.rating": "Bu yanıtı nasıl değerlendirirsiniz?",
    "history.feedback": "Ek yorumunuz (isteğe bağlı)",
    "history.feedback_placeholder": "Bu yanıt hakkında düşüncelerinizi paylaşın...",
    "history.submit_feedback": "Değerlendirmeyi Gönder",
    "history.submitting": "Gönderiliyor...",
    "history.continue_conversation": "Konuşmaya Devam Et",
    "history.close": "Kapat",
    "history.court": "Mahkeme",
    "history.article": "Madde",
    "history.law": "Kanun",
    "history.decision": "Karar",

    // Admin
    "admin.title": "Admin Paneli",
    "admin.system_stats": "Sistem İstatistikleri",
    "admin.user_analytics": "Kullanıcı Analitikleri",
    "admin.user_management": "Kullanıcı Yönetimi",
    "admin.total_users": "Toplam Kullanıcı",
    "admin.active_today": "aktif bugün",
    "admin.todays_queries": "Bugünkü Sorgular",
    "admin.successful": "başarılı",
    "admin.average_response": "Ortalama Yanıt",
    "admin.today_average": "Bugün ortalaması",
    "admin.user_rating": "Kullanıcı Puanı",
    "admin.success_rate": "başarı oranı",
    "admin.daily_summary": "Günlük Özet",
    "admin.success_rate_label": "Başarı Oranı",
    "admin.failed_queries": "Başarısız Sorgular",
    "admin.user_satisfaction": "Kullanıcı Memnuniyeti",
    "admin.active_user_rate": "Aktif Kullanıcı Oranı",
    "admin.loading_error": "Sistem istatistikleri yüklenirken hata oluştu",

    // User Stats
    "stats.user_stats": "Kullanıcı İstatistikleri",  
    "stats.total_queries": "Toplam Sorgu",
    "stats.success_rate": "Başarı Oranı",
    "stats.avg_response": "Ort. Yanıt Süresi",
    "stats.user_rating": "Kullanıcı Puanı",
    "stats.queries": "sorgu",
    "stats.ms": "ms",
    "stats.loading_error": "İstatistikler yüklenirken hata oluştu",
    "stats.this_month": "Bu Ay",
    "stats.today": "Bugün",
    "stats.evaluations": "değerlendirme",
    "stats.category_distribution": "Kategori Dağılımı",
    "stats.laws": "Kanunlar",
    "stats.decisions": "Kararlar",
    "stats.constitution": "Anayasa",
    "stats.usage_summary": "Kullanım Özeti",
    "stats.success_rate_summary": "Başarı Oranı",
    "stats.helpful_responses": "Faydalı Yanıtlar",
    "stats.average_confidence": "Ortalama Güven",

    // Admin Analytics
    "admin.analytics_error": "Kullanıcı analitikleri yüklenirken hata oluştu",
    "admin.summary_statistics": "Özet İstatistikler",
    "admin.back_to_dashboard": "Dashboard'a Dön",
    "admin.description": "Sistem istatistiklerini görüntüleyin ve kullanıcıları yönetin",

    // Query History
    "history.loading_error": "Geçmiş yüklenirken hata oluştu",
    "history.query_history_title": "Sorgu Geçmişi",
    "history.no_history_yet": "Henüz sorgu geçmişiniz bulunmuyor",
    "history.source_count": "kaynak",
    "history.categories": "Kategoriler",
    "history.page_info": "Sayfa {page} - {count} öğe görüntüleniyor",
    "history.previous": "Önceki",
    "history.next": "Sonraki",
    "admin.recent_new_users": "Son Dönem Yeni Kullanıcı",
    "admin.days_data": "günlük veri",
    "admin.total_queries_analytics": "Toplam Sorgu",
    "admin.top_users": "En aktif kullanıcılar",
    "admin.most_active_user": "En Aktif Kullanıcı",
    "admin.none": "Yok",
    "admin.top_active_users": "En Aktif Kullanıcılar",
    "admin.no_active_users": "Henüz aktif kullanıcı bulunmuyor",
    "admin.most_active_prefix": "En aktif kullanıcı",
    "admin.query_count": "sorgu",
    "admin.share_percentage": "pay",
    "admin.new_users_trend": "Yeni Kullanıcılar Trendi",
    "admin.no_new_users_data": "Henüz yeni kullanıcı verisi bulunmuyor",
    "admin.registration_day": "Yeni kayıt günü",
    "admin.new_user_single": "Yeni kullanıcı",

    // User Management
    "admin.user_management_title": "Kullanıcı Yönetimi",
    "admin.search_users": "Kullanıcı ara...",
    "admin.inactive": "Pasif",
    "admin.unlimited": "Sınırsız",
    "admin.daily_limit": "günlük",
    "admin.monthly_limit": "aylık",
    "admin.membership": "Üyelik",
    "admin.last_login": "Son giriş",
    "admin.make_free": "Free Yap",
    "admin.make_admin": "Admin Yap",
    "admin.make_premium": "Premium Yap",
    "admin.deactivate": "Pasifleştir",
    "admin.activate": "Aktifleştir",
    "admin.no_users_found": "Arama kriterine uygun kullanıcı bulunamadı",
    "admin.no_users_yet": "Henüz kullanıcı bulunmuyor",
    "admin.total_users_display": "Toplam {count} kullanıcı görüntüleniyor",
    "admin.user_management_unavailable": "Kullanıcı yönetimi endpoint'i henüz hazır değil",
    "admin.user_management_coming_soon": "Bu özellik backend geliştirildikten sonra aktif olacak",
  },
  en: {
    // Header
    "header.profile_settings": "Profile Settings",
    "header.logout": "Logout",

    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.welcome_message": "Welcome to Hukukturk AI Legal Assistant",
    "dashboard.welcome_description":
      "Ask any question about Turkish law, regulations, and court decisions. Get instant answers with source references.",
    "dashboard.sample_questions.severance": "Severance payment conditions",
    "dashboard.sample_questions.worker_rights": "Worker rights",
    "dashboard.sample_questions.marriage": "Marriage conditions",
    "dashboard.ask_placeholder": "Ask about Turkish law...",

    // Chat
    "chat.summary": "Summary",
    "chat.detailed_explanation": "Detailed Explanation",
    "chat.used_sources": "Used Sources",
    "chat.error": "Error",
    "chat.error_message":
      "An error occurred while processing your question. Please try again.",
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
    "auth.register_card_description":
      "Create your account to access AI-powered legal assistance",
    "auth.create_account": "Create account",
    "auth.email_placeholder": "Enter your email",
    "auth.password_placeholder": "Enter your password",
    "auth.full_name_placeholder": "John Doe",
    "auth.username_placeholder": "johndoe",
    "auth.password_create_placeholder": "Create a password (min. 6 characters)",
    "auth.confirm_password_placeholder": "Confirm your password",
    "auth.signing_in": "Signing in...",
    "auth.creating_account": "Creating account...",
    "auth.login_error":
      "Invalid email or password. Please check your credentials and try again.",
    "auth.register_error":
      "Registration failed. Please check your information and try again.",
    "auth.password_mismatch":
      "Passwords do not match. Please check and try again.",
    "auth.password_min_length": "Password must be at least 6 characters long.",
    "auth.no_account": "Don't have an account?",
    "auth.have_account": "Already have an account?",

    // Chat Interface
    "chat.guidance.title": "Enter your legal question or topic here",
    "chat.guidance.subtitle": "Get instant answers with source references",
    "chat.guidance.good_examples_title": "✓ Ask detailed and specific questions",
    "chat.guidance.bad_examples_title": "✗ Don't use single words or general terms",
    "chat.input.placeholder": "Enter your legal question or topic here...",
    "chat.sources_found": "Sources Found",
    "chat.source_link_title": "Go to source",

    // History
    "history.title": "Query History",
    "history.description": "View and evaluate your past queries",
    "history.back_to_dashboard": "Back to Dashboard",
    "history.no_queries": "You don't have any query history yet",
    "history.query_detail": "Query Detail",
    "history.question": "Question",
    "history.short_result": "Short Result",
    "history.detailed_explanation": "Detailed Explanation",
    "history.sources": "Sources",
    "history.confidence": "Confidence",
    "history.response_time": "Response time",
    "history.sources_count": "items",
    "history.rating": "How would you rate this response?",
    "history.feedback": "Additional comments (optional)",
    "history.feedback_placeholder": "Share your thoughts about this response...",
    "history.submit_feedback": "Submit Evaluation",
    "history.submitting": "Submitting...",
    "history.continue_conversation": "Continue Conversation",
    "history.close": "Close",
    "history.court": "Court",
    "history.article": "Article",
    "history.law": "Law",
    "history.decision": "Decision",

    // Admin
    "admin.title": "Admin Panel",
    "admin.system_stats": "System Statistics",
    "admin.user_analytics": "User Analytics",
    "admin.user_management": "User Management",
    "admin.total_users": "Total Users",
    "admin.active_today": "active today",
    "admin.todays_queries": "Today's Queries",
    "admin.successful": "successful",
    "admin.average_response": "Average Response",
    "admin.today_average": "Today's average",
    "admin.user_rating": "User Rating",
    "admin.success_rate": "success rate",
    "admin.daily_summary": "Daily Summary",
    "admin.success_rate_label": "Success Rate",
    "admin.failed_queries": "Failed Queries",
    "admin.user_satisfaction": "User Satisfaction",
    "admin.active_user_rate": "Active User Rate",
    "admin.loading_error": "Error loading system statistics",

    // User Stats  
    "stats.user_stats": "User Statistics",
    "stats.total_queries": "Total Queries", 
    "stats.success_rate": "Success Rate",
    "stats.avg_response": "Avg. Response Time",
    "stats.user_rating": "User Rating",
    "stats.queries": "queries",
    "stats.ms": "ms", 
    "stats.loading_error": "Error loading statistics",
    "stats.this_month": "This Month",
    "stats.today": "Today",
    "stats.evaluations": "evaluations",
    "stats.category_distribution": "Category Distribution",
    "stats.laws": "Laws",
    "stats.decisions": "Decisions",
    "stats.constitution": "Constitution",
    "stats.usage_summary": "Usage Summary",
    "stats.success_rate_summary": "Success Rate",
    "stats.helpful_responses": "Helpful Responses",
    "stats.average_confidence": "Average Confidence",

    // Admin Analytics
    "admin.analytics_error": "Error loading user analytics",
    "admin.summary_statistics": "Summary Statistics",
    "admin.back_to_dashboard": "Back to Dashboard",
    "admin.description": "View system statistics and manage users",

    // Query History
    "history.loading_error": "Error loading history",
    "history.query_history_title": "Query History",
    "history.no_history_yet": "You don't have any query history yet",
    "history.source_count": "sources",
    "history.categories": "Categories",
    "history.page_info": "Page {page} - showing {count} items",
    "history.previous": "Previous",
    "history.next": "Next",
    "admin.recent_new_users": "Recent New Users",
    "admin.days_data": "days of data",
    "admin.total_queries_analytics": "Total Queries",
    "admin.top_users": "Top active users",
    "admin.most_active_user": "Most Active User",
    "admin.none": "None",
    "admin.top_active_users": "Top Active Users",
    "admin.no_active_users": "No active users yet",
    "admin.most_active_prefix": "Top active user",
    "admin.query_count": "queries",
    "admin.share_percentage": "share",
    "admin.new_users_trend": "New Users Trend",
    "admin.no_new_users_data": "No new user data available yet",
    "admin.registration_day": "Registration day",
    "admin.new_user_single": "New user",

    // User Management
    "admin.user_management_title": "User Management",
    "admin.search_users": "Search users...",
    "admin.inactive": "Inactive",
    "admin.unlimited": "Unlimited",
    "admin.daily_limit": "daily",
    "admin.monthly_limit": "monthly",
    "admin.membership": "Membership",
    "admin.last_login": "Last login",
    "admin.make_free": "Make Free",
    "admin.make_admin": "Make Admin",
    "admin.make_premium": "Make Premium",
    "admin.deactivate": "Deactivate",
    "admin.activate": "Activate",
    "admin.no_users_found": "No users found matching search criteria",
    "admin.no_users_yet": "No users found yet",
    "admin.total_users_display": "Showing {count} users total",
    "admin.user_management_unavailable": "User management endpoint is not ready yet",
    "admin.user_management_coming_soon": "This feature will be active after backend development",
  },
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
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
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

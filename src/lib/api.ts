import axios from "axios";
import type {
    AdminUser,
    ChangePasswordCredentials,
    FeedbackRequest,
    LoginCredentials,
    RagQueryRequest,
    RagQueryResponse,
    RegisterCredentials,
    SystemStats,
    User,
    UserAnalytics,
    UserQuery,
    UserStats,
    ChatSessionResponse,
    ChatSessionWithMessages,
    CreateSessionRequest,
    UpdateSessionRequest,
    CreateMessageRequest,
    SourceDetail,
} from "@/types";
import {getAuthToken, removeAuthToken} from "./auth-security";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else if (
        typeof window !== "undefined" &&
        localStorage.getItem("auth-token")
    ) {
        window.location.href = "/login";
        return Promise.reject(new Error("Token expired or invalid"));
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isAuthEndpoint = error.config?.url?.includes("/auth/login") ||
                                  error.config?.url?.includes("/auth/register");
            
            if (!isAuthEndpoint) {
                removeAuthToken();
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }

        if (process.env.NODE_ENV === "development") {
            const isAdminEndpoint = error.config?.url?.includes("/admin/") || error.config?.url?.includes("/dashboard/admin/");
            const is404 = error.response?.status === 404;

            if (!(isAdminEndpoint && is404)) {
                console.error("API Error:", error.response?.status, error.message);
            }
        }

        return Promise.reject(error);
    },
);

export const authApi = {
    login: (credentials: LoginCredentials) =>
        api.post<{ access_token: string; user: User }>("/auth/login", credentials),

    register: (credentials: RegisterCredentials) =>
        api.post<{ access_token: string; user: User }>(
            "/auth/register",
            credentials,
        ),

    me: () => api.get<User>("/auth/me"),

    changePassword: (credentials: ChangePasswordCredentials) =>
        api.post<{ message: string }>("/auth/change-password", credentials),
};

export const ragApi = {
    ask: (request: RagQueryRequest) =>
        api.post<RagQueryResponse>("/ask", request),
};

export const historyApi = {
    getHistory: (params?: { limit?: number; offset?: number }) =>
        api.get<UserQuery[]>("/dashboard/history", {params}),

    getQueryDetail: (queryId: string) =>
        api.get<UserQuery>(`/dashboard/history/${queryId}`),

    getStats: () => api.get<UserStats>("/dashboard/stats"),

    getSessions: (params?: { limit?: number; offset?: number }) =>
        api.get<ChatSessionResponse[]>("/dashboard/sessions", {params}),

    submitFeedback: (request: FeedbackRequest) =>
        api.post<{ message: string }>("/dashboard/feedback", request),

    getDashboard: () =>
        api.get<{
            user: User;
            stats: UserStats;
            recent_queries: UserQuery[];
            usage_summary: {
                daily_queries_used: number;
                daily_queries_remaining: number;
                monthly_queries_used: number;
                monthly_queries_remaining: number;
                success_rate: number;
                most_used_category: string;
            };
        }>("/dashboard/"),

    getUsageChart: (params?: { days?: number }) =>
        api.get<{
            chart_data: Array<{
                date: string;
                queries: number;
            }>;
        }>("/dashboard/usage-chart", {params}),
};

export const adminApi = {
    getSystemStats: () =>
        api.get<SystemStats>("/dashboard/admin/system-stats"),

    getUserAnalytics: (params?: { days?: number }) =>
        api.get<UserAnalytics>("/dashboard/admin/user-analytics", {params}),

    getAllUsers: (params?: { skip?: number; limit?: number }) =>
        api.get<AdminUser[]>("/auth/admin/users", {params}),

    updateUserRole: (userId: string, role: "free" | "premium" | "admin") =>
        api.put<{ message: string }>(`/auth/admin/users/${userId}/role`, {new_role: role}),

    updateUserStatus: (userId: string, isActive: boolean) =>
        api.put<{ message: string }>(`/auth/admin/users/${userId}/status`, {is_active: isActive}),
};

export const chatApi = {
    getSessions: () =>
        api.get<ChatSessionResponse[]>("/api/chat/sessions"),

    createSession: (data: CreateSessionRequest) =>
        api.post<ChatSessionResponse>("/api/chat/sessions", data),

    getSession: (sessionId: string) =>
        api.get<ChatSessionWithMessages>(`/api/chat/sessions/${sessionId}`),

    deleteSession: (sessionId: string) =>
        api.delete<{ message: string }>(`/api/chat/sessions/${sessionId}`),

    updateSession: (sessionId: string, data: UpdateSessionRequest) =>
        api.put<ChatSessionResponse>(`/api/chat/sessions/${sessionId}`, data),

    createMessage: (sessionId: string, data: CreateMessageRequest) =>
        api.post<{ message: string }>(`/api/chat/sessions/${sessionId}/messages`, data),

    submitMessageFeedback: (messageId: string, feedback: { rating: number; feedback?: string; is_helpful: boolean }) =>
        api.post<{ message: string }>(`/api/chat/messages/${messageId}/feedback`, feedback),
};

export const sourceApi = {
    getSourceDetail: (sourceId: string) =>
        api.get<SourceDetail>(`/api/sources/${sourceId}`),
};

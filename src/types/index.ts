export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role?: "free" | "premium" | "admin";
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}


export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  full_name: string;
}

export interface ChangePasswordCredentials {
  current_password: string;
  new_password: string;
}

export interface RagQueryRequest {
  question: string;
  session_id?: string;
  include_laws?: boolean;
  include_decisions?: boolean;
}

export interface RagQueryResponse {
  short_conclusion: string;
  detailed_reasoning: string;
  sources: Array<{
    id: string;
    type: "law" | "decision";
    title: string;
    anchor: string;
    excerpt: string;
    score: number;
    court?: string;
    court_id?: number;
    law_article?: string;
  }>;
  confidence: number;
  response_time_ms: number;
  query_id: string;
  sources_by_type: {
    law: number;
    decision: number;
  };
  avg_score: number;
}

export interface UserQuery {
  id: string;
  query_text: string;
  response_time_ms: number;
  confidence_score: number;
  sources_count: number;
  categories_used: {
    law: number;
    decision: number;
    constitution?: number;
  };
  user_rating: number | null;
  user_feedback: string | null;
  is_helpful: boolean | null;
  created_at: string;
  response_data?: RagQueryResponse;
}

export interface UserQueryHistory {
  queries: UserQuery[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface UserStats {
  user_id: string;
  total_queries: number;
  successful_queries: number;
  failed_queries: number;
  daily_queries_today: number;
  monthly_queries_current: number;
  avg_response_time: number;
  avg_confidence_score: number;
  total_sources_viewed: number;
  laws_queries: number;
  decisions_queries: number;
  constitution_queries: number;
  total_ratings: number;
  avg_rating: number;
  helpful_responses: number;
  created_at: string;
  updated_at: string;
}

export interface FeedbackRequest {
  query_id: string;
  rating: number;
  feedback?: string;
  is_helpful: boolean;
}

export interface SystemStats {
  total_users: number;
  active_users_today: number;
  total_queries_today: number;
  successful_queries_today: number;
  failed_queries_today: number;
  avg_response_time_today: number;
  avg_user_rating_today: number;
  category_distribution: {
    laws: number;
    decisions: number;
    constitution: number;
  };
  most_used_category: string;
  date: string;
}

export interface UserAnalytics {
  new_users_daily: Array<{
    date: string;
    count: number;
  }>;
  top_users: Array<{
    username: string;
    query_count: number;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  role: "free" | "premium" | "admin";
  created_at: string;
  last_login: string | null;
  daily_query_limit: number;
  monthly_query_limit: number;
}

export interface ChatSessionResponse {
  id: string;
  title: string;
  created_at: string;
  last_activity: string;
  message_count: number;
  is_archived: boolean;
}

export interface ChatMessageResponse {
  id: string;
  role: "user" | "assistant";
  content: string;
  response_data?: RagQueryResponse;
  confidence_score?: number;
  response_time_ms?: number;
  created_at: string;
}

export interface ChatSessionWithMessages extends ChatSessionResponse {
  messages: ChatMessageResponse[];
}

export interface CreateSessionRequest {
  title?: string;
}

export interface UpdateSessionRequest {
  title: string;
}

export interface CreateMessageRequest {
  role: "user" | "assistant";
  content: string;
  response_data?: RagQueryResponse;
  confidence_score?: number;
  response_time_ms?: number;
}

export interface SourceDetail {
  id: string;
  type: "law" | "decision" | "constitution";
  title: string;
  full_content: string;
  metadata: {
    id: string;
    category: string;
    title: string;
    source: string;
  };
  law_article?: string;
  law_type?: string;
  validity_status?: string;
  court?: string;
  date?: string;
  decision_no?: string;
}

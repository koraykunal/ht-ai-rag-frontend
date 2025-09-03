export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
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

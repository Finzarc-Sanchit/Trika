// Sessions API service
import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from '../api';

export interface Session {
  _id: string;
  value: string;
  label: string;
  price: number;
  description?: string;
  duration?: string;
  category: 'INDIVIDUAL' | 'GROUP' | 'TEACHING';
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionData {
  value: string;
  label: string;
  price: number;
  description?: string;
  duration?: string;
  category?: 'INDIVIDUAL' | 'GROUP' | 'TEACHING';
  image?: string;
  isActive?: boolean;
}

export interface SessionsResponse {
  success: boolean;
  count: number;
  sessions: Session[];
}

// Get all sessions
export const getSessions = async (category?: string): Promise<ApiResponse<SessionsResponse>> => {
  const url = category ? `/sessions?category=${category}` : '/sessions';
  return apiGet<SessionsResponse>(url);
};

// Get session by ID
export const getSessionById = async (id: string): Promise<ApiResponse<{ success: boolean; session: Session }>> => {
  return apiGet<{ success: boolean; session: Session }>(`/sessions/${id}`);
};

// Create session
export const createSession = async (sessionData: SessionData): Promise<ApiResponse<{ success: boolean; message: string; session: Session }>> => {
  return apiPost<{ success: boolean; message: string; session: Session }>('/sessions', sessionData);
};

// Update session
export const updateSession = async (id: string, sessionData: Partial<SessionData>): Promise<ApiResponse<{ success: boolean; message: string; session: Session }>> => {
  return apiPut<{ success: boolean; message: string; session: Session }>(`/sessions/${id}`, sessionData);
};

// Delete session
export const deleteSession = async (id: string): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  return apiDelete<{ success: boolean; message: string }>(`/sessions/${id}`);
};


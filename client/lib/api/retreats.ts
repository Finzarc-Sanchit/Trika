// Retreats API service
import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from '../api';

export interface Retreat {
  _id: string;
  name: string;
  price: number;
  location: string;
  date: string;
  description?: string;
  duration?: string;
  image?: string;
  maxCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RetreatData {
  name: string;
  price: number;
  location: string;
  date: string;
  description?: string;
  duration?: string;
  image?: string;
  maxCapacity?: number;
  isActive?: boolean;
}

export interface RetreatsResponse {
  success: boolean;
  count: number;
  retreats: Retreat[];
}

// Get all retreats
export const getRetreats = async (): Promise<ApiResponse<RetreatsResponse>> => {
  return apiGet<RetreatsResponse>('/retreats');
};

// Get retreat by ID
export const getRetreatById = async (id: string): Promise<ApiResponse<{ success: boolean; retreat: Retreat }>> => {
  return apiGet<{ success: boolean; retreat: Retreat }>(`/retreats/${id}`);
};

// Create retreat
export const createRetreat = async (retreatData: RetreatData): Promise<ApiResponse<{ success: boolean; message: string; retreat: Retreat }>> => {
  return apiPost<{ success: boolean; message: string; retreat: Retreat }>('/retreats', retreatData);
};

// Update retreat
export const updateRetreat = async (id: string, retreatData: Partial<RetreatData>): Promise<ApiResponse<{ success: boolean; message: string; retreat: Retreat }>> => {
  return apiPut<{ success: boolean; message: string; retreat: Retreat }>(`/retreats/${id}`, retreatData);
};

// Delete retreat
export const deleteRetreat = async (id: string): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  return apiDelete<{ success: boolean; message: string }>(`/retreats/${id}`);
};


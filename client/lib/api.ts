// API configuration and interceptor
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

interface RequestConfig extends RequestInit {
    skipAuth?: boolean;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: any;
}

// Request interceptor
const requestInterceptor = async (url: string, config: RequestConfig): Promise<RequestInit> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...config.headers,
    };

    // Add auth token if available (for future use)
    const token = localStorage.getItem('token');
    if (token && !config.skipAuth) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return {
        ...config,
        headers,
    };
};

// Response interceptor
const responseInterceptor = async <T>(response: Response): Promise<ApiResponse<T>> => {
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
        if (response.ok) {
            return { success: true, data: {} as T };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
        const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;

        // Handle specific status codes
        if (response.status === 401) {
            // Unauthorized - clear token and redirect to login if needed
            localStorage.removeItem('token');
            // You can add redirect logic here if needed
        }

        throw new Error(errorMessage);
    }

    return data;
};

// Main API function with interceptors
export const api = async <T = any>(
    endpoint: string,
    config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
    try {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

        // Apply request interceptor
        const requestConfig = await requestInterceptor(url, config);

        // Make the request
        const response = await fetch(url, requestConfig);

        // Apply response interceptor
        const data = await responseInterceptor<T>(response);

        return data;
    } catch (error) {
        // Handle network errors
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Network error: Please check your internet connection');
        }

        // Re-throw other errors
        throw error;
    }
};

// Convenience methods
export const apiGet = <T = any>(endpoint: string, config?: RequestConfig) => {
    return api<T>(endpoint, { ...config, method: 'GET' });
};

export const apiPost = <T = any>(endpoint: string, data?: any, config?: RequestConfig) => {
    return api<T>(endpoint, {
        ...config,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
    });
};

export const apiPut = <T = any>(endpoint: string, data?: any, config?: RequestConfig) => {
    return api<T>(endpoint, {
        ...config,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    });
};

export const apiDelete = <T = any>(endpoint: string, config?: RequestConfig) => {
    return api<T>(endpoint, { ...config, method: 'DELETE' });
};

export default api;


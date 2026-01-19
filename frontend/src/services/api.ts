import axios from 'axios';
import type { PasswordOptions, BatchPasswordOptions, PassphraseOptions, PasswordResponse, ApiResponse } from '../types';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Generate a secure password
 */
export const generatePassword = async (options: PasswordOptions): Promise<PasswordResponse> => {
    try {
        const response = await api.post<ApiResponse<PasswordResponse>>('/api/password/generate', options);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to generate password');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to generate password');
        }
        throw error;
    }
};

/**
 * Generate multiple secure passwords
 */
export const generateBatch = async (batchOptions: BatchPasswordOptions): Promise<PasswordResponse[]> => {
    try {
        const response = await api.post<ApiResponse<PasswordResponse[]>>('/api/password/batch', batchOptions);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to generate passwords');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to generate passwords');
        }
        throw error;
    }
};

/**
 * Generate a passphrase
 */
export const generatePassphrase = async (options: PassphraseOptions): Promise<PasswordResponse> => {
    try {
        const response = await api.post<ApiResponse<PasswordResponse>>('/api/password/passphrase', options);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to generate passphrase');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to generate passphrase');
        }
        throw error;
    }
};

/**
 * Analyze password strength
 */
export const analyzePassword = async (password: string): Promise<PasswordResponse> => {
    try {
        const response = await api.post<ApiResponse<PasswordResponse>>('/api/password/analyze', { password });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to analyze password');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to analyze password');
        }
        throw error;
    }
};

/**
 * Check service health
 */
export const checkHealth = async (): Promise<string> => {
    try {
        const response = await api.get<ApiResponse<string>>('/api/password/health');
        return response.data.data;
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
};

export default api;

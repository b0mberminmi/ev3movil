import axios from 'axios';
import { API_URL } from '../constants/config';
import { handleAxiosError, ApiError } from '../utils/error-handler';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data?: {
        token: string;
    };
}

export type RegisterPayload = LoginPayload;
export type RegisterResponse = LoginResponse;

export default function getAuthService() {
    const client = axios.create({
        baseURL: `${API_URL}/auth`,
        timeout: 10000, // 10 segundos
    });

    async function login(payload: LoginPayload): Promise<LoginResponse> {
        try {
            // Validación básica de entrada
            if (!payload.email || !payload.password) {
                throw new ApiError(400, 'Email y contraseña son requeridos');
            }

            const response = await client.post<LoginResponse>('/login', payload);
            return response.data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw handleAxiosError(error, 'Error al iniciar sesión');
        }
    }

    async function register(payload: RegisterPayload): Promise<RegisterResponse> {
        try {
            // Validación básica de entrada
            if (!payload.email || !payload.password) {
                throw new ApiError(400, 'Email y contraseña son requeridos');
            }

            if (payload.password.length < 6) {
                throw new ApiError(400, 'La contraseña debe tener al menos 6 caracteres');
            }

            const response = await client.post<RegisterResponse>('/register', payload);
            return response.data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw handleAxiosError(error, 'Error al registrarse');
        }
    }

    return {
        login,
        register,
    };
}

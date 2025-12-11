import axios from 'axios';
import { API_URL } from '../constants/config';

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
    });

    async function login(payload: LoginPayload): Promise<LoginResponse> {
        try {
            const response = await client.post<LoginResponse>('/login', payload);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw new Error('Credenciales inválidas');
                }
            }
            throw new Error('Error de red o del servidor');
        }
    }

    async function register(payload: RegisterPayload): Promise<RegisterResponse> {
        try {
            const response = await client.post<RegisterResponse>('/register', payload);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    throw new Error('El usuario ya existe');
                }
            }
            throw new Error('Error de red o del servidor');
        }
    }

    return {
        login,
        register,
    };
}

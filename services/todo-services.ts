import axios from 'axios';
import { API_URL } from '../constants/config';

export interface Task {
    title: string;
    description?: string;
    photoUri?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

export interface TodoApi {
    id: string;
    title: string;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetTodosResponse {
    success: boolean;
    data: TodoApi[];
    count?: number;
}

export interface CreateTodoResponse {
    success: boolean;
    data: TodoApi;
}

export interface UpdateTodoResponse {
    success: boolean;
    data: TodoApi;
}

export default function getTodoService({ token }: { token: string }) {
    const client = axios.create({
        baseURL: `${API_URL}/todos`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    async function getTodos(): Promise<GetTodosResponse> {
        try {
            const response = await client.get<GetTodosResponse>('');
            
            // La API devuelve { success, data: [...], count }
            if (!response.data) {
                return { success: true, data: [], count: 0 };
            }

            // Validar que data sea array
            if (!Array.isArray(response.data.data)) {
                return { success: true, data: [], count: 0 };
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                if (status === 401) {
                    throw new Error('No autorizado');
                }
                if (status === 404) {
                    return { success: true, data: [], count: 0 };
                }
                throw new Error(`Error del servidor: ${status}`);
            }
            console.error('Error de red al obtener tareas:', error);
            throw new Error('No se pudo conectar al servidor');
        }
    }

    async function createTodo(task: Task): Promise<TodoApi> {
        try {
            const response = await client.post<CreateTodoResponse>('', task);
            if (!response.data?.data) {
                throw new Error('Respuesta inválida del servidor');
            }
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw new Error('No autorizado');
                }
            }
            console.error('Error al conectar al servidor', error);
            throw new Error('Error al conectar al servidor');
        }
    }

    async function toggleTodo(id: string, completed: boolean): Promise<TodoApi> {
        try {
            const response = await client.patch<UpdateTodoResponse>(`/${id}`, { completed });
            if (!response.data?.data) {
                throw new Error('Respuesta inválida del servidor');
            }
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw new Error('No autorizado');
                }
            }
            throw new Error('Error al actualizar la tarea');
        }
    }

    async function deleteTodo(id: string): Promise<void> {
        try {
            await client.delete(`/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw new Error('No autorizado');
                }
            }
            throw new Error('Error al eliminar la tarea');
        }
    }

    async function updateTodo(id: string, task: Task): Promise<TodoApi> {
        try {
            const response = await client.patch<UpdateTodoResponse>(`/${id}`, task);
            if (!response.data?.data) {
                throw new Error('Respuesta inválida del servidor');
            }
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw new Error('No autorizado');
                }
            }
            console.error('Error al conectar con el servidor', error);
            throw new Error('Error al conectar con el servidor');
        }
    }

    return {
        getTodos,
        createTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
    };
}

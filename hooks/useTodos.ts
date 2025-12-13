import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getTodoService, { TodoApi } from '../services/todo-services';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

const useTodos = (token: string | undefined) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const mapTodo = (apiTodo: TodoApi): Todo => ({
    id: apiTodo.id,
    title: apiTodo.title,
    completed: Boolean(apiTodo.completed),
    photoUri: apiTodo.photoUri,
    location: apiTodo.location,
  });

  const loadTodos = useCallback(async () => {
    if (!token) {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    const service = getTodoService({ token });
    try {
      const response = await service.getTodos();
      const mapped = response.data?.map(mapTodo) ?? [];
      if (isMountedRef.current) {
        setTodos(mapped);
        setCount(response.count ?? mapped.length);
      }
    } catch (error) {
      console.error('Error al cargar tareas desde API:', error);
      // En caso de error, mantener lista vacía en lugar de crash
      if (isMountedRef.current) {
        setTodos([]);
        setCount(0);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    setIsLoading(true);
    loadTodos();
  }, [loadTodos]);

  // Permite recargar explícitamente
  const reload = useCallback(() => {
    setIsLoading(true);
    loadTodos();
  }, [loadTodos]);

  const createTodo = useCallback(
    async (task: { title: string; description?: string }) => {
      if (!token) return;
      const service = getTodoService({ token });
      try {
        const created = await service.createTodo(task);
        const mapped = mapTodo(created);
        setTodos(prev => [...prev, mapped]);
        setCount(prev => prev + 1);
      } catch (error) {
        console.error('Error al crear tarea:', error);
        throw error;
      }
    },
    [token]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      if (!token) return;
      const service = getTodoService({ token });
      try {
        await service.deleteTodo(id);
          setTodos(prev => prev.filter(t => t.id !== id));
          setCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        throw error;
      }
    },
    [token]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      if (!token) return;
      const current = todos.find(t => t.id === id);
      if (!current) return;

      const service = getTodoService({ token });
      try {
        const updated = await service.toggleTodo(id, !current.completed);
        const mapped = mapTodo(updated);
        setTodos(prev => prev.map(t => (t.id === id ? mapped : t)));
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
        throw error;
      }
    },
    [token, todos]
  );

  const updateTodo = useCallback(
    async (id: string, updates: Partial<{ title: string; photoUri?: string; location?: Todo['location'] }>) => {
      if (!token) return;
      const current = todos.find(t => t.id === id);
      if (!current) return;

      const service = getTodoService({ token });
      try {
        // Combinar datos actuales con los cambios
        const updatedTask = {
          title: updates.title ?? current.title,
          photoUri: updates.photoUri ?? current.photoUri,
          location: updates.location ?? current.location,
        };

        const updated = await service.updateTodo(id, updatedTask);
        const mapped = mapTodo(updated);
        setTodos(prev => prev.map(t => (t.id === id ? mapped : t)));
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
        throw error;
      }
    },
    [token, todos]
  );

  const activeTodos = useMemo(() => todos.filter(t => !t.completed), [todos]);
  const completedTodos = useMemo(() => todos.filter(t => t.completed), [todos]);

  return {
    todos,
    activeTodos,
    completedTodos,
    count,
    isLoading,
    createTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    reload,
  };
};

export default useTodos;
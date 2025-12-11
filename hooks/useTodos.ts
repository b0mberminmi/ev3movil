import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface Todo {
  id: string;
  title: string;
  photoUri: string;
  latitude: number;
  longitude: number;
  isCompleted: boolean;
  userEmail: string;
}

const TODOS_STORAGE_KEY_PREFIX = '@MyApp:Todos';
const getStorageKey = (email: string) =>
  `${TODOS_STORAGE_KEY_PREFIX}:${email.trim().toLowerCase() || 'anon'}`;

const useTodos = (currentEmail: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const storageKey = useMemo(() => getStorageKey(currentEmail), [currentEmail]);

  const loadTodos = useCallback(async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(storageKey);
      const parsed: Todo[] = storedTodos ? JSON.parse(storedTodos) : [];
      if (isMountedRef.current) {
        setTodos(parsed);
      }
    } catch (error) {
      console.error('Error al cargar tareas: ', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    setIsLoading(true);
    loadTodos();
  }, [loadTodos]);

  // Permite recargar explícitamente al cerrar la modal
  const reload = useCallback(() => {
    setIsLoading(true);
    loadTodos();
  }, [loadTodos]);

  const persistTodos = useCallback(
    async (nextTodos: Todo[]) => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(nextTodos));
      } catch (error) {
        console.error('Error al guardar tareas: ', error);
      }
    },
    [storageKey]
  );

  // Crear
  const createTodo = useCallback(
    async (
      title: string,
      photoUri: string,
      location: Location.LocationObjectCoords
    ) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title,
        photoUri,
        latitude: location.latitude,
        longitude: location.longitude,
        isCompleted: false,
        userEmail: currentEmail,
      };

      setTodos(prevTodos => {
        const next = [...prevTodos, newTodo];
        persistTodos(next);
        return next;
      });
    },
    [currentEmail, persistTodos]
  );

  // Borrar
  const deleteTodo = useCallback(
    async (id: string) => {
      setTodos(prevTodos => {
        const next = prevTodos.filter(todo => todo.id !== id);
        persistTodos(next);
        return next;
      });
    },
    [persistTodos]
  );

  // Marcar / desmarcar
  const toggleTodo = useCallback(
    async (id: string) => {
      setTodos(prevTodos => {
        const next = prevTodos.map(todo =>
          todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        );
        persistTodos(next);
        return next;
      });
    },
    [persistTodos]
  );

  // Apartados: activas y completadas
  const activeTodos = useMemo(
    () => todos.filter(t => !t.isCompleted),
    [todos]
  );

  const completedTodos = useMemo(
    () => todos.filter(t => t.isCompleted),
    [todos]
  );

  return {
    todos,
    activeTodos,
    completedTodos,
    isLoading,
    createTodo,
    deleteTodo,
    toggleTodo,
    reload,
  };
};

export default useTodos;
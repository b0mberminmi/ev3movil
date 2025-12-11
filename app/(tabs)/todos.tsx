import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import TodoItem from '../../components/TodoItem';
import useTodos, { Todo } from '../../hooks/useTodos';

const NEON_GREEN = '#00FF00';
const BLACK = 'black';

export default function TodosScreen() {
  // Se obtiene email del usuario con los parámetros
  const { userEmail } = useLocalSearchParams<{ userEmail?: string }>();
  const emailString = userEmail ? String(userEmail) : '';

  const router = useRouter();

  // Se conecta al hook con el email ingresado
  const {
    todos,
    activeTodos,
    completedTodos,
    isLoading,
    deleteTodo,
    toggleTodo,
    reload,
  } = useTodos(emailString);

  const handleToggleRequest = (todo: Todo) => {
    toggleTodo(todo.id);
  };

  const handleDeleteRequest = (todo: Todo) => {
    deleteTodo(todo.id);
  };

  // Recargar las tareas cada vez que la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  // Renderizado
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis tareas</Text>
        {emailString ? (
          <Text style={styles.headerSubtitle}>{emailString}</Text>
        ) : null}
        {activeTodos.length > 0 ? (
          <Text style={styles.hintText}>
            Selecciona una tarea para marcarla como completada.
          </Text>
        ) : null}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={NEON_GREEN} />
          <Text style={styles.loadingText}>Cargando tareas...</Text>
        </View>
      ) : todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aún no has creado tareas.</Text>
          <Text style={styles.emptyHint}>
            Crea tu primera tarea usando el botón +.
          </Text>
        </View>
      ) : (
        <FlatList
          data={activeTodos}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggleRequest={handleToggleRequest}
              onDeleteRequest={handleDeleteRequest}
            />
          )}
          ListFooterComponent={
            completedTodos.length > 0 ? (
              <View style={styles.completedSection}>
                <Text style={styles.completedTitle}>Tareas completadas</Text>
                {completedTodos.map(todo => (
                  <View key={todo.id} style={styles.completedItemWrapper}>
                    <TodoItem
                      todo={todo}
                      onToggleRequest={handleToggleRequest}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  </View>
                ))}
              </View>
            ) : null
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: '/modal',
            params: { userEmail: emailString },
          })
        }
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: NEON_GREEN,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: NEON_GREEN,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: NEON_GREEN,
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyHint: {
    color: '#AAAAAA',
    fontSize: 13,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 80,
  },
  separator: {
    height: 10,
  },
  completedSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 12,
  },
  completedTitle: {
    color: NEON_GREEN,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completedItemWrapper: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: NEON_GREEN,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 36,
    color: 'black',
    marginTop: -3,
  },
  hintText: {
    color: '#AAAAAA',
    fontSize: 13,
    marginTop: 6,
  },
});
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Todo } from '../hooks/useTodos';

const NEON_GREEN = '#00FF00';
const INACTIVE_NEON = '#006600';
const WHITE = 'white';
const BLACK = 'black';

interface TodoItemProps {
  todo: Todo;
  onToggleRequest: (todo: Todo) => void;
  onDeleteRequest: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleRequest,
  onDeleteRequest,
}) => {
  const isCompleted = todo.isCompleted;

  return (
    <View
      style={[
        styles.container,
        isCompleted && styles.containerCompleted,
      ]}
    >
      <TouchableOpacity
        onPress={() => onToggleRequest(todo)}
        style={styles.checkContainer}
      >
        {isCompleted ? (
          <FontAwesome name="check-square" size={26} color={NEON_GREEN} />
        ) : (
          <FontAwesome name="square-o" size={26} color={NEON_GREEN} />
        )}
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.title,
            isCompleted && styles.titleCompleted,
          ]}
          numberOfLines={2}
        >
          {todo.title}
        </Text>

        <Text style={styles.locationText}>
          ({todo.latitude.toFixed(4)}, {todo.longitude.toFixed(4)})
        </Text>
      </View>

      <Image source={{ uri: todo.photoUri }} style={styles.todoImage} />

      <TouchableOpacity
        onPress={() => onDeleteRequest(todo)}
        style={styles.deleteButton}
      >
        <FontAwesome name="trash" size={22} color={INACTIVE_NEON} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BLACK,
    borderWidth: 1,
    borderColor: NEON_GREEN,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  containerCompleted: {
    opacity: 0.4,
  },

  checkContainer: {
    marginRight: 12,
  },

  infoContainer: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    fontSize: 16,
    color: WHITE,
  },

  titleCompleted: {
    textDecorationLine: 'line-through',
    color: INACTIVE_NEON,
  },

  locationText: {
    fontSize: 12,
    color: INACTIVE_NEON,
    marginTop: 2,
  },

  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },

  todoImage: {
    width: 55,
    height: 55,
    borderRadius: 4,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: NEON_GREEN,
  },
});

export default TodoItem;
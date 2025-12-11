import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Linking } from 'react-native';
import TodoForm from '../components/TodoForm';
import useTodos from '../hooks/useTodos';

const NEON_GREEN = '#00FF00';
const BLACK = 'black';

export default function ModalScreen() {
  const router = useRouter();
  const { userEmail } = useLocalSearchParams<{ userEmail?: string }>();

  const emailString = userEmail ? String(userEmail) : '';

  const { createTodo } = useTodos(emailString);

  // Comprobar y (re)solicitar permisos de ubicación y cámara al abrir el modal.
  // Si el usuario denegó permanentemente, mostramos un diálogo para abrir los ajustes.
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Ubicación
        const locStatus = await Location.getForegroundPermissionsAsync();
        if (mounted && locStatus.status !== Location.PermissionStatus.GRANTED) {
          const requested = await Location.requestForegroundPermissionsAsync();
          if (!requested.granted) {
            if (!requested.canAskAgain) {
              Alert.alert(
                'Permiso de ubicación requerido',
                'La aplicación necesita acceso a la ubicación. Por favor, habilítalo en los ajustes.',
                [
                  { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
                  { text: 'Cancelar', style: 'cancel' },
                ]
              );
            }
          }
        }

        // Cámara
        const camStatus = await ImagePicker.getCameraPermissionsAsync();
        if (mounted && camStatus.status !== ImagePicker.PermissionStatus.GRANTED) {
          const requestedCam = await ImagePicker.requestCameraPermissionsAsync();
          if (!requestedCam.granted) {
            // Algunas versiones usan `canAskAgain` en la respuesta
            if ((requestedCam as any).canAskAgain === false) {
              Alert.alert(
                'Permiso de cámara requerido',
                'La aplicación necesita acceso a la cámara. Por favor, habilítalo en los ajustes.',
                [
                  { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
                  { text: 'Cancelar', style: 'cancel' },
                ]
              );
            }
          }
        }

        // Calentar cache de ubicación (no bloqueante)
        try {
          await Location.getLastKnownPositionAsync();
        } catch (e) {
          /* ignore */
        }
      } catch (error) {
        console.warn('Preload permissions failed:', error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateFromModal = async (
    title: string,
    uri: string,
    coords: Location.LocationObjectCoords
  ) => {
    await createTodo(title, uri, coords);
    router.back(); // cerramos modal
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.closeText}>Cerrar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Crear nueva tarea</Text>

      <TodoForm onCreateTodo={handleCreateFromModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeText: {
    color: NEON_GREEN,
    fontSize: 16,
  },
  title: {
    color: NEON_GREEN,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const NEON_GREEN = '#00FF00';
const INACTIVE_NEON = '#006600';
const BLACK = 'black';

interface TodoFormProps {
  onCreateTodo: (
    title: string,
    uri: string,
    coords: Location.LocationObjectCoords
  ) => Promise<void>;
}

const TodoForm: React.FC<TodoFormProps> = ({ onCreateTodo }) => {
  const [title, setTitle] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const ensureCameraPermission = async () => {
    const currentPermission = await ImagePicker.getCameraPermissionsAsync();

    if (currentPermission.status === ImagePicker.PermissionStatus.GRANTED) {
      return true;
    }

    const requested = await ImagePicker.requestCameraPermissionsAsync();

    if (requested.status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos permiso de cámara para tomar una foto de la tarea.'
      );
      return false;
    }

    return true;
  };

  const ensureLocationPermission = async () => {
    const currentPermission = await Location.getForegroundPermissionsAsync();

    if (currentPermission.status === Location.PermissionStatus.GRANTED) {
      return true;
    }

    const requested = await Location.requestForegroundPermissionsAsync();

    if (requested.status !== Location.PermissionStatus.GRANTED) {
      Alert.alert(
        'Permiso de ubicación requerido',
        'Necesitamos tu ubicación para asociarla a la tarea.'
      );
      return false;
    }

    return true;
  };

  const handlePickImage = async () => {
    try {
      const hasPermission = await ensureCameraPermission();
      if (!hasPermission) return;

      // `expo-image-picker` v17+ recomienda `ImagePicker.MediaType`,
      // pero algunas versiones pueden no exponer `MediaType` (y usan MediaTypeOptions).
      // Usamos un fallback en tiempo de ejecución para evitar errores si la propiedad no existe.
      const mediaTypesCandidate =
        (ImagePicker as any).MediaType?.Images ??
        (ImagePicker as any).MediaTypeOptions?.Images;

      const launchOptions: any = {
        allowsEditing: false,
        quality: 0.7,
      };

      // Solo incluir mediaTypes si el valor runtime es compatible (no un array de strings).
      // Pasar un array de strings ('Images') provoca error de cast en Android.
      if (mediaTypesCandidate !== undefined && !Array.isArray(mediaTypesCandidate)) {
        launchOptions.mediaTypes = mediaTypesCandidate;
      }

      const result = await ImagePicker.launchCameraAsync(launchOptions);

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset?.uri) {
        Alert.alert('Error', 'No se pudo obtener la imagen seleccionada.');
        return;
      }

      setSelectedImageUri(asset.uri);
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      Alert.alert(
        'Error',
        'Ocurrió un problema al acceder a la cámara. Intenta nuevamente.'
      );
    }
  };

  const handleCreateTodo = async () => {
    const trimmedTitle = title.trim();

    // Validación de título
    if (!trimmedTitle) {
      Alert.alert('Título requerido', 'Por favor ingresa un título para la tarea.');
      return;
    }

    // Validación de foto
    if (!selectedImageUri) {
      Alert.alert(
        'Foto requerida',
        'Debes tomar una foto para asociarla a la tarea.'
      );
      return;
    }

    if (isCreating) return;

    setIsCreating(true);

    try {
      const hasLocationPermission = await ensureLocationPermission();
      if (!hasLocationPermission) {
        setIsCreating(false);
        return;
      }

      // Intentamos usar una posición conocida en caché primero (rápido). Si no hay, pedimos
      // la posición actual con menor precisión para reducir el tiempo de espera.
      let location = await Location.getLastKnownPositionAsync();
      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
      }

      await onCreateTodo(trimmedTitle, selectedImageUri, location.coords);

      setTitle('');
      setSelectedImageUri(null);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      Alert.alert(
        'Error de creación',
        'Hubo un problema al guardar la tarea o la localización.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Título de la tarea..."
        placeholderTextColor={INACTIVE_NEON}
        value={title}
        onChangeText={setTitle}
      />

      {selectedImageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImageUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.retakeButton} onPress={handlePickImage}>
            <Text style={styles.retakeText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
          <FontAwesome name="camera" size={20} color={NEON_GREEN} />
          <Text style={styles.imageButtonText}>Tomar foto</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.createButton, isCreating && styles.createButtonDisabled]}
        onPress={handleCreateTodo}
        disabled={isCreating}
      >
        {isCreating ? (
          <Text style={styles.createButtonText}>Creando tarea...</Text>
        ) : (
          <Text style={styles.createButtonText}>Crear tarea</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    backgroundColor: BLACK,
    borderTopWidth: 1,
    borderTopColor: INACTIVE_NEON,
  },
  input: {
    borderWidth: 1,
    borderColor: NEON_GREEN,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: NEON_GREEN,
    marginBottom: 12,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: NEON_GREEN,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 12,
  },
  imageButtonText: {
    color: NEON_GREEN,
    marginLeft: 8,
    fontSize: 14,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  retakeButton: {
    padding: 5,
  },
  retakeText: {
    color: NEON_GREEN,
    fontSize: 14,
  },
  createButton: {
    backgroundColor: NEON_GREEN,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: INACTIVE_NEON,
  },
  createButtonText: {
    color: BLACK,
    fontWeight: 'bold',
  },
});

export default TodoForm;
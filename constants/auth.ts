import AsyncStorage from '@react-native-async-storage/async-storage';

const VALID_USERS = [
  { email: 'demo@eva.com', password: '2025' },
  { email: 'visitante@eva.com', password: '1234' },
];

const SIMULATED_DELAY_MS = 350;

const wait = () =>
  new Promise(resolve => {
    setTimeout(resolve, SIMULATED_DELAY_MS);
  });

export const CURRENT_USER_STORAGE_KEY = '@MyApp:CurrentUser';

export interface AuthUser {
  email: string;
}

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// Autenticación de usuario con lista de usuarios válidos
export const authenticate = async (email: string, password: string): Promise<boolean> => {
  await wait();

  const normalizedEmail = email.trim().toLowerCase();

  const foundUser = VALID_USERS.find(
    user =>
      user.email.toLowerCase() === normalizedEmail && user.password === password,
  );

  if (!foundUser) {
    await AsyncStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    return false;
  }

  const userToStore: AuthUser = { email: normalizedEmail };

  try {
    await AsyncStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToStore));
  } catch (error) {
    console.error('Error al guardar el usuario actual:', error);
  }

  return true;
};


 // Se obtiene el usuario actual desde AsyncStorage
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const stored = await AsyncStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!stored) return null;

    // Intentamos parsear como objeto { email }
    try {
      const parsed = JSON.parse(stored) as AuthUser;
      if (parsed && typeof parsed.email === 'string') {
        return { email: parsed.email.trim().toLowerCase() };
      }
    } catch {
      return { email: stored.trim().toLowerCase() };
    }

    return null;
  } catch (error) {
    console.error('Error al leer el usuario actual:', error);
    return null;
  }
};


// Se elimina el usuario actual de asyncStorage

export const clearCurrentUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar el usuario actual:', error);
  }
};
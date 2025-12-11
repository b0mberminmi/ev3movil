import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { authenticate, getCurrentUser, isValidEmail } from '../constants/auth';
import { useAuth } from '../components/context/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Se restaura sesión si ya hay un usuario registrado
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.email && isMounted) {
          router.replace({
            pathname: '/(tabs)/todos',
            params: { userEmail: user.email },
          });
          return;
        }
      } catch (restoreError) {
        console.error('Error restaurando la sesión:', restoreError);
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogin = async () => {
    setError('');

    if (!isValidEmail(email)) {
      setError('Ingresa un email válido.');
      return;
    }

    if (!password) {
      setError('Ingresa tu contraseña.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Usar la API real en lugar de autenticación local
      const success = await login(email.trim(), password.trim());

      if (!success) {
        setError('Credenciales incorrectas.');
        return;
      }

      // Navegar a la pantalla de todos
      router.replace({
        pathname: '/(tabs)/todos',
        params: { userEmail: email.trim().toLowerCase() },
      });
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError((err as Error).message || 'No se pudo iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#00ff00" size="large" />
        <Text style={styles.loadingText}>Cargando sesión...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#006600"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        placeholderTextColor="#006600"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[
          styles.loginButton,
          { opacity: !email || !password || isSubmitting ? 0.5 : 1 },
        ]}
        disabled={!email || !password || isSubmitting}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>
          {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: '#00ff00',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#00ff00',
  },
  label: {
    fontSize: 16,
    color: '#00ff00',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#00ff00',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: '#00ff00',
  },
  loginButton: {
    backgroundColor: '#00ff00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
});
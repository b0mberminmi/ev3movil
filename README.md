# Evaluación 3 - Desarrollo Móvil — TODO List

Aplicación de lista de tareas (TODO) desarrollada con React Native + Expo y TypeScript que se conecta a una API backend externa. 
Proyecto creado como parte de la Evaluación 3 del curso de Desarrollo de Aplicaciones Móviles.

## Enlace a la Demostración en Video



## Características

- **Autenticación con API backend**: Login y registro contra servidor externo.
- Gestión de tareas: crear, editar, completar y eliminar tareas.
- Interfaz con navegación por pestañas (tabs).
- Formularios controlados con validación.
- Persistencia de sesión de usuario con `AsyncStorage`.
- Context API para gestión de estado de autenticación.
- Componentes reutilizables y hooks personalizados.
- Cliente HTTP con Axios para comunicación con la API.

## Credenciales de prueba

Para acceder a la aplicación, crea un usuario en el panel de administración de la API o usa estas credenciales:

- Email: `user@e.com`  
	Password: `123`

## Tecnologías

- Expo (React Native)
- React
- TypeScript
- **Axios** (cliente HTTP para la API)
- **Context API** (gestión de estado de autenticación)
- `@react-native-async-storage/async-storage` (persistencia de sesión)
- Expo Router (navegación)
- Metro bundler (dev server)
- Node.js, npm/yarn

## Requisitos

- Node.js (14+ recomendado)
- npm o yarn
- Opcional: Expo CLI (`npm install -g expo-cli`)

## Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl
```

Esta variable define la URL base de la API backend externa.

## Instalación y ejecución

1. Instala dependencias

```powershell
npm install
```

2. Inicia la aplicación (abrirá el panel de Expo)

```powershell
npx expo start
```

Abre la app en un emulador o dispositivo con Expo Go / development build según prefieras.

## Estructura principal del proyecto

- `app/` — Pantallas y rutas (login, tabs, etc.).
  - `index.tsx` — Pantalla de login.
  - `(tabs)/` — Pantallas con navegación por pestañas (todos, perfil).
  - `_layout.tsx` — Layout raíz con AuthProvider.
- `components/` — Componentes reutilizables.
  - `TodoItem.tsx`, `TodoForm.tsx` — Gestión de tareas.
  - `context/auth-context.tsx` — Context de autenticación.
- `services/` — Servicios de API.
  - `auth-services.ts` — Cliente HTTP para autenticación.
- `hooks/` — Hooks personalizados.
  - `useTodos.ts` — Lógica de TODOs.
- `constants/` — Constantes y configuración.
  - `auth.ts` — Lógica de autenticación local.
  - `config.ts` — Variables de entorno.
  - `Colors.ts` — Paleta de colores.
- `assets/` — Fuentes e imágenes.
- `package.json` — Dependencias y scripts.
- `tsconfig.json` — Configuración de TypeScript.
- `.env.local` — Variables de entorno (local).


## Uso de IA

Durante el desarrollo se utilizó GitHub Copilot como herramienta de apoyo para identificar y solucionar errores y proponer snippets de código. Las sugerencias de Copilot fueron revisadas y validadas manualmente por el equipo antes de incorporarlas al proyecto.

## Licencia
Este proyecto es de uso académico y está estríctamente prohibido su uso para usos comerciales.

## Autores
Miembros del equipo y roles:
- Luciano Lopresti: Desarollo.
- Sebastián Masferrer: Desarrollo.
- Víctor Mella: Desarrollo.
- Loretto Herrera: Desarrollo.



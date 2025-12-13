# Evaluación 3 - Desarrollo Móvil — TODO List

Aplicación de lista de tareas (TODO) desarrollada con React Native + Expo y TypeScript que se conecta a una API backend externa. Implementa gestión completa de tareas con captura de fotos, ubicación GPS, edición de tareas y autenticación de usuarios.
Proyecto creado como parte de la Evaluación 3 del curso de Desarrollo de Aplicaciones Móviles.

# Video Explicativo

- [Ver video explicativo en YouTube](https://youtu.be/StnTmLiDNwM?si=4MjswExMO4bPt1Fw)


## Características

- **Autenticación con API backend**: Login y registro de nuevos usuarios contra servidor externo con JWT.
- **Gestión completa de tareas**: Crear, editar, completar y eliminar tareas.
- **Captura de fotos**: Tomar fotos con la cámara del dispositivo e incluirlas en las tareas.
- **Ubicación GPS**: Capturar coordenadas de ubicación automáticamente al tomar fotos.
- **Visor de tareas**: Mostrar fotos y coordenadas de ubicación en la lista de tareas.
- **Edición de tareas**: Modificar el título de tareas existentes mediante modal dedicado.
- **Perfil de usuario**: Resumen de tareas totales, completadas y pendientes.
- **Interfaz con navegación por pestañas** (tabs): Tareas y Perfil.
- **Persistencia de sesión**: Mantiene el usuario logueado entre sesiones.
- **Context API** para gestión de estado de autenticación.
- **Componentes reutilizables** y hooks personalizados.
- **Cliente HTTP con Axios** para comunicación con la API externa.
- **Integración con API externa**: https://todo-list.dobleb.cl

## Credenciales de prueba

Para acceder a la aplicación, utiliza la opción de **"Registrate"** directamente desde la pantalla de login para crear una nueva cuenta con el siguiente formato:

```
Email: usuario@ejemplo.com
Contraseña: mínimo 6 caracteres
```

O usa credenciales existentes si ya las tienes registradas en el sistema.

## Tecnologías

- **Expo** (React Native)
- **React** 19.1.0
- **TypeScript** (strict mode)
- **Axios** (cliente HTTP para la API)
- **Context API** (gestión de estado)
- **React Router** (expo-router v6)
- **AsyncStorage** (persistencia de sesión)
- **jose** (decodificación de JWT)
- **expo-image-picker** (captura de fotos)
- **expo-location** (coordenadas GPS)
- **FontAwesome Icons** (interfaz visual)

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

1. **Instala dependencias**:

```powershell
npm install
```

2. **Inicia la aplicación**:

```powershell
npx expo start
```

3. **Escanea el código QR** con la app Expo Go o abre en emulador/dispositivo.

## Funcionalidades Principales

### Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios
- Persistencia automática de sesión
- Cierre de sesión (logout)

### Gestión de Tareas
- Crear tareas con título, foto y ubicación
- Editar título de tareas existentes
- Marcar tareas como completadas/pendientes
- Eliminar tareas
- Ver tareas activas y completadas
- Mostrar contador de tareas

### Perfil de Usuario
- Ver email del usuario logueado
- Resumen de tareas (total, completadas, pendientes)

### Captura Multimedia
- Botón para capturar fotos con la cámara
- Obtención automática de ubicación GPS después de capturar
- Vista previa de foto antes de crear/editar
- Visualización de fotos en la lista de tareas
- Mostrar coordenadas de ubicación (latitud, longitud)

## Estructura principal del proyecto

```
app/
├── index.tsx              # Pantalla de login
├── register.tsx           # Pantalla de registro
├── modal.tsx              # Modal para crear tareas
├── edit-modal.tsx         # Modal para editar tareas
├── _layout.tsx            # Layout raíz con AuthProvider
├── LogoutButton.tsx       # Botón de cierre de sesión
└── (tabs)/
    ├── _layout.tsx        # Layout de tabs
    ├── todos.tsx          # Pantalla de lista de tareas
    └── profile.tsx        # Pantalla de perfil

components/
├── TodoItem.tsx           # Componente individual de tarea
├── TodoForm.tsx           # Formulario para crear/editar tareas
├── EditScreenInfo.tsx
├── StyledText.tsx
├── Themed.tsx
└── context/
    └── auth-context.tsx   # Context de autenticación

services/
├── auth-services.ts       # API de autenticación
├── todo-services.ts       # API de tareas
└── image-services.ts      # API de carga de imágenes

hooks/
└── useTodos.ts            # Hook para gestión de tareas

constants/
├── auth.ts                # Lógica de autenticación
├── config.ts              # Variables de entorno
└── Colors.ts              # Paleta de colores

assets/
├── fonts/
└── images/

package.json              # Dependencias y scripts
tsconfig.json             # Configuración de TypeScript
.env.local                # Variables de entorno (local)
README.md                 # Este archivo
```

## Endpoints de la API

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar nuevo usuario

### Tareas
- `GET /todos` - Obtener lista de tareas
- `POST /todos` - Crear nueva tarea
- `PATCH /todos/:id` - Actualizar tarea
- `DELETE /todos/:id` - Eliminar tarea

### Demostración
A continuación se mostraran algunas capturas del consumo de los diferentes endpoints de la api en la 
plataforma de Swagger, junto con sus resultados en nuestra aplicación propiamente tal.

![Metodo get](/assets/images/get-pc.png)

Aquí podemos apreciar el uso del método GET del endpoint /todos, el cual fue correctamente ejecutado y nos dio como respuesta
una sola tarea que es la que teníamos hasta ese momento luego de grabar el vídeo.

![Resultado aplicacion metodo GET](/assets/images/get-cel.png)



## Uso de IA

Durante el desarrollo se utilizó **GitHub Copilot** como herramienta de apoyo para:
- Identificar y solucionar errores de compilación
- Proponer snippets de código y completar funciones
- Optimizar la estructura del proyecto
- Generar comentarios y documentación

Todas las sugerencias de Copilot fueron **revisadas y validadas manualmente** antes de incorporarlas al proyecto.

## Licencia

Este proyecto es de **uso académico exclusivamente**. Está estrictamente prohibido su uso para fines comerciales sin autorización.

## Autores

Miembros del equipo de desarrollo:
- Luciano Lopresti - Desarrollo
- Sebastián Masferrer - Desarrollo
- Víctor Mella - Desarrollo
- Loretto Herrera - Desarrollo

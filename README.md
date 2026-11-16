# Products App

Aplicación móvil multiplataforma para productos, desarrollada con Expo, React Native y TypeScript. El proyecto usa Expo Router para la navegación y está organizado por capas para separar rutas, lógica de autenticación y componentes de presentación.

## Requisitos

- Node.js compatible con Expo SDK 58.
- pnpm.
- Expo Go en un dispositivo físico o un emulador Android/iOS.
- Un backend disponible para las rutas de autenticación.

## Instalación y ejecución

Instala las dependencias:

```powershell
pnpm install
```

Crea tu archivo local de variables de entorno:

```powershell
Copy-Item .env.template .env
```

Edita `.env` con las direcciones correctas para tu entorno y luego inicia Expo:

```powershell
pnpm start
```

Abre el proyecto con Expo Go o con un emulador desde el menú que aparece en la terminal.

## Configuración de la API

La app selecciona su URL según `EXPO_PUBLIC_STAGE` y la plataforma:

- `EXPO_PUBLIC_API_URL`: URL de la API para producción.
- `EXPO_PUBLIC_API_URL_IOS`: URL de la API cuando la app corre en iOS.
- `EXPO_PUBLIC_API_URL_ANDROID`: URL de la API cuando la app corre en Android.

En desarrollo, el backend debe exponer la API bajo `/api` y escuchar en el puerto configurado (por defecto, `3000`). Para un teléfono físico, reemplaza `YOUR_PC_IP` por la IPv4 de la computadora en la red Wi-Fi compartida, por ejemplo `192.168.1.22`. No uses `localhost` desde un teléfono: apuntaría al propio dispositivo. En el emulador Android de Android Studio, normalmente se usa `10.0.2.2` para acceder al host. El firewall también debe permitir conexiones entrantes al puerto del backend.

Las variables con prefijo `EXPO_PUBLIC_` se incluyen en el bundle de la app; no guardes secretos ni credenciales privadas en ellas. El archivo `.env` local está excluido de Git.

## Funcionalidad y estado

- Navegación basada en archivos con Expo Router.
- Rutas iniciales para iniciar sesión, registrarse y acceder al área de productos protegida.
- Estado de autenticación con Zustand y llamadas HTTP con Axios a `/auth/login` y `/auth/check-status`.
- Componentes reutilizables con tema claro/oscuro e iconos.
- Fuentes Kanit Regular, Bold y Thin cargadas desde `assets/fonts`.

La pantalla de registro y la pantalla de inicio de productos son actualmente estructuras iniciales. La integración completa de formularios, persistencia segura del token y registro todavía está pendiente.

## Estructura principal

```text
src/
  app/                  Rutas y layouts de Expo Router
  core/auth/            API, acciones y tipos de autenticación
  presentation/auth/    Estado de autenticación
  presentation/theme/   Componentes y hooks de tema
  constants/            Colores, tipografías y tokens visuales
assets/fonts/           Archivos de fuentes Kanit
```

## Verificaciones

```powershell
pnpm lint
pnpm exec tsc --noEmit
```

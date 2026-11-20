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

La app consume los endpoints de autenticación y productos. Para productos se esperan:

- `GET /products` para consultar el catálogo con `limit` y `offset`.
- `GET /products/:id` para consultar el detalle.
- `POST /products` para crear un producto.
- `PATCH /products/:id` para actualizar un producto.

Las variables con prefijo `EXPO_PUBLIC_` se incluyen en el bundle de la app; no guardes secretos ni credenciales privadas en ellas. El archivo `.env` local está excluido de Git.

## Funcionalidad y estado

- Navegación basada en archivos con Expo Router.
- Inicio de sesión y registro conectados a los endpoints `/auth/login` y `/auth/register`.
- Estado de autenticación con Zustand; el token se guarda con `expo-secure-store` y se envía como Bearer token en las solicitudes.
- Verificación de sesión con `/auth/check-status` y cierre de sesión desde el área protegida.
- Toast de bienvenida al completar el registro correctamente.
- Validación básica de campos obligatorios; los requisitos de contraseña y correo dependen del backend. Los errores de registro se muestran con un mensaje genérico.
- Catálogo de productos en una lista de dos columnas, con carga paginada, actualización por gesto y tarjetas que abren el detalle.
- Formulario para consultar y actualizar productos existentes, y para crear productos nuevos desde el botón flotante (FAB). El identificador `new` inicia el flujo de creación; los demás identificadores actualizan el producto existente.
- El formulario captura título, slug, descripción, precio, inventario, tallas y género.
- Imágenes de producto con imagen de reemplazo cuando no hay imágenes disponibles. La carga de imágenes al crear o actualizar productos aún está pendiente.
- Cliente HTTP compartido que adjunta el token de sesión como Bearer token y normaliza las URL de imágenes.
- Componentes reutilizables con tema claro/oscuro, botones de selección, campos de texto e iconos.
- Caché y consultas de datos de productos con TanStack Query.
- Fuentes Kanit Regular, Bold y Thin cargadas desde `assets/fonts`.

Todavía no se incluyen flujos de verificación de correo ni recuperación de contraseña.

## Estructura principal

```text
src/
  app/                  Rutas y layouts de Expo Router
    (products-app)/     Área autenticada, catálogo y detalle de productos
    auth/               Inicio de sesión y registro
  core/api/             Cliente HTTP compartido
  core/auth/            Acciones y tipos de autenticación
  core/products/        Acciones e interfaces de productos
  helpers/adapters/     Adaptadores de almacenamiento seguro
  presentation/auth/    Estado y componentes de autenticación
  presentation/products/Lista, tarjetas e imágenes de productos
  presentation/toast/   Estado y presentación de notificaciones toast
  presentation/theme/   Componentes y hooks de tema
  constants/            Colores, tipografías y tokens visuales
assets/fonts/           Archivos de fuentes Kanit
assets/images/          Imágenes de reemplazo de productos
```

## Verificaciones

```powershell
pnpm lint
pnpm exec tsc --noEmit
```

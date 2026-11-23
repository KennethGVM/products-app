# Products App

Aplicación móvil multiplataforma para productos, desarrollada con Expo, React Native y TypeScript. El proyecto usa Expo Router para la navegación y está organizado por capas para separar rutas, lógica de autenticación y componentes de presentación.

## Requisitos

- Node.js compatible con Expo SDK 58.
- pnpm.
- Expo Go en un dispositivo físico o un emulador Android/iOS.
- Development build para probar permisos nativos de guardado de fotos.
- Docker Desktop o Docker Engine para ejecutar el backend.

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

## Backend local con Docker

La app usa el backend [tesloshop-backend](https://github.com/Klerith/tesloshop-backend), que ejecuta NestJS y PostgreSQL en contenedores. Si todavía no tienes el repositorio:

```powershell
git clone https://github.com/Klerith/tesloshop-backend.git
Set-Location tesloshop-backend
Copy-Item .env.template .env
docker compose up -d
```

Docker Desktop o Docker Engine debe estar activo. El `docker compose` del backend publica la API en el puerto `3000` y PostgreSQL en el `5432`. El archivo `.env` del backend configura sus servicios; no lo compartas ni lo subas al repositorio.

- Poblar datos de prueba: `http://localhost:3000/api/seed`.
- Consultar la documentación de la API: `http://localhost:3000/api`.

Para un teléfono físico, configura `EXPO_PUBLIC_API_URL_IOS` o `EXPO_PUBLIC_API_URL_ANDROID` con la IPv4 de la computadora y el sufijo `/api`; la app y la computadora deben estar en la misma red. En un emulador Android, usa `10.0.2.2` en lugar de `localhost`.

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
- Captura de fotos con la cámara y selección de varias imágenes desde la galería.
- Imágenes temporales de cámara/galería en Zustand, que se agregan al formulario y se limpian al entrar al editor y al guardar correctamente.
- Carga de imágenes al backend al guardar un producto; las imágenes existentes se conservan al editar.
- Cliente HTTP compartido que adjunta el token de sesión como Bearer token y normaliza las URL de imágenes.
- Componentes reutilizables con tema claro/oscuro, botones de selección, campos de texto e iconos.
- Caché y consultas de datos de productos con TanStack Query.
- Fuentes Kanit Regular, Bold y Thin cargadas desde `assets/fonts`.

Todavía no se incluyen flujos de verificación de correo ni recuperación de contraseña.

## Flujo de imágenes de productos

La selección de una foto y su asociación con un producto son pasos separados:

1. La cámara o el selector de galería devuelve una URI local, como `file://...`. La pantalla de cámara agrega esas URI al store temporal `useCameraStore`.
2. Al guardar el formulario, la app combina las imágenes existentes del producto con las nuevas selecciones.
3. `create-update-product.action.ts` sube las URI locales como `multipart/form-data`, en el campo `file`, a `POST /api/files/product` (el cliente HTTP ya incluye `/api` en su URL base). Solo se tratan como archivos locales las URI `file://` y `content://`; las URL existentes del backend no se vuelven a subir.
4. El endpoint de archivos devuelve `data.image`, un identificador de imagen generado por el backend. Ese endpoint no recibe el ID del producto y todavía no asocia la imagen.
5. La app manda los identificadores en la propiedad `images` al crear (`POST /products`) o actualizar (`PATCH /products/:id`) el producto. Esa solicitud es la que vincula las imágenes con el producto correspondiente. Para uno nuevo se usa `POST`; para editar, el `id` de la ruta.

Al consultar productos, la app transforma cada identificador en una URL de visualización bajo `/files/product/:image`. Al editar, conserva esos identificadores y solo sube las URI locales nuevas. Si la carga del producto falla después de subir un archivo, el backend podría conservar un archivo que aún no quedó asociado a ningún producto.

`MediaLibrary.Asset.create()` guarda una copia en la fototeca del dispositivo; no sube la imagen al backend. La subida ocurre después, al guardar el formulario. El selector `ImagePicker.launchImageLibraryAsync()` abre el selector del sistema; elegir una imagen no requiere pedir acceso completo a toda la fototeca. El store temporal se limpia al abrir el editor y al completar la mutación para reducir el riesgo de mezclar selecciones.

El plugin `expo-media-library` configura el permiso de guardar fotos y limita Android a permiso de fotos. Los cambios de permisos nativos de `app.json` requieren una nueva development build para aplicarse; Expo Go no incorpora la configuración nativa propia del proyecto y en Android no ofrece acceso completo a la fototeca.

La pantalla `src/app/camera/index.tsx` se navega en ejecución como `/camera`. En esta versión de Expo Router, los tipos generados exponen `/camera/index`; el botón conserva la ruta de ejecución con `router.push('/camera' as Href)`.

## Estructura principal

```text
src/
  app/                  Rutas y layouts de Expo Router
    (products-app)/     Área autenticada, catálogo y detalle de productos
    auth/               Inicio de sesión y registro
    camera/             Captura y selección de imágenes
  core/api/             Cliente HTTP compartido
  core/auth/            Acciones y tipos de autenticación
  core/products/        Acciones e interfaces de productos
  helpers/adapters/     Adaptadores de almacenamiento seguro
  presentation/auth/    Estado y componentes de autenticación
  presentation/products/Lista, tarjetas e imágenes de productos
  presentation/store/   Estado temporal de imágenes seleccionadas
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

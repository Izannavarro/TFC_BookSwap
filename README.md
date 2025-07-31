# BookSwap - Aplicación de Intercambio de Libros

## Descripción del Proyecto

BookSwap es una aplicación móvil multiplataforma desarrollada con React Native que permite a los usuarios intercambiar libros de manera local. La aplicación conecta a personas que desean intercambiar sus libros con otros usuarios cercanos geográficamente, facilitando el acceso a nueva literatura y promoviendo la reutilización de libros.

## Arquitectura del Sistema

### Frontend - Aplicación Móvil (React Native/Expo)
- **Framework**: React Native con Expo
- **Navegación**: React Navigation (Stack y Tab Navigator)
- **Estado Global**: Context API
- **UI Components**: React Native Paper, Material Community Icons
- **Mapas**: React Native Maps
- **Cámara/Galería**: Expo Image Picker
- **Permisos**: Expo Location

### Backend - API REST (Spring Boot)
- **Framework**: Spring Boot 3.1.1
- **Base de Datos**: MongoDB
- **Autenticación**: Sistema de tokens personalizado
- **Geolocalización**: Google Maps Geocoding API
- **Seguridad**: Encriptación SHA-256 para contraseñas
- **CORS**: Configuración para permitir peticiones desde la aplicación móvil

## Funcionalidades Principales

### 🔐 Autenticación y Registro
- Registro de usuarios con dirección geográfica
- Login con validación de credenciales
- Sistema de tokens para sesiones activas
- Validación de direcciones mediante Google Maps API

### 📚 Gestión de Libros
- Añadir libros personales (máximo 5 por usuario)
- Subir imágenes de libros en Base64
- Editar y eliminar libros propios
- Visualización de biblioteca personal

### 🗺️ Sistema de Geolocalización
- Mostrar usuarios cercanos en mapa interactivo
- Filtrado por proximidad geográfica
- Validación de direcciones reales
- Permisos de ubicación en tiempo real

### 🔄 Sistema de Intercambios
- Crear propuestas de intercambio
- Estados: Pendiente, Aceptado, Rechazado
- Notificaciones de intercambios recibidos
- Gestión completa del ciclo de intercambio

### 💬 Sistema de Chat
- Chat en tiempo real entre usuarios
- Estados de mensajes: Enviado, Entregado, Visto
- Historial de conversaciones
- Interfaz intuitiva de mensajería

### ⚙️ Configuración de Usuario
- Editar perfil y foto de perfil
- Cambiar contraseña
- Eliminar cuenta (con limpieza de datos)
- Gestión de sesión (logout)

## Estructura del Proyecto

```
BookSwap/
├── MobileApp/                          # Aplicación React Native
│   ├── src/
│   │   ├── screens/                    # Pantallas principales
│   │   │   ├── Main.js                 # Pantalla principal
│   │   │   ├── Login.js                # Pantalla de login
│   │   │   ├── Register.js             # Pantalla de registro
│   │   │   ├── Home.js                 # Mapa con usuarios
│   │   │   ├── Books.js                # Gestión de libros
│   │   │   ├── Exchanges.js            # Gestión de intercambios
│   │   │   ├── ChatList.js             # Lista de chats
│   │   │   ├── ChatDetails.js          # Chat individual
│   │   │   ├── Settings.js             # Configuración
│   │   │   └── Context.js              # Estado global
│   │   ├── navigation/                 # Configuración de navegación
│   │   │   ├── AppStack.js             # Stack principal
│   │   │   └── AppTabs.js              # Navegación por tabs
│   │   ├── assets/                     # Recursos gráficos
│   │   └── utilities/                  # Utilidades
│   ├── App.js                          # Componente raíz
│   ├── package.json                    # Dependencias
│   └── app.json                        # Configuración Expo
└── SpringbootTFC/                      # Backend Spring Boot
    └── SpringBootPI/
        ├── src/main/java/bookswap/
        │   ├── controller/             # Controladores REST
        │   ├── model/
        │   │   ├── entity/             # Entidades MongoDB
        │   │   └── dto/                # Objetos de transferencia
        │   ├── repository/             # Repositorios MongoDB
        │   ├── config/                 # Configuración
        │   └── Main.java               # Clase principal
        ├── src/main/resources/
        │   └── application.properties  # Configuración de BD
        └── pom.xml                     # Dependencias Maven
```

## Modelos de Datos

### Usuario (User)
```json
{
  "id": "ObjectId",
  "username": "string",
  "password": "string (SHA-256)",
  "profilePicture": "string (Base64)",
  "address": "string",
  "lat": "double",
  "lng": "double"
}
```

### Libro (Book)
```json
{
  "id": "ObjectId",
  "title": "string",
  "author": "string",
  "genre": "string",
  "description": "string",
  "image_url": "string (Base64)",
  "ownerUsername": "string",
  "publicationDate": "string"
}
```

### Intercambio (Exchange)
```json
{
  "id": "ObjectId",
  "bookId": "string",
  "ownerId": "string",
  "receiverId": "string",
  "status": "string (pending/accepted/denied)",
  "exchangeDate": "string"
}
```

### Chat
```json
{
  "id": "ObjectId",
  "participants": ["string"],
  "messages": ["Message"],
  "creationDate": "string"
}
```

### Mensaje (Message)
```json
{
  "message_id": "string",
  "chatId": "string",
  "senderId": "string",
  "receiverId": "string",
  "content": "string",
  "timestamp": "string",
  "status": "string (delivered/viewed)"
}
```

## API Endpoints

### Autenticación
- `POST /bookswap/login` - Iniciar sesión
- `POST /bookswap/register` - Registrar usuario
- `GET /bookswap/logout` - Cerrar sesión

### Usuarios
- `GET /bookswap/userInfo` - Información de usuario
- `GET /bookswap/getUsersInfo` - Lista de usuarios
- `GET /bookswap/userLocations` - Ubicaciones de usuarios
- `PUT /bookswap/updateUser` - Actualizar perfil
- `DELETE /bookswap/deleteAccount` - Eliminar cuenta

### Libros
- `POST /bookswap/addBook` - Añadir libro
- `GET /bookswap/getBooks` - Obtener libros de usuario
- `DELETE /bookswap/deleteBook` - Eliminar libro

### Intercambios
- `POST /bookswap/addExchange` - Crear intercambio
- `GET /bookswap/getMyExchanges` - Intercambios enviados
- `GET /bookswap/getReceivedExchanges` - Intercambios recibidos
- `PUT /bookswap/updateExchangeStatus` - Actualizar estado

### Chat
- `POST /bookswap/createChats` - Crear chats automáticamente
- `GET /bookswap/getChats` - Obtener chats de usuario
- `GET /bookswap/getMessages` - Mensajes de chat
- `POST /bookswap/addMessage` - Enviar mensaje
- `POST /bookswap/markMessagesViewed` - Marcar como visto

### Geolocalización
- `GET /bookswap/geocode` - Validar dirección y obtener coordenadas

## Tecnologías Utilizadas

### Frontend
- **React Native** 0.76.9 - Framework multiplataforma
- **Expo** ~52.0.46 - Plataforma de desarrollo
- **React Navigation** - Navegación entre pantallas
- **React Native Paper** - Componentes Material Design
- **React Native Maps** - Integración de mapas
- **Expo Image Picker** - Selección de imágenes
- **Expo Location** - Servicios de geolocalización

### Backend
- **Spring Boot** 3.1.1 - Framework Java
- **Spring Data MongoDB** - Integración con MongoDB
- **Apache Commons Codec** - Encriptación
- **Jackson** - Serialización JSON
- **Maven** - Gestión de dependencias

### Base de Datos
- **MongoDB** - Base de datos NoSQL
- **Colecciones**: User, Book, Exchange, Chat, Message

### Servicios Externos
- **Google Maps Geocoding API** - Validación de direcciones

## Configuración y Instalación

### Prerrequisitos
- Node.js 18+
- Java 17+
- MongoDB 5.0+
- Expo CLI
- Android Studio / Xcode (para emuladores)

### Configuración del Backend

1. **Clonar el repositorio**:
```bash
git clone <repository-url>
cd BookSwap/SpringbootTFC/SpringBootPI
```

2. **Configurar MongoDB**:
```properties
# application.properties
spring.data.mongodb.uri=mongodb://admin:admin123@localhost:27017/BookSwap?authSource=admin
google.api.key=YOUR_GOOGLE_API_KEY
```

3. **Ejecutar la aplicación**:
```bash
mvn spring-boot:run
```

### Configuración del Frontend

1. **Instalar dependencias**:
```bash
cd BookSwap/MobileApp
npm install
```

2. **Ejecutar la aplicación**:
```bash
# Para desarrollo
expo start

# Para Android
expo start --android

# Para iOS
expo start --ios
```

## Características Destacadas

### 🛡️ Seguridad
- Encriptación SHA-256 para contraseñas
- Sistema de tokens para autenticación
- Validación de entrada en todos los endpoints
- Limpieza automática de datos al eliminar cuenta

### 🎨 Interfaz de Usuario
- Diseño Material Design consistente
- Navegación intuitiva por tabs
- Animaciones suaves y transiciones
- Soporte para modo retrato forzado
- Paleta de colores coherente

### 📱 Experiencia Móvil
- Aplicación completamente responsive
- Optimizada para dispositivos móviles
- Gestión eficiente de memoria
- Carga asíncrona de imágenes
- Manejo de estados de conexión

### 🌍 Geolocalización Avanzada
- Integración con Google Maps
- Validación de direcciones reales
- Visualización de usuarios en mapa interactivo
- Filtrado por proximidad geográfica

### 💾 Persistencia de Datos
- Base de datos NoSQL optimizada
- Gestión eficiente de imágenes en Base64
- Índices optimizados para consultas rápidas
- Limpieza automática de datos huérfanos

## Flujo de Usuario

1. **Registro/Login**: El usuario se registra con una dirección válida
2. **Configuración**: Añade libros a su biblioteca personal
3. **Exploración**: Ve usuarios cercanos en el mapa
4. **Intercambio**: Propone intercambios de libros
5. **Comunicación**: Chatea con otros usuarios
6. **Gestión**: Administra sus intercambios y perfil

## Estado del Proyecto

El proyecto BookSwap es una aplicación completamente funcional que incluye:

✅ **Completado**:
- Sistema de autenticación completo
- Gestión de libros con imágenes
- Sistema de intercambios
- Chat en tiempo real
- Geolocalización con mapas
- API REST completa
- Base de datos MongoDB configurada

🔧 **Posibles Mejoras Futuras**:
- Notificaciones push
- Sistema de calificaciones
- Búsqueda avanzada de libros
- Integración con APIs de libros
- Modo oscuro
- Soporte para múltiples idiomas

## Licencia

Este proyecto fue desarrollado como Trabajo Final de Carrera y está disponible para fines educativos y de demostración.

---

*BookSwap - Conectando lectores, compartiendo conocimiento* 📚✨

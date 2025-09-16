# API de Pagos Bob Subastas - Documentación

## Descripción
API REST para gestión de usuarios en el sistema de subastas Pagos Bob.

## Tecnologías
- **Node.js** con Express.js
- **Prisma ORM** con PostgreSQL
- **ES6 Modules**

## Instalación y Configuración

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar base de datos:**
   - Crear archivo `.env` con:
   ```
   DATABASE_URL="postgresql://usuario:password@localhost:5432/pagos_bob_subastas?schema=public"
   ```

3. **Ejecutar migraciones:**
```bash
npx prisma migrate dev
```

4. **Iniciar servidor:**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints de la API

### Base URL
```
http://localhost:3000/api/users
```

### 1. Obtener todos los usuarios
```http
GET /api/users
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "nombre": "Juan Pérez",
      "telefono": "123456789",
      "tipo_usuario": "comprador",
      "esta_activo": true,
      "fecha_creacion": "2024-01-01T00:00:00.000Z",
      "fecha_actualizacion": null
    }
  ],
  "message": "Usuarios obtenidos correctamente"
}
```

### 2. Obtener usuario por ID
```http
GET /api/users/:id
```

**Parámetros:**
- `id` (number): ID del usuario

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "nombre": "Juan Pérez",
    "telefono": "123456789",
    "tipo_usuario": "comprador",
    "esta_activo": true,
    "fecha_creacion": "2024-01-01T00:00:00.000Z",
    "fecha_actualizacion": null
  },
  "message": "Usuario obtenido correctamente"
}
```

### 3. Crear nuevo usuario
```http
POST /api/users
```

**Body (JSON):**
```json
{
  "email": "nuevo@ejemplo.com",
  "nombre": "María García",
  "telefono": "987654321",
  "tipo_usuario": "vendedor"
}
```

**Campos obligatorios:**
- `email` (string): Email válido
- `nombre` (string): Nombre del usuario
- `tipo_usuario` (string): Tipo de usuario

**Campos opcionales:**
- `telefono` (string): Número de teléfono

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "nuevo@ejemplo.com",
    "nombre": "María García",
    "telefono": "987654321",
    "tipo_usuario": "vendedor",
    "esta_activo": true,
    "fecha_creacion": "2024-01-01T12:00:00.000Z",
    "fecha_actualizacion": null
  },
  "message": "Usuario creado correctamente"
}
```

### 4. Actualizar usuario
```http
PUT /api/users/:id
```

**Parámetros:**
- `id` (number): ID del usuario

**Body (JSON):**
```json
{
  "email": "actualizado@ejemplo.com",
  "nombre": "María García Actualizada",
  "telefono": "111222333",
  "tipo_usuario": "administrador",
  "esta_activo": false
}
```

**Todos los campos son opcionales** - solo se actualizarán los campos enviados.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "actualizado@ejemplo.com",
    "nombre": "María García Actualizada",
    "telefono": "111222333",
    "tipo_usuario": "administrador",
    "esta_activo": false,
    "fecha_creacion": "2024-01-01T12:00:00.000Z",
    "fecha_actualizacion": "2024-01-01T13:00:00.000Z"
  },
  "message": "Usuario actualizado correctamente"
}
```

### 5. Eliminar usuario
```http
DELETE /api/users/:id
```

**Parámetros:**
- `id` (number): ID del usuario

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado correctamente"
}
```

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error en la solicitud (datos inválidos)
- **404**: Recurso no encontrado
- **409**: Conflicto (email duplicado)
- **500**: Error interno del servidor

## Ejemplos de Uso con cURL

### Obtener todos los usuarios
```bash
curl -X GET http://localhost:3000/api/users
```

### Crear un usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "nombre": "Usuario Test",
    "tipo_usuario": "comprador"
  }'
```

### Actualizar un usuario
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nombre Actualizado"
  }'
```

### Eliminar un usuario
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## Estructura del Proyecto

```
pagos-bob-subastas-api/
├── controllers/
│   └── userController.js    # Lógica de negocio para usuarios
├── lib/
│   └── db.js               # Configuración de Prisma
├── prisma/
│   └── schema.prisma       # Esquema de base de datos
├── routes/
│   └── userRoutes.js       # Definición de rutas
├── index.js                # Punto de entrada de la aplicación
└── package.json            # Dependencias y scripts
```

## Próximos Pasos Sugeridos

1. **Autenticación y Autorización**: Implementar JWT o similar
2. **Validación de datos**: Usar librerías como Joi o Yup
3. **Middleware de logging**: Para registrar requests
4. **Rate limiting**: Para limitar requests por IP
5. **Documentación con Swagger**: Para documentación interactiva
6. **Tests**: Implementar tests unitarios e integración
7. **Más entidades**: Productos, Subastas, Pujas, etc.

# Informaticpark — Backend

API REST construida con **NestJS 11 + Prisma + PostgreSQL**. Corre en el puerto `4000`. Todas las rutas están prefijadas con `/api`. Documentación Swagger disponible en `/api/docs`.

## Requisitos

- Node.js >= 18
- PostgreSQL

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/informaticpark"
JWT_SECRET="tu_secreto_jwt"
JWT_EXPIRES_IN="1h"
```

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar migraciones
npm run prisma:migrate

# Poblar con datos iniciales (admin@example.com / Admin123!)
npm run prisma:seed

# Desarrollo con hot reload (puerto 4000)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Comandos disponibles

```bash
npm run start:dev       # Desarrollo con hot reload
npm run start:debug     # Desarrollo con debugger
npm run build           # Compila TypeScript + genera cliente Prisma
npm run lint            # ESLint con auto-fix
npm run format          # Prettier
npm run test            # Tests unitarios
npm run test:e2e        # Tests end-to-end
npm run test:cov        # Cobertura de tests
npm run prisma:migrate  # Ejecutar migraciones
npm run prisma:seed     # Poblar base de datos
npm run prisma:generate # Regenerar cliente Prisma
```

## Autenticación

1. `POST /api/auth/login` — devuelve un JWT
2. Todas las demás rutas requieren `Authorization: Bearer <token>`
3. Las rutas de administrador requieren rol `ADMIN`

## Esquema de base de datos

### MER

```mermaid
erDiagram
    User {
        Int     id              PK
        String  name
        String  email           "unique"
        String  password
        Role    role            "ADMIN | USER"
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    Location {
        Int     id              PK
        String  canton
        String  parroquia
        Float   lat
        Float   lng
        DateTime createdAt
        DateTime updatedAt
    }

    Custodian {
        Int     id              PK
        String  fullName
        String  identifier      "unique"
        String  unit
        Int     locationId      FK
        DateTime createdAt
        DateTime updatedAt
    }

    Asset {
        Int      id               PK
        String   code             "unique"
        String   previousCode
        String   assetName
        String   brand
        String   model
        String   serialNumber
        String   location
        String   physicalLocation
        DateTime entryDate
        DateTime activationDate
        String   accountCode
        Decimal  initialValue     "12,2"
        Decimal  currentValue     "12,2"
        String   note
        Int      custodianId      FK
        Int      createdByUserId  FK
        Int      locationId       FK
        DateTime createdAt
        DateTime updatedAt
    }

    User        ||--o{ Asset      : "registra"
    Custodian   ||--o{ Asset      : "custodia"
    Location    ||--o{ Asset      : "ubica"
    Location    ||--o{ Custodian  : "ubica"
```

### Modelos

#### `User`

| Campo       | Tipo       | Descripción                              |
|-------------|------------|------------------------------------------|
| `id`        | `Int` PK   | Autoincremental                          |
| `name`      | `String`   | Nombre completo                          |
| `email`     | `String`   | Único                                    |
| `password`  | `String`   | Hash bcrypt                              |
| `role`      | `Role`     | `ADMIN` o `USER` (default: `USER`)       |
| `isActive`  | `Boolean`  | Soft delete (default: `true`)            |
| `createdAt` | `DateTime` |                                          |
| `updatedAt` | `DateTime` |                                          |

#### `Location`

| Campo       | Tipo       | Descripción                          |
|-------------|------------|--------------------------------------|
| `id`        | `Int` PK   | Autoincremental                      |
| `canton`    | `String?`  | Cantón                               |
| `parroquia` | `String?`  | Parroquia                            |
| `lat`       | `Float?`   | Latitud                              |
| `lng`       | `Float?`   | Longitud                             |
| `createdAt` | `DateTime` |                                      |
| `updatedAt` | `DateTime` |                                      |

Relaciones: tiene muchos `Asset` y muchos `Custodian`.

#### `Custodian`

| Campo        | Tipo       | Descripción                          |
|--------------|------------|--------------------------------------|
| `id`         | `Int` PK   | Autoincremental                      |
| `fullName`   | `String`   | Nombre completo                      |
| `identifier` | `String`   | Identificador único (cédula/código)  |
| `unit`       | `String?`  | Unidad o departamento                |
| `locationId` | `Int?` FK  | Referencia a `Location`              |
| `createdAt`  | `DateTime` |                                      |
| `updatedAt`  | `DateTime` |                                      |

Relaciones: pertenece a una `Location` (opcional, `SetNull` al borrar); tiene muchos `Asset`.

#### `Asset`

| Campo             | Tipo          | Descripción                                   |
|-------------------|---------------|-----------------------------------------------|
| `id`              | `Int` PK      | Autoincremental                               |
| `code`            | `String?`     | Código único del activo                       |
| `previousCode`    | `String?`     | Código anterior                               |
| `assetName`       | `String`      | Nombre del bien                               |
| `brand`           | `String?`     | Marca                                         |
| `model`           | `String?`     | Modelo                                        |
| `serialNumber`    | `String?`     | Número de serie                               |
| `location`        | `String?`     | Ubicación textual                             |
| `physicalLocation`| `String?`     | Ubicación física detallada                    |
| `entryDate`       | `DateTime?`   | Fecha de ingreso                              |
| `activationDate`  | `DateTime?`   | Fecha de activación                           |
| `accountCode`     | `String?`     | Código contable                               |
| `initialValue`    | `Decimal?`    | Valor inicial (12,2)                          |
| `currentValue`    | `Decimal?`    | Valor actual (12,2)                           |
| `note`            | `String?`     | Observaciones                                 |
| `custodianId`     | `Int?` FK     | Referencia a `Custodian`                      |
| `createdByUserId` | `Int?` FK     | Usuario que registró el activo                |
| `locationId`      | `Int?` FK     | Referencia a `Location` (`SetNull` al borrar) |
| `createdAt`       | `DateTime`    |                                               |
| `updatedAt`       | `DateTime`    |                                               |

### Enum `Role`

| Valor   | Descripción              |
|---------|--------------------------|
| `ADMIN` | Acceso completo          |
| `USER`  | Acceso solo a activos    |

## Variables de entorno

| Variable        | Default                | Descripción                  |
|-----------------|------------------------|------------------------------|
| `DATABASE_URL`  | —                      | Cadena de conexión PostgreSQL |
| `JWT_SECRET`    | `changeme_jwt_secret`  | Clave de firma JWT           |
| `JWT_EXPIRES_IN`| `1h`                   | TTL del token                |

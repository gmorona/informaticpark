# Database Schema

Motor: **PostgreSQL** — ORM: **Prisma**

---

## Diagrama de relaciones

```
User (1) ──────────────────────────── (N) Asset
                                            │
Custodian (1) ──────────────────────── (N) Asset
```

---

## Tablas

### `User`

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | Int | PK, autoincrement | |
| `name` | String | NOT NULL | Nombre completo |
| `email` | String | UNIQUE, NOT NULL | Correo electrónico |
| `password` | String | NOT NULL | Hash bcrypt |
| `role` | Enum | NOT NULL, default `USER` | `ADMIN` o `USER` |
| `isActive` | Boolean | NOT NULL, default `true` | Soft delete |
| `createdAt` | DateTime | default `now()` | |
| `updatedAt` | DateTime | auto-update | |

---

### `Custodian`

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | Int | PK, autoincrement | |
| `fullName` | String | NOT NULL | Nombre del custodio |
| `identifier` | String | UNIQUE, NOT NULL | Código o cédula identificadora |
| `unit` | String | nullable | Dependencia o unidad |
| `createdAt` | DateTime | default `now()` | |
| `updatedAt` | DateTime | auto-update | |

---

### `Asset`

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | Int | PK, autoincrement | |
| `code` | String | UNIQUE, nullable | Código de activo actual |
| `previousCode` | String | nullable | Código anterior del activo |
| `assetName` | String | NOT NULL | Nombre/descripción del bien |
| `brand` | String | nullable | Marca |
| `model` | String | nullable | Modelo |
| `serialNumber` | String | nullable | Número de serie |
| `location` | String | nullable | Ubicación general |
| `physicalLocation` | String | nullable | Ubicación física detallada |
| `entryDate` | DateTime | nullable | Fecha de ingreso |
| `activationDate` | DateTime | nullable | Fecha de activación |
| `accountCode` | String | nullable | Código contable |
| `initialValue` | Decimal(12,2) | nullable | Valor inicial |
| `currentValue` | Decimal(12,2) | nullable | Valor actual |
| `note` | String | nullable | Observaciones |
| `custodianId` | Int | FK → `Custodian.id`, nullable | |
| `createdByUserId` | Int | FK → `User.id`, nullable | |
| `createdAt` | DateTime | default `now()` | |
| `updatedAt` | DateTime | auto-update | |

---

## Relaciones

| Relación | Cardinalidad | Descripción |
|---|---|---|
| `User` → `Asset` | 1 : N | Un usuario puede registrar múltiples activos (`createdByUserId`) |
| `Custodian` → `Asset` | 1 : N | Un custodio puede tener múltiples activos asignados (`custodianId`) |

Ambas FK son opcionales (nullable), por lo que un activo puede existir sin custodio asignado o sin usuario creador registrado.

---

## Enum

```
Role
  ADMIN   → acceso total (usuarios, custodios, activos)
  USER    → acceso a activos solamente
```

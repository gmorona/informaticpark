# Interfaces Principales — Infopark

## 1. User

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | Int (auto) | Sí | PK, autoincremental |
| `name` | String | Sí | Nombre completo |
| `email` | String (unique) | Sí | Correo electrónico |
| `password` | String | Sí* | Solo al crear/editar, nunca se muestra |
| `role` | Enum | Sí | `ADMIN` / `USER` (default: `USER`) |
| `isActive` | Boolean | Sí | Activo/Inactivo (soft delete) |
| `custodianId` | Int? | No | Vínculo 1:1 opcional con Custodian |
| `createdAt` | DateTime | Auto | Timestamp de creación |
| `updatedAt` | DateTime | Auto | Timestamp de actualización |

Relaciones: assetsCreated[] (Asset), movimientosRegistrados[], movimientosConfirmados[]

---

## 2. Custodian

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | Int (auto) | Sí | PK, autoincremental |
| `fullName` | String | Sí | Nombre completo |
| `identifier` | String (unique) | Sí | Cédula/RUC/Pasaporte |
| `unit` | String? | No | Unidad organizacional |
| `locationId` | Int? | No | FK → Location (ubicación geográfica) |
| `createdAt` | DateTime | Auto | Timestamp de creación |
| `updatedAt` | DateTime | Auto | Timestamp de actualización |

Relaciones: assets[], userAccount? (User 1:1), movimientosComoOrigen[], movimientosComoDestino[]

---

## 3. Location

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | Int (auto) | Sí | PK, autoincremental |
| `canton` | String? | No | Nombre del cantón |
| `parroquia` | String? | No | Nombre de la parroquia |
| `lat` | Float? | No | Latitud (coordenada GPS) |
| `lng` | Float? | No | Longitud (coordenada GPS) |
| `createdAt` | DateTime | Auto | Timestamp de creación |
| `updatedAt` | DateTime | Auto | Timestamp de actualización |

Relaciones: assets[], custodians[], movimientosComoOrigen[], movimientosComoDestino[]

---

## 4. Asset

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | Int (auto) | Sí | PK, autoincremental |
| `code` | String? (unique) | No | Código único del activo |
| `previousCode` | String? | No | Código anterior (legado) |
| `assetName` | String | Sí | Nombre/descripción del activo |
| `brand` | String? | No | Marca |
| `model` | String? | No | Modelo |
| `serialNumber` | String? | No | Número de serie |
| `location` | String? | No | Ubicación libre (texto) |
| `physicalLocation` | String? | No | Ubicación física específica |
| `entryDate` | DateTime? | No | Fecha de ingreso |
| `activationDate` | DateTime? | No | Fecha de activación |
| `accountCode` | String? | No | Código contable |
| `initialValue` | Decimal(12,2)? | No | Valor inicial |
| `currentValue` | Decimal(12,2)? | No | Valor actual |
| `note` | String? | No | Observaciones |
| `custodianId` | Int? | No | FK → Custodian actual |
| `createdByUserId` | Int? | No | FK → User que lo registró |
| `locationId` | Int? | No | FK → Location (georreferenciado) |
| `createdAt` | DateTime | Auto | Timestamp de creación |
| `updatedAt` | DateTime | Auto | Timestamp de actualización |

Relaciones: custodian?, createdByUser?, geoLocation?, movements[]

---

## 5. AssetMovement

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | Int (auto) | Sí | PK, autoincremental |
| `transferDate` | DateTime | Auto | Fecha del traslado |
| `note` | String? | No | Observaciones |
| `actaUrl` | String? | No | PDF/JPG/PNG — Acta de entrega |
| `status` | Enum | Sí | PENDIENTE / COMPLETADO / RECHAZADO |
| `confirmedAt` | DateTime? | No | Fecha de confirmación |
| `actaRecepcionUrl` | String? | No | PDF/JPG/PNG — Acta de recepción firmada |
| `assetId` | Int | Sí | FK → Asset (cascade delete) |
| `fromCustodianId` | Int? | No | FK → Custodian origen |
| `toCustodianId` | Int? | No | FK → Custodian destino |
| `fromLocationId` | Int? | No | FK → Location origen |
| `toLocationId` | Int? | No | FK → Location destino |
| `registeredByUserId` | Int? | No | FK → User que registró |
| `confirmedByUserId` | Int? | No | FK → User que confirmó |
| `createdAt` | DateTime | Auto | Timestamp de creación |

Relaciones: asset, fromCustodian?, toCustodian?, fromLocation?, toLocation?, registeredBy?, confirmedBy?

---

## Resumen

| Interfaz | Campos obligatorios | Campos opcionales | Archivos adjuntos | Estados |
|---|---|---|---|---|
| **User** | 4 (name, email, password, role) | 2 (custodianId, isActive) | — | — |
| **Custodian** | 2 (fullName, identifier) | 1 (unit) | — | — |
| **Location** | 0 | 4 (canton, parroquia, lat, lng) | — | — |
| **Asset** | 1 (assetName) | 14 | — | — |
| **AssetMovement** | 1 (assetId) | 13 | 2 (actaUrl, actaRecepcionUrl) | 3 (PENDIENTE/COMPLETADO/RECHAZADO) |

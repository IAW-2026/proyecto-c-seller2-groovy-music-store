# Groovy Music Store — Seller App

Panel de vendedores para **Groovy Music Store**, un marketplace de música física (vinilos, CDs, cassettes). Parte de un sistema de cuatro aplicaciones desarrollado para la materia Ingeniería de Aplicaciones Web — UNS 2026.

## 🔗 Link de producción

> **[https://proyecto-c-seller2-groovy-music-sto.vercel.app](https://proyecto-c-seller2-groovy-music-sto.vercel.app)**

## 👤 Credenciales de prueba

| Rol | Usuario | Contraseña | Acceso |
|-----|---------|------------|--------|
| Vendedor | `seller_groovy` | `IAWEB_2026` | `/dashboard` |
| Admin | `admin_seller_groovy` | `IAWEB_2026` | `/admin` |

## 📋 Responsabilidad de esta app

Interfaz para vendedores: publicación y gestión de productos, gestión de ventas y stock, panel de administración.

## ⚙️ Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Base de datos | PostgreSQL (Neon) |
| ORM | Prisma 6 |
| Autenticación | Clerk |
| Estilos | Tailwind CSS |
| Deploy | Vercel |
| Imágenes | Cloudinary |

## 🗂️ Páginas implementadas

### Panel vendedor (`/dashboard`)
- **Inicio** — resumen de productos activos, ventas por estado e ingresos totales
- **Mis productos** — listado con búsqueda, paginación, alta y edición
- **Mis ventas** — gestión de órdenes con avance de estado (Pendiente → Preparando → Listo para envío → Enviado)
- **Balance** — consulta de acreditaciones (mockeado, se integra con Payments App en Etapa 2)
- **Perfil** — configuración del negocio (nombre, dirección, código postal)

### Panel admin (`/admin`)
- **Overview** — totales del sistema (productos, ventas, vendedores)
- **Productos** — listado completo con opción de desactivar
- **Vendedores** — listado con conteo de productos activos y ventas por vendedor

## 🔌 APIs expuestas (consumidas por otras apps)

| Método | Endpoint | Descripción | Consumidor |
|--------|----------|-------------|------------|
| `GET` | `/api/products` | Catálogo paginado con filtros | Buyer App |
| `GET` | `/api/products/:id` | Detalle de producto | Buyer App |
| `POST` | `/api/products/batch` | Consulta múltiple por IDs | Buyer App |
| `POST` | `/api/orders/reserve` | Reservar stock de una orden | Buyer App |
| `POST` | `/api/orders/confirm` | Confirmar venta tras pago aprobado | Buyer App |
| `POST` | `/api/orders/release` | Liberar stock por pago fallido | Buyer App |

Autenticación inter-servicios: `Authorization: Bearer <JWT>` (o `X-API-Key` para Etapa 2).

## 🗃️ Modelo de datos

Entidades propias: `PerfilVendedor`, `Producto`, `Venta`, `Reserva`, `ItemReserva`.

IDs externos (no se guardan localmente): `buyer_id`, `order_id`, `envio_id`.

## 🚀 Correr localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Completar los valores en .env.local

# 3. Generar cliente Prisma
npx prisma generate

# 4. Ejecutar migraciones
npx dotenv -e .env.local -- prisma migrate dev

# 5. Cargar datos de prueba
npx tsx prisma/seed.ts

# 6. Iniciar servidor de desarrollo
npm run dev
```

## 🔑 Variables de entorno

Ver `.env.example` para la lista completa. Las principales:

```
DATABASE_URL=                           # Connection string de PostgreSQL (Neon)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=      # Clave pública de Clerk
CLERK_SECRET_KEY=                       # Clave secreta de Clerk
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=      # Nombre del cloud en Cloudinary
ADMIN_USER_IDS=                         # clerk_user_id del admin, separados por coma si hay más de uno
BUYER_APP_API_KEY=                      # API key para autenticación M2M con Buyer App (Etapa 2)
```

## 🏗️ Arquitectura

Esta app es parte de un sistema de microservicios:

```
Buyer App ──→ Seller App (esta)
           ──→ Payments App
           ──→ Shipping App

Seller App ──→ Shipping App (crear envío)
           ──→ Payments App (consultar balance)
```

Durante la Etapa 1 las llamadas a otras apps están mockeadas. La integración real se realiza en la Etapa 2.

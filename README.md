## 🔗 Deploy de producción

[https://proyecto-c-seller2-groovy-music-sto.vercel.app](https://proyecto-c-seller2-groovy-music-sto.vercel.app)

---

## 👤 Usuarios disponibles

| Rol | Email | Contraseña | Acceso |
|-----|-------|------------|--------|
| Vendedor | `seller+clerktest@iaw.com` | `iawuser#` | `/dashboard` |
| Admin | `admin_seller+clerktest@iaw.com` | `iawuser#` | `/admin` |

---

## 📋 Instrucciones de uso

**Panel vendedor** — ingresar con `seller+clerktest@iaw.com`:
- `/dashboard` — resumen general con estadísticas de ventas e ingresos
- `/mis-productos` — listado con búsqueda por título/artista, filtros por formato y género, paginación. Permite publicar, editar y eliminar productos
- `/mis-ventas` — gestión de órdenes con avance de estado (Pendiente → Preparando → Listo para envío → Enviado)
- `/balance` — consulta de acreditaciones (mockeado para Etapa 2, se integra con Payments App en Etapa 3)
- `/perfil` — edición del perfil del negocio

**Panel admin** — ingresar con `admin_seller+clerktest@iaw.com`:
- `/admin` — overview con totales del sistema
- `/admin/productos` — listado completo de productos con opción de desactivar
- `/admin/vendedores` — listado de vendedores con conteo de productos activos y ventas

---

## 📝 Descripción del proyecto

**Groovy Music Store — Seller App** es el panel de vendedores de un marketplace de música física (vinilos, CDs y cassettes). Permite a los vendedores publicar y gestionar su catálogo, hacer seguimiento de sus ventas y consultar su balance. Forma parte de un sistema de cuatro aplicaciones independientes (Buyer App, Seller App, Shipping App y Payments App), cada una con su propia base de datos y autenticación compartida mediante Clerk.

La aplicación expone una API REST que será consumida por la Buyer App en la Etapa 3: catálogo de productos con búsqueda y filtros, consulta por lote de IDs, reserva de stock, confirmación de venta y liberación de stock ante pagos fallidos. La lógica de reserva implementa un modelo transaccional con estados (ACTIVA / CONFIRMADA / LIBERADA) para garantizar consistencia ante operaciones concurrentes.

---

## 🗒️ Notas para la corrección

- **Llamadas inter-app mockeadas:** el balance (`/balance`) consulta `PAYMENTS_APP_URL` con fallback a datos simulados, ya que Payments App no está integrada en esta etapa.
- **Datos precargados:** 24 productos activos (10 vinilos, 7 CDs, 5 cassettes, 2 desactivados) y 20 ventas distribuidas en todos los estados posibles, accesibles con el usuario vendedor.
- **Productos desactivados:** visibles en `/admin/productos` pero no en el catálogo público. Permiten evaluar el flujo de moderación del panel admin.
- **API externa:** las imágenes de productos se gestionan mediante Cloudinary (upload y almacenamiento).
- **Autorización inter-servicios:** los endpoints de la API aceptan `Authorization: Bearer <JWT>` y también `X-API-Key` como mecanismo alternativo para comunicación M2M en Etapa 3.

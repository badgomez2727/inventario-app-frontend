# Vendita — frontend

Aplicación web de Vendita (inventario y punto de venta de Tyndall Commerce): el **panel de administración** para tenderos y empleados, y el **catálogo público** para sus clientes. React 19 (Create React App), React Router 7 y Tailwind CSS.

> La documentación técnica de todo el sistema (arquitectura, reglas de negocio, API y operación) está en el repo del backend: [`inventario-app-backend/docs/`](https://github.com/badgomez2727/inventario-app-backend/tree/main/docs).

## Entornos

| Entorno | Rama git | Deploy en Vercel | Variables |
|---|---|---|---|
| Producción | `main` | Production (`vendita.tyndallcore.com`) | `REACT_APP_API_URL` -> backend de producción en Render |
| Staging | `develop` | Preview (`vendita-git-develop-badgomez2727s-projects.vercel.app`, estable entre pushes) | `REACT_APP_API_URL` -> backend de staging en Render, `REACT_APP_ENVIRONMENT=staging` |

`REACT_APP_ENVIRONMENT=staging` activa un banner visible ("Entorno de STAGING") en toda la app — ver `src/components/StagingBanner.jsx`. Solo está configurada en el entorno Preview de Vercel, nunca en Production.

Las variables `REACT_APP_*` **se incorporan al construir**: un build de Preview no debe promoverse a producción (llevaría la API y el banner de staging). Producción siempre se reconstruye con sus propias variables.

Ver el README del backend para cómo provisionar el servicio de staging en Render y cómo reiniciar los datos de la rama `staging` de Neon desde producción.

## Desarrollo local

```bash
npm install
npm start        # http://localhost:3000 (usa REACT_APP_API_URL, o http://localhost:3001 si no está definida)
npm test         # pruebas (Jest + Testing Library)
npm run build    # build de producción (con CI=true, los warnings de lint rompen el build)
```

Variables en `.env.local` (ignorado por git): `REACT_APP_API_URL`.

## Estructura (`src/`)

| Carpeta | Contenido |
|---|---|
| `pages/` | Una pantalla por ruta (ventas, inventario, clientes, cartera, pedidos, catálogo público…). `pages/productos/` agrupa el inventario. |
| `components/` | Piezas reutilizables: `Layout`, `Sidebar`, `PrivateRoute`, modales (`SaleDetailModal`, `ProductDetailModal`, `StockFormModal`, `ProductHistoryModal`), `QuantityInput`, `StagingBanner`, `ColdStartOverlay`. |
| `contexts/` | `AuthContext`: sesión (token y usuario en `localStorage`). |
| `services/` | `apiService.js`: **todas** las llamadas al backend; añade el token, maneja errores y la expiración de sesión (401 → vuelve al login con un aviso). |
| `utils/` | `formatters.js` (moneda COP), `normalize.js` (texto sin tildes/mayúsculas y búsqueda tolerante a plurales). |

## Rutas y roles

`src/App.js` define las rutas. Sin sesión solo se ven las públicas; con sesión, el panel dentro de `Layout` (menú lateral, y barra inferior en celular).

| Ruta | Quién | Pantalla |
|---|---|---|
| `/`, `/login`, `/register-company`, `/forgot-password`, `/reset-password`, `/apoyar`, `/terminos` | Público | Landing, acceso, registro y páginas informativas |
| `/catalogo/:slug` | Público (con o sin sesión) | **Catálogo público** de una tienda: buscador, categorías, detalle del producto, carrito y envío del pedido por WhatsApp. Se monta fuera del `Layout` a propósito, para que nunca lleve el menú del panel |
| `/dashboard` | Usuario (el menú solo lo muestra a administradores) | Panel de control |
| `/productos` | Usuario | Inventario (crear/editar, fotos, stock, historial, desactivar/reactivar) |
| `/ventas` | Usuario | Vender (POS), incluida la venta a crédito |
| `/pedido-whatsapp` | Usuario | Pedido por WhatsApp asistido por IA (plan PRO) |
| `/pedidos` | Usuario | Pedidos que llegaron del catálogo: confirmar o rechazar |
| `/historial-ventas` | Usuario | Historial de ventas, abonos y anulaciones |
| `/clientes`, `/clientes/:id` | Usuario | Clientes y estado de cuenta de cada uno (PDF y WhatsApp) |
| `/proveedores`, `/historial-stock` | Usuario | Proveedores y movimientos de stock |
| `/cartera` | Admin | Cartera de clientes, con buscador y exportación a CSV |
| `/reporte-inventario`, `/productos/upload` | Admin | Reporte de inventario y carga masiva por CSV |
| `/gestion-usuarios` | Admin | Usuarios y configuración |
| `/catalogo-config` | Admin | Configuración del catálogo público (slug, portada, WhatsApp, domicilio) |
| `/admin/companias` | Super admin | Compañías y planes de todo el sistema |

> El control de rol de estas rutas es solo de interfaz (`PrivateRoute`); la autoridad real está en el backend. Ver "Brechas conocidas" en la documentación de reglas de negocio.

## Catálogo público

- El carrito vive en el navegador; al enviar, el backend guarda el pedido y devuelve el enlace `wa.me`.
- El buscador (por nombre, tolerante a mayúsculas, tildes y plurales) y el filtro por categoría trabajan sobre la lista ya cargada. El backend no pagina: límite conocido documentado en el README del backend.
- **Vista previa al compartir el enlace:** `api/og-catalogo.js` (función serverless de Vercel) sirve metadatos Open Graph solo a los bots de redes sociales, activada por un `rewrite` por User-Agent en `vercel.json`. Las personas ven la app normal.

## Pruebas

Hoy hay pruebas de `QuantityInput` (escribir la cantidad, tope, cero, vacío) y de `matchesSearch` (buscador). La lógica de negocio y la API se prueban en el backend (Jest + Supertest).

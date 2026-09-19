# Changelog

## Sin publicar

### Agregado — desactivar / reactivar productos

- Inventario: botón "Desactivar / Reactivar" en cada producto, e interruptor "Mostrar inactivos" (por defecto la lista solo muestra los activos). Un producto inactivo se ve atenuado con la etiqueta "Inactivo", deja de aparecer en ventas, pedidos por WhatsApp, alertas de stock y catálogo público, conserva su historial y se puede reactivar cuando se quiera. El cambio queda anotado en su historial de cambios ("Estado: Activo → Inactivo").
- Al intentar eliminar un producto que ya tiene historial, ahora se muestra el motivo real (antes solo decía "No se pudo eliminar el producto") y se sugiere desactivarlo.

### Documentado — README del frontend

- El README reemplaza el texto genérico de Create React App por la estructura del proyecto, el mapa de rutas y roles, las variables de entorno, el catálogo público y las pruebas, y enlaza la documentación técnica del backend (`docs/`).

### Agregado — catálogo público: detalle del producto y cantidad editable

- Al tocar la foto o el nombre de un producto se abre su detalle: foto grande, galería con todas sus fotos (flechas, deslizar con el dedo y miniaturas), nombre, categoría, precio, disponible/agotado y la descripción (que hasta ahora no se mostraba en ninguna parte), con el control para agregarlo al pedido. Se cierra con la X, tocando fuera o con Escape.
- La cantidad ya se puede escribir directamente (en la tarjeta, en el detalle y en el carrito), con teclado numérico en el celular; antes solo se podía subir/bajar de a uno. Escribir 0 quita el producto; dejar el campo vacío vuelve al número anterior; el tope es 999 (el stock exacto no se publica: si piden más de lo que hay, se avisa al enviar el pedido).
- Primeros tests de frontend (`QuantityInput`, `matchesSearch`), con las librerías de testing que el proyecto ya traía.

## 1.3.0

### En palabras simples (para contarle a los clientes)

- **Encuentra a cualquier cliente en segundos.** Busca por nombre o por celular en Clientes y en Cartera, sin importar mayúsculas, tildes ni cómo esté escrito el número (con o sin +57, con espacios o guiones).
- **La ficha completa de cada cliente**, con un clic: cuánto debe, cuánto ha comprado en total, sus ventas pendientes con abonos y antigüedad, y su historial de ventas pagadas. Desde ahí mismo abres una venta y registras un abono, sin ir al historial.
- **Estado de cuenta en PDF**, listo para entregar o enviar: datos de tu negocio, del cliente, fecha, ventas pendientes con sus abonos y el saldo total.
- **Recordatorio de cobro por WhatsApp**, con un mensaje corto y amable ya escrito (saldo y detalle de lo pendiente). Se abre en WhatsApp para que lo revises y lo ajustes antes de enviarlo.
- **Exporta tu cartera completa** a un archivo que abre Excel, con cliente, celular, saldo, ventas pendientes y antigüedad de la deuda más vieja; respeta lo que hayas escrito en el buscador.
- **Tu catálogo público ahora tiene buscador y categorías.** Tus clientes encuentran un producto escribiendo su nombre (aunque lo escriban en plural o sin tilde) o filtrando por categoría; los productos sin categoría aparecen en "Otros".

### Agregado — v1.3, Parte 1: buscador y detalle del cliente

- Buscador por nombre o celular en las pantallas de Cartera y de Clientes (tolerante a mayúsculas, tildes y al formato del número).
- Página nueva `/clientes/:id`: datos del cliente, saldo total adeudado, total histórico comprado, sus ventas pendientes o parciales y su historial de ventas pagadas. Se llega haciendo clic en un cliente desde Clientes o Cartera.
- Desde esa página se abre el detalle de cualquier venta (y se puede registrar un abono) sin ir al historial de ventas.

### Agregado — v1.3, Parte 2: exportar y compartir el estado de cuenta

- Botón "Estado de cuenta" en el detalle del cliente: descarga un PDF con los datos del negocio, del cliente, la fecha de emisión, la tabla de ventas pendientes/parciales y el saldo total.
- Botón "Enviar por WhatsApp" en el detalle del cliente: abre WhatsApp con un mensaje corto y respetuoso (saludo, saldo total, resumen de las ventas pendientes y una línea para coordinar el pago) ya escrito pero sin enviar, para que lo revises antes. Se deshabilita, con una explicación, si el cliente no tiene celular registrado.
- Botón "Exportar CSV" en Cartera: descarga todos los clientes con saldo (o solo los que coinciden con el buscador, si hay texto escrito) con su celular, saldo, cantidad de ventas pendientes y la antigüedad de la deuda más vieja.

### Agregado — v1.3, Bloque 2: buscador y filtro por categoría en el catálogo público

- Buscador por nombre de producto en `/catalogo/:slug`, tolerante a mayúsculas, tildes y singular/plural (buscar "camisa" encuentra "Camisas"), y a varias palabras en cualquier orden.
- Chips de categoría (derivadas de los productos publicados) con scroll horizontal propio; los productos sin categoría van al grupo "Otros" y nunca quedan fuera. Se combinan con el buscador.
- Mensaje "Ningún producto coincide con tu búsqueda" con botón "Limpiar filtros".
- La barra de buscador y chips queda pegada arriba al hacer scroll. Todo del lado del cliente: no toca el endpoint público, el carrito ni el checkout.

## 1.2.0

### En palabras simples (para contarle a los clientes)

- **Catálogo público, sin que tu cliente necesite instalar nada ni crear cuenta.** Cada negocio tiene su propia vitrina en línea (`vendita.tyndallcore.com/catalogo/tu-tienda`) con fotos, precios y disponibilidad — la activas y la configuras tú mismo desde "Catálogo Público" en el menú.
- **Fotos reales de tus productos**, subidas desde el celular (con cámara o galería), varias por producto, reordenables.
- **Tus clientes arman su pedido solos**: eligen productos, dejan su nombre y celular, dicen si recogen o piden domicilio, y al final se abre WhatsApp con el pedido ya escrito, listo para mandarte.
- **Tú decides qué se publica**: cada producto tiene un interruptor de "mostrar en catálogo" — nada se hace público solo porque esté en tu inventario.
- **Los pedidos no son ventas hasta que tú los confirmes.** Te llegan a una bandeja nueva ("Pedidos Catálogo") donde los revisas y decides: confirmar o rechazar.
- Al compartir el link de tu catálogo por WhatsApp, se ve una vista previa con el nombre, la descripción y la foto de tu negocio.

### Agregado — Bloque 1 parte 1: fotos de producto

- Editor de producto: subir fotos (varias, con soporte de cámara del celular vía `accept="image/*" capture="environment"`), reordenarlas (la primera queda de portada) y eliminarlas — solo disponible al editar un producto ya guardado.
- Checkbox "Mostrar este producto en el catálogo público" en el editor.

### Agregado — Bloque 1 parte 2: configuración de empresa para el catálogo

- Página nueva `Catálogo Público` (`/catalogo-config`, solo admin, link en el menú): identificador del catálogo (slug, con la URL pública en vivo), descripción, foto de portada, números de WhatsApp de ventas (agregar/quitar), si ofrece domicilio y su valor por defecto, y el botón para activar/desactivar la vitrina.

### Agregado — Bloque 1 parte 3: catálogo público (lectura) + Open Graph

- Página pública `/catalogo/:slug` (sin login, sin el panel de administración alrededor — funciona igual si hay una sesión iniciada o no): portada, nombre, descripción, y la cuadrícula de productos publicados con foto, precio y "Agotado" cuando no hay stock. Pie de página "Hecho con Vendita" enlazando al inicio.
- Metadatos Open Graph (para que el link se vea bien al compartirlo por WhatsApp/redes): como Create React App no puede generarlos por ruta (es 100% del lado del cliente y los crawlers no ejecutan JS), se agregó una función serverless de Vercel (`api/og-catalogo.js`) que le sirve un HTML mínimo con `og:title`/`og:description`/`og:image` a los bots conocidos — un rewrite en `vercel.json` (nuevo) solo la activa cuando el User-Agent es de un crawler (WhatsApp, Facebook, Twitter, etc.); los visitantes reales siguen viendo la app normal.

### Agregado — Bloque 1 parte 4: carrito y pedido en el catálogo público

- Carrito en `PublicCatalogPage`: botón "Agregar" por producto disponible, contador +/- una vez agregado, botón flotante con el total que abre el panel del pedido.
- Checkout: nombre, celular, tipo de entrega (Recoger/Domicilio — Domicilio deshabilitado si la tienda no lo ofrece) y dirección cuando aplica. Al enviar, se crea el pedido y el navegador redirige directo a WhatsApp con el mensaje ya armado por el backend.

### Agregado — Bloque 1 parte 5: panel de pedidos

- Página nueva `Pedidos Catálogo` (`/pedidos`, link en el menú, no requiere admin): pestañas Pendientes/Confirmados/Rechazados, y por pedido el cliente, tipo de entrega, ítems y total. "Confirmar" (crea la venta real) o "Rechazar" (con motivo obligatorio) para los pendientes.

## 1.1.0

### En palabras simples (para contarle a los clientes)

- **Fiar ya no es a ciegas.** Toda venta pendiente o parcial ahora te pide un cliente — lo creas ahí mismo con nombre y celular si no lo tenías, sin salir de la venta, y si el celular ya estaba registrado se reutiliza el cliente en vez de duplicarlo.
- **Cartera de clientes** nueva (menú → Cartera): cuánto te debe cada cliente, cuántas ventas pendientes tiene y hace cuántos días.
- **Clientes con estado**: puedes desactivar un cliente sin borrar su historial, y ya no se puede eliminar por accidente a uno que tiene ventas registradas.

### Agregado

- POS (`SalesPage`): cuando la venta queda `PENDIENTE`, el cliente pasa a ser obligatorio; el selector ahora incluye "➕ Nuevo cliente", que muestra un mini-formulario (nombre y celular) sin salir de la venta. Si ya existe un cliente con ese celular, se avisa que se reutilizó en vez de crear uno duplicado.
- `SaleDetailModal`: botón "Asignar cliente" cuando una venta no tiene uno (ej. ventas pendientes de antes de este bloque), con el mismo selector + "nuevo cliente" del POS.
- `ClientesPage`: columna de estado y botón activar/desactivar por cliente, con confirmación (igual que en compañías y usuarios).
- Página nueva `Cartera` (`/cartera`, solo `admin_compania`/`super_admin_sistema`, link en el menú): total adeudado, y por cliente su saldo, cantidad de ventas pendientes y antigüedad de la deuda más vieja (con aviso visual si pasa de 30 días); cada fila se expande para ver el detalle de cada venta.

## 1.0.1

### En palabras simples (para contarle a los clientes)

- **Los correos ya llegan de verdad**, ahora salen desde nuestro propio dominio verificado.
- **Gestión de tu equipo completa**: edita nombre/correo/rol de cualquier integrante y desactiva/reactiva su acceso sin borrarlo.
- El mensaje de "Olvidé mi contraseña" ahora te da instrucciones más claras (revisar spam, confirmar el correo correcto).

### Agregado

- CRUD de usuarios completo en `UserManagementPage`: el formulario de "Nuevo Integrante" ahora también edita (nombre, email, rol) al usuario seleccionado, con un botón para cancelar la edición. Nueva columna de estado (Activo/Inactivo) y botón para activar/desactivar cada usuario, con confirmación — oculto sobre el propio usuario logueado y sobre cuentas `super_admin_sistema`.

### Cambiado

- Mensaje de éxito de "Olvidé mi contraseña" ahora es fijo en el frontend (no depende del texto que mande el backend) y da instrucciones prácticas: revisar spam y confirmar que sea el correo con el que te registraste. Sigue sin revelar si el correo existe o no.

## 1.0.0

### En palabras simples (para contarle a los clientes)

Desde la 0.9.1 hasta esta 1.0.0, así fue evolucionando Vendita:

- **Más seguro por dentro.** Reforzamos varios controles de seguridad internos (quién puede hacer qué, y que cada compañía solo vea sus propios datos). No vas a notar nada distinto en el día a día, pero tu información está mejor protegida.
- **Ver u ocultar tu contraseña** con un clic al escribirla, en vez de escribir a ciegas.
- **Detalle de cada venta** con un clic, sin tener que descargar el PDF cada vez que quieres revisar qué se vendió.
- **Abonos y pagos parciales**: ahora puedes dejar una venta como pendiente o parcial e ir registrando los pagos que el cliente te va haciendo, hasta completarla.
- **Sesión de 8 horas** en vez de 1 — ya no te saca de la aplicación a mitad de tu jornada.
- **Anular una venta** cuando te equivocas o el cliente se arrepiente: el stock de esos productos vuelve automáticamente al inventario, y queda registrado quién la anuló, cuándo y por qué. Las ventas anuladas ya no se cuentan en tus totales ni reportes, pero siguen visibles en el historial con su motivo.
- **Recuperar tu contraseña es más seguro**: el proceso es igual de simple, pero ya no revela si un correo está o no registrado en el sistema.
- **Mensajes más claros**: si intentas borrar un producto, proveedor o cliente que ya tiene historial (ventas, movimientos de stock), ahora te lo explica en vez de mostrar un error genérico.
- **Corregimos un bug molesto**: si recargabas la página estando en cualquier sección, te mandaba de vuelta al inicio — ya no pasa.

### Agregado

- Anulación de ventas: dentro del detalle de venta, botón "Anular venta" (visible para `admin_compania` y `super_admin_sistema`) con confirmación y motivo obligatorio. Una venta anulada muestra un banner con el motivo, bloquea el registro de nuevos pagos, y se sigue viendo en el historial con el badge `ANULADA` (fila atenuada, excluida del total de la página).
- Panel de sistema (`AdminCompaniesPage`): columna "Estado" y botón para activar/desactivar cada compañía (con confirmación), oculto para la compañía interna. Si una compañía queda inactiva, sus usuarios ven el mensaje claro del backend tanto al iniciar sesión como en cualquier acción posterior.

### Corregido

- Recargar la página en cualquier ruta privada (ej. `/admin/companias`, `/historial-ventas`) siempre terminaba en `/dashboard`. `AuthProvider` lee el token de `localStorage` de forma asíncrona; `App.js` no esperaba ese resultado y en el primer render (con `isAuthenticated` todavía en `false`) montaba las rutas públicas, cuyo comodín `*` redirige a `/`. `AppContent` ahora muestra un loader mientras `AuthContext` sigue cargando, antes de decidir qué árbol de rutas montar.

## v0.9.2 — Pagos con abonos, detalle de venta y sesión de 8h

### Agregado

- Componente reutilizable `PasswordInput` con botón de mostrar/ocultar contraseña (ícono de ojo), accesible por teclado y con `aria-label` dinámico ("Mostrar contraseña"/"Ocultar contraseña"). Integrado en login, registro de compañía, restablecer contraseña y creación de usuarios.
- Detalle de venta en modal (`SaleDetailModal`) desde el historial de ventas: fecha, cliente, vendedor, productos (cantidad, precio unitario, subtotal), total y estado de pago, sin necesidad de descargar el PDF. El botón de descarga de PDF se mantiene dentro del modal.
- Pagos/abonos de una venta: dentro del detalle de venta, botón "Registrar pago" (visible en ventas `PENDIENTE`/`PARCIAL`, con el monto por defecto igual al saldo pendiente) y lista de pagos registrados con opción de anular (motivo obligatorio). El historial de ventas ahora muestra el badge `PARCIAL` (además de `PAGADA`/`PENDIENTE`) y el saldo pendiente de cada venta.

### Cambiado

- El overlay de "cold start" del backend ya no dice "Despertando el servidor..." (detalle de infraestructura); ahora dice "Trabajando en tus datos...".

### Corregido

- Scroll horizontal roto en el listado de usuarios (`UserManagementPage`): la tabla no tenía contenedor con `overflow-x-auto`, lo que en pantallas angostas generaba desplazamiento lateral. Se agregó el mismo patrón de contenedor de scroll usado en las demás tablas del sistema.
- Al expirar el token (1h) o quedar inválido, `apiService` mandaba de vuelta al login sin ninguna explicación — la navegación (`window.location.href`) desmontaba el componente antes de que pudiera mostrar el error, así que se sentía como una desconexión random en medio de cualquier acción (ej. registrando un pago). Ahora se guarda un mensaje en `sessionStorage` antes de redirigir y `LoginPage` lo muestra ("Tu sesión expiró. Por favor, inicia sesión de nuevo.").

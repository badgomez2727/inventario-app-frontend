# Changelog

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

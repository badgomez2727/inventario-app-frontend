# Changelog

## Sin publicar

### Agregado

- Componente reutilizable `PasswordInput` con botón de mostrar/ocultar contraseña (ícono de ojo), accesible por teclado y con `aria-label` dinámico ("Mostrar contraseña"/"Ocultar contraseña"). Integrado en login, registro de compañía, restablecer contraseña y creación de usuarios.
- Detalle de venta en modal (`SaleDetailModal`) desde el historial de ventas: fecha, cliente, vendedor, productos (cantidad, precio unitario, subtotal), total y estado de pago, sin necesidad de descargar el PDF. El botón de descarga de PDF se mantiene dentro del modal.
- Pagos/abonos de una venta: dentro del detalle de venta, botón "Registrar pago" (visible en ventas `PENDIENTE`/`PARCIAL`, con el monto por defecto igual al saldo pendiente) y lista de pagos registrados con opción de anular (motivo obligatorio). El historial de ventas ahora muestra el badge `PARCIAL` (además de `PAGADA`/`PENDIENTE`) y el saldo pendiente de cada venta.

### Cambiado

- El overlay de "cold start" del backend ya no dice "Despertando el servidor..." (detalle de infraestructura); ahora dice "Trabajando en tus datos...".

### Corregido

- Scroll horizontal roto en el listado de usuarios (`UserManagementPage`): la tabla no tenía contenedor con `overflow-x-auto`, lo que en pantallas angostas generaba desplazamiento lateral. Se agregó el mismo patrón de contenedor de scroll usado en las demás tablas del sistema.

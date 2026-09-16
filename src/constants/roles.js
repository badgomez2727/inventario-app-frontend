// frontend/src/constants/roles.js
//
// Única fuente de verdad para los roles de usuario en el frontend. Los
// valores DEBEN coincidir exacto con la lista blanca del backend
// (backend/src/config/roles.js) — "super_admin_sistema" no se incluye en
// ASSIGNABLE_ROLES a propósito, ese rol nunca se asigna desde la UI.

export const ASSIGNABLE_ROLES = [
  { value: 'admin_compania', label: 'Administrador' },
  { value: 'empleado_inventario', label: 'Empleado' },
];

export const ROLE_DISPLAY = {
  admin_compania: { label: 'Administrador', color: 'bg-purple-100 text-purple-700' },
  empleado_inventario: { label: 'Empleado', color: 'bg-emerald-100 text-emerald-700' },
  super_admin_sistema: { label: 'Super Admin', color: 'bg-red-100 text-red-700' },
};

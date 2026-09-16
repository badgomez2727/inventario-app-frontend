import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Campo de contraseña reutilizable con botón de mostrar/ocultar.
 * Recibe las mismas props que un <input>, más:
 * - leftIcon: elemento opcional que se muestra a la izquierda (ej. <FaLock />)
 * - className: clases del <input> (igual que en un input normal del proyecto)
 */
function PasswordInput({ className = '', leftIcon = null, style, ...rest }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {leftIcon && (
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input
        {...rest}
        type={visible ? 'text' : 'password'}
        className={className}
        style={{ paddingRight: '2.75rem', ...style }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-emerald-600"
      >
        {visible ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
      </button>
    </div>
  );
}

export default PasswordInput;

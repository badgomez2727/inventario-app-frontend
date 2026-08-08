import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaFileContract, FaShieldAlt } from "react-icons/fa";

// Datos de contacto del responsable — cámbialos aquí cuando tengas correo/dominio propio.
const CONTACT_EMAIL = "gomezposadadario@gmail.com";
const LAST_UPDATED = "8 de agosto de 2026";

const Logo = () => (
  <div className="flex items-center gap-2 flex-shrink-0">
    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-2">
      <span className="text-white font-black text-2xl -rotate-2">V</span>
    </div>
    <span className="text-2xl font-black tracking-tighter text-gray-900">
      Ven<span className="text-emerald-500">dita</span>
    </span>
  </div>
);

const Section = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-24 mb-10">
    <h3 className="text-lg font-black text-gray-900 mb-3">{title}</h3>
    <div className="text-gray-600 leading-relaxed space-y-3 text-sm">{children}</div>
  </section>
);

const TermsPage = () => {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <nav className="flex items-center justify-between px-6 py-6 max-w-3xl mx-auto w-full">
        <Logo />
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors">
          <FaArrowLeft /> Volver al inicio
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pb-24">
        <div className="text-center pt-4 pb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-3">
            Términos y Privacidad
          </h1>
          <p className="text-gray-400 text-sm">Última actualización: {LAST_UPDATED}</p>
        </div>

        {/* Aviso honesto */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-12 text-sm text-amber-800 leading-relaxed">
          <strong>Nota:</strong> este documento es una base estándar razonable para un
          producto en etapa temprana, redactada para cumplir de buena fe con la
          normatividad colombiana de protección de datos. No reemplaza asesoría legal
          profesional — a medida que Vendita crezca y maneje más datos de más negocios,
          recomendamos que un abogado la revise y ajuste.
        </div>

        {/* Navegación interna */}
        <div className="flex gap-3 mb-12">
          <a href="#terminos" className="flex-1 flex items-center gap-2 justify-center px-4 py-3 bg-gray-50 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <FaFileContract className="text-emerald-500" /> Términos y Condiciones
          </a>
          <a href="#privacidad" className="flex-1 flex items-center gap-2 justify-center px-4 py-3 bg-gray-50 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <FaShieldAlt className="text-emerald-500" /> Tratamiento de Datos
          </a>
        </div>

        {/* ============ TÉRMINOS Y CONDICIONES ============ */}
        <h2 id="terminos" className="scroll-mt-24 text-2xl font-black text-gray-900 mb-8 pb-3 border-b border-gray-100">
          Términos y Condiciones
        </h2>

        <Section title="1. Qué es Vendita">
          <p>
            Vendita es una plataforma de gestión de inventario, ventas, clientes y
            proveedores, ofrecida por {CONTACT_EMAIL} ("nosotros", "la Plataforma").
            Al registrar una compañía o usar Vendita, aceptas estos términos.
          </p>
        </Section>

        <Section title="2. Cuentas y responsabilidad">
          <p>
            Eres responsable de mantener la confidencialidad de tu contraseña y de toda
            actividad que ocurra bajo tu cuenta. Cada compañía registrada es responsable
            de los usuarios que invita y de los permisos que les otorga dentro del sistema.
          </p>
        </Section>

        <Section title="3. Plan gratuito y plan PRO">
          <p>
            Vendita ofrece un plan gratuito con límites de uso (cantidad de productos y
            ventas mensuales), visibles dentro de la propia aplicación. Estos límites
            pueden ajustarse en el tiempo. El paso al plan PRO se activa manualmente tras
            confirmar un aporte/pago — no hay garantía de un tiempo específico de
            activación, aunque hacemos el mejor esfuerzo por que sea rápido.
          </p>
          <p>
            Los aportes/donaciones no son reembolsables, salvo que decidamos lo contrario
            en un caso puntual.
          </p>
        </Section>

        <Section title="4. Tus datos son tuyos">
          <p>
            La información de productos, ventas, clientes y proveedores que cargas en
            Vendita te pertenece a ti (o a tu compañía). Puedes solicitar en cualquier
            momento una exportación o la eliminación de tu cuenta y datos escribiendo a{" "}
            {CONTACT_EMAIL}.
          </p>
        </Section>

        <Section title="5. Uso aceptable">
          <p>
            No está permitido usar Vendita para actividades ilegales, para almacenar datos
            de personas sin autorización de tratarlos, para intentar vulnerar la seguridad
            de la plataforma, o para acceder a datos de compañías distintas a la tuya.
          </p>
        </Section>

        <Section title="6. Disponibilidad y garantías">
          <p>
            Vendita se ofrece "tal cual" ("as is"), en desarrollo activo. No garantizamos
            disponibilidad ininterrumpida ni ausencia total de errores. Te recomendamos no
            depender de Vendita como única copia de tu información crítica de negocio
            mientras la plataforma madura.
          </p>
        </Section>

        <Section title="7. Cambios y terminación">
          <p>
            Podemos actualizar estos términos, notificándolo en la propia aplicación o por
            correo. Podemos suspender cuentas que incumplan estos términos o que hagan un
            uso indebido de la plataforma.
          </p>
        </Section>

        <Section title="8. Ley aplicable">
          <p>Estos términos se rigen por las leyes de Colombia.</p>
        </Section>

        {/* ============ TRATAMIENTO DE DATOS ============ */}
        <h2 id="privacidad" className="scroll-mt-24 text-2xl font-black text-gray-900 mb-8 pb-3 border-b border-gray-100 mt-16">
          Política de Tratamiento de Datos Personales
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre
          protección de datos personales en Colombia.
        </p>

        <Section title="1. Responsable del tratamiento">
          <p>
            Vendita, con contacto en {CONTACT_EMAIL}, actúa como responsable del
            tratamiento de los datos de las compañías registradas y de los usuarios que
            operan el sistema (nombre de usuario, correo, rol).
          </p>
          <p>
            Para los datos de <strong>clientes y proveedores</strong> que cada compañía
            registra dentro de Vendita (nombre, correo, teléfono, dirección), la compañía
            usuaria es la <strong>responsable</strong> del tratamiento de esos datos frente
            a sus propios clientes/proveedores, y Vendita actúa como{" "}
            <strong>encargado del tratamiento</strong>: solo almacenamos y procesamos esa
            información por instrucción de la compañía, para que pueda operar su negocio.
          </p>
        </Section>

        <Section title="2. Qué datos recolectamos">
          <ul className="list-disc pl-5 space-y-1">
            <li>Datos de la compañía: nombre comercial, dirección, teléfono, correo de contacto.</li>
            <li>Datos de usuarios del sistema: nombre de usuario, correo, contraseña (almacenada cifrada, nunca en texto plano), rol.</li>
            <li>Datos que la compañía carga sobre sus clientes y proveedores: nombre, correo, teléfono, dirección.</li>
            <li>Datos de uso: productos, ventas, movimientos de inventario asociados a la compañía.</li>
          </ul>
        </Section>

        <Section title="3. Finalidad">
          <p>
            Usamos estos datos exclusivamente para operar la plataforma: autenticación,
            generación de reportes y recibos, envío de correos transaccionales (ej.
            recuperación de contraseña), y para activar el plan correspondiente a cada
            compañía.
          </p>
        </Section>

        <Section title="4. Tus derechos (ARCO)">
          <p>
            Como titular de tus datos, tienes derecho a conocer, actualizar, rectificar y
            solicitar la eliminación de tus datos personales, así como a revocar la
            autorización otorgada para su tratamiento, escribiendo a {CONTACT_EMAIL}.
          </p>
        </Section>

        <Section title="5. Seguridad">
          <p>
            Las contraseñas se almacenan cifradas (bcrypt), el acceso a la plataforma
            requiere autenticación mediante token, y cada compañía solo puede acceder a
            su propia información — el sistema está diseñado para que ninguna compañía
            pueda ver datos de otra.
          </p>
        </Section>

        <Section title="6. Terceros y hosting">
          <p>
            Los datos se almacenan en proveedores de infraestructura en la nube (base de
            datos y hosting de la aplicación) y usamos un proveedor externo para el envío
            de correos transaccionales. Ninguno de estos terceros usa tus datos con fines
            distintos a operar Vendita.
          </p>
        </Section>

        <Section title="7. Vigencia">
          <p>
            Esta política aplica desde {LAST_UPDATED} y permanecerá vigente mientras exista
            una relación con la compañía titular de los datos, y durante el tiempo
            necesario para cumplir obligaciones legales posteriores.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default TermsPage;

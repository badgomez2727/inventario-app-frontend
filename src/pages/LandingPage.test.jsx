import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';
import { WHATSAPP_NUMBER } from '../config/contact';

// El Jest de Create React App (v27) no resuelve React Router 7 (usa el campo
// "exports" del package.json), así que se simula solo Link, que es lo único
// del router que usa la landing.
jest.mock(
  'react-router-dom',
  () => ({
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }),
  { virtual: true }
);

const renderLanding = () => render(<LandingPage />);

describe('LandingPage', () => {
  test('todos los botones "Probar 7 días gratis" llevan al registro', () => {
    renderLanding();
    const botones = screen.getAllByRole('link', { name: /probar 7 días gratis/i });
    expect(botones.length).toBeGreaterThanOrEqual(2);
    botones.forEach((b) => expect(b.getAttribute('href')).toBe('/register-company'));
  });

  test('los botones de WhatsApp abren wa.me al número de contacto con un mensaje', () => {
    renderLanding();
    const enlaces = screen.getAllByRole('link', { name: /whatsapp|ayuda para cargar/i });
    expect(enlaces.length).toBeGreaterThanOrEqual(3);
    enlaces.forEach((a) => {
      expect(a.getAttribute('href')).toMatch(new RegExp(`^https://wa\\.me/${WHATSAPP_NUMBER}\\?text=.+`));
      expect(a.getAttribute('target')).toBe('_blank');
    });
  });

  test('el botón de ayuda para cargar productos manda un mensaje específico', () => {
    renderLanding();
    const ayuda = screen.getByRole('link', { name: /ayuda para cargar mis productos/i });
    expect(decodeURIComponent(ayuda.getAttribute('href'))).toContain('ayuden a cargar mis productos');
  });

  test('muestra la prueba de 7 días, los precios de los planes y qué pasa al terminar', () => {
    renderLanding();
    expect(screen.getByRole('heading', { name: /prueba vendita 7 días gratis/i })).toBeTruthy();
    expect(screen.getAllByText(/hasta 500 productos/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/\$10\.000/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/\$20\.000/).length).toBeGreaterThanOrEqual(1);
    // Aparece en la oferta y en las preguntas frecuentes.
    expect(screen.getAllByText(/solo lectura/i).length).toBeGreaterThanOrEqual(1);
  });

  test('no promete un plan gratis permanente', () => {
    renderLanding();
    expect(document.body.textContent).not.toMatch(/gratis (para )?siempre|gratis hasta 50|gratis durante el lanzamiento/i);
  });

  test('el asistente de IA aparece solo como "Próximamente"', () => {
    renderLanding();
    expect(screen.getByText('Próximamente')).toBeTruthy();
    expect(screen.getByText(/asistente con inteligencia artificial para generar tus productos/i)).toBeTruthy();
  });

  test('tiene las preguntas frecuentes', () => {
    renderLanding();
    expect(screen.getByText('¿Tengo que instalar algo?')).toBeTruthy();
    expect(screen.getByText('¿Cuánto cuesta?')).toBeTruthy();
    expect(screen.getByText('¿Qué pasa cuando termina la prueba?')).toBeTruthy();
  });

  test('no promete una aplicación de escritorio ni instalable (Vendita es una app web)', () => {
    renderLanding();
    expect(document.body.textContent).not.toMatch(/aplicaci[oó]n de escritorio|app de escritorio|instala la app|descarga la app/i);
  });
});

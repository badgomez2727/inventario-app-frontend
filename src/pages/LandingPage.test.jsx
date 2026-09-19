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
  test('todos los botones "Empezar gratis" llevan al registro', () => {
    renderLanding();
    const botones = screen.getAllByRole('link', { name: /empezar gratis/i });
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

  test('muestra la oferta de lanzamiento, lo que incluye y lo que viene después', () => {
    renderLanding();
    expect(screen.getByRole('heading', { name: /gratis durante el lanzamiento/i })).toBeTruthy();
    expect(screen.getByText(/hasta 500 productos/i)).toBeTruthy();
    // Aparece en la oferta y en las preguntas frecuentes.
    expect(screen.getAllByText(/habrá planes según la cantidad de productos/i).length).toBeGreaterThanOrEqual(1);
  });

  test('el asistente de IA aparece solo como "Próximamente"', () => {
    renderLanding();
    expect(screen.getByText('Próximamente')).toBeTruthy();
    expect(screen.getByText(/asistente con inteligencia artificial para generar tus productos/i)).toBeTruthy();
  });

  test('tiene las preguntas frecuentes', () => {
    renderLanding();
    expect(screen.getByText('¿Tengo que instalar algo?')).toBeTruthy();
    expect(screen.getByText('¿De verdad es gratis?')).toBeTruthy();
  });

  test('no promete una aplicación de escritorio ni instalable (Vendita es una app web)', () => {
    renderLanding();
    expect(document.body.textContent).not.toMatch(/aplicaci[oó]n de escritorio|app de escritorio|instala la app|descarga la app/i);
  });
});

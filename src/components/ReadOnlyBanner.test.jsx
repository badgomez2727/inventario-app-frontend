import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ReadOnlyBanner from './ReadOnlyBanner';
import { getPlanStatus } from '../services/apiService';

// El Jest de Create React App (v27) no resuelve React Router 7: se simula solo Link.
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
jest.mock('../services/apiService', () => ({ getPlanStatus: jest.fn() }));

describe('ReadOnlyBanner', () => {
  afterEach(() => jest.resetAllMocks());

  test('con la prueba terminada avisa que la cuenta está en solo lectura y ofrece activar el plan', async () => {
    getPlanStatus.mockResolvedValue({ plan: 'VENCIDO', storedPlan: 'LANZAMIENTO' });
    render(<ReadOnlyBanner />);

    expect(await screen.findByText(/tu cuenta está en modo solo lectura/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /activar mi plan/i }).getAttribute('href')).toBe('/apoyar');
  });

  test.each(['LANZAMIENTO', 'FREE', 'BASICO', 'PRO'])('con el plan %s no muestra nada', async (plan) => {
    getPlanStatus.mockResolvedValue({ plan });
    const { container } = render(<ReadOnlyBanner />);

    await waitFor(() => expect(getPlanStatus).toHaveBeenCalled());
    expect(container.textContent).toBe('');
  });

  test('si no se puede consultar el plan, no muestra nada ni rompe la pantalla', async () => {
    getPlanStatus.mockRejectedValue(new Error('sin conexión'));
    const { container } = render(<ReadOnlyBanner />);

    await waitFor(() => expect(getPlanStatus).toHaveBeenCalled());
    expect(container.textContent).toBe('');
  });
});

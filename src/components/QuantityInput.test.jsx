import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuantityInput, { MAX_CANTIDAD } from './QuantityInput';

const setup = (value = 3) => {
  const onChange = jest.fn();
  const onRemove = jest.fn();
  render(<QuantityInput value={value} onChange={onChange} onRemove={onRemove} />);
  return { onChange, onRemove, input: screen.getByLabelText('Cantidad') };
};

const ultimaLlamada = (mock) => mock.mock.calls[mock.mock.calls.length - 1][0];

describe('QuantityInput', () => {
  test('muestra la cantidad actual', () => {
    const { input } = setup(7);
    expect(input.value).toBe('7');
  });

  test('"+" suma uno y "−" resta uno', () => {
    const { onChange } = setup(3);
    userEvent.click(screen.getByLabelText('Agregar uno'));
    expect(onChange).toHaveBeenLastCalledWith(4);
    userEvent.click(screen.getByLabelText('Quitar uno'));
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  test('"−" estando en 1 quita el producto', () => {
    const { onChange, onRemove } = setup(1);
    userEvent.click(screen.getByLabelText('Quitar uno'));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('se puede escribir la cantidad directamente', () => {
    const { onChange, input } = setup(1);
    userEvent.clear(input);
    userEvent.type(input, '24');
    expect(ultimaLlamada(onChange)).toBe(24);
    expect(input.value).toBe('24');
  });

  test('ignora todo lo que no sea dígito', () => {
    const { onChange, input } = setup(1);
    userEvent.clear(input);
    userEvent.type(input, 'a1b2-');
    expect(ultimaLlamada(onChange)).toBe(12);
    expect(input.value).toBe('12');
  });

  test('un número por encima del tope se limita a MAX_CANTIDAD', () => {
    const { onChange, input } = setup(1);
    userEvent.clear(input);
    userEvent.type(input, '5000');
    expect(ultimaLlamada(onChange)).toBe(MAX_CANTIDAD);
    expect(input.value).toBe(String(MAX_CANTIDAD));
  });

  test('"+" se deshabilita en el tope', () => {
    setup(MAX_CANTIDAD);
    expect(screen.getByLabelText('Agregar uno').disabled).toBe(true);
  });

  test('escribir 0 y salir del campo quita el producto (sin fijar 0 como cantidad)', () => {
    const { onChange, onRemove, input } = setup(3);
    userEvent.clear(input);
    userEvent.type(input, '0');
    expect(onChange).not.toHaveBeenCalled();
    userEvent.tab();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('dejar el campo vacío y salir NO quita el producto: vuelve al número anterior', () => {
    const { onChange, onRemove, input } = setup(3);
    userEvent.clear(input);
    userEvent.tab();
    expect(onRemove).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(input.value).toBe('3');
  });
});

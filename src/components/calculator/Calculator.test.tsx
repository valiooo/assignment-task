import '@testing-library/jest-dom';
import { render, act, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { select } from 'react-select-event';

import { Calculator } from './Calculator';

describe('Calculator', () => {
  test('should render Calculator', async () => {
    const { asFragment } = await act(() => render(<Calculator />));

    expect(asFragment()).toMatchSnapshot();
  });
  test('should render default values', async () => {
    await act(() => render(<Calculator />));

    expect(screen.getByTestId('select-from')).toHaveTextContent('EUR');
    expect(screen.getByTestId('select-to')).toHaveTextContent('GBP');
    expect(screen.getByLabelText('Amount:')).toHaveValue('1.00');
  });
  test('should swap currencies', async () => {
    await act(() => render(<Calculator />));
    await userEvent.click(screen.getByLabelText('Swap currencies'));

    expect(screen.getByTestId('select-to')).toHaveTextContent('EUR');
  });
  describe('should validate', () => {
    test('currency EUR max value', async () => {
      await act(() => render(<Calculator />));
      await userEvent.click(screen.getByRole('button', { name: 'Convert' }));
      await act(() => {
        fireEvent.change(screen.getByLabelText('Amount:'), {
          target: { value: 5001 },
        });
      });

      expect(
        screen.getByText('Amount must be less than or equal to 5000.')
      ).toBeTruthy();
    });

    test('currency PLN max value', async () => {
      await act(() => render(<Calculator />));
      await userEvent.click(screen.getByRole('button', { name: 'Convert' }));
      await act(async () => {
        await select(screen.getByLabelText('From:'), 'PLN');
        await fireEvent.change(screen.getByLabelText('Amount:'), {
          target: { value: 20001 },
        });
      });

      expect(
        screen.getByText('Amount must be less than or equal to 20000.')
      ).toBeTruthy();
    });

    test('currency GBP max value', async () => {
      await act(() => render(<Calculator />));
      await userEvent.click(screen.getByRole('button', { name: 'Convert' }));
      await act(async () => {
        await select(screen.getByLabelText('From:'), 'GBP');
        await fireEvent.change(screen.getByLabelText('Amount:'), {
          target: { value: 1001 },
        });
      });

      expect(
        screen.getByText('Amount must be less than or equal to 1000.')
      ).toBeTruthy();
    });

    test('currency UAH max value', async () => {
      await act(() => render(<Calculator />));
      await userEvent.click(screen.getByRole('button', { name: 'Convert' }));
      await act(async () => {
        await select(screen.getByLabelText('From:'), 'UAH');
        await fireEvent.change(screen.getByLabelText('Amount:'), {
          target: { value: 50001 },
        });
      });

      expect(
        screen.getByText('Amount must be less than or equal to 50000.')
      ).toBeTruthy();
    });
  });
});

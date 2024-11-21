import '@testing-library/jest-dom';
import { useForm } from 'react-hook-form';
import { render, act, screen } from '@testing-library/react';

import { FieldInput } from './FieldInput';
import { FormProps } from '../calculator/Calculator';

const FormWrapper = ({ error }: { error?: string }) => {
  const { control } = useForm<FormProps>();

  return (
    <FieldInput
      label="Amount"
      control={control}
      name="fromAmount"
      onChange={() => {}}
      error={error}
    />
  );
};

describe('FieldInput', () => {
  test('Should render FieldInput', async () => {
    const { asFragment } = await act(() => render(<FormWrapper />));

    expect(asFragment()).toMatchSnapshot();
  });

  test('Should render error message', async () => {
    await act(() => render(<FormWrapper error={'Required field.'} />));

    expect(screen.getByText('Required field.')).toBeTruthy();
  });
});

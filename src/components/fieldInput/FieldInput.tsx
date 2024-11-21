'use client';
import { Controller, Control } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import classNames from 'classnames';

import { FormProps } from '../calculator/Calculator';

interface FieldSelectProps {
  label?: string;
  control?: Control<FormProps>;
  name: keyof FormProps;
  onChange: (value: string) => void;
  error?: string;
}

export const FieldInput = ({
  label,
  control,
  name,
  onChange,
  error,
}: FieldSelectProps) => {
  return (
    <div data-testid={`field-${name}`}>
      {label && (
        <label className="_label" htmlFor={name}>
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={{ required: true, max: 20000 }}
        render={({ field: { value, onBlur }, fieldState: { error } }) => (
          <NumericFormat
            type="text"
            id={name}
            value={Number(value).toFixed(2)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value)
            }
            onBlur={onBlur}
            className={classNames('_field text-[29px] font-medium', {
              '!border-b-red text-red': error,
            })}
            decimalScale={2}
          />
        )}
      />
      {error && <div className="text-red text-xs mt-1">{error}</div>}
    </div>
  );
};

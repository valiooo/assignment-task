'use client';
import Select, {
  components,
  OptionProps,
  SingleValueProps,
  DropdownIndicatorProps,
} from 'react-select';
import { Controller, Control } from 'react-hook-form';
import classNames from 'classnames';

import { FormProps } from '../calculator/Calculator';
import IconCarrot from '../../svg/carrot.svg';
import { Flag, CurrencyProps } from '../flag/Flag';

interface FieldSelectProps {
  label?: string;
  control?: Control<FormProps>;
  name: keyof FormProps;
  onChange: (value: CurrencyProps) => void;
}

interface FlagOptionProps {
  label: string;
  value: CurrencyProps;
}

export const FieldSelect = ({
  label,
  control,
  name,
  onChange,
}: FieldSelectProps) => {
  const options: FlagOptionProps[] = [
    { value: 'PLN', label: 'PLN' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'UAH', label: 'UAH' },
  ];

  const Option = (props: OptionProps<FlagOptionProps>) => (
    <components.Option {...props}>
      <div className="flex items-center justify-start gap-2">
        <span>
          <Flag currency={props.data.value} />
        </span>
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );

  const SingleValue = ({
    children,
    ...props
  }: SingleValueProps<FlagOptionProps>) => {
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center justify-start gap-2 ">
          <span>
            <Flag currency={props.data.value} />
          </span>
          <span className="text-2xl">{children}</span>
        </div>
      </components.SingleValue>
    );
  };

  const DropdownIndicator = (
    props: DropdownIndicatorProps<FlagOptionProps>
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <IconCarrot />
      </components.DropdownIndicator>
    );
  };

  return (
    <div data-testid={`select-${name}`}>
      {label && (
        <label className="_label" htmlFor={name}>
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onBlur }, fieldState: { error } }) => (
          <Select
            isSearchable={false}
            onBlur={onBlur}
            options={options}
            components={{ Option, SingleValue, DropdownIndicator }}
            instanceId={name}
            inputId={name}
            isMulti={false}
            className={classNames('border w-full', {
              'border-red': error,
            })}
            value={options.find((c) => c.value === value)}
            onChange={(newValue: any) => onChange(newValue?.value)}
            classNames={{
              container: () => '!border-0 !shadow-none',
              control: () =>
                '!bg-white !rounded-none !border-0 !border-b-smoke !border-b !shadow-none !cursor-pointer',
              singleValue: () => '!-mx-[8px] !-my[2px]',
              indicatorSeparator: () => '!hidden',
              menu: () => '!mt-0',
              menuList: () => '!border-0 !p-0',
              option: (state) =>
                state.isSelected
                  ? '!bg-smoke !text-black'
                  : 'hover:!bg-smoke !cursor-pointer',
            }}
          />
        )}
      />
    </div>
  );
};

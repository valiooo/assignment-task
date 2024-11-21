'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';

import IconSwap from '../../svg/swap.svg';
import IconCircle from '../../svg/circle.svg';
import IconLoader from '../../svg/loader.svg';
import { FieldSelect } from '../fieldSelect/FieldSelect';
import { FieldInput } from '../fieldInput/FieldInput';
import { CurrencyProps } from '../flag/Flag';
import { getFxRates } from '../../api/getFxRates';

const schema = yup.object({
  from: yup.string().required(),
  to: yup.string().required(),
  fromAmount: yup
    .number()
    .typeError('Amount must be a number.')
    .positive('Amount must be a positive number.')
    .required('Required field.')
    .when('from', ([from], schema) =>
      from === 'PLN'
        ? schema.max(20000, 'Amount must be less than or equal to 20000.')
        : schema
    )
    .when('from', ([from], schema) =>
      from === 'EUR'
        ? schema.max(5000, 'Amount must be less than or equal to 5000.')
        : schema
    )
    .when('from', ([from], schema) =>
      from === 'GBP'
        ? schema.max(1000, 'Amount must be less than or equal to 1000.')
        : schema
    )
    .when('from', ([from], schema) =>
      from === 'UAH'
        ? schema.max(50000, 'Amount must be less than or equal to 50000.')
        : schema
    ),
});

export type FormProps = {
  from: string;
  to: string;
  rate?: number;
  fromAmount: number;
  toAmount?: number;
};

export const Calculator = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitiated, setIsInitiated] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    control,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormProps>({
    defaultValues: {
      from: 'EUR',
      to: 'GBP',
      rate: 0,
      fromAmount: 1,
      toAmount: 0,
    },
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const { from, to, rate } = watch();

  const getInitialRates = () => {
    if (isValid) {
      setIsInitiated(true);
      updateRates();
    }
  };

  const updateFrom = (value: CurrencyProps) => {
    setValue('from', value, { shouldValidate: true });
    trigger('fromAmount');

    if (isValid && isInitiated) {
      updateRates();
    }
  };

  const updateTo = (value: CurrencyProps) => {
    setValue('to', value, { shouldValidate: true });

    if (isValid && isInitiated) {
      updateRates();
    }
  };

  const swapCurrency = () => {
    const values = getValues();

    setValue('from', values.to);
    setValue('to', values.from);

    if (isValid && isInitiated) {
      updateRates();
    }
  };

  const updateFromAmount = (value: string) => {
    setValue('fromAmount', parseFloat(value), {
      shouldValidate: true,
    });

    if (isValid && isInitiated) {
      updateRates();
    }
  };

  const updateToAmount = (value: string) => {
    if (rate) {
      setValue('fromAmount', parseFloat(value) * rate, {
        shouldValidate: true,
      });
      setValue('toAmount', parseFloat(value));
    }
  };

  const updateRates = useDebouncedCallback(async () => {
    const values = getValues();
    setIsLoading(true);

    await getFxRates(values).then((fxRates) => {
      if (!fxRates?.error) {
        setValue('from', fxRates.from);
        setValue('to', fxRates.to);
        setValue('toAmount', fxRates.toAmount);
        setValue('rate', fxRates.rate);
        trigger();
      } else {
        console.log('Error:', fxRates?.error);
      }
    });
    setIsLoading(false);
  }, 100);

  return (
    <div
      className={classNames(
        'bg-white w-[35.2rem] h-[32rem] xsm:h-[22.2rem] xsm:shadow-theme xsm:mx-6',
        {
          '': isClient,
        }
      )}
    >
      {isClient && (
        <div className="flex flex-col items-start justify-between h-full px-6 py-[2.5rem] min-[420px]:px-[3.25rem]">
          <div className="flex flex-row items-start justify-start gap-3 flex-wrap xsm:flex-column xsm:flex-nowrap xsm:gap-[4.5rem] relative w-full">
            <div className="_select-wrapper">
              <FieldSelect
                label="From:"
                name="from"
                control={control}
                onChange={updateFrom}
              />
            </div>
            <div className="_select-wrapper">
              <FieldSelect
                label="To:"
                name="to"
                control={control}
                onChange={updateTo}
              />
            </div>
            <button
              type="button"
              aria-label="Swap currencies"
              className="flex items-center justify-center bg-white gap-3 xsm:gap-0 xsm:w-9 h-9 mt-3 xsm:mt-0 xsm:absolute xsm:left-1/2 xsm:bottom-0.5 xsm:-translate-x-1/2"
              onClick={() => swapCurrency()}
            >
              <IconSwap />
              <span className="text-gray text-xs uppercase tracking-tighter xsm:hidden">
                Swap currencies
              </span>
            </button>
          </div>
          <div className="flex-auto flex items-start justify-between mt-5 xsm:mt-[2rem] gap-6 xsm:gap-[4.5rem] w-full">
            <div className="_input-wrapper">
              <FieldInput
                label="Amount:"
                control={control}
                name="fromAmount"
                onChange={updateFromAmount}
                error={errors?.fromAmount && errors.fromAmount.message}
              />
              <div className="_currency-label">{from}</div>
            </div>
            {isInitiated && (
              <div className="_input-wrapper">
                <FieldInput
                  label="Converted to:"
                  control={control}
                  name="toAmount"
                  onChange={updateToAmount}
                />
                <div className="_currency-label">{to}</div>
              </div>
            )}
          </div>
          {!isInitiated ? (
            <div className="w-full">
              <button
                type="button"
                onClick={getInitialRates}
                className="bg-green h-[3.75rem] w-full flex items-center justify-center text-white text-xl transition hover:bg-green-hover"
              >
                Convert
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div>
                <div
                  className={classNames(
                    'flex items-center justify-start gap-2 text-lg font-medium leading-tight'
                  )}
                >
                  {isLoading ? (
                    <IconLoader className="animate-spin" />
                  ) : (
                    <IconCircle />
                  )}
                  <span
                    className={classNames('transition', {
                      'opacity-10': isLoading,
                      'opacity-100': !isLoading,
                    })}
                  >
                    {`${from} = ${rate} ${to}`}
                  </span>
                </div>
                <p className="text-xs text-gray mt-4">
                  All figures are live mid-market rates, which are for
                  informational purposes only. To see the rates for money
                  transfer, please select sending money option.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

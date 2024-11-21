import { FormProps } from '../components/calculator/Calculator';

export const getFxRates = async (values: FormProps) => {
  const data = new URLSearchParams({
    from: values.from,
    to: values.to,
    amount: values.fromAmount.toFixed(2).toString(),
  }).toString();

  const res = await fetch(`https://my.transfergo.com/api/fx-rates?${data}`);

  return await res.json();
};

import FlagEur from '../../svg/EUR.svg';
import FlagPln from '../../svg/PLN.svg';
import FlagGbp from '../../svg/GBP.svg';
import FlagUah from '../../svg/UAH.svg';

export type CurrencyProps = 'PLN' | 'EUR' | 'GBP' | 'UAH';

export const Flag = ({ currency }: { currency: CurrencyProps }) => {
  switch (currency) {
    case 'PLN':
      return <FlagPln data-testid="flag-PLN" />;
    case 'EUR':
      return <FlagEur data-testid="flag-EUR" />;
    case 'GBP':
      return <FlagGbp data-testid="flag-EUR" />;
    case 'UAH':
      return <FlagUah data-testid="flag-UAH" />;
    default:
      return null;
  }
};

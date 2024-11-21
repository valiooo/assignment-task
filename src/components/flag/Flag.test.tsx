import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Flag } from './Flag';

describe('Flag', () => {
  test('should render Flag', () => {
    const { asFragment } = render(<Flag currency="EUR" />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render correct flag', () => {
    render(<Flag currency="PLN" />);

    expect(screen.getByTestId('flag-PLN')).toBeInTheDocument();
  });
});

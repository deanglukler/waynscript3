import { render } from '@testing-library/react';

import { MainWindow } from './MainWindow';

describe('MainWindow component', () => {
  it('Renders the component', () => {
    render(<MainWindow />);
    expect(true).toBe(true);
  });
});

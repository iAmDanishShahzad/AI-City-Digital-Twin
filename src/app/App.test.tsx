import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('App', () => {
  it('renders the project title', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'AI City Digital Twin' })).toBeInTheDocument();
  });
});

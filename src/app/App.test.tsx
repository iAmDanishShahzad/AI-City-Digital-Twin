import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../presentation/scene/DistrictScene', () => ({
  DistrictScene: () => <section aria-label="Central District district scene" />,
}));

import { App } from './App';

describe('App', () => {
  it('renders the project title', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Central District' })).toBeInTheDocument();
    expect(screen.getByLabelText('Central District district scene')).toBeInTheDocument();
  });
});

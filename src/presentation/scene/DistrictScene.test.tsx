import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { centralDistrictDefinition } from '@/district';

import { projectDistrict } from '../projection/district-projection';
import { DistrictScene } from './DistrictScene';

vi.mock('@react-three/fiber', () => ({
  Canvas: () => <div data-testid="district-canvas" />,
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
}));

describe('DistrictScene', () => {
  it('renders the projected district through the canvas boundary without errors', () => {
    const result = projectDistrict(centralDistrictDefinition);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    render(<DistrictScene projection={result.value} />);

    expect(screen.getByLabelText('Central District district scene')).toBeInTheDocument();
    expect(screen.getByTestId('district-canvas')).toBeInTheDocument();
  });
});

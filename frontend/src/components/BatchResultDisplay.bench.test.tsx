// @vitest-environment jsdom
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BatchResultDisplay from './BatchResultDisplay';
import type { PasswordResponse } from '../types';

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

const generateMockResults = (count: number): PasswordResponse[] => {
  return Array.from({ length: count }, (_, i) => ({
    password: `password-${i}`,
    strength: 50 + (i % 50),
    strengthLabel: 'Strong',
    estimatedCrackTime: 'Centuries',
    entropy: 128,
  }));
};

describe('BatchResultDisplay Performance', () => {
  it('renders 1000 items and handles updates', async () => {
    const results = generateMockResults(1000);

    const startRender = performance.now();
    const { getAllByRole } = render(<BatchResultDisplay results={results} />);
    const endRender = performance.now();

    console.log(`[PERF] Initial Render (1000 items): ${(endRender - startRender).toFixed(4)}ms`);

    // Verify render
    expect(screen.getByText('password-0')).toBeDefined();
    expect(screen.getByText('password-999')).toBeDefined();

    // Find a copy button (skip the first one which is "Copy All")
    const buttons = getAllByRole('button');
    const itemCopyBtn = buttons[1]; // First item copy button

    expect(itemCopyBtn).toBeDefined();

    const startUpdate = performance.now();
    await act(async () => {
      fireEvent.click(itemCopyBtn);
    });
    const endUpdate = performance.now();

    console.log(`[PERF] Update (Copy action): ${(endUpdate - startUpdate).toFixed(4)}ms`);
  }, 20000);
});

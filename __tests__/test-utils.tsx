import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = (
  response: Record<string, unknown> | null = null,
  status: number = 200,
  ok: boolean = true
) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status,
    json: jest.fn().mockResolvedValueOnce(response),
    text: jest.fn().mockResolvedValueOnce(JSON.stringify(response)),
  });
};

const mockFetchError = (error: string = 'Network error') => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(error));
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Re-export everything from @testing-library/react plus custom utilities
export * from '@testing-library/react';
export { customRender as render, mockFetch, mockFetchError, userEvent };

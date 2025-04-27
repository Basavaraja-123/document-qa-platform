import { reducer, toast, useToast } from '@/hooks/use-toast';
import { render, screen } from '@testing-library/react';
import * as React from 'react';

// Mock timers to control setTimeout
jest.useFakeTimers();

describe('useToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('initializes with empty toasts', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('toasts').textContent).toBe('Toasts: 0');
  });
});

describe('toast function', () => {
  it('generates unique IDs', () => {
    const toast1 = toast({ title: 'Toast 1' });
    const toast2 = toast({ title: 'Toast 2' });
    expect(toast1.id).not.toBe(toast2.id);
  });

  it('returns dismiss and update methods', () => {
    const toastInstance = toast({ title: 'Test Toast' });
    expect(toastInstance).toHaveProperty('id');
    expect(toastInstance).toHaveProperty('dismiss');
    expect(toastInstance).toHaveProperty('update');
    expect(typeof toastInstance.dismiss).toBe('function');
    expect(typeof toastInstance.update).toBe('function');
  });
});

describe('reducer', () => {
  const initialState: { toasts: any[] } = { toasts: [] };
  const mockToast = {
    id: '1',
    title: 'Test Title',
    description: 'Test Description',
    open: true,
  };

  it('handles ADD_TOAST', () => {
    const action = { type: 'ADD_TOAST', toast: mockToast };
    const newState = reducer(initialState, action);
    expect(newState.toasts).toEqual([mockToast]);
  });

  it('respects TOAST_LIMIT in ADD_TOAST', () => {
    const state = { toasts: [mockToast] };
    const newToast = { ...mockToast, id: '2' };
    const action = { type: 'ADD_TOAST', toast: newToast };
    const newState = reducer(state, action);
    expect(newState.toasts).toEqual([newToast]);
    expect(newState.toasts.length).toBe(1);
  });

  it('handles UPDATE_TOAST', () => {
    const state = { toasts: [mockToast] };
    const action = {
      type: 'UPDATE_TOAST',
      toast: { id: '1', title: 'Updated Title' },
    };
    const newState = reducer(state, action);
    expect(newState.toasts[0].title).toBe('Updated Title');
    expect(newState.toasts[0].description).toBe('Test Description');
  });

  it('handles DISMISS_TOAST for specific toast', () => {
    const state = { toasts: [mockToast] };
    const action = { type: 'DISMISS_TOAST', toastId: '1' };
    const newState = reducer(state, action);
    expect(newState.toasts[0].open).toBe(false);
  });

  it('handles DISMISS_TOAST for all toasts', () => {
    const state = { toasts: [mockToast, { ...mockToast, id: '2' }] };
    const action = { type: 'DISMISS_TOAST' };
    const newState = reducer(state, action);
    expect(newState.toasts.every((t) => t.open === false)).toBe(true);
  });

  it('handles REMOVE_TOAST for specific toast', () => {
    const state = { toasts: [mockToast] };
    const action = { type: 'REMOVE_TOAST', toastId: '1' };
    const newState = reducer(state, action);
    expect(newState.toasts).toEqual([]);
  });

  it('handles REMOVE_TOAST for all toasts', () => {
    const state = { toasts: [mockToast, { ...mockToast, id: '2' }] };
    const action = { type: 'REMOVE_TOAST' };
    const newState = reducer(state, action);
    expect(newState.toasts).toEqual([]);
  });
});

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error">Rendering Error</div>;
    }
    return this.props.children;
  }
}

// Test component to interact with useToast
function TestComponent() {
  const { toasts, toast, dismiss } = useToast();
  const [lastToastId, setLastToastId] = React.useState<string | null>(null);

  return (
    <ErrorBoundary>
      <div>
        <div data-testid="toasts">Toasts: {toasts.length}</div>
        {toasts.map((t) => (
          <div
            key={t.id}
            data-testid={`toast-${t.id}`}
            data-open={t.open ? 'true' : 'false'}
          >
            <span>{t.title}</span>
            <span>{t.description}</span>
            <span data-testid="toast-id">{t.id}</span>
          </div>
        ))}
        <button
          onClick={() => {
            const toastInstance = toast({
              title: 'Test Title',
              description: 'Test Description',
            });
            setLastToastId(toastInstance.id);
          }}
        >
          Add Toast
        </button>
        <button onClick={() => lastToastId && dismiss(lastToastId)}>
          Dismiss Toast
        </button>
        <button onClick={() => dismiss()}>Dismiss All</button>
        <button
          onClick={() => {
            if (lastToastId) {
              toast({
                id: lastToastId,
                title: 'Updated Title',
                description: 'Updated Description',
              }).update({
                id: lastToastId,
                title: 'Updated Title',
                description: 'Updated Description',
              });
            }
          }}
        >
          Update Toast
        </button>
      </div>
    </ErrorBoundary>
  );
}

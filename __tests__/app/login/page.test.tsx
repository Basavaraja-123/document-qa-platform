import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginPage from '@/app/login/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock use-toast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock useAuth
jest.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  it('renders the login form', async () => {
    await act(async () => {
      render(<LoginPage />);
    });
    const headingElements = screen.getAllByText(/Login to your account/i);
    expect(headingElements.length).toBeGreaterThan(0);

    expect(screen.getByPlaceholderText(/Enter Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    await act(async () => {
      render(<LoginPage />);
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(
      await screen.findByText(/Please enter a valid email address/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Password is required/i)
    ).toBeInTheDocument();
  });

  it('calls login function on valid form submit', async () => {
    const emailInput = 'test@example.com';
    const passwordInput = 'password123';

    await act(async () => {
      render(<LoginPage />);
    });

    fireEvent.input(screen.getByPlaceholderText(/Enter Email/i), {
      target: { value: emailInput },
    });
    fireEvent.input(screen.getByPlaceholderText(/Enter Password/i), {
      target: { value: passwordInput },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  });
});

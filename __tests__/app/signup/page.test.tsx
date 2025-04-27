import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import SignUpPage from '@/app/signup/page';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));
jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

describe('SignUpPage', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();
  const mockSignUp = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (useAuth as jest.Mock).mockReturnValue({ signUp: mockSignUp });
    jest.clearAllMocks();
  });

  it('renders the sign-up form correctly', () => {
    render(<SignUpPage />);

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(
      screen.getByText(/Enter your information below/)
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute(
      'href',
      '/login'
    );
  });

  it('displays validation errors for invalid form inputs', async () => {
    render(<SignUpPage />);

    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Name must be at least 2 characters.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please enter a valid email address.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Password must be at least 8 characters.')
      ).toBeInTheDocument();
    });
  });

  it('submits the form successfully with valid inputs', async () => {
    mockSignUp.mockResolvedValueOnce(undefined);
    render(<SignUpPage />);

    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        'John Doe'
      );
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Account created!',
        description: 'You have successfully signed up.',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error toast when sign-up fails', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('Sign up failed'));
    render(<SignUpPage />);

    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    });
  });

  it('disables submit button and shows loading state during submission', async () => {
    mockSignUp.mockReturnValueOnce(new Promise(() => {})); // Never resolves
    render(<SignUpPage />);

    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Creating account...');
  });
});

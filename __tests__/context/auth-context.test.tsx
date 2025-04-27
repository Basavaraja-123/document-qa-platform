import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  mockLogin,
  mockSignUp,
  mockLogout,
  mockGetCurrentUser,
} from '@/lib/mock-services';
import { AuthProvider, useAuth } from '@/context/auth-context';

// Mock the services
jest.mock('@/lib/mock-services');

describe('AuthProvider', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin' as const,
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (mockGetCurrentUser as jest.Mock).mockReset();
    (mockLogin as jest.Mock).mockReset();
    (mockSignUp as jest.Mock).mockReset();
    (mockLogout as jest.Mock).mockReset();
  });

  it('initializes with isLoading true and no user', () => {
    // Mock getCurrentUser to resolve after a delay
    (mockGetCurrentUser as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('isLoading: true')).toBeInTheDocument();
    expect(screen.getByText('user: null')).toBeInTheDocument();
  });

  it('sets user and isLoading false on successful mockGetCurrentUser', async () => {
    (mockGetCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('isLoading: false')).toBeInTheDocument();
      expect(screen.getByText(`user: ${mockUser.name}`)).toBeInTheDocument();
    });
  });

  it('sets user to null and isLoading false on failed mockGetCurrentUser', async () => {
    (mockGetCurrentUser as jest.Mock).mockRejectedValue(new Error('No user'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('isLoading: false')).toBeInTheDocument();
      expect(screen.getByText('user: null')).toBeInTheDocument();
    });
  });

  it('updates user state on successful login', async () => {
    (mockGetCurrentUser as jest.Mock).mockResolvedValue(null);
    (mockLogin as jest.Mock).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('isLoading: false')).toBeInTheDocument();
      expect(screen.getByText('user: null')).toBeInTheDocument();
    });

    // Trigger login
    const loginButton = screen.getByRole('button', { name: 'Login' });
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
      expect(screen.getByText(`user: ${mockUser.name}`)).toBeInTheDocument();
    });
  });

  it('updates user state on successful signUp', async () => {
    (mockGetCurrentUser as jest.Mock).mockResolvedValue(null);
    (mockSignUp as jest.Mock).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('isLoading: false')).toBeInTheDocument();
      expect(screen.getByText('user: null')).toBeInTheDocument();
    });

    // Trigger signUp
    const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
    await userEvent.click(signUpButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'password',
        'Test User'
      );
      expect(screen.getByText(`user: ${mockUser.name}`)).toBeInTheDocument();
    });
  });

  it('clears user state on logout', async () => {
    (mockGetCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (mockLogout as jest.Mock).mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('isLoading: false')).toBeInTheDocument();
      expect(screen.getByText(`user: ${mockUser.name}`)).toBeInTheDocument();
    });

    // Trigger logout
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(screen.getByText('user: null')).toBeInTheDocument();
    });
  });

  it('renders children correctly', () => {
    (mockGetCurrentUser as jest.Mock).mockResolvedValue(null);

    render(
      <AuthProvider>
        <div data-testid="child">Child Content</div>
      </AuthProvider>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
  });
});

describe('useAuth', () => {
  it('throws an error when used outside AuthProvider', () => {
    // Suppress console.error for this test to avoid cluttering output
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleError.mockRestore();
  });

  it('returns context values when used within AuthProvider', async () => {
    (mockGetCurrentUser as jest.Mock).mockResolvedValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('isLoading: false')).toBeInTheDocument();
      expect(screen.getByText('user: null')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Sign Up' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Logout' })
      ).toBeInTheDocument();
    });
  });
});

// Test component to access context and trigger actions
function TestComponent() {
  const { user, isLoading, login, signUp, logout } = useAuth();

  return (
    <div>
      <div>isLoading: {isLoading.toString()}</div>
      <div>user: {user ? user.name : 'null'}</div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button
        onClick={() => signUp('test@example.com', 'password', 'Test User')}
      >
        Sign Up
      </button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

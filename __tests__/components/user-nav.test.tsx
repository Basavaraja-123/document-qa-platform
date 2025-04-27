import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { UserNav } from '@/components/user-nav';

// Mock dependencies
jest.mock('@/context/auth-context');
jest.mock('next/navigation');

describe('UserNav', () => {
  const mockLogout = jest.fn();
  const mockPush = jest.fn();
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('does not render when user is null', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    render(<UserNav />);

    expect(screen.queryByText(mockUser.name)).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-nav-button')).not.toBeInTheDocument();
  });

  it('renders user initial button when user is provided', () => {
    render(<UserNav />);

    const button = screen.getByTestId('user-nav-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('J'); // First letter of "John Doe"
  });

  it('adds and removes mousedown event listener', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(<UserNav />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});

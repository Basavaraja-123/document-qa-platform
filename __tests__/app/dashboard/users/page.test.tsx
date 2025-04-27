import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import UsersPage from '@/app/dashboard/users/page';

// Mock the dependencies
jest.mock('@/context/auth-context');
jest.mock('@/hooks/use-toast');
jest.mock('@/lib/mock-data', () => ({
  mockUsers: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      lastActive: '2023-10-01',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'inactive',
      lastActive: '2023-10-02',
    },
  ],
}));

describe('UsersPage', () => {
  const mockToast = jest.fn();
  const mockUser = { role: 'admin' };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    jest.clearAllMocks();
  });

  it('renders access denied message for non-admin users', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { role: 'user' } });
    render(<UsersPage />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText('You do not have permission to access this page.')
    ).toBeInTheDocument();
  });

  it('renders user management table for admin users', () => {
    render(<UsersPage />);

    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add User/i })
    ).toBeInTheDocument();
  });

  it('filters users based on search term', async () => {
    render(<UsersPage />);

    const searchInput = screen.getByPlaceholderText('Search...');
    await userEvent.type(searchInput, 'John');

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('opens add user dialog when clicking Add User button', async () => {
    render(<UsersPage />);

    const addUserButton = screen.getByRole('button', { name: /Add User/i });
    await userEvent.click(addUserButton);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'user' })).toBeInTheDocument();
  });

  it('shows error toast when adding user with missing fields', async () => {
    render(<UsersPage />);

    const addUserButton = screen.getByRole('button', { name: /Add User/i });
    await userEvent.click(addUserButton);

    const submitButton = screen.getByTestId('submit-user');
    await userEvent.click(submitButton);

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Please fill in all required fields.',
      variant: 'destructive',
    });
  });

  it('adds new user successfully', async () => {
    render(<UsersPage />);

    const addUserButton = screen.getByRole('button', { name: /Add User/i });
    await userEvent.click(addUserButton);

    await userEvent.type(screen.getByLabelText('Name'), 'New User');
    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com');

    const submitButton = screen.getByTestId('submit-user');
    await userEvent.click(submitButton);

    expect(mockToast).toHaveBeenCalledWith({
      title: 'User added',
      description: 'New User has been added successfully.',
    });
  });

  it('deletes user when clicking delete option', async () => {
    render(<UsersPage />);

    const menuButtons = screen.getAllByRole('button', { name: 'Open menu' });
    await userEvent.click(menuButtons[0]);

    const deleteOption = screen.getByText('Delete User');
    await userEvent.click(deleteOption);

    expect(mockToast).toHaveBeenCalledWith({
      title: 'User deleted',
      description: 'The user has been deleted successfully.',
    });
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('changes user role when selecting role option', async () => {
    render(<UsersPage />);

    const menuButtons = screen.getAllByRole('button', { name: 'Open menu' });
    await userEvent.click(menuButtons[1]);

    const setAdminOption = screen.getByText('Set as Admin');
    await userEvent.click(setAdminOption);

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Role updated',
      description: "The user's role has been updated successfully.",
    });
  });

  it('toggles user status when clicking activate/deactivate option', async () => {
    render(<UsersPage />);

    const menuButtons = screen.getAllByRole('button', { name: 'Open menu' });
    await userEvent.click(menuButtons[0]);

    const toggleOption = screen.getByText('Deactivate User');
    await userEvent.click(toggleOption);

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Status updated',
      description: "The user's status has been updated successfully.",
    });
  });

  it('displays no users found when no users match search', async () => {
    render(<UsersPage />);

    const searchInput = screen.getByPlaceholderText('Search...');
    await userEvent.type(searchInput, 'Nonexistent');

    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });
});

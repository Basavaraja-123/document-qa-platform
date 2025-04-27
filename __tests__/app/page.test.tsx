import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Home from '@/app/page';

// Mock dependencies
jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, ...props }) => (
    <button {...props}>{children}</button>
  )),
}));
jest.mock('next/link', () => {
  return jest.fn(({ children, href }) => <a href={href}>{children}</a>);
});

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with DocQA logo', () => {
    render(<Home />);

    expect(screen.getByText('DocQA')).toBeInTheDocument();
  });

  it('renders Login button with correct link', () => {
    render(<Home />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    const loginLink = loginButton.closest('a');
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('renders Sign Up button with correct link in header', () => {
    render(<Home />);

    const signUpButton = screen.getAllByRole('button', { name: /sign up/i })[0];
    expect(signUpButton).toBeInTheDocument();
    const signUpLink = signUpButton.closest('a');
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });

  it('renders main section with title', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        name: /document management & q&a platform/i,
      })
    ).toBeInTheDocument();
  });

  it('renders correct number of buttons', () => {
    render(<Home />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });
});

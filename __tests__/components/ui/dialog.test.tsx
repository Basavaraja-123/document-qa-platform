import { Dialog } from '@/components/ui/dialog';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock lucide-react X icon
jest.mock('lucide-react', () => ({
  X: jest.fn(() => <svg data-testid="x-icon" />),
}));

describe('Dialog', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when open is false', () => {
    render(
      <Dialog open={false} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dialog-overlay')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(
      <Dialog open={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Dialog open={true} onClose={mockOnClose}>
        <div data-testid="child">Child Content</div>
      </Dialog>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
  });

  it('calls onClose when close button is clicked', async () => {
    render(
      <Dialog open={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    const closeButton = screen.getByRole('button');
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the dialog', () => {
    render(
      <Dialog open={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    const overlay = screen.getByTestId('dialog-overlay');
    fireEvent.mouseDown(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the dialog', () => {
    render(
      <Dialog open={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    const dialogContent = screen.getByText('Dialog Content');
    fireEvent.mouseDown(dialogContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when pressing Escape key', () => {
    render(
      <Dialog open={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when pressing other keys', () => {
    render(
      <Dialog open={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('adds and removes mousedown event listener', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(
      <Dialog open={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2); // mousedown and keydown

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2); // mousedown and keydown

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('adds and removes keydown event listener', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(
      <Dialog open={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2); // mousedown and keydown

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2); // mousedown and keydown

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});

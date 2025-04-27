'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef} data-testid="user-nav-button">
      <button
        onClick={() => setOpen(!open)}
        className="h-8 w-8 rounded-full border bg-gray-100 flex items-center justify-center focus:outline-none"
        data-testid="dropdown"
      >
        <span className="text-sm font-bold uppercase">
          {user.name.charAt(0)}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
          <div className="px-4 py-2 text-sm text-gray-700">
            <div>{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          <div className="border-t my-2" />

          <button
            onClick={handleLogout}
            className="w-full cursor text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            data-testid="logout"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

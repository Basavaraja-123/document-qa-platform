'use client';

import type React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Database,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: 'Documents',
      href: '/dashboard/documents',
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: 'Upload',
      href: '/dashboard/upload',
      icon: <Upload className="mr-2 h-4 w-4" />,
    },
    {
      title: 'Collection',
      href: '/dashboard/ingestion',
      icon: <Database className="mr-2 h-4 w-4" />,
    },
    {
      title: 'Q&A',
      href: '/dashboard/qa',
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
    {
      title: 'Users',
      href: '/dashboard/users',
      icon: <Users className="mr-2 h-4 w-4" />,
      adminOnly: true,
    },
  ];

  return (
    <div className="h-full py-6">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Dashboard
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            return (
              <Button
                key={item.href}
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  'w-full justify-start',
                  pathname === item.href
                    ? 'bg-muted hover:bg-muted'
                    : 'hover:bg-transparent hover:underline'
                )}
              >
                <Link href={item.href} className="flex">
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

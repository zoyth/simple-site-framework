// ABOUTME: Breadcrumb navigation component for page hierarchy
// ABOUTME: Provides navigation trail for better UX and SEO

import Link from 'next/link';
import { cn } from '../../lib/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm', className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center space-x-2">
            {item.href && !isLast ? (
              <>
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors opacity-80 hover:opacity-100"
                >
                  {item.label}
                </Link>
                <span className="opacity-60">/</span>
              </>
            ) : (
              <span
                className={cn('font-medium', {
                  'opacity-80': !isLast,
                })}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

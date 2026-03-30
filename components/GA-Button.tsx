'use client';

import React from 'react';
import Link from 'next/link';
import { trackButtonClick } from '@/lib/analytics';

interface GAButtonProps {
  children: React.ReactNode;
  gaEventName: string;
  gaEventData?: Record<string, unknown>;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  type?: 'button' | 'submit' | 'reset';
  [key: string]: unknown;
}

interface GALinkProps {
  children: React.ReactNode;
  href: string;
  gaEventName: string;
  gaEventData?: Record<string, unknown>;
  className?: string;
  [key: string]: unknown;
}

/**
 * GA-enabled button component
 * Automatically tracks button clicks to Google Analytics
 */
export const GAButton = React.forwardRef<HTMLButtonElement, GAButtonProps>(
  (
    {
      children,
      gaEventName,
      gaEventData,
      onClick,
      className = '',
      variant = 'primary',
      type = 'button',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      // Track to GA
      trackButtonClick(gaEventName as string, gaEventData);
      
      // Execute custom handler if provided
      if (onClick) {
        onClick();
      }
    };

    const baseStyles = 'font-semibold transition-colors rounded-lg';
    const variantStyles = {
      primary: 'bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-gray-400',
      secondary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
      outline: 'border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white disabled:opacity-50',
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={handleClick}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GAButton.displayName = 'GAButton';

/**
 * GA-enabled link component
 * Automatically tracks link clicks to Google Analytics
 */
export const GALink = React.forwardRef<HTMLAnchorElement, GALinkProps>(
  (
    { children, href, gaEventName, gaEventData, className = '', ...props },
    ref
  ) => {
    const handleClick = () => {
      trackButtonClick(gaEventName as string, gaEventData);
    };

    return (
      <Link
        ref={ref}
        href={href}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

GALink.displayName = 'GALink';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';

interface NavigationProps {
  onOpenExpenseModal: () => void;
  onOpenProfileModal: () => void;
  studentName?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenExpenseModal,
  onOpenProfileModal,
  studentName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const setMenu = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  // Keyboard and resize handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setMenu(false);
        toggleRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 900 && isOpen) {
        setMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  const handleNavClick = (sectionId: string) => {
    setMenu(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative z-50 w-full px-4 sm:px-8 py-5 max-w-[1240px] mx-auto flex items-center justify-between">
      {/* Brand logo / wordmark */}
      <div className="z-50 relative">
        <Logo showCreator />
      </div>

      {/* Center Navigation Links (Hidden <= 900px) */}
      <nav
        aria-label="Main Navigation"
        className="hidden min-[901px]:flex items-center gap-8 text-[15px] font-medium text-[#5c5c5c]"
      >
        <button
          onClick={() => handleNavClick('track')}
          className="hover:text-[#111111] transition-colors cursor-pointer focus:outline-none focus-visible:underline"
        >
          Track
        </button>
        <button
          onClick={() => handleNavClick('budget')}
          className="hover:text-[#111111] transition-colors cursor-pointer focus:outline-none focus-visible:underline"
        >
          Budget
        </button>
        <button
          onClick={() => handleNavClick('goals')}
          className="hover:text-[#111111] transition-colors cursor-pointer focus:outline-none focus-visible:underline"
        >
          Goals
        </button>
        <button
          onClick={() => handleNavClick('insights')}
          className="hover:text-[#111111] transition-colors cursor-pointer focus:outline-none focus-visible:underline"
        >
          Insights
        </button>
        <button
          onClick={() => handleNavClick('analytics')}
          className="hover:text-[#111111] transition-colors cursor-pointer focus:outline-none focus-visible:underline"
        >
          Analytics
        </button>
      </nav>

      {/* Right Action Stack */}
      <div className="flex items-center gap-3 z-50">
        {/* Profile Pill Trigger */}
        <button
          onClick={onOpenProfileModal}
          id="profile-button"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#5c5c5c] bg-white/70 hover:bg-white hover:text-[#111111] border border-black/5 transition-all shadow-sm"
          title="Student Profile Settings"
          aria-label="Student Profile Settings"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="truncate max-w-[110px]">{studentName || 'Student'}</span>
        </button>

        {/* CTA: Visible on desktop (>900px) and tablet (641-900px), hidden on <=640px */}
        <button
          id="nav-cta"
          onClick={() => {
            onOpenExpenseModal();
          }}
          className="hidden sm:inline-flex min-[641px]:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm shadow-black/10"
        >
          Start Tracking
        </button>

        {/* Mobile Hamburger / X Button (Visible <= 900px) */}
        <button
          ref={toggleRef}
          id="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-menu"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenu(!isOpen)}
          className="min-[901px]:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer shadow-sm transition-transform active:scale-95"
        >
          <span
            className={`block h-0.5 w-5 bg-[#111111] rounded-full transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-[#111111] rounded-full transition-opacity duration-200 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-[#111111] rounded-full transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Fullscreen Menu Panel (#site-menu) */}
      <div
        id="site-menu"
        className={`fixed inset-0 bg-[#eef2ee] z-40 flex flex-col justify-between px-6 pt-28 pb-10 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] min-[901px]:hidden ${
          isOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col gap-6 text-left max-w-sm mx-auto w-full pt-4">
          <span className="text-xs font-semibold tracking-wider text-[#5c5c5c] uppercase">
            Menu Navigation
          </span>
          <button
            onClick={() => handleNavClick('track')}
            className="text-2xl font-medium text-[#111111] text-left hover:opacity-75 transition-opacity"
          >
            Track
          </button>
          <button
            onClick={() => handleNavClick('budget')}
            className="text-2xl font-medium text-[#111111] text-left hover:opacity-75 transition-opacity"
          >
            Budget
          </button>
          <button
            onClick={() => handleNavClick('goals')}
            className="text-2xl font-medium text-[#111111] text-left hover:opacity-75 transition-opacity"
          >
            Goals
          </button>
          <button
            onClick={() => handleNavClick('insights')}
            className="text-2xl font-medium text-[#111111] text-left hover:opacity-75 transition-opacity"
          >
            Insights
          </button>
          <button
            onClick={() => handleNavClick('analytics')}
            className="text-2xl font-medium text-[#111111] text-left hover:opacity-75 transition-opacity"
          >
            Analytics
          </button>
          <button
            onClick={() => {
              setMenu(false);
              onOpenProfileModal();
            }}
            className="text-xl font-medium text-[#5c5c5c] text-left hover:text-[#111111] transition-colors pt-2 border-t border-black/8"
          >
            Student Profile ({studentName || 'Student'})
          </button>
        </div>

        {/* Mobile menu CTA (Always visible in mobile menu, critical for <=640px) */}
        <div className="max-w-sm mx-auto w-full pt-6">
          <button
            id="mobile-menu-cta"
            onClick={() => {
              setMenu(false);
              onOpenExpenseModal();
            }}
            className="w-full py-3.5 px-6 rounded-full text-base font-medium text-white bg-[#111111] hover:bg-[#2b2b2b] active:scale-[0.98] transition-all shadow-md text-center"
          >
            Start Tracking
          </button>
        </div>
      </div>
    </header>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  showCreator?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showCreator = false }) => {
  return (
    <a
      href="#"
      id="brand-logo"
      className={`inline-flex ${showCreator ? 'items-start' : 'items-center'} gap-2.5 text-[#111111] no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-md ${className}`}
      aria-label="StudentSpend Home"
    >
      {/* Minimal abstract geometric mark: two overlapping refined curved geometric leaves/polygons */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-transform duration-300 hover:rotate-6 ${showCreator ? 'mt-[2px] sm:mt-[3px]' : ''}`}
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="16"
          height="16"
          rx="5"
          fill="#111111"
        />
        <circle
          cx="20"
          cy="20"
          r="9"
          fill="#111111"
          fillOpacity="0.82"
        />
        <path
          d="M11 11L21 21"
          stroke="#eef2ee"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col">
        <span className="font-semibold text-[21px] sm:text-[25px] tracking-[-0.02em] leading-none select-none">
          StudentSpend
        </span>
        {showCreator && (
          <span className="text-[11px] font-normal tracking-normal text-[#5c5c5c] leading-tight mt-1 select-none whitespace-nowrap">
            Created by Yojees.R
          </span>
        )}
      </div>
    </a>
  );
};

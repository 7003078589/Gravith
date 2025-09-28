'use client';

import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageTitle({ title, subtitle, className = '' }: PageTitleProps) {
  return (
    <div className={`text-left mb-4 sm:mb-6 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}

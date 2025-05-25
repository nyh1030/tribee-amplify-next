'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, MapPinIcon, RectangleStackIcon, BellIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, MapPinIcon as MapPinIconSolid, RectangleStackIcon as RectangleStackIconSolid, BellIcon as BellIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      path: '/',
      label: '홈',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
    },
    {
      path: '/pick',
      label: '픽',
      subText: 'Pick',
      icon: MapPinIcon,
      activeIcon: MapPinIconSolid,
    },
    {
      path: '/clet',
      label: '클렛',
      subText: 'Clet',
      icon: RectangleStackIcon,
      activeIcon: RectangleStackIconSolid,
    },
    {
      path: '/activity',
      label: '활동',
      icon: BellIcon,
      activeIcon: BellIconSolid,
    },
    {
      path: '/profile',
      label: '프로필',
      icon: UserIcon,
      activeIcon: UserIconSolid,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map((item) => {
            const Icon = isActive(item.path) ? item.activeIcon : item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActive(item.path)
                    ? 'text-pink-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6" />
                <div className="flex flex-col items-center">
                  <span className="text-xs mt-1">{item.label}</span>
                  {item.subText && (
                    <span className="text-[10px] text-gray-400">{item.subText}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 
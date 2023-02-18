import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  return (
    <>
      <div className="fixed mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 z-50">
        <div className="relative flex h-16 justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center"></div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex items-center">
              <Link href="/">
                <a>
                  <Image
                    className="block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                  />
                </a>
              </Link>
              <div className="ml-4 sm:ml-6 sm:flex sm:space-x-8 items-center">
                <Link href="/leaderboard">
                  <a
                    className="border-indigo-500 text-gray-900 text-sm font-medium hover:border-gray-300 hover:text-gray-700"
                    style={{ transition: 'color 0.3s ease' }}
                    onMouseOver={(e) => {
                      const button = e.target as HTMLElement;
                      const rect = button.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const deltaX = (centerX - x) / centerX;
                      const deltaY = (centerY - y) / centerY;
                      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                      const color = `rgba(79, 70, 229, ${distance})`;
                      button.style.color = color;
                    }}
                    onMouseOut={(e) => {
                      const button = e.target as HTMLElement;
                      button.style.color = 'black';
                    }}
                  >
                    Leaderboard
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16 w-full"></div>
    </>
  );
}

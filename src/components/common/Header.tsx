'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthHooks } from '@/services/authHooks';
import { DUMMY_USER } from '@/utils/constants/dummyUser';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { useGetLoggedInUser } = useAuthHooks();
  const { data: userData, isLoading: isLoadingUser, error: userError, isFetching } = useGetLoggedInUser();

  const user = userData?.user || userData?.data || userData;
  const displayUser = user || (userError && !isLoadingUser && !isFetching ? DUMMY_USER : null);
  
  const userName = displayUser 
    ? `${displayUser.firstName || displayUser.first_name || ''} ${displayUser.lastName || displayUser.last_name || ''}`.trim() || 'User'
    : 'Loading...';
  const userInitials = displayUser 
    ? `${(displayUser.firstName || displayUser.first_name || '')?.[0] || ''}${(displayUser.lastName || displayUser.last_name || '')?.[0] || ''}`.toUpperCase() || 'U'
    : '...';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    queryClient.invalidateQueries({ queryKey: ['loggedInUser'] });
    queryClient.clear();
    toast.success('Logged out successfully');
    router.push('/');
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-slate-800 border-b border-slate-700 fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Tasks App</h1>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center rounded-lg transition-colors cursor-pointer"
            >
              {isLoadingUser ? (
                <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {userInitials}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden animate-in slide-in-from-top-2">
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    {isLoadingUser ? (
                      <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {userInitials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {isLoadingUser ? (
                        <>
                          <p className="text-sm font-semibold text-white truncate animate-pulse">Loading...</p>
                          <p className="text-xs text-slate-400 truncate">...</p>
                          <p className="text-xs text-slate-500 capitalize mt-1">...</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-white truncate">{userName}</p>
                          <p className="text-xs text-slate-400 truncate">{displayUser?.email || 'No email'}</p>
                          <p className="text-xs text-slate-500 capitalize mt-1">{(displayUser?.role || displayUser?.userRole || 'USER')?.toLowerCase()}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileRepository } from '@/core/repositories/profile';
import useLocalStorage from './useLocalStorage';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: ProfileRepository | null;
}

export function useAuthCheck() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    profile: null,
  });

  const [profile] = useLocalStorage<ProfileRepository>('Profile', {} as ProfileRepository);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if profile exists and has required properties
        const isValidProfile =
          profile &&
          typeof profile === 'object' &&
          profile.name &&
          profile.name.trim() !== '' &&
          typeof profile.id === 'number' &&
          typeof profile.coin === 'number';

        if (isValidProfile) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            profile: profile,
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            profile: null,
          });
        }
      } catch (error) {
        // Auth check error - log and reset to unauthenticated state
        console.error('Authentication check failed:', error);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          profile: null,
        });
      }
    };

    // Initial check
    checkAuth();
  }, [profile]);

  const redirectToLogin = () => {
    router.push('/login');
  };

  const redirectToHome = () => {
    router.push('/');
  };

  const logout = () => {
    // Clear profile from localStorage
    localStorage.removeItem('Profile');
    setAuthState({
      isLoading: false,
      isAuthenticated: false,
      profile: null,
    });
    redirectToLogin();
  };

  return {
    ...authState,
    redirectToLogin,
    redirectToHome,
    logout,
  };
}

export default useAuthCheck;

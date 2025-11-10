'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useAuthCheck } from '@/presentation/hooks/useAuthCheck';
import AuthRedirectScreen from '@/presentation/components/ui/AuthRedirectScreen';

const MapComponent = dynamic(() => import('@/presentation/components/homepage/homePage'), {
  ssr: false,
});

export default function Homepage() {
  const { isLoading, isAuthenticated, redirectToLogin } = useAuthCheck();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirectToLogin();
    }
  }, [isLoading, isAuthenticated, redirectToLogin]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <AuthRedirectScreen variant="toLogin" />;
  }

  // Show loading screen while redirecting to login
  if (!isAuthenticated) {
    return <AuthRedirectScreen variant="toLogin" />;
  }

  return (
    <div>
      <MapComponent />
    </div>
  );
}

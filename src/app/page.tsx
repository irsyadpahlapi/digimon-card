'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useAuthCheck } from '@/presentation/hooks/useAuthCheck';

const MapComponent = dynamic(() => import('@/presentation/components/homepage/homePage'), {
  ssr: false,
});

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#443c70] via-[#a76050] to-[#f1ba63] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Checking authentication...</p>
      </div>
    </div>
  );
}

export default function Homepage() {
  const { isLoading, isAuthenticated, redirectToLogin } = useAuthCheck();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirectToLogin();
    }
  }, [isLoading, isAuthenticated, redirectToLogin]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show loading screen while redirecting to login
  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <MapComponent />
    </div>
  );
}

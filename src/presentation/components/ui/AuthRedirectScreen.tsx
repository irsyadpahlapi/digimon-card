'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import GradientBackground from './GradientBackground';

interface AuthRedirectScreenProps {
  variant?: 'toHome' | 'toLogin';
  className?: string;
}

export default function AuthRedirectScreen({
  variant = 'toHome',
  className = '',
}: Readonly<AuthRedirectScreenProps>) {
  const router = useRouter();

  const config = {
    toHome: {
      background: 'homepage' as const,
      redirectTo: '/',
      message: 'Redirecting to dashboard...',
    },
    toLogin: {
      background: 'login' as const,
      redirectTo: '/login',
      message: 'Redirecting to login...',
    },
  };

  const { background, redirectTo, message } = config[variant] || config.toHome;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectTo);
    }, 1500);

    return () => clearTimeout(timer);
  }, [router, redirectTo]);

  return (
    <div className={className}>
      <GradientBackground variant={background}>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <LoadingSpinner size="lg" color="white" />
          <p className="text-white text-xl font-semibold mt-6 animate-pulse">{message}</p>
        </div>
      </GradientBackground>
    </div>
  );
}

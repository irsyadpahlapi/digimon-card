'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileRepository } from '@/core/repositories/profile.d';
import useLocalStorage from '@hooks/useLocalStorage';
import { useAuthCheck } from '@/presentation/hooks/useAuthCheck';
import { validateUsername, sanitizeInput } from '@/presentation/hooks/security';
import GradientBackground from '@/presentation/components/ui/gradientBackground';
import LogoBrand from '@/presentation/components/ui/logoBrand';
import FormInput from '@/presentation/components/ui/formInput';
import ActionButton from '@/presentation/components/ui/actionButton';
import AuthRedirectScreen from '@/presentation/components/ui/authRedirectScreen';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setProfile] = useLocalStorage<ProfileRepository>('Profile', {} as ProfileRepository);
  const router = useRouter();
  const { isAuthenticated, redirectToHome } = useAuthCheck();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      redirectToHome();
    }
  }, [isAuthenticated, redirectToHome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;

    // Validate username using security utilities
    const validation = validateUsername(trimmedUsername);
    if (!validation.valid) {
      setError(validation.error ?? 'Invalid username');
      return;
    }

    // Sanitize the username
    const sanitizedUsername = sanitizeInput(trimmedUsername);

    setIsLoading(true);
    setError('');

    setProfile({
      id: Date.now(), // Use timestamp for unique ID
      name: sanitizedUsername,
      coin: 100,
    });

    // Small delay for better UX
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  // Don't render login form if user is already authenticated
  if (isAuthenticated) {
    return <AuthRedirectScreen variant="toHome" />;
  }

  const userIcon = (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const rightArrowIcon = (
    <svg className="w-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );

  return (
    <GradientBackground variant="login" className="relative overflow-hidden">
      {/* Login Container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Title Section */}
          <LogoBrand />

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Username Input */}
              <FormInput
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                label="Username"
                icon={userIcon}
                required
                disabled={isLoading}
              />

              {/* Submit Button */}
              <ActionButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                disabled={!username.trim()}
                loadingText="Logging in..."
                className="w-full"
              >
                <span>Enter the Digital World</span>
                {!isLoading && rightArrowIcon}
              </ActionButton>
            </form>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}

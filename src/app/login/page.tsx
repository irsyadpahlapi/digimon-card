'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProfileRepository } from '@/core/repositories/profile';
import useLocalStorage from '@hooks/useLocalStorage';
import { useAuthCheck } from '@/presentation/hooks/useAuthCheck';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    if (!username.trim()) return;

    setIsLoading(true);

    setProfile({
      id: Date.now(), // Use timestamp for unique ID
      name: username.trim(),
      coin: 100,
    });

    // Small delay for better UX
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  // Don't render login form if user is already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-700 text-lg font-medium">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Subtle Background Decoration */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-200/30 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/30 rounded-full filter blur-3xl opacity-50"></div>

      {/* Login Container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Title Section */}
          <div className="text-center mb-8">
            <div className="inline-block p-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-amber-500 rounded-full mb-6 shadow-2xl relative overflow-hidden">
              {/* Agumon Image - Transparent background version */}
              <div className="w-28 h-28 relative flex items-center justify-center">
                <Image
                  src="/images/rare.png"
                  alt="Agumon"
                  width={112}
                  height={112}
                  className="object-contain drop-shadow-2xl relative z-10 scale-110"
                  priority
                />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-40 rounded-full blur-md"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-2 drop-shadow-lg tracking-tight">
              DigiCard
            </h1>
            <p className="text-orange-700 text-lg font-bold tracking-wide">
              ⚡ ENTER AT YOUR OWN RISK ⚡
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 ml-1"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl hover:from-yellow-600 hover:via-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter the Digital World</span>
                      <svg
                        className="w-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { BACKDROP_EMPTY_STATE, GRADIENT_HOMEPAGE_TEXT } from '@/presentation/styles/gradients';
import { EmptyStateProps } from '@entities/digimon.d';

export default function EmptyState({
  title = 'No Cards Yet!',
  description = 'Your collection is empty. Start your Digimon journey by purchasing a starter pack above!',
  actionText = 'Scroll up to buy a pack',
  totalPacks = 4,
  cardsPerPack = '5-10',
  userCoins = 0,
}: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className={`${BACKDROP_EMPTY_STATE} max-w-2xl w-full text-center`}>
        {/* Animated SVG Illustration */}
        <div className="mb-8 relative">
          <svg
            className="w-64 h-64 mx-auto"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background circle with gradient */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="url(#emptyGradient)"
              className="animate-pulse"
              opacity="0.2"
            />

            {/* Empty box */}
            <rect
              x="60"
              y="70"
              width="80"
              height="60"
              rx="8"
              fill="#f1ba63"
              className="animate-bounce"
              style={{ animationDuration: '2s' }}
            />
            <rect
              x="60"
              y="70"
              width="80"
              height="60"
              rx="8"
              stroke="#643c30"
              strokeWidth="3"
              fill="none"
            />

            {/* Box lid */}
            <path
              d="M55 70 L100 50 L145 70 Z"
              fill="#fbf39b"
              stroke="#643c30"
              strokeWidth="3"
              className="animate-pulse"
            />

            {/* Sparkles */}
            <circle cx="40" cy="60" r="3" fill="#f1ba63" className="animate-ping" />
            <circle
              cx="160"
              cy="80"
              r="3"
              fill="#fbf39b"
              className="animate-ping"
              style={{ animationDelay: '0.5s' }}
            />
            <circle
              cx="50"
              cy="140"
              r="2"
              fill="#a76050"
              className="animate-ping"
              style={{ animationDelay: '1s' }}
            />
            <circle
              cx="150"
              cy="140"
              r="2"
              fill="#443c70"
              className="animate-ping"
              style={{ animationDelay: '1.5s' }}
            />

            {/* Question mark */}
            <text
              x="100"
              y="115"
              fontSize="32"
              fontWeight="bold"
              fill="#643c30"
              textAnchor="middle"
              className="animate-pulse"
            >
              ?
            </text>

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#443c70" />
                <stop offset="50%" stopColor="#a76050" />
                <stop offset="100%" stopColor="#f1ba63" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Text content */}
        <h2 className={`text-3xl font-bold ${GRADIENT_HOMEPAGE_TEXT} mb-4`}>{title}</h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">{description}</p>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2 text-[#643c30]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span className="font-semibold">{actionText}</span>
          </div>
        </div>

        {/* Stats/Info boxes */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#443c70] mb-1">{totalPacks}</div>
            <div className="text-xs text-gray-500">Pack Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#a76050] mb-1">{cardsPerPack}</div>
            <div className="text-xs text-gray-500">Cards per Pack</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#f1ba63] mb-1">{userCoins}</div>
            <div className="text-xs text-gray-500">Your Coins</div>
          </div>
        </div>
      </div>
    </div>
  );
}

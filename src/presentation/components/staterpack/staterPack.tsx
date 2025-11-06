'use client';
import { StarterPackProps } from '@/core/entities/staterPack';
import { borderMap, badgeMap, gradientMap } from '@/presentation/hooks/constant';
import Image from 'next/image';

interface StarterPackComponentProps {
  item: StarterPackProps['item'];
  onBuy?: (item: StarterPackProps['item']) => void;
  isLoading?: boolean;
}

export default function StarterPack({ item, onBuy, isLoading = false }: StarterPackComponentProps) {
  const handleBuyClick = () => {
    onBuy?.(item);
  };

  return (
    <div className="group relative h-full">
      <div
        className={`relative overflow-hidden rounded-2xl border-2 ${
          borderMap[item.type]
        } bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col`}
      >
        {/* Badge Type */}
        <div className="absolute top-4 left-4 z-10">
          <div
            className={`${
              badgeMap[item.type]
            } text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg`}
          >
            {item.type}
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-[#f1ba63] text-[#643c30] px-4 py-2 rounded-full font-bold text-lg shadow-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            {item.price}
          </div>
        </div>

        {/* Gradient Header Background */}
        <div className={`h-48 bg-gradient-to-br ${gradientMap[item.type]} relative`}>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          {/* Image Container */}
          <div className="relative h-full flex items-center justify-center p-4">
            <div className="relative w-[130px] h-[130px]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="130px"
                className="object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-white to-gray-50 flex-1 flex flex-col">
          <h3 className="text-2xl font-bold text-[#643c30] mb-2">{item.name} Pack</h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

          {/* Composition Details */}
          <div className="bg-[#d1c9bc] bg-opacity-30 rounded-lg p-4 mb-4 flex-1">
            <h4 className="text-xs font-semibold text-[#643c30] mb-2 uppercase tracking-wide">
              Pack Contents:
            </h4>
            <div className="space-y-1">
              {item.type === 'C' && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#a76050] rounded-full"></span>
                    <span className="text-[#643c30]">4 Rookie Cards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#443c70] rounded-full"></span>
                    <span className="text-[#643c30]">1 Champion Card</span>
                  </div>
                </>
              )}
              {item.type === 'B' && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#a76050] rounded-full"></span>
                    <span className="text-[#643c30]">2 Rookie Cards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#443c70] rounded-full"></span>
                    <span className="text-[#643c30]">2 Champion Cards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#f1ba63] rounded-full"></span>
                    <span className="text-[#643c30]">1 Ultimate Card</span>
                  </div>
                </>
              )}
              {item.type === 'A' && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#a76050] rounded-full"></span>
                    <span className="text-[#643c30]">1 Rookie Card</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#443c70] rounded-full"></span>
                    <span className="text-[#643c30]">2 Champion Cards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#f1ba63] rounded-full"></span>
                    <span className="text-[#643c30]">2 Ultimate Cards</span>
                  </div>
                </>
              )}
              {item.type === 'R' && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#443c70] rounded-full"></span>
                    <span className="text-[#643c30]">1 Champion Card</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#f1ba63] rounded-full"></span>
                    <span className="text-[#643c30]">3 Ultimate Cards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                    <span className="text-[#643c30]">1 Mega Card</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Buy Button */}
          <button
            type="button"
            onClick={handleBuyClick}
            onTouchStart={() => {}} // Enable touch events for iOS
            disabled={isLoading}
            className={` w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px] touch-manipulation ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#443c70] to-[#a76050] hover:shadow-lg hover:scale-105 active:scale-95 active:bg-gradient-to-r active:from-[#3a3460] active:to-[#965545] cursor-pointer'
            } text-white select-none `}
            style={{
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
          >
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
                <span>Buying...</span>
              </>
            ) : (
              'Buy Now'
            )}
          </button>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700 pointer-events-none"></div>
      </div>
    </div>
  );
}

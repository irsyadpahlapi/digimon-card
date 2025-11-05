'use client';
import Image from 'next/image';
import { DetailDigimonRepository } from '@/core/repositories/myCardRepository';

interface CardProps {
  item: DetailDigimonRepository;
  onClick?: () => void;
}

export default function Card({ item, onClick }: CardProps) {
  const imgSrc = item.images?.[0]?.href || 'https://via.placeholder.com/96x96?text=Digimon';
  const isRare = item.total >= 3;

  return (
    <article
      onClick={onClick}
      className={`relative border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 ${
        isRare
          ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-300 animate-pulse-slow'
          : 'bg-white'
      }`}
    >
      {/* Shimmer effect for rare cards */}
      {isRare && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
      )}

      {/* Total badge */}
      <span
        className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full text-xs font-semibold px-3 py-1 border z-2 ${
          isRare
            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-amber-500 shadow-lg animate-bounce-slow'
            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16Zm1-11a1 1 0 10-2 0v.1a4.5 4.5 0 00-1.7.66C6.6 8.23 6 9.01 6 10c0 .99.6 1.77 1.32 2.25.48.32 1.05.55 1.68.66v1.94c-.39-.13-.68-.32-.84-.5a1 1 0 10-1.51 1.31c.56.65 1.41 1.08 2.35 1.26V16a1 1 0 102 0v-.09c.62-.11 1.2-.34 1.68-.66C13.4 14.76 14 13.99 14 13s-.6-1.76-1.32-2.25A4.5 4.5 0 0011 10.1V8.15c.39.12.68.31.84.5a1 1 0 101.51-1.31c-.56-.65-1.41-1.07-2.35-1.25V7Z" />
        </svg>
        {item.total}
      </span>

      <div className="flex items-start gap-4">
        <div className="w-20 h-20 shrink-0 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
          <Image
            src={imgSrc}
            alt={item.name}
            width={80}
            height={80}
            className="h-full w-full object-contain p-1"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5">{item.category || item.level}</p>

          {/* Meta chips */}
          <div className="mt-2 flex flex-wrap gap-2">
            {item.level && (
              <span className="text-[10px] md:text-xs px-2 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                {item.level}
              </span>
            )}
            {item.type && (
              <span className="text-[10px] md:text-xs px-2 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                {item.type}
              </span>
            )}
            {typeof item.evolution === 'number' && (
              <span className="text-[10px] md:text-xs px-2 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                {item.evolution} Evolution
              </span>
            )}
            {typeof item.starterPack === 'number' && (
              <span className="text-[10px] md:text-xs px-2 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                {item.starterPack} Starter Pack
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

'use client';

import Image from 'next/image';
import { GRADIENT_LOGO_TEXT } from '@/presentation/styles/gradients';

interface LogoBrandProps {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LogoBrand({
  title = 'DigiCard',
  subtitle = '⚡ ENTER AT YOUR OWN RISK ⚡',
  imageSrc = '/images/rare.png',
  imageAlt = 'Agumon',
  size = 'md',
  className = '',
}: Readonly<LogoBrandProps>) {
  const sizes = {
    sm: {
      container: 'p-4 w-20 h-20',
      image: 'w-12 h-12',
      title: 'text-2xl',
      subtitle: 'text-sm',
    },
    md: {
      container: 'p-6 w-28 h-28',
      image: 'w-16 h-16',
      title: 'text-4xl md:text-5xl',
      subtitle: 'text-lg',
    },
    lg: {
      container: 'p-8 w-36 h-36',
      image: 'w-24 h-24',
      title: 'text-5xl md:text-6xl',
      subtitle: 'text-xl',
    },
  };

  const currentSize = sizes[size];

  return (
    <div className={`text-center mb-8 ${className}`}>
      <div className="inline-block bg-gradient-to-br from-yellow-400 via-orange-500 to-amber-500 rounded-full mb-6 shadow-2xl relative overflow-hidden">
        {/* Logo Image */}
        <div className={`${currentSize.container} relative flex items-center justify-center`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={112}
            height={112}
            className={`${currentSize.image} object-contain drop-shadow-2xl relative z-10 scale-110`}
            priority
          />
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-40 rounded-full blur-md"></div>
      </div>

      <h1
        className={`${currentSize.title} font-bold ${GRADIENT_LOGO_TEXT} mb-2 drop-shadow-lg tracking-tight`}
      >
        {title}
      </h1>

      <p className={`${currentSize.subtitle} text-orange-700 font-bold tracking-wide`}>
        {subtitle}
      </p>
    </div>
  );
}

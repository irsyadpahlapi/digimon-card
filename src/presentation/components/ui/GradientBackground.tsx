'use client';

interface GradientBackgroundProps {
  variant: 'homepage' | 'login';
  children: React.ReactNode;
  className?: string;
}

export default function GradientBackground({
  variant,
  children,
  className = '',
}: GradientBackgroundProps) {
  const gradients = {
    homepage: 'bg-gradient-to-br from-[#443c70] via-[#a76050] to-[#f1ba63]',
    login: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
  };

  return (
    <div className={`min-h-screen ${gradients[variant]} ${className}`}>
      {variant === 'login' && (
        <>
          {/* Subtle Background Decoration */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-200/30 rounded-full filter blur-3xl opacity-50"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/30 rounded-full filter blur-3xl opacity-50"></div>
        </>
      )}
      {children}
    </div>
  );
}

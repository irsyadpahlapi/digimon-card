'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/presentation/components/homepage/homePage'), {
  ssr: false,
});

export default function Homepage() {
  return (
    <div>
      <MapComponent />
    </div>
  );
}

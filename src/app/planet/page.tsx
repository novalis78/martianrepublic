'use client';

import { Suspense } from 'react';

export default function PlanetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-2xl font-bold text-center">
          Planet Page - Coming Soon
        </div>
      </div>
    </Suspense>
  );
}
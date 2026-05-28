'use client';

import { useState, useEffect } from 'react';
import RankingContent from './RankingContent';

export default function Ranking() {
  const [mounted, setMounted] = useState(false);

  useEffect(function() {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lista-orange font-bold animate-pulse text-lg">Cargando ranking...</div>
      </div>
    );
  }

  return <RankingContent />;
}

import { useState, useEffect } from 'react';
import { Utensils, Coffee, Wine, Sparkles } from 'lucide-react';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: 'starter' | 'soup' | 'main' | 'dessert' | 'drink' | 'sandwich' | string;
  priority?: boolean;
}

export function FoodImage({
  src,
  alt,
  className = '',
  category = 'main',
}: FoodImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const getCategoryIcon = () => {
    switch (category) {
      case 'drink':
        return <Wine className="w-8 h-8 text-amber-700" />;
      case 'dessert':
        return <Sparkles className="w-8 h-8 text-amber-600" />;
      case 'coffee':
        return <Coffee className="w-8 h-8 text-amber-800" />;
      default:
        return <Utensils className="w-8 h-8 text-blue-900" />;
    }
  };

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50 border border-blue-200 text-center overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        {/* Azulejo corner flourishes */}
        <div className="absolute top-1 left-1 text-blue-400 text-xs font-serif opacity-40 select-none">
          ✦
        </div>
        <div className="absolute top-1 right-1 text-blue-400 text-xs font-serif opacity-40 select-none">
          ✦
        </div>
        <div className="absolute bottom-1 left-1 text-blue-400 text-xs font-serif opacity-40 select-none">
          ✦
        </div>
        <div className="absolute bottom-1 right-1 text-blue-400 text-xs font-serif opacity-40 select-none">
          ✦
        </div>

        <div className="p-3 bg-white/80 rounded-full shadow-sm mb-2 border border-blue-100">
          {getCategoryIcon()}
        </div>
        <p className="font-serif-lisbon font-bold text-blue-950 text-sm leading-snug line-clamp-2">
          {alt}
        </p>
        <span className="text-[11px] font-medium tracking-wide text-amber-900/80 mt-1 uppercase">
          Portuguese Gastronomy
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 isolate ${className}`}
      style={{
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translate3d(0, 0, 0)',
        transform: 'translate3d(0, 0, 0)',
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <Utensils className="w-6 h-6 text-slate-300" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover block"
      />
    </div>
  );
}

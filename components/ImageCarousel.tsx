import React, { useEffect, useState, useRef } from 'react';

interface ImageCarouselProps {
  images: string[];
  width?: number | string;
  height?: number | string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  width = '100%',
  height = 220,
  autoPlay = true,
  autoPlayInterval = 4000
}) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, autoPlayInterval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [autoPlay, autoPlayInterval, images.length]);

  const goTo = (i: number) => {
    setIndex(i % images.length);
  };

  const prev = () => setIndex(prev => (prev - 1 + images.length) % images.length);
  const next = () => setIndex(prev => (prev + 1) % images.length);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full" style={{ maxWidth: width }}>
      <div className="relative overflow-hidden rounded-2xl shadow-md bg-white">
        <div className="w-full h-full">
          <img
            src={images[index]}
            alt={`slide-${index}`}
            className="w-full h-[220px] object-cover block"
            style={{ height: typeof height === 'number' ? `${height}px` : height }}
          />
        </div>

        {/* Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:scale-105 transition-transform"
              aria-label="Précédent"
            >
              ‹
            </button>

            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:scale-105 transition-transform"
              aria-label="Suivant"
            >
              ›
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full ${i === index ? 'bg-electric-600' : 'bg-white/70'} border border-slate-200`}
                  aria-label={`Aller à la diapositive ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

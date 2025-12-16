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
  const [validImages, setValidImages] = useState<string[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay || validImages.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex(prev => (prev + 1) % validImages.length);
    }, autoPlayInterval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [autoPlay, autoPlayInterval, validImages.length]);

  // Preprocess image URLs (encode and check loadability)
  useEffect(() => {
    let mounted = true;
    const encoded = images.map(img => encodeURI(img));
    const checks = encoded.map(url => new Promise<string | null>((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = () => resolve(null);
    }));

    Promise.all(checks).then(results => {
      if (!mounted) return;
      const good = results.filter(Boolean) as string[];
      if (good.length === 0) {
        // No valid images, keep empty to hide the carousel
        setValidImages([]);
      } else {
        setValidImages(good);
      }
      // Reset index if necessary
      setIndex(prev => Math.min(prev, Math.max(0, (good.length - 1))));
    }).catch(() => {
      if (mounted) setValidImages(encoded);
    });

    return () => { mounted = false; };
  }, [images]);

  const goTo = (i: number) => {
    if (validImages.length === 0) return;
    setIndex(i % validImages.length);
  };

  const prev = () => setIndex(prev => (prev - 1 + (validImages.length || 1)) % (validImages.length || 1));
  const next = () => setIndex(prev => (prev + 1) % (validImages.length || 1));

  if (!validImages || validImages.length === 0) return null;

  return (
    <div className="w-full" style={{ maxWidth: width }}>
      <div className="relative overflow-hidden rounded-2xl shadow-md bg-white">
        <div className="w-full h-full">
          <a
            href="https://www.facebook.com/people/CVLM-CI/61584701370592/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ouvrir la page Facebook CVLM-CI"
          >
            <img
              src={validImages[index]}
              alt={`slide-${index}`}
              className="w-full h-[220px] object-cover block"
              style={{ height: typeof height === 'number' ? `${height}px` : height }}
              onError={(e) => {
                // Replace with fallback icon if image cannot be loaded
                (e.currentTarget as HTMLImageElement).src = '/icons/icon-192x192.png';
              }}
            />
          </a>
        </div>

        {/* Controls */}
        {validImages.length > 1 && (
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
              {validImages.map((_, i) => (
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

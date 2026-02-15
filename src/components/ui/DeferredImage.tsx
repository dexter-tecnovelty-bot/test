import { useEffect, useRef, useState } from 'react';

interface DeferredImageProps {
  avifSrc: string;
  webpSrc: string;
  fallbackSrc: string;
  alt: string;
  width: number;
  height: number;
}

const DeferredImage = ({
  avifSrc,
  webpSrc,
  fallbackSrc,
  alt,
  width,
  height,
}: DeferredImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return undefined;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {isVisible ? (
        <picture>
          <source srcSet={avifSrc} type="image/avif" />
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={fallbackSrc}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
      ) : (
        <div className="h-full w-full animate-pulse bg-slate-100" aria-hidden="true" />
      )}
    </div>
  );
};

export default DeferredImage;

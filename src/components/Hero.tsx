import { useEffect, useRef, useState } from 'react';
import Button from './ui/Button';
import Section from './ui/Section';
import { trackCtaClick } from '../services/analytics';

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  onPrimaryCtaClick: () => void;
  onSecondaryCtaClick: () => void;
}

interface DeferredImageProps {
  avifSrc: string;
  webpSrc: string;
  fallbackSrc: string;
  alt: string;
  width: number;
  height: number;
}

const HERO_IMAGE = {
  avif: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?fm=avif&q=70&w=1280&h=720&fit=crop',
  webp: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?fm=webp&q=70&w=1280&h=720&fit=crop',
  fallback:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?fm=jpg&q=75&w=1280&h=720&fit=crop',
} as const;

const SECONDARY_IMAGE = {
  avif: 'https://images.unsplash.com/photo-1551434678-e076c223a692?fm=avif&q=70&w=1280&h=720&fit=crop',
  webp: 'https://images.unsplash.com/photo-1551434678-e076c223a692?fm=webp&q=70&w=1280&h=720&fit=crop',
  fallback:
    'https://images.unsplash.com/photo-1551434678-e076c223a692?fm=jpg&q=75&w=1280&h=720&fit=crop',
} as const;

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
            style={{ aspectRatio: `${width} / ${height}` }}
          />
        </picture>
      ) : (
        <div className="h-full w-full animate-pulse bg-slate-100" aria-hidden="true" />
      )}
    </div>
  );
};

const Hero = ({
  headline,
  subheadline,
  primaryCtaLabel,
  secondaryCtaLabel,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
}: HeroProps) => {
  const handlePrimaryClick = () => {
    trackCtaClick({ location: 'hero', target: 'primary' });
    onPrimaryCtaClick();
  };

  const handleSecondaryClick = () => {
    trackCtaClick({ location: 'hero', target: 'secondary' });
    onSecondaryCtaClick();
  };

  return (
    <Section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <h1 className="max-w-xl text-slate-900">{headline}</h1>
          <p className="mt-5 max-w-2xl text-body text-brand-neutral">{subheadline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={handlePrimaryClick}>
              {primaryCtaLabel}
            </Button>
            <Button variant="ghost" size="lg" onClick={handleSecondaryClick}>
              {secondaryCtaLabel}
            </Button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[640px]">
          <div
            className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl"
            style={{ aspectRatio: '16 / 9' }}
          >
            <picture>
              <source srcSet={HERO_IMAGE.avif} type="image/avif" />
              <source srcSet={HERO_IMAGE.webp} type="image/webp" />
              <img
                src={HERO_IMAGE.fallback}
                alt="Product analytics dashboard preview"
                width={1280}
                height={720}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ aspectRatio: '16 / 9' }}
              />
            </picture>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <DeferredImage
          avifSrc={SECONDARY_IMAGE.avif}
          webpSrc={SECONDARY_IMAGE.webp}
          fallbackSrc={SECONDARY_IMAGE.fallback}
          alt="Team reviewing launch metrics in a workspace"
          width={1280}
          height={720}
        />
      </div>
    </Section>
  );
};

export default Hero;

import { lazy, Suspense, useState } from 'react';
import { Gauge, Lock, Rocket } from 'lucide-react';
import FeatureGrid from './FeatureGrid';
import Footer from './Footer';
import Hero from './Hero';
import LoadingSpinner from './LoadingSpinner';
import PricingTeaser from './PricingTeaser';
import SocialProof from './SocialProof';

type AuthMode = 'signup' | 'login' | 'magic_link';

const AuthModal = lazy(() => import('./AuthModal'));
const VideoModal = lazy(() => import('./VideoModal'));

const featureItems = [
  {
    id: 'reliability',
    title: 'Reliable By Default',
    description: 'Built-in observability and guardrails keep releases stable under real traffic.',
    icon: Lock,
  },
  {
    id: 'velocity',
    title: 'Ship Faster',
    description:
      'Reusable primitives and workflows help teams deliver production features quickly.',
    icon: Rocket,
  },
  {
    id: 'insights',
    title: 'Actionable Insights',
    description: 'Track signup and retention trends with lightweight analytics instrumentation.',
    icon: Gauge,
  },
] as const;

const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
  };

  return (
    <>
      <main>
        <Hero
          headline="Launch Faster With Production-Ready Foundations"
          subheadline="Build secure onboarding, observability, and conversion-ready experiences without starting from zero."
          primaryCtaLabel="Get Started"
          secondaryCtaLabel="Watch Demo"
          onPrimaryCtaClick={() => openAuthModal('signup')}
          onSecondaryCtaClick={() => setIsVideoOpen(true)}
        />
        <div className="defer-render">
          <FeatureGrid items={featureItems} />
        </div>
        <div className="defer-render">
          <SocialProof />
        </div>
        <div className="defer-render">
          <PricingTeaser />
        </div>
      </main>
      <div className="defer-render">
        <Footer />
      </div>

      {isAuthOpen && (
        <Suspense fallback={<LoadingSpinner label="Preparing sign in" />}>
          <AuthModal
            isOpen={isAuthOpen}
            initialMode={authMode}
            onClose={() => setIsAuthOpen(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        </Suspense>
      )}

      {isVideoOpen && (
        <Suspense fallback={<LoadingSpinner label="Loading video" />}>
          <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

export default LandingPage;

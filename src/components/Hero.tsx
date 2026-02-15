import Button from './ui/Button';
import Section from './ui/Section';

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCtaLabel: 'Get Started';
  secondaryCtaLabel: 'Watch Demo';
  onPrimaryCtaClick: () => void;
  onSecondaryCtaClick: () => void;
}

const Hero = ({
  headline,
  subheadline,
  primaryCtaLabel,
  secondaryCtaLabel,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
}: HeroProps) => (
  <Section className="bg-gradient-to-b from-blue-50 to-white">
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
      <div>
        <h1 className="max-w-xl text-slate-900">{headline}</h1>
        <p className="mt-5 max-w-2xl text-body text-brand-neutral">{subheadline}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={onPrimaryCtaClick}>
            {primaryCtaLabel}
          </Button>
          <Button variant="ghost" size="lg" onClick={onSecondaryCtaClick}>
            {secondaryCtaLabel}
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[560px]">
        <svg
          viewBox="0 0 560 420"
          width={560}
          height={420}
          className="h-auto w-full overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl"
          role="img"
          aria-label="Product analytics dashboard preview"
        >
          <rect x="0" y="0" width="560" height="420" fill="#F8FAFC" />
          <rect x="0" y="0" width="560" height="58" fill="#E2E8F0" />
          <circle cx="28" cy="29" r="7" fill="#F59E0B" />
          <circle cx="52" cy="29" r="7" fill="#10B981" />
          <circle cx="76" cy="29" r="7" fill="#3B82F6" />
          <rect x="34" y="96" width="232" height="134" rx="12" fill="#DBEAFE" />
          <rect x="292" y="96" width="232" height="70" rx="12" fill="#D1FAE5" />
          <rect x="292" y="178" width="232" height="52" rx="12" fill="#FDE68A" />
          <rect x="34" y="252" width="490" height="136" rx="12" fill="#FFFFFF" />
          <path
            d="M72 352L144 311L210 334L292 279L356 301L412 274L486 291"
            stroke="#3B82F6"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  </Section>
);

export default Hero;

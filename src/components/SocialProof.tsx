import Section from './ui/Section';

const logoNames = ['Acme', 'Helios', 'Northstar', 'Pulse', 'Crest', 'Stackline'] as const;

const testimonials = [
  {
    quote:
      'We reduced onboarding time by 37% in two sprints and shipped faster without cutting quality.',
    name: 'Avery Chen',
    title: 'Staff Engineer, Acme',
  },
  {
    quote:
      'The launch experience is clean and reliable. Our conversion rate improved within the first month.',
    name: 'Jordan Diaz',
    title: 'Product Lead, Northstar',
  },
] as const;

const stats = [
  { value: '2.1M+', label: 'Monthly API calls' },
  { value: '99.95%', label: 'Platform uptime' },
] as const;

const SocialProof = () => (
  <Section className="bg-slate-50">
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-neutral">
        Trusted by Product and Engineering Teams
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {logoNames.map((name) => (
          <div
            key={name}
            className="flex h-14 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold uppercase tracking-wide text-slate-700"
          >
            {name}
          </div>
        ))}
      </div>
    </div>

    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      {testimonials.map(({ quote, name, title }) => (
        <figure key={name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <blockquote className="text-body text-slate-700">&ldquo;{quote}&rdquo;</blockquote>
          <figcaption className="mt-4">
            <p className="text-sm font-semibold text-slate-900">{name}</p>
            <p className="text-sm text-brand-neutral">{title}</p>
          </figcaption>
        </figure>
      ))}
    </div>

    <div className="mt-10 rounded-xl bg-white p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-brand-neutral">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-brand-neutral">
        Sources: Internal platform telemetry, January 2026.
      </p>
    </div>
  </Section>
);

export default SocialProof;

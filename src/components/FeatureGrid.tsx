import type { ComponentType } from 'react';

import Section from './ui/Section';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

interface FeatureGridProps {
  items: FeatureItem[];
}

const FeatureGrid = ({ items }: FeatureGridProps) => (
  <Section>
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-slate-900">Built for Teams That Move Fast</h2>
      <p className="mt-4 text-body text-brand-neutral">
        Launch confidently with a stack designed for speed, security, and day-one developer
        productivity.
      </p>
    </div>

    <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {items.map(({ id, title, description, icon: Icon }) => (
        <article
          key={id}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          <div className="inline-flex rounded-lg bg-blue-50 p-3 text-brand-primary">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-h3 text-slate-900">{title}</h3>
          <p className="mt-3 text-body text-brand-neutral">{description}</p>
        </article>
      ))}
    </div>
  </Section>
);

export type { FeatureItem, FeatureGridProps };
export default FeatureGrid;

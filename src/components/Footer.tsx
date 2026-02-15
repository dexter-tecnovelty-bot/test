import { useState } from 'react';

import Button from './ui/Button';
import Input from './ui/Input';
import Section from './ui/Section';

const primaryLinks = ['Product', 'Pricing', 'Docs', 'Blog', 'About', 'Careers'] as const;
const supportLinks = ['Support', 'Terms', 'Privacy', 'Status'] as const;
const socialLinks = ['X/Twitter', 'LinkedIn', 'GitHub', 'Discord'] as const;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!emailRegex.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setError('');
    setMessage('Thanks for subscribing. Please check your inbox.');
    setEmail('');
  };

  return (
    <Section className="border-t border-slate-200 bg-slate-50">
      <footer className="space-y-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-slate-900">Company Name</p>
            <p className="mt-3 max-w-sm text-sm text-brand-neutral">
              Production-grade tooling for teams that need high reliability and fast delivery.
            </p>
          </div>

          <nav aria-label="Primary footer links" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {primaryLinks.map((link) => (
              <a
                key={link}
                href="/"
                className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-brand-primary"
              >
                {link}
              </a>
            ))}
          </nav>

          <nav aria-label="Support and legal links" className="grid grid-cols-2 gap-3">
            {supportLinks.map((link) => (
              <a
                key={link}
                href="/"
                className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-brand-primary"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-neutral">
              Follow
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link}
                  href="/"
                  className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-brand-primary"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full rounded-xl border border-slate-200 bg-white p-4"
          >
            <Input
              type="email"
              label="Newsletter"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={error || undefined}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-brand-neutral">Product updates once a week.</p>
              <Button type="submit" size="sm">
                Subscribe
              </Button>
            </div>
            {message && (
              <p className="mt-3 text-sm font-medium text-brand-secondary" role="status">
                {message}
              </p>
            )}
          </form>
        </div>

        <p className="border-t border-slate-200 pt-6 text-sm text-brand-neutral">
          © 2026 [Company Name].
        </p>
      </footer>
    </Section>
  );
};

export default Footer;

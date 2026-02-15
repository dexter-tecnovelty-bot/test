import { useNavigate } from 'react-router-dom';

import Button from './ui/Button';
import Section from './ui/Section';

const plans = [
  {
    name: 'Free',
    summary: 'For early exploration',
    values: ['10k / month', 'Community support', 'Up to 3 seats'],
  },
  {
    name: 'Pro',
    summary: 'For growing teams',
    values: ['250k / month', '24-hour SLA', 'Up to 25 seats'],
  },
  {
    name: 'Enterprise',
    summary: 'For advanced organizations',
    values: ['Custom limits', '1-hour SLA', 'Unlimited seats'],
  },
] as const;

const differentiators = ['API Limits', 'Support SLA', 'Team Seats'] as const;

const PricingTeaser = () => {
  const navigate = useNavigate();

  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-slate-900">Pricing That Scales With You</h2>
        <p className="mt-4 text-body text-brand-neutral">
          Start for free, then upgrade when your traffic and team grow.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Plan</th>
              {plans.map((plan) => (
                <th key={plan.name} className="px-4 py-4 text-left">
                  <p className="text-base font-semibold text-slate-900">{plan.name}</p>
                  <p className="text-sm font-normal text-brand-neutral">{plan.summary}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {differentiators.map((differentiator, index) => (
              <tr key={differentiator} className="border-b border-slate-200 last:border-b-0">
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                  {differentiator}
                </th>
                {plans.map((plan) => (
                  <td
                    key={`${plan.name}-${differentiator}`}
                    className="px-4 py-4 text-sm text-slate-700"
                  >
                    {plan.values[index]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="ghost" onClick={() => navigate('/pricing')}>
          View Full Pricing
        </Button>
        <Button onClick={() => navigate('/signup')}>Get Started</Button>
      </div>
    </Section>
  );
};

export default PricingTeaser;

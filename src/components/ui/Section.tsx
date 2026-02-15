import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  // eslint-disable-next-line react/require-default-props
  className?: string;
}

const Section = ({ className = '', children }: SectionProps) => {
  const sectionClassName = ['py-section-mobile lg:py-section', className].filter(Boolean).join(' ');

  return (
    <section className={sectionClassName}>
      <div className="container-responsive">{children}</div>
    </section>
  );
};

export default Section;

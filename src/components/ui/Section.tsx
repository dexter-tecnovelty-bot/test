import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

const Section = ({ className, children }: SectionProps) => {
  const sectionClassName = ['py-section-mobile lg:py-section', className].filter(Boolean).join(' ');

  return (
    <section className={sectionClassName}>
      <div className="container-responsive">{children}</div>
    </section>
  );
};

Section.defaultProps = {
  className: undefined,
};

export default Section;

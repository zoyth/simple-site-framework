import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStudySection } from './CaseStudySection';
import type { CaseStudy } from './CaseStudySection';

const mockCaseStudy: CaseStudy = {
  id: '1',
  company: 'Test Company',
  quote: 'This product changed our business completely',
  author: {
    name: 'John Doe',
    title: 'CEO',
  },
  metrics: [
    { label: 'Revenue Growth', value: '200%' },
    { label: 'Time Saved', value: '10 hrs/week' },
  ],
};

describe('CaseStudySection', () => {
  it('renders section title and description', () => {
    render(
      <CaseStudySection
        title="Success Stories"
        description="See how our customers succeed"
        caseStudies={[mockCaseStudy]}
      />
    );

    expect(screen.getByText('Success Stories')).toBeInTheDocument();
    expect(screen.getByText('See how our customers succeed')).toBeInTheDocument();
  });

  it('renders case study company name', () => {
    render(<CaseStudySection caseStudies={[mockCaseStudy]} />);

    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('renders case study quote', () => {
    render(<CaseStudySection caseStudies={[mockCaseStudy]} />);

    expect(screen.getByText(/This product changed our business/)).toBeInTheDocument();
  });

  it('renders author information', () => {
    render(<CaseStudySection caseStudies={[mockCaseStudy]} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('CEO')).toBeInTheDocument();
  });

  it('renders metrics when showMetrics is true', () => {
    render(<CaseStudySection caseStudies={[mockCaseStudy]} showMetrics={true} />);

    expect(screen.getByText('200%')).toBeInTheDocument();
    expect(screen.getByText('Revenue Growth')).toBeInTheDocument();
    expect(screen.getByText('10 hrs/week')).toBeInTheDocument();
    expect(screen.getByText('Time Saved')).toBeInTheDocument();
  });

  it('does not render metrics when showMetrics is false', () => {
    render(<CaseStudySection caseStudies={[mockCaseStudy]} showMetrics={false} />);

    expect(screen.queryByText('200%')).not.toBeInTheDocument();
    expect(screen.queryByText('Revenue Growth')).not.toBeInTheDocument();
  });

  it('renders company logo when provided', () => {
    const caseStudyWithLogo = {
      ...mockCaseStudy,
      logo: '/test-logo.png',
    };

    render(<CaseStudySection caseStudies={[caseStudyWithLogo]} />);

    const logo = screen.getByAltText('Test Company logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/test-logo.png');
  });

  it('renders author avatar when provided', () => {
    const caseStudyWithAvatar = {
      ...mockCaseStudy,
      author: {
        ...mockCaseStudy.author!,
        avatar: '/author-avatar.png',
      },
    };

    render(<CaseStudySection caseStudies={[caseStudyWithAvatar]} />);

    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/author-avatar.png');
  });

  it('renders industry when provided', () => {
    const caseStudyWithIndustry = {
      ...mockCaseStudy,
      industry: 'Technology',
    };

    render(<CaseStudySection caseStudies={[caseStudyWithIndustry]} />);

    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders challenge and solution when showDetails is true', () => {
    const caseStudyWithDetails = {
      ...mockCaseStudy,
      challenge: 'Low conversion rates',
      solution: 'Implemented A/B testing',
    };

    render(<CaseStudySection caseStudies={[caseStudyWithDetails]} showDetails={true} />);

    expect(screen.getByText('Challenge')).toBeInTheDocument();
    expect(screen.getByText('Low conversion rates')).toBeInTheDocument();
    expect(screen.getByText('Solution')).toBeInTheDocument();
    expect(screen.getByText('Implemented A/B testing')).toBeInTheDocument();
  });

  it('does not render challenge/solution when showDetails is false', () => {
    const caseStudyWithDetails = {
      ...mockCaseStudy,
      challenge: 'Low conversion rates',
      solution: 'Implemented A/B testing',
    };

    render(<CaseStudySection caseStudies={[caseStudyWithDetails]} showDetails={false} />);

    expect(screen.queryByText('Challenge')).not.toBeInTheDocument();
    expect(screen.queryByText('Solution')).not.toBeInTheDocument();
  });

  it('renders CTA link when url is provided', () => {
    const caseStudyWithURL = {
      ...mockCaseStudy,
      url: '/case-studies/test-company',
      ctaText: 'Read More',
    };

    render(<CaseStudySection caseStudies={[caseStudyWithURL]} />);

    const link = screen.getByRole('link', { name: /Read More/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/case-studies/test-company');
  });

  it('renders default CTA text when not provided', () => {
    const caseStudyWithURL = {
      ...mockCaseStudy,
      url: '/case-studies/test-company',
    };

    render(<CaseStudySection caseStudies={[caseStudyWithURL]} />);

    expect(screen.getByText('Read Full Story')).toBeInTheDocument();
  });

  it('renders multiple case studies in grid layout', () => {
    const caseStudies = [
      { ...mockCaseStudy, id: '1', company: 'Company 1' },
      { ...mockCaseStudy, id: '2', company: 'Company 2' },
      { ...mockCaseStudy, id: '3', company: 'Company 3' },
    ];

    render(<CaseStudySection caseStudies={caseStudies} variant="grid" />);

    expect(screen.getByText('Company 1')).toBeInTheDocument();
    expect(screen.getByText('Company 2')).toBeInTheDocument();
    expect(screen.getByText('Company 3')).toBeInTheDocument();
  });

  it('renders featured layout with first case study prominent', () => {
    const caseStudies = [
      { ...mockCaseStudy, id: '1', company: 'Featured Company' },
      { ...mockCaseStudy, id: '2', company: 'Other Company' },
    ];

    render(<CaseStudySection caseStudies={caseStudies} variant="featured" />);

    expect(screen.getByText('Featured Company')).toBeInTheDocument();
    expect(screen.getByText('Other Company')).toBeInTheDocument();
  });

  it('uses custom CTA renderer when provided', () => {
    const customCTA = (caseStudy: CaseStudy) => (
      <button className="custom-cta">Custom CTA for {caseStudy.company as string}</button>
    );

    render(<CaseStudySection caseStudies={[mockCaseStudy]} renderCTA={customCTA} />);

    expect(screen.getByText('Custom CTA for Test Company')).toBeInTheDocument();
  });

  it('handles localized strings for multi-language support', () => {
    const localizedCaseStudy: CaseStudy = {
      id: '1',
      company: { en: 'Test Company', fr: 'Société Test' },
      quote: { en: 'Great product', fr: 'Excellent produit' },
    };

    const { rerender } = render(
      <CaseStudySection caseStudies={[localizedCaseStudy]} locale="en" />
    );

    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText(/Great product/)).toBeInTheDocument();

    rerender(<CaseStudySection caseStudies={[localizedCaseStudy]} locale="fr" />);

    expect(screen.getByText('Société Test')).toBeInTheDocument();
    expect(screen.getByText(/Excellent produit/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CaseStudySection caseStudies={[mockCaseStudy]} className="custom-class" />
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });
});

// ABOUTME: Comprehensive style guide displaying all brand elements and components
// ABOUTME: Shows colors, typography, buttons, and UI components for design reference

'use client';

import { type Locale } from '../lib/i18n/config';
import { type ThemeConfig } from '../config/theme.schema';
import { type LogoConfig } from '../config/navigation.schema';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Breadcrumb } from './ui/Breadcrumb';
import Image from 'next/image';

export interface StyleGuideProps {
  locale: Locale;
  theme: ThemeConfig;
  logo?: LogoConfig;
  favicon?: string;
}

export function StyleGuide({ locale, theme, logo, favicon }: StyleGuideProps) {
  const colors = theme.brand.colors;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
            {locale === 'fr' ? 'Guide de style' : 'Style Guide'}
          </h1>
          <p className="text-lg text-gray-600 font-body">
            {locale === 'fr'
              ? 'Éléments de design et composants de la marque'
              : 'Brand design elements and components'}
          </p>
        </div>

        {/* Brand Identity */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
            {locale === 'fr' ? 'Identité de marque' : 'Brand Identity'}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Logo */}
            {logo && (
              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 font-heading">
                  Logo
                </h3>
                <div className="bg-white p-8 rounded-lg border border-gray-200 flex items-center justify-center">
                  {logo.image ? (
                    <Image
                      src={logo.image}
                      alt={logo.imageAlt?.[locale] || 'Logo'}
                      width={logo.width || 1674}
                      height={logo.height || 613}
                      className="w-auto"
                      style={{ height: `${logo.displayHeight || 48}px` }}
                    />
                  ) : logo.text ? (
                    <span className="text-2xl font-bold">{logo.text[locale]}</span>
                  ) : (
                    <div className="text-gray-400">No logo configured</div>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  {logo.width && <div>Width: {logo.width}px</div>}
                  {logo.height && <div>Height: {logo.height}px</div>}
                  {logo.displayHeight && (
                    <div>Display Height: {logo.displayHeight}px</div>
                  )}
                </div>
              </Card>
            )}

            {/* Favicon */}
            {favicon && (
              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 font-heading">
                  Favicon
                </h3>
                <div className="bg-white p-8 rounded-lg border border-gray-200 flex items-center justify-center">
                  <Image src={favicon} alt="Favicon" width={64} height={64} />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  32x32px and 64x64px recommended
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
            {locale === 'fr' ? 'Palette de couleurs' : 'Color Palette'}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary */}
            <Card className="p-6">
              <div
                className="w-full h-24 rounded-lg mb-4 flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: colors.primary }}
              >
                Primary
              </div>
              <div className="space-y-1 text-sm">
                <div className="font-medium text-gray-900">Primary</div>
                <div className="font-mono text-gray-600">{colors.primary}</div>
              </div>
            </Card>

            {/* Primary Hover */}
            <Card className="p-6">
              <div
                className="w-full h-24 rounded-lg mb-4 flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: colors.primaryHover }}
              >
                Primary Hover
              </div>
              <div className="space-y-1 text-sm">
                <div className="font-medium text-gray-900">Primary Hover</div>
                <div className="font-mono text-gray-600">{colors.primaryHover}</div>
              </div>
            </Card>

            {/* Primary Light */}
            <Card className="p-6">
              <div
                className="w-full h-24 rounded-lg mb-4 flex items-center justify-center text-gray-900 font-semibold border border-gray-200"
                style={{ backgroundColor: colors.primaryLight }}
              >
                Primary Light
              </div>
              <div className="space-y-1 text-sm">
                <div className="font-medium text-gray-900">Primary Light</div>
                <div className="font-mono text-gray-600">{colors.primaryLight}</div>
              </div>
            </Card>

            {/* Primary Dark */}
            <Card className="p-6">
              <div
                className="w-full h-24 rounded-lg mb-4 flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: colors.primaryDark }}
              >
                Primary Dark
              </div>
              <div className="space-y-1 text-sm">
                <div className="font-medium text-gray-900">Primary Dark</div>
                <div className="font-mono text-gray-600">{colors.primaryDark}</div>
              </div>
            </Card>
          </div>

          {/* Gradients */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 font-heading">
              {locale === 'fr' ? 'Dégradés' : 'Gradients'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div
                  className="w-full h-24 rounded-lg mb-4 flex items-center justify-center text-white font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primaryGradientStart}, ${colors.primaryGradientEnd})`,
                  }}
                >
                  Primary Gradient
                </div>
                <div className="text-sm space-y-1">
                  <div className="font-medium text-gray-900">Primary Gradient</div>
                  <div className="font-mono text-xs text-gray-600">
                    {colors.primaryGradientStart} → {colors.primaryGradientEnd}
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div
                  className="w-full h-24 rounded-lg mb-4 flex items-center justify-center text-white font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${colors.heroGradientStart}, ${colors.heroGradientEnd})`,
                  }}
                >
                  Hero Gradient
                </div>
                <div className="text-sm space-y-1">
                  <div className="font-medium text-gray-900">Hero Gradient</div>
                  <div className="font-mono text-xs text-gray-600">
                    {colors.heroGradientStart} → {colors.heroGradientEnd}
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div
                  className="w-full h-24 rounded-lg mb-4 flex items-center justify-center text-white font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${colors.footerGradientStart}, ${colors.footerGradientEnd})`,
                  }}
                >
                  Footer Gradient
                </div>
                <div className="text-sm space-y-1">
                  <div className="font-medium text-gray-900">Footer Gradient</div>
                  <div className="font-mono text-xs text-gray-600">
                    {colors.footerGradientStart} → {colors.footerGradientEnd}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
            {locale === 'fr' ? 'Typographie' : 'Typography'}
          </h2>

          <Card className="p-8 space-y-8">
            {/* Font Families */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 font-heading">
                {locale === 'fr' ? 'Familles de polices' : 'Font Families'}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Heading: {theme.brand.fonts.heading.family}
                  </div>
                  <div className="text-2xl font-heading">
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Body: {theme.brand.fonts.body.family}
                  </div>
                  <div className="text-lg font-body">
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              </div>
            </div>

            {/* Headings */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 font-heading">
                {locale === 'fr' ? 'Titres' : 'Headings'}
              </h3>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 font-heading">
                  Heading 1 - 4xl Bold
                </h1>
                <h2 className="text-3xl font-bold text-gray-900 font-heading">
                  Heading 2 - 3xl Bold
                </h2>
                <h3 className="text-2xl font-semibold text-gray-900 font-heading">
                  Heading 3 - 2xl Semibold
                </h3>
                <h4 className="text-xl font-semibold text-gray-900 font-heading">
                  Heading 4 - xl Semibold
                </h4>
                <h5 className="text-lg font-medium text-gray-900 font-heading">
                  Heading 5 - lg Medium
                </h5>
                <h6 className="text-base font-medium text-gray-900 font-heading">
                  Heading 6 - base Medium
                </h6>
              </div>
            </div>

            {/* Body Text */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 font-heading">
                {locale === 'fr' ? 'Corps de texte' : 'Body Text'}
              </h3>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 font-body">
                  Large body text - Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
                <p className="text-base text-gray-700 font-body">
                  Regular body text - Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
                <p className="text-sm text-gray-600 font-body">
                  Small body text - Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
                <p className="text-xs text-gray-500 font-body">
                  Extra small body text - Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
            {locale === 'fr' ? 'Boutons' : 'Buttons'}
          </h2>

          <Card className="p-8">
            <div className="space-y-8">
              {/* Outlined Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 font-heading">
                  Outlined (Default)
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outlined" size="sm">
                    Small Button
                  </Button>
                  <Button variant="outlined" size="md">
                    Medium Button
                  </Button>
                  <Button variant="outlined" size="lg">
                    Large Button
                  </Button>
                </div>
              </div>

              {/* Filled Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 font-heading">
                  Filled
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="filled" size="sm">
                    Small Button
                  </Button>
                  <Button variant="filled" size="md">
                    Medium Button
                  </Button>
                  <Button variant="filled" size="lg">
                    Large Button
                  </Button>
                </div>
              </div>

              {/* Text Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 font-heading">
                  Text
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="text" size="sm">
                    Small Button
                  </Button>
                  <Button variant="text" size="md">
                    Medium Button
                  </Button>
                  <Button variant="text" size="lg">
                    Large Button
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Form Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
            {locale === 'fr' ? 'Composants de formulaire' : 'Form Components'}
          </h2>

          <Card className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Input
              </label>
              <Input type="text" placeholder="Enter text..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Input
              </label>
              <Input type="email" placeholder="email@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Textarea
              </label>
              <Textarea placeholder="Enter message..." rows={4} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disabled Input
              </label>
              <Input type="text" placeholder="Disabled" disabled />
            </div>
          </Card>
        </section>

        {/* UI Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
            {locale === 'fr' ? 'Composants UI' : 'UI Components'}
          </h2>

          <div className="space-y-8">
            {/* Card */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 font-heading">
                Card
              </h3>
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 font-heading">
                  Card Title
                </h4>
                <p className="text-gray-600 font-body">
                  This is a card component with padding and rounded corners. It can
                  contain any content.
                </p>
              </Card>
            </div>

            {/* Breadcrumb */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 font-heading">
                Breadcrumb
              </h3>
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Category', href: '/category' },
                  { label: 'Current Page' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Spacing Scale */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
            {locale === 'fr' ? 'Échelle d\'espacement' : 'Spacing Scale'}
          </h2>

          <Card className="p-8">
            <div className="space-y-4">
              {[1, 2, 4, 6, 8, 12, 16, 24, 32].map((size) => (
                <div key={size} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-600 font-mono">
                    {size * 4}px
                  </div>
                  <div
                    className="h-8 bg-primary"
                    style={{ width: `${size * 4}px` }}
                  />
                  <div className="text-sm text-gray-600">
                    {size === 1 && 'px-1, py-1, gap-1'}
                    {size === 2 && 'px-2, py-2, gap-2'}
                    {size === 4 && 'px-4, py-4, gap-4'}
                    {size === 6 && 'px-6, py-6, gap-6'}
                    {size === 8 && 'px-8, py-8, gap-8'}
                    {size === 12 && 'px-12, py-12, gap-12'}
                    {size === 16 && 'px-16, py-16, gap-16'}
                    {size === 24 && 'px-24, py-24, gap-24'}
                    {size === 32 && 'px-32, py-32, gap-32'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

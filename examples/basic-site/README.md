# Basic Site Example

A minimal example showing how to use the Simple Site Framework.

## Quick Start

```bash
# Create a new Next.js project
npx create-next-app@latest my-site --typescript --tailwind --app

cd my-site

# Install the framework
npm install @zoyth/simple-site-framework

# Install peer dependencies
npm install framer-motion lucide-react react-hook-form @hookform/resolvers zod
```

## Project Structure

```
my-site/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── config/
│       ├── theme.ts
│       ├── content.ts
│       └── navigation.ts
├── public/
│   └── logo.png
└── tailwind.config.ts
```

## Configuration Files

See the example configuration files in this directory for reference implementations.

## Key Components

This example demonstrates:
- Theme configuration
- Content configuration (bilingual)
- Navigation setup
- Using HeroSection, ServicesSection, ContactSection
- Header and Footer layout
- Language switching

## Run the Example

```bash
npm run dev
```

Visit http://localhost:3000 to see the site.

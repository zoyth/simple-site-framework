# Simple Site Framework CLI

Command-line tools for scaffolding and managing Simple Site Framework projects.

## Installation

The CLI tools are included with the framework package.

## Commands

### Create a New Project

```bash
npx create-simple-site my-site
```

**Interactive Setup:**
- Choose from 5 project templates
- Configure theme (colors, fonts)
- Set supported locales (EN/FR)
- Enter company information
- Auto-install dependencies
- Initialize git repository

**Templates:**
- **Service Business** - Professional services (law, consulting, accounting)
- **SaaS** - Software-as-a-service marketing site
- **Portfolio** - Personal or agency portfolio
- **Blog** - Content-focused blog
- **Blank** - Minimal starter

**Options:**
```bash
npx create-simple-site my-site --template saas
npx create-simple-site my-site --skip-install
npx create-simple-site my-site --skip-git
```

### Add Components

Add component examples to your project:

```bash
npx simple-site add <component>
```

**Examples:**
```bash
npx simple-site add pricing
npx simple-site add testimonials
npx simple-site add faq
npx simple-site add contact-form
```

Creates example usage in `examples/<component>-example.tsx`

### Create Sections

Generate new section boilerplate:

```bash
npx simple-site section <name>
```

**Examples:**
```bash
npx simple-site section team
npx simple-site section services
```

Creates section in `app/sections/<name>.tsx`

### Create Pages

Generate new page boilerplate:

```bash
npx simple-site page <path>
```

**Examples:**
```bash
npx simple-site page about
npx simple-site page services/consulting
```

Creates page in `app/<path>/page.tsx`

### List Components

View all available components:

```bash
npx simple-site list
```

Shows components organized by category:
- Layout (Hero, Features, Header, Footer)
- Conversion (Pricing, Testimonials, Stats, etc.)
- Content (FAQ, Blog, Timeline, Tabs, etc.)
- Forms (Contact, Multi-step, Upload, etc.)
- UI (Button, Modal, Toast, etc.)

### Search Components

Search for components:

```bash
npx simple-site search pricing
npx simple-site search form
```

### Configuration Wizard

Interactive configuration:

```bash
npx simple-site config
```

**Configuration Options:**
- Update theme colors
- Change fonts
- Modify company info

## Project Structure

Generated projects follow this structure:

```
my-site/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── sections/        # Custom sections
├── config/
│   └── theme.ts         # Theme configuration
├── examples/            # Component examples (from 'add' command)
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Next Steps

After creating a project:

```bash
cd my-site
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## Requirements

- Node.js 18+
- npm 9+

## Help

For help with any command:

```bash
npx create-simple-site --help
npx simple-site --help
npx simple-site add --help
```

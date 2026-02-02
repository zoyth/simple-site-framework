#!/usr/bin/env node

/**
 * simple-site CLI tool
 * Add components, configure settings, and manage your project
 */

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');

const program = new Command();

program
  .name('simple-site')
  .description('Simple Site Framework CLI')
  .version('0.1.0');

// Add component command
program
  .command('add <component>')
  .description('Add a component to your project')
  .action(async (component) => {
    try {
      await addComponent(component);
    } catch (error) {
      console.error(chalk.red('\n✖ Error:'), error.message);
      process.exit(1);
    }
  });

// Add section command
program
  .command('section <name>')
  .alias('add-section')
  .description('Add a new section to your project')
  .action(async (name) => {
    try {
      await addSection(name);
    } catch (error) {
      console.error(chalk.red('\n✖ Error:'), error.message);
      process.exit(1);
    }
  });

// Add page command
program
  .command('page <path>')
  .alias('add-page')
  .description('Add a new page to your project')
  .action(async (pagePath) => {
    try {
      await addPage(pagePath);
    } catch (error) {
      console.error(chalk.red('\n✖ Error:'), error.message);
      process.exit(1);
    }
  });

// List components command
program
  .command('list')
  .description('List available components')
  .action(() => {
    listComponents();
  });

// Search components command
program
  .command('search <query>')
  .description('Search for components')
  .action((query) => {
    searchComponents(query);
  });

// Configuration wizard
program
  .command('config')
  .description('Interactive configuration wizard')
  .action(async () => {
    try {
      await configWizard();
    } catch (error) {
      console.error(chalk.red('\n✖ Error:'), error.message);
      process.exit(1);
    }
  });

// Migration command
program
  .command('migrate')
  .description('Run migration tasks (e.g., migrate i18n)')
  .argument('[task]', 'Migration task to run (i18n)')
  .option('--dry-run', 'Preview changes without writing files')
  .action(async (task, options) => {
    try {
      if (!task || task === 'i18n') {
        await migrateI18n(options);
      } else {
        console.log(chalk.yellow(`\n⚠ Unknown migration task: ${task}`));
        console.log(chalk.gray('Available migrations: i18n\n'));
      }
    } catch (error) {
      console.error(chalk.red('\n✖ Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();

// Component registry
const COMPONENTS = {
  // Layout
  'hero': { category: 'Layout', name: 'HeroSection', description: 'Hero section with CTA' },
  'features': { category: 'Layout', name: 'FeaturesGrid', description: 'Features grid display' },
  'footer': { category: 'Layout', name: 'Footer', description: 'Site footer' },
  'header': { category: 'Layout', name: 'Header', description: 'Site header with navigation' },

  // Conversion
  'pricing': { category: 'Conversion', name: 'PricingTable', description: 'Pricing comparison table' },
  'testimonials': { category: 'Conversion', name: 'TestimonialCarousel', description: 'Customer testimonials carousel' },
  'stats': { category: 'Conversion', name: 'StatsSection', description: 'Statistics with animated counters' },
  'trust-badges': { category: 'Conversion', name: 'TrustBadges', description: 'Trust and credibility badges' },
  'countdown': { category: 'Conversion', name: 'CountdownTimer', description: 'Countdown timer for urgency' },
  'exit-intent': { category: 'Conversion', name: 'ExitIntentModal', description: 'Exit intent modal' },

  // Content
  'faq': { category: 'Content', name: 'FAQAccordion', description: 'FAQ accordion' },
  'blog-card': { category: 'Content', name: 'BlogCard', description: 'Blog post preview card' },
  'timeline': { category: 'Content', name: 'Timeline', description: 'Timeline for history/process' },
  'comparison': { category: 'Content', name: 'ComparisonTable', description: 'Feature comparison table' },
  'tabs': { category: 'Content', name: 'Tabs', description: 'Tabbed content with URL sync' },

  // Forms
  'contact-form': { category: 'Forms', name: 'ContactSection', description: 'Contact form section' },
  'multi-step-form': { category: 'Forms', name: 'MultiStepForm', description: 'Multi-step form with validation' },
  'file-upload': { category: 'Forms', name: 'FileUpload', description: 'File upload with drag & drop' },
  'select': { category: 'Forms', name: 'Select', description: 'Dropdown select' },
  'checkbox': { category: 'Forms', name: 'Checkbox', description: 'Checkbox input' },
  'radio': { category: 'Forms', name: 'Radio', description: 'Radio button input' },

  // UI
  'button': { category: 'UI', name: 'Button', description: 'Button component' },
  'modal': { category: 'UI', name: 'Modal', description: 'Modal dialog' },
  'toast': { category: 'UI', name: 'Toast', description: 'Toast notifications' },
  'loading': { category: 'UI', name: 'LoadingSpinner', description: 'Loading spinner' },
  'skeleton': { category: 'UI', name: 'Skeleton', description: 'Skeleton loader' }
};

async function addComponent(componentKey) {
  const component = COMPONENTS[componentKey.toLowerCase()];

  if (!component) {
    console.log(chalk.yellow(`\n⚠ Component "${componentKey}" not found.\n`));
    console.log(chalk.gray('Run `simple-site list` to see available components'));
    return;
  }

  const spinner = ora(`Adding ${component.name}...`).start();

  try {
    // Check if we're in a project directory
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      spinner.fail('Not in a project directory');
      console.log(chalk.yellow('\nRun this command from your project root directory'));
      return;
    }

    // Create component usage example
    const examplePath = path.join(process.cwd(), 'examples', `${componentKey}-example.tsx`);
    fs.ensureDirSync(path.dirname(examplePath));

    const exampleCode = generateComponentExample(component.name, componentKey);
    fs.writeFileSync(examplePath, exampleCode);

    spinner.succeed(`Added ${component.name}!`);
    console.log(chalk.green(`\n✓ Example created: examples/${componentKey}-example.tsx`));
    console.log(chalk.gray(`\nImport with: import { ${component.name} } from '@zoyth/simple-site-framework/components'\n`));

  } catch (error) {
    spinner.fail('Failed to add component');
    throw error;
  }
}

function generateComponentExample(componentName, key) {
  const examples = {
    'HeroSection': `import { HeroSection } from '@zoyth/simple-site-framework/components'

export function HeroExample() {
  return (
    <HeroSection
      title={{ en: "Welcome to Our Site", fr: "Bienvenue sur notre site" }}
      subtitle="Build amazing websites with Simple Site Framework"
      primaryCTA={{
        label: "Get Started",
        href: "/contact"
      }}
      locale="en"
    />
  )
}`,
    'PricingTable': `import { PricingTable } from '@zoyth/simple-site-framework/components'

export function PricingExample() {
  return (
    <PricingTable
      tiers={[
        {
          name: { en: "Basic", fr: "Basique" },
          price: { monthly: 29, annual: 290 },
          features: [
            { name: "Feature 1", included: true },
            { name: "Feature 2", included: true },
            { name: "Feature 3", included: false }
          ],
          cta: { label: "Get Started", href: "/signup" }
        }
      ]}
      locale="en"
    />
  )
}`
  };

  return examples[componentName] || `import { ${componentName} } from '@zoyth/simple-site-framework/components'

export function ${componentName}Example() {
  return (
    <${componentName} />
  )
}`;
}

async function addSection(name) {
  const spinner = ora(`Creating section ${name}...`).start();

  try {
    const sectionPath = path.join(process.cwd(), 'app', 'sections', `${name}.tsx`);
    fs.ensureDirSync(path.dirname(sectionPath));

    const sectionCode = `export function ${capitalize(name)}Section() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">${capitalize(name)}</h2>
        {/* Add your content here */}
      </div>
    </section>
  )
}`;

    fs.writeFileSync(sectionPath, sectionCode);

    spinner.succeed(`Created ${name} section!`);
    console.log(chalk.green(`\n✓ Section created: app/sections/${name}.tsx\n`));

  } catch (error) {
    spinner.fail('Failed to create section');
    throw error;
  }
}

async function addPage(pagePath) {
  const spinner = ora(`Creating page ${pagePath}...`).start();

  try {
    const fullPath = path.join(process.cwd(), 'app', pagePath, 'page.tsx');
    fs.ensureDirSync(path.dirname(fullPath));

    const pageCode = `export default function ${capitalize(path.basename(pagePath))}Page() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">${capitalize(path.basename(pagePath))}</h1>
        {/* Add your content here */}
      </div>
    </main>
  )
}`;

    fs.writeFileSync(fullPath, pageCode);

    spinner.succeed(`Created page!`);
    console.log(chalk.green(`\n✓ Page created: app/${pagePath}/page.tsx\n`));

  } catch (error) {
    spinner.fail('Failed to create page');
    throw error;
  }
}

function listComponents() {
  console.log(chalk.bold.cyan('\n📦 Available Components\n'));

  const byCategory = {};
  for (const [key, component] of Object.entries(COMPONENTS)) {
    if (!byCategory[component.category]) {
      byCategory[component.category] = [];
    }
    byCategory[component.category].push({ key, ...component });
  }

  for (const [category, components] of Object.entries(byCategory)) {
    console.log(chalk.bold(`\n${category}:`));
    components.forEach(comp => {
      console.log(chalk.gray(`  ${comp.key.padEnd(20)} ${comp.description}`));
    });
  }

  console.log(chalk.gray(`\nUse: simple-site add <component>`));
  console.log(chalk.gray(`Example: simple-site add pricing\n`));
}

function searchComponents(query) {
  const results = Object.entries(COMPONENTS).filter(([key, comp]) =>
    key.includes(query.toLowerCase()) ||
    comp.name.toLowerCase().includes(query.toLowerCase()) ||
    comp.description.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) {
    console.log(chalk.yellow(`\n⚠ No components found matching "${query}"\n`));
    return;
  }

  console.log(chalk.bold.cyan(`\n🔍 Search Results for "${query}":\n`));
  results.forEach(([key, comp]) => {
    console.log(chalk.bold(`  ${key}`));
    console.log(chalk.gray(`    ${comp.description}`));
    console.log(chalk.gray(`    Category: ${comp.category}\n`));
  });
}

async function configWizard() {
  console.log(chalk.bold.cyan('\n⚙️  Configuration Wizard\n'));

  const configPath = path.join(process.cwd(), 'config', 'theme.ts');

  if (!fs.existsSync(configPath)) {
    console.log(chalk.yellow('⚠ No config/theme.ts found'));
    console.log(chalk.gray('Make sure you\'re in a Simple Site project directory\n'));
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to configure?',
      choices: [
        'Update theme colors',
        'Change fonts',
        'Modify company info',
        'Exit'
      ]
    }
  ]);

  if (answers.action === 'Exit') {
    return;
  }

  if (answers.action === 'Update theme colors') {
    const colorAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'primary',
        message: 'Primary color (hex):',
        validate: (input) => /^#[0-9A-F]{6}$/i.test(input) || 'Please enter a valid hex color'
      }
    ]);

    const spinner = ora('Updating theme...').start();

    try {
      let themeContent = fs.readFileSync(configPath, 'utf-8');
      themeContent = themeContent.replace(
        /(primary:\s*['"])#[0-9A-F]{6}/gi,
        `$1${colorAnswers.primary}`
      );
      fs.writeFileSync(configPath, themeContent);
      spinner.succeed('Theme updated!');
    } catch (error) {
      spinner.fail('Failed to update theme');
      throw error;
    }
  }

  console.log(chalk.green('\n✓ Configuration complete!\n'));
}

async function migrateI18n(options = {}) {
  const isDryRun = options.dryRun;

  console.log(chalk.bold.cyan('\n🌐 i18n Migration Tool\n'));

  if (isDryRun) {
    console.log(chalk.yellow('Running in DRY RUN mode - no files will be modified\n'));
  }

  // Check if we're in a project directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log(chalk.red('✖ Not in a project directory'));
    console.log(chalk.gray('Run this command from your project root directory\n'));
    return;
  }

  // Check if i18n config already exists
  const i18nConfigPath = path.join(process.cwd(), 'src', 'config', 'i18n.ts');
  if (fs.existsSync(i18nConfigPath) && !isDryRun) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'i18n configuration already exists. Overwrite?',
        default: false
      }
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('\n⚠ Migration cancelled\n'));
      return;
    }
  }

  // Prompt for configuration
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'locales',
      message: 'Select languages to support:',
      choices: [
        { name: 'English (en)', value: 'en', checked: true },
        { name: 'French (fr)', value: 'fr', checked: true },
        { name: 'Spanish (es)', value: 'es' },
        { name: 'German (de)', value: 'de' },
        { name: 'Italian (it)', value: 'it' },
        { name: 'Portuguese (pt)', value: 'pt' },
        { name: 'Japanese (ja)', value: 'ja' },
        { name: 'Chinese (zh)', value: 'zh' },
        { name: 'Arabic (ar)', value: 'ar' },
        { name: 'Hebrew (he)', value: 'he' }
      ],
      validate: (input) => input.length > 0 || 'Select at least one language'
    },
    {
      type: 'list',
      name: 'defaultLocale',
      message: 'Select default language:',
      choices: (answers) => answers.locales
    },
    {
      type: 'list',
      name: 'localePrefix',
      message: 'Choose URL prefix mode:',
      choices: [
        {
          name: 'as-needed (default locale has no prefix) - Recommended',
          value: 'as-needed'
        },
        {
          name: 'always (all locales have prefix)',
          value: 'always'
        },
        {
          name: 'never (no prefixes, cookie/header only)',
          value: 'never'
        }
      ],
      default: 'as-needed'
    },
    {
      type: 'confirm',
      name: 'localeDetection',
      message: 'Enable automatic browser language detection?',
      default: true
    }
  ]);

  // Check if RTL locales were selected
  const rtlLocales = answers.locales.filter(locale => ['ar', 'he', 'fa', 'ur'].includes(locale));

  const spinner = ora('Creating i18n configuration...').start();

  try {
    const files = [];

    // 1. Create i18n configuration file
    const i18nConfig = generateI18nConfig(answers, rtlLocales);
    if (!isDryRun) {
      fs.ensureDirSync(path.dirname(i18nConfigPath));
      fs.writeFileSync(i18nConfigPath, i18nConfig);
    }
    files.push({ path: 'src/config/i18n.ts', status: 'created' });

    // 2. Create middleware file
    const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
    const middlewareExists = fs.existsSync(middlewarePath);

    if (middlewareExists) {
      files.push({ path: 'src/middleware.ts', status: 'already exists - please update manually' });
    } else {
      const middlewareCode = generateMiddleware();
      if (!isDryRun) {
        fs.writeFileSync(middlewarePath, middlewareCode);
      }
      files.push({ path: 'src/middleware.ts', status: 'created' });
    }

    // 3. Check layout file
    const layoutPath = path.join(process.cwd(), 'src', 'app', '[locale]', 'layout.tsx');
    if (fs.existsSync(layoutPath)) {
      files.push({
        path: 'src/app/[locale]/layout.tsx',
        status: 'exists - add setI18nConfig() call manually'
      });
    } else {
      files.push({
        path: 'src/app/[locale]/layout.tsx',
        status: 'not found - create [locale] route directory'
      });
    }

    spinner.succeed('i18n configuration created!');

    // Show summary
    console.log(chalk.bold.green('\n✓ Migration complete!\n'));
    console.log(chalk.bold('Files:\n'));
    files.forEach(file => {
      const icon = file.status.includes('created') ? '✓' :
                   file.status.includes('exists') ? '●' : '○';
      const color = file.status.includes('created') ? chalk.green :
                    file.status.includes('exists') ? chalk.yellow :
                    chalk.gray;
      console.log(color(`  ${icon} ${file.path}`));
      if (!file.status.includes('created')) {
        console.log(chalk.gray(`    ${file.status}`));
      }
    });

    // Show next steps
    console.log(chalk.bold('\nNext steps:\n'));
    console.log(chalk.gray('1. Review generated files in src/config/i18n.ts'));

    if (middlewareExists) {
      console.log(chalk.gray('2. Update src/middleware.ts with:'));
      console.log(chalk.gray('   import { createI18nMiddleware } from \'simple-site-framework/lib/i18n\';'));
      console.log(chalk.gray('   import { i18nConfig } from \'./src/config/i18n\';'));
      console.log(chalk.gray('   export default createI18nMiddleware(i18nConfig);'));
    } else {
      console.log(chalk.gray('2. Middleware created automatically ✓'));
    }

    console.log(chalk.gray('3. Add to src/app/[locale]/layout.tsx:'));
    console.log(chalk.gray('   import { setI18nConfig } from \'simple-site-framework/lib/i18n\';'));
    console.log(chalk.gray('   import { i18nConfig } from \'@/config/i18n\';'));
    console.log(chalk.gray('   setI18nConfig(i18nConfig); // At top level'));
    console.log(chalk.gray('4. See docs/i18n/MIGRATION.md for complete migration guide'));
    console.log('');

  } catch (error) {
    spinner.fail('Migration failed');
    throw error;
  }
}

function generateI18nConfig(answers, rtlLocales) {
  const { locales, defaultLocale, localePrefix, localeDetection } = answers;

  // Generate locale names
  const localeNameMap = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    ja: '日本語',
    zh: '中文',
    ar: 'العربية',
    he: 'עברית'
  };

  const localeNames = locales.reduce((acc, locale) => {
    acc[locale] = localeNameMap[locale] || locale.toUpperCase();
    return acc;
  }, {});

  const localeLabels = locales.reduce((acc, locale) => {
    acc[locale] = locale.toUpperCase();
    return acc;
  }, {});

  const localesArray = JSON.stringify(locales, null, 2).replace(/"/g, "'");
  const localeNamesStr = JSON.stringify(localeNames, null, 4).replace(/"/g, "'");
  const localeLabelsStr = JSON.stringify(localeLabels, null, 4).replace(/"/g, "'");

  let configContent = `// ABOUTME: i18n configuration
// ABOUTME: Internationalization settings for the application

import type { I18nConfig } from 'simple-site-framework/lib/i18n';

export const i18nConfig: I18nConfig = {
  // Supported languages
  locales: ${localesArray},

  // Default language
  defaultLocale: '${defaultLocale}',

  // Locale prefix mode:
  // 'as-needed' - default locale has no prefix, others do (recommended)
  // 'always' - all URLs have locale prefix
  // 'never' - no locale prefixes (cookie/header detection only)
  localePrefix: '${localePrefix}',

  // Enable browser language detection
  localeDetection: ${localeDetection},

  // Display names for language selector
  localeNames: ${localeNamesStr},

  // Short labels for compact display
  localeLabels: ${localeLabelsStr},`;

  if (rtlLocales.length > 0) {
    const rtlArray = JSON.stringify(rtlLocales, null, 2).replace(/"/g, "'");
    configContent += `

  // Right-to-left languages
  rtlLocales: ${rtlArray},`;
  }

  configContent += `
};
`;

  return configContent;
}

function generateMiddleware() {
  return `// ABOUTME: Middleware configuration
// ABOUTME: Handles i18n routing and locale detection

import { createI18nMiddleware } from 'simple-site-framework/lib/i18n';
import { i18nConfig } from './src/config/i18n';

export default createI18nMiddleware(i18nConfig);

export const config = {
  // Exclude API routes, static assets, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

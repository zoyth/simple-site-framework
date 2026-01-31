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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

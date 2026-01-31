#!/usr/bin/env node

/**
 * create-simple-site CLI tool
 * Scaffolds new projects with the Simple Site Framework
 */

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

const program = new Command();

program
  .name('create-simple-site')
  .description('Create a new Simple Site Framework project')
  .argument('[project-name]', 'Name of your project')
  .option('-t, --template <template>', 'Template to use (service-business, saas, portfolio, blog, blank)')
  .option('--skip-install', 'Skip npm install')
  .option('--skip-git', 'Skip git initialization')
  .action(async (projectName, options) => {
    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error(chalk.red('\n✖ Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();

async function createProject(projectName, options) {
  console.log(chalk.bold.cyan('\n🚀 Simple Site Framework\n'));

  // Get project name if not provided
  if (!projectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-site',
        validate: (input) => {
          if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
          return 'Project name may only include letters, numbers, underscores and hashes.';
        }
      }
    ]);
    projectName = answers.projectName;
  }

  const projectPath = path.join(process.cwd(), projectName);

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${projectName} already exists. Overwrite?`,
        default: false
      }
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('\n✖ Cancelled'));
      process.exit(0);
    }

    fs.removeSync(projectPath);
  }

  // Interactive setup
  const config = await interactiveSetup(options);

  // Create project
  const spinner = ora('Creating project...').start();

  try {
    // Create directory
    fs.ensureDirSync(projectPath);

    // Copy template
    await copyTemplate(projectPath, config.template);

    // Update configuration files
    await updateConfig(projectPath, config);

    spinner.succeed('Project created!');

    // Install dependencies
    if (!options.skipInstall) {
      const installSpinner = ora('Installing dependencies...').start();
      try {
        execSync('npm install', {
          cwd: projectPath,
          stdio: 'ignore'
        });
        installSpinner.succeed('Dependencies installed!');
      } catch (error) {
        installSpinner.fail('Failed to install dependencies');
        console.log(chalk.yellow('  Run `npm install` manually in the project directory'));
      }
    }

    // Initialize git
    if (!options.skipGit) {
      const gitSpinner = ora('Initializing git repository...').start();
      try {
        execSync('git init', { cwd: projectPath, stdio: 'ignore' });
        execSync('git add -A', { cwd: projectPath, stdio: 'ignore' });
        execSync('git commit -m "Initial commit from create-simple-site"', {
          cwd: projectPath,
          stdio: 'ignore'
        });
        gitSpinner.succeed('Git repository initialized!');
      } catch (error) {
        gitSpinner.fail('Failed to initialize git');
      }
    }

    // Success message
    console.log(chalk.green('\n✓ Project ready!\n'));
    console.log(chalk.bold('Next steps:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    if (options.skipInstall) {
      console.log(chalk.gray('  npm install'));
    }
    console.log(chalk.gray('  npm run dev\n'));

  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}

async function interactiveSetup(options) {
  const questions = [];

  // Template selection
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Choose a template:',
      choices: [
        { name: 'Service Business - Professional services (law, consulting)', value: 'service-business' },
        { name: 'SaaS - Software-as-a-service marketing site', value: 'saas' },
        { name: 'Portfolio - Personal/agency portfolio', value: 'portfolio' },
        { name: 'Blog - Content-focused blog', value: 'blog' },
        { name: 'Blank - Minimal starter', value: 'blank' }
      ],
      default: 'service-business'
    });
  }

  // Theme configuration
  questions.push(
    {
      type: 'input',
      name: 'primaryColor',
      message: 'Primary color (hex):',
      default: '#f97316',
      validate: (input) => /^#[0-9A-F]{6}$/i.test(input) || 'Please enter a valid hex color'
    },
    {
      type: 'list',
      name: 'fontHeading',
      message: 'Heading font:',
      choices: ['Inter', 'Poppins', 'Montserrat', 'Roboto', 'Open Sans'],
      default: 'Inter'
    },
    {
      type: 'list',
      name: 'fontBody',
      message: 'Body font:',
      choices: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Source Sans Pro'],
      default: 'Inter'
    },
    {
      type: 'checkbox',
      name: 'locales',
      message: 'Languages to support:',
      choices: [
        { name: 'English', value: 'en', checked: true },
        { name: 'French', value: 'fr' }
      ],
      validate: (answer) => answer.length > 0 || 'You must choose at least one language'
    }
  );

  // Company info
  questions.push(
    {
      type: 'input',
      name: 'companyName',
      message: 'Company name:',
      default: 'My Company'
    },
    {
      type: 'input',
      name: 'companyEmail',
      message: 'Contact email:',
      default: 'contact@example.com'
    },
    {
      type: 'input',
      name: 'companyPhone',
      message: 'Phone number (optional):',
      default: ''
    }
  );

  const answers = await inquirer.prompt(questions);

  return {
    template: options.template || answers.template,
    theme: {
      primaryColor: answers.primaryColor,
      fontHeading: answers.fontHeading,
      fontBody: answers.fontBody
    },
    locales: answers.locales,
    company: {
      name: answers.companyName,
      email: answers.companyEmail,
      phone: answers.companyPhone
    }
  };
}

async function copyTemplate(projectPath, template) {
  const templatesDir = path.join(__dirname, '..', 'templates');
  const templatePath = path.join(templatesDir, template);

  if (!fs.existsSync(templatePath)) {
    // Fallback to blank template
    const blankPath = path.join(templatesDir, 'blank');
    if (fs.existsSync(blankPath)) {
      fs.copySync(blankPath, projectPath);
    } else {
      // Create minimal structure if no template exists
      createMinimalStructure(projectPath);
    }
  } else {
    fs.copySync(templatePath, projectPath);
  }
}

function createMinimalStructure(projectPath) {
  // Create basic Next.js App Router structure
  const structure = {
    'app': {
      'layout.tsx': `import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
      'page.tsx': `export default function Home() {
  return <main className="min-h-screen p-8">
    <h1 className="text-4xl font-bold">Welcome to Simple Site Framework</h1>
  </main>
}`,
      'globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`
    },
    'config': {
      'theme.ts': `export const theme = {
  colors: {
    primary: '#f97316'
  }
}`
    },
    'public': {},
    'package.json': JSON.stringify({
      name: 'my-site',
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        '@zoyth/simple-site-framework': 'latest',
        'next': '^14.0.0',
        'react': '^18.0.0',
        'react-dom': '^18.0.0'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        'typescript': '^5.0.0',
        'tailwindcss': '^3.4.0'
      }
    }, null, 2),
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: { '@/*': ['./*'] }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    }, null, 2),
    'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`,
    'tailwind.config.ts': `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config`,
    '.gitignore': `node_modules
.next
out
.env*.local
.DS_Store`
  };

  function createStructure(basePath, struct) {
    for (const [key, value] of Object.entries(struct)) {
      const itemPath = path.join(basePath, key);
      if (typeof value === 'string') {
        fs.writeFileSync(itemPath, value);
      } else {
        fs.ensureDirSync(itemPath);
        createStructure(itemPath, value);
      }
    }
  }

  createStructure(projectPath, structure);
}

async function updateConfig(projectPath, config) {
  // Update theme config
  const themeConfigPath = path.join(projectPath, 'config', 'theme.ts');
  if (fs.existsSync(themeConfigPath)) {
    let themeContent = fs.readFileSync(themeConfigPath, 'utf-8');
    themeContent = themeContent.replace(/#[0-9A-F]{6}/gi, config.theme.primaryColor);
    fs.writeFileSync(themeConfigPath, themeContent);
  }

  // Update package.json with company name
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.name = config.company.name.toLowerCase().replace(/\s+/g, '-');
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

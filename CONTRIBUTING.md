# Contributing to Simple Site Framework

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git fork https://github.com/zoyth/simple-site-framework.git
   cd simple-site-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the framework**
   ```bash
   npm run build
   ```

4. **Start development mode** (watches for changes)
   ```bash
   npm run dev
   ```

5. **Type check**
   ```bash
   npm run typecheck
   ```

## Project Structure

```
simple-site-framework/
├── src/
│   ├── components/       # React components
│   │   ├── layout/       # Header, Footer, etc.
│   │   ├── sections/     # Page sections
│   │   └── ui/           # UI primitives
│   ├── config/           # Configuration schemas
│   ├── lib/              # Utilities and helpers
│   └── index.ts          # Main exports
├── bin/                  # CLI tools
├── docs/                 # Documentation
└── dist/                 # Build output (generated)
```

## Code Guidelines

### TypeScript
- All code must be TypeScript
- Use strict type checking
- Export types for all public APIs
- Document complex types with JSDoc

### Components
- Use functional components with hooks
- Follow existing component patterns
- Include TypeScript prop types
- Add ABOUTME comments at file top (2 lines)

### Styling
- Use Tailwind CSS utility classes
- No inline styles or CSS-in-JS
- Follow existing design tokens
- Ensure responsive design (mobile-first)

### Accessibility
- All components must meet WCAG 2.1 AA
- Include proper ARIA attributes
- Support keyboard navigation
- Test with screen readers

### Code Style
- Match existing code style and formatting
- Use meaningful variable names
- Keep functions focused and small
- Add comments for complex logic only

### File Headers
Every file must start with ABOUTME comments:
```typescript
// ABOUTME: Brief description of what this file does
// ABOUTME: Second line with additional context
```

## Commit Guidelines

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **refactor**: Code refactoring
- **test**: Adding/updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat: Add Newsletter signup component

Add lightweight newsletter signup form with email validation,
spam protection, and email service integrations.

Closes #48
```

```bash
fix: Button ripple effect on Safari

Fix ripple animation not working on Safari due to
missing -webkit prefix.

Fixes #123
```

### Rules
- Use present tense ("Add feature" not "Added feature")
- Keep subject line under 72 characters
- Reference issues in footer

## Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow code guidelines above
   - Add/update documentation
   - Ensure TypeScript compiles (`npm run typecheck`)
   - Test manually in a Next.js app

3. **Commit your changes**
   - Follow commit message format
   - Make focused commits (one logical change per commit)

4. **Update documentation**
   - Update README if adding major features
   - Update API docs if changing component APIs
   - Add examples if helpful

### Submitting the PR

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**
   - Use a clear, descriptive title
   - Describe what changed and why
   - Link related issues
   - Add screenshots for UI changes
   - Mark as draft if work in progress

3. **Respond to feedback**
   - Address all review comments
   - Push additional commits to the same branch
   - Request re-review when ready

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] TypeScript types are properly defined
- [ ] Components are accessible (WCAG 2.1 AA)
- [ ] Documentation is updated
- [ ] All files have ABOUTME comments
- [ ] Commit messages follow format
- [ ] No breaking changes (or clearly documented)
- [ ] Works with Next.js 14/15/16 and React 18/19

## What to Contribute

### Good First Issues
Look for issues labeled `good first issue` - these are great entry points:
- Documentation improvements
- Bug fixes
- Minor component enhancements
- Example projects

### High Priority
- Missing components (see issues #47-50)
- Accessibility improvements
- Test coverage
- Performance optimizations

### Ideas Welcome
- New components for professional services sites
- Utility functions
- Documentation improvements
- Better examples

## Questions or Problems?

- **Bug reports**: [GitHub Issues](https://github.com/zoyth/simple-site-framework/issues)
- **Feature requests**: [GitHub Issues](https://github.com/zoyth/simple-site-framework/issues)
- **Questions**: [GitHub Discussions](https://github.com/zoyth/simple-site-framework/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

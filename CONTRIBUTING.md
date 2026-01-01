# Contributing to Vuetify Nuxt 4 Module

Thank you for your interest in contributing to Vuetify Nuxt 4 Module! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be respectful and considerate in all interactions
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for mistakes and learn from them

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x (or pnpm/yarn)
- Git
- Basic knowledge of:
  - Vue 3 / Nuxt 4
  - Vuetify 3
  - TypeScript

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/Vuetify-Nuxt4-Module.git
cd Vuetify-Nuxt4-Module
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/KHNexTech/Vuetify-Nuxt4-Module.git
```

---

## Development Setup

### Install Dependencies

```bash
npm install
```

### Prepare Development Environment

```bash
npm run dev:prepare
```

This command:
- Builds the module in stub mode
- Prepares type definitions
- Sets up the playground

### Start Development Server

```bash
npm run dev
```

This starts the playground application with hot-reload enabled.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with playground |
| `npm run dev:prepare` | Prepare module for development |
| `npm run dev:build` | Build the playground |
| `npm run build` | Build the module for production |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:types` | Run type checking |
| `npm run analyze` | Analyze bundle size |

---

## Project Structure

```
vuetify-nuxt4-module/
├── src/
│   ├── module.ts              # Main module entry point
│   ├── runtime/
│   │   ├── plugins/
│   │   │   └── vuetify.ts     # Vuetify plugin (runs at runtime)
│   │   ├── composables/
│   │   │   └── useVuetify.ts  # useVuetify composable
│   │   └── styles/
│   │       └── vuetify.scss   # Custom styles
│   ├── types/
│   │   ├── index.ts           # Type exports
│   │   ├── module.ts         # Module options types
│   │   ├── hooks.ts           # Hook types
│   │   ├── icon.ts            # Icon types
│   │   └── runtime.d.ts       # Runtime type declarations
│   └── utils/
│       ├── index.ts           # Utility exports
│       ├── blueprints.ts      # Blueprint loading
│       ├── date.ts            # Date adapter utilities
│       ├── hooks.ts           # Hook system
│       ├── i18n.ts            # i18n integration
│       ├── icon.ts            # Icon configuration
│       ├── lazy.ts            # Lazy component loading
│       ├── locale.ts          # Locale configuration
│       ├── logger.ts          # Logging utilities
│       ├── persistence.ts     # Theme persistence
│       └── preload.ts         # Asset preloading
├── playground/                 # Development playground
│   ├── nuxt.config.ts
│   ├── app.vue
│   └── pages/
├── test/
│   ├── basic.test.ts
│   └── fixtures/
├── dist/                       # Built module (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Key Files

#### `src/module.ts`
The main module definition. Handles:
- Module registration
- Vite plugin setup
- CSS/styles injection
- Composable auto-imports

#### `src/runtime/plugins/vuetify.ts`
The Vuetify plugin that runs at runtime. Handles:
- Vuetify instance creation
- Theme persistence
- i18n adapter setup
- Hook execution

#### `src/utils/`
Utility functions used by both the module and runtime plugin.

---

## Making Changes

### Branch Naming

Create a branch for your changes:

```bash
git checkout -b <type>/<description>
```

Types:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes

Examples:
```bash
git checkout -b feature/add-custom-icons
git checkout -b fix/hydration-mismatch
git checkout -b docs/update-readme
```

### Code Style

This project uses ESLint for code linting. Before committing:

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### TypeScript

- All code must be written in TypeScript
- Avoid using `any` type - use proper types
- Export types that consumers might need
- Add JSDoc comments for public APIs

### Testing

Add tests for new features and bug fixes:

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run type checking
npm run test:types
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |

### Examples

```bash
# Feature
git commit -m "feat(icons): add support for custom SVG icon sets"

# Bug fix
git commit -m "fix(ssr): resolve theme hydration mismatch"

# Documentation
git commit -m "docs: update i18n integration guide"

# Breaking change
git commit -m "feat(config)!: rename moduleOptions to vuetifyOptions

BREAKING CHANGE: The moduleOptions key has been renamed to vuetifyOptions"
```

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest upstream changes:

```bash
git fetch upstream
git rebase upstream/main
```

2. **Run all checks**:

```bash
npm run lint
npm run test
npm run test:types
```

3. **Build the module**:

```bash
npm run build
```

4. **Test in playground**:

```bash
npm run dev
```

### Submitting

1. Push your branch to your fork:

```bash
git push origin <branch-name>
```

2. Open a Pull Request on GitHub

3. Fill out the PR template with:
  - Description of changes
  - Related issue (if any)
  - Screenshots (if UI changes)
  - Breaking changes (if any)

### PR Requirements

- [ ] All tests pass
- [ ] No linting errors
- [ ] Types are correct
- [ ] Documentation updated (if needed)
- [ ] Changelog entry added (for features/fixes)

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged

---

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Reproduction**: Steps to reproduce
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**:
  - Node.js version
  - npm/pnpm/yarn version
  - Nuxt version
  - Vuetify version
  - Module version
  - OS

### Feature Requests

When requesting features, include:

1. **Problem**: What problem does this solve?
2. **Solution**: Your proposed solution
3. **Alternatives**: Other solutions you considered
4. **Examples**: Code examples or mockups

### Security Issues

For security vulnerabilities, please email security@example.com instead of creating a public issue.

---

## Questions?

If you have questions:

1. Check existing [issues](https://github.com/KHNexTech/Vuetify-Nuxt4-Module/issues)
2. Check the [documentation](README.md)
3. Open a new issue with the "question" label

---

Thank you for contributing! 🎉

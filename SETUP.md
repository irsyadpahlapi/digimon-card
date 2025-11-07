# CI/CD Setup Documentation

This project is configured with automated CI/CD pipeline using GitHub Actions, SonarCloud, and Vercel.

## Required GitHub Secrets

To complete the setup, you need to add the following secrets in your GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

### SonarCloud Configuration

```bash
SONAR_TOKEN=your_sonarcloud_token_here
```

### Vercel Configuration

```bash
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

## How to get these values:

### 1. SONAR_TOKEN

- Login to https://sonarcloud.io
- Go to `My Account` → `Security` → `Generate Tokens`
- Create a token with name "github-actions"
- Copy the generated token

### 2. VERCEL_TOKEN

- Login to https://vercel.com
- Go to `Settings` → `Tokens`
- Create new token with name "github-actions"
- Copy the generated token

### 3. VERCEL_ORG_ID & VERCEL_PROJECT_ID

- Install Vercel CLI: `npm i -g vercel`
- In your project directory, run: `vercel link`
- Check `.vercel/project.json` for the IDs
- Or get them from Vercel dashboard → Project Settings

## Workflow Overview

### Push to main branch:

1. ✅ Run tests with coverage
2. ✅ ESLint analysis
3. ✅ SonarCloud code quality scan
4. ✅ Deploy to Vercel production

### Pull Request:

1. ✅ Run tests with coverage
2. ✅ ESLint analysis
3. ✅ SonarCloud code quality scan
4. ✅ Deploy preview to Vercel

## Local Development Commands

```bash
# Install dependencies
npm install

# Run tests with coverage
npm run test:coverage

# Run SonarCloud analysis locally (requires SONAR_TOKEN)
npm run analyze

# Build for production
npm run build

# Start development server
npm run dev
```

## SonarCloud Configuration

The project is configured with the following quality standards:

- Function coverage: 80%+
- Line coverage: 70%+
- Branch coverage: 70%+
- Statement coverage: 70%+

Quality gate will fail if these thresholds are not met.

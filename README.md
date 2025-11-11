# 🎴 DigiCard - Digimon Card Collection Game

A modern web-based Digimon card collection game built with Next.js 15, TypeScript, and Clean Architecture principles.

[![CI/CD Pipeline](https://github.com/irsyadpahlapi/digimon-card/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/irsyadpahlapi/digimon-card/actions/workflows/ci-cd.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=irsyadpahlapi_digimon-card&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=irsyadpahlapi_digimon-card)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=irsyadpahlapi_digimon-card&metric=coverage)](https://sonarcloud.io/summary/new_code?id=irsyadpahlapi_digimon-card)

## 🌐 Links

- **Repository**: [https://github.com/irsyadpahlapi/digimon-card](https://github.com/irsyadpahlapi/digimon-card)
- **Live Demo**: [Vercel Deployment](https://digimon-card-eight.vercel.app/)

## 📖 About

DigiCard is an interactive card collection game where you can:

- 🛒 Purchase starter packs with coins
- 🎲 Get random Digimon cards from different packs
- 📊 Build and manage your card collection
- 🔄 Evolve your Digimon to higher levels
- 💰 Sell cards to earn coins
- 🔍 Filter cards by category and type
- ♾️ Infinite scroll pagination for smooth browsing

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **Yarn**: v1.22.x or higher (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/irsyadpahlapi/digimon-card.git
   cd digimon-card
   ```

2. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   ```

   The `.env.local` file contains:

   ```env
   NEXT_PUBLIC_API_URL=https://digi-api.com/api/v1/digimon
   ```

   > **Note**: The `NEXT_PUBLIC_` prefix makes the variable accessible in the browser.

4. **Run the development server**

   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### 1. **First Time Setup**

- Open the application in your browser
- You'll be redirected to the login page
- Enter your username to create a profile
- You'll start with **100 coins**

### 2. **Purchase Starter Packs**

- Browse available starter packs at the top of the homepage
- Three types available:
  - 🟢 **Rookie Pack** (100 coins) - Get 5-10 Rookie level Digimon
  - 🟡 **Champion Pack** (200 coins) - Get 5-10 Champion level Digimon
  - 🔴 **Ultimate Pack** (300 coins) - Get 5-10 Ultimate level Digimon
- Click "Buy Pack" button to purchase (requires sufficient coins)
- Cards are automatically added to "My Cards" section

### 3. **Manage Your Collection**

- Scroll down to view your card collection
- Use **filter options** to organize cards:
  - Filter by **Category** (Rookie, Champion, Ultimate, Mega)
  - Filter by **Type** (Vaccine, Data, Virus, Free, Unknown, Variable)
- Click "Reset Filters" to view all cards

### 4. **Card Details & Actions**

- Click on any card to view detailed information
- In the modal, you can:
  - **View card stats**: Level, Type, Attribute, Field
  - **Read description**: Origin and background story
  - **See evolution options**: Available next evolutions
  - **Evolve**: Click "Evolve to [Digimon]" button (requires coins)
  - **Sell**: Click "Sell for [amount] coins" to get coins back

### 5. **Evolution System**

- Each Digimon can evolve to multiple next forms
- Evolution costs vary based on target level
- After evolution, the old card is replaced with the new one
- Evolution is permanent and cannot be undone

### 6. **Infinite Scroll**

- Cards load in batches of 20
- Scroll to the bottom to automatically load more
- **2-second delay** between loads for smooth experience
- Loading indicator shows when fetching more cards

### 7. **Data Persistence**

- All data is stored in **browser localStorage**
- Your profile, coins, and cards persist across sessions
- Clear browser data will reset your progress

## 🛠️ Development

### Available Scripts

```bash
# Development
yarn dev              # Start dev server with hot reload
yarn build            # Build production bundle
yarn start            # Start production server

# Testing
yarn test             # Run tests in watch mode
yarn test:ci          # Run tests with coverage
yarn test:coverage    # Generate coverage report

# Code Quality
yarn lint             # Run ESLint
yarn lint:report      # Generate ESLint report
```

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage route
│   └── login/             # Login page
├── core/                   # Business Logic (Clean Architecture)
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces
│   └── usecases/          # Application use cases
├── data/                   # Data Layer
│   ├── datasources/       # External data sources
│   └── repositories/      # Repository implementations
└── presentation/           # UI Layer
    ├── components/        # React components
    ├── hooks/             # Custom React hooks
    └── styles/            # Styling utilities
```

## 🧪 Testing

The project has comprehensive test coverage:

```bash
# Run all tests
yarn test

# Run with coverage report
yarn test:coverage

# Watch mode for TDD
yarn test:watch
```

**Coverage Targets:**

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19, Tailwind CSS
- **Testing**: Jest 30, React Testing Library
- **Code Quality**: ESLint 9, Prettier, SonarCloud
- **CI/CD**: GitHub Actions, Vercel
- **Architecture**: Clean Architecture, SOLID principles

## 📊 CI/CD Pipeline

The project uses GitHub Actions for automated quality checks:

1. ✅ **Check Dependencies** - Install and cache dependencies
2. ✅ **ESLint Analysis** - Code quality and style checks
3. ✅ **SonarCloud Analysis** - Static code analysis with coverage
4. ✅ **Build Application** - Verify production build
5. 🚀 **Deploy to Vercel** - Automatic deployment on main branch

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

| Variable              | Description          | Default                               |
| --------------------- | -------------------- | ------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Digimon API base URL | `https://digi-api.com/api/v1/digimon` |

**Setup:**

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Modify values if needed (optional for local development)

3. Restart the dev server to apply changes

> **Important**: `.env.local` is git-ignored for security. Never commit sensitive data.

### Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## � Security

This project implements multiple layers of security to protect user data and prevent common vulnerabilities:

### Security Features

- **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and more configured in `next.config.ts`
- **Input Validation**: Comprehensive validation utilities in `src/presentation/hooks/security.ts` for sanitizing user input
- **API Protection**: Timeout protection (10s), error handling, and response validation in API client
- **Environment Validation**: Runtime validation of required environment variables
- **Rate Limiting**: Client-side rate limiting utilities to prevent abuse

### Security Scripts

Run security audits to check for vulnerabilities:

```bash
# Run npm audit for known vulnerabilities
npm run security:audit

# Run both audit and ESLint checks
npm run security:check

# Automatically fix vulnerabilities
npm run security:fix
```

### Reporting Vulnerabilities

Please read our [Security Policy](SECURITY.md) for information on reporting security vulnerabilities responsibly.

## �👨‍💻 Author

**Irsyad Pahlapi**

- GitHub: [@irsyadpahlapi](https://github.com/irsyadpahlapi)
- Repository: [digimon-card](https://github.com/irsyadpahlapi/digimon-card)

## 🙏 Acknowledgments

- Digimon data powered by [Digi-API](https://digi-api.com/)
- Built with [Next.js](https://nextjs.org)
- Deployed on [Vercel](https://vercel.com)

---

**⭐ Star this repository if you find it helpful!**

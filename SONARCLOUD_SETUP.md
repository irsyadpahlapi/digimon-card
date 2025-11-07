# SonarCloud Setup Guide

## ⚠️ Fix: "You are running CI analysis while Automatic Analysis is enabled"

Error ini terjadi karena Automatic Analysis aktif di SonarCloud. Anda perlu **disable Automatic Analysis** untuk menggunakan CI-based analysis.

### Step-by-Step: Disable Automatic Analysis

1. **Login ke SonarCloud**

   ```
   https://sonarcloud.io
   ```

2. **Pilih Organization Anda**
   - Klik organization name di navbar

3. **Buka Project Settings**
   - Pilih project: `irsyadpahlapi_digimon-card`
   - Klik **Administration** → **Analysis Method**

4. **Disable Automatic Analysis**

   ```
   [×] Automatic Analysis  ← Uncheck this option
   [✓] CI-based Analysis   ← Enable this option
   ```

5. **Save Changes**
   - Automatic Analysis akan disabled
   - CI-based Analysis akan aktif

### Verify Configuration

Setelah disable Automatic Analysis, coba push lagi atau re-run workflow:

```bash
# Re-run workflow di GitHub Actions
https://github.com/irsyadpahlapi/digimon-card/actions
```

## 📋 Required GitHub Secrets

Pastikan secrets berikut sudah diset di repository:

### SonarCloud Secrets

```
SONAR_TOKEN          = [Your SonarCloud Token]
```

**Cara mendapatkan SONAR_TOKEN:**

1. Login ke https://sonarcloud.io
2. Klik profile picture → **My Account**
3. Tab **Security**
4. **Generate Tokens**
   - Name: `github-actions-digimon-card`
   - Type: `Project Analysis Token`
   - Project: `irsyadpahlapi_digimon-card`
5. Copy token dan paste ke GitHub Secrets

### Vercel Secrets (Optional - untuk deployment)

```
VERCEL_TOKEN         = [Your Vercel Token]
VERCEL_ORG_ID        = [Your Vercel Organization ID]
VERCEL_PROJECT_ID    = [Your Vercel Project ID]
```

## ✅ Expected Workflow Behavior

Setelah setup selesai:

1. ✅ **Code Quality Analysis** job akan run:
   - Install dependencies
   - Run ESLint
   - Run tests with coverage
   - **SonarCloud Scan** (dengan `continue-on-error: true`)

2. ✅ **Deploy to Vercel** (hanya pada push ke main):
   - Build application
   - Deploy production

3. ✅ **Preview Deployment** (hanya pada pull request):
   - Build application
   - Deploy preview

## 🔧 SonarCloud Configuration

File konfigurasi: `sonar-project.properties`

```properties
sonar.organization=irsyadpahlapi
sonar.projectKey=irsyadpahlapi_digimon-card
sonar.projectName=digimon-card
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.tsx,**/*.test.ts
sonar.exclusions=**/*.test.tsx,**/*.test.ts,**/node_modules/**,**/coverage/**
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=test-report.xml
```

## 📊 Coverage Requirements

Current coverage targets:

- **Function Coverage**: 83.92% ✅
- **Line Coverage**: 88%+ ✅
- **Branch Coverage**: 87%+ ✅

## 🔗 Useful Links

- SonarCloud Dashboard: https://sonarcloud.io/project/overview?id=irsyadpahlapi_digimon-card
- GitHub Actions: https://github.com/irsyadpahlapi/digimon-card/actions
- SonarCloud Docs: https://docs.sonarcloud.io/

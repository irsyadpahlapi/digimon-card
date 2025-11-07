# Vercel Deployment Setup Guide

## 📋 Prerequisites

1. Vercel account: https://vercel.com
2. GitHub repository connected to Vercel
3. Vercel project created

## 🔐 Setup GitHub Secrets for Vercel

### Step 1: Get Vercel Token

1. Login ke https://vercel.com
2. Click profile picture → **Settings**
3. Tab **Tokens**
4. Click **Create Token**
   - Token Name: `github-actions-digimon-card`
   - Scope: `Full Access` atau pilih specific scope
   - Expiration: `No Expiration` atau set sesuai kebutuhan
5. Click **Create**
6. **Copy token** (hanya tampil sekali!)

### Step 2: Get Vercel Organization ID & Project ID

#### Option A: Via Vercel Dashboard

1. Go to your project: https://vercel.com/dashboard
2. Select project: `digimon-card`
3. Click **Settings** → **General**
4. Scroll down untuk menemukan:
   ```
   Project ID: prj_xxxxxxxxxxxxxxxxxxxxx
   ```
5. Di bagian atas, klik organization name untuk melihat:
   ```
   Team ID / Org ID: team_xxxxxxxxxxxxxxxxxxxxx
   ```

#### Option B: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link project (run di project directory)
vercel link

# Check .vercel/project.json
cat .vercel/project.json
```

Output akan menampilkan:

```json
{
  "orgId": "team_xxxxxxxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxxx"
}
```

### Step 3: Add Secrets to GitHub

1. Go to GitHub repository: https://github.com/irsyadpahlapi/digimon-card
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these 3 secrets:

```
Name: VERCEL_TOKEN
Value: [paste your Vercel token from Step 1]

Name: VERCEL_ORG_ID
Value: [paste your Organization/Team ID from Step 2]

Name: VERCEL_PROJECT_ID
Value: [paste your Project ID from Step 2]
```

## 🚀 Deployment Flow

### Production Deployment (main branch)

Setiap push ke `main` branch akan:

1. Run tests & code quality checks
2. Build Next.js application
3. Deploy to Vercel production
4. Available at: `https://digimon-card.vercel.app` (or your custom domain)

### Preview Deployment (pull requests)

Setiap pull request akan:

1. Run tests & code quality checks
2. Build Next.js application
3. Deploy to Vercel preview environment
4. Get unique preview URL (commented on PR)

## 🔧 Workflow Configuration

File: `.github/workflows/ci-cd.yml`

```yaml
deploy:
  steps:
    - name: Deploy to Vercel (Production)
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

## ⚠️ Troubleshooting

### Error: "Resource not accessible by integration"

**Cause**: GitHub token tidak memiliki permission untuk write comments di PR

**Solution**:

- Workflow sudah dikonfigurasi dengan `continue-on-error: true`
- Deployment tetap berhasil, hanya PR comment yang gagal
- Atau tambahkan permissions di workflow:
  ```yaml
  permissions:
    contents: read
    pull-requests: write
  ```

### Error: "Invalid vercel token"

**Cause**: VERCEL_TOKEN tidak valid atau expired

**Solution**:

1. Generate token baru di Vercel Settings → Tokens
2. Update GitHub Secret `VERCEL_TOKEN`

### Error: "Project not found"

**Cause**: VERCEL_PROJECT_ID atau VERCEL_ORG_ID salah

**Solution**:

1. Verify IDs di Vercel Settings atau via `vercel link`
2. Update GitHub Secrets dengan nilai yang benar

## ✅ Verify Deployment

Setelah setup selesai:

1. **Trigger deployment**:

   ```bash
   git add .
   git commit -m "test: trigger vercel deployment"
   git push origin main
   ```

2. **Check GitHub Actions**:
   - Go to: https://github.com/irsyadpahlapi/digimon-card/actions
   - Monitor "Deploy to Vercel" job
   - Check logs untuk deployment URL

3. **Check Vercel Dashboard**:
   - Go to: https://vercel.com/dashboard
   - Lihat deployment terbaru
   - Verify production URL

## 📊 Expected Output

Successful deployment akan menampilkan:

```
✓ Deploying to production...
✓ Build completed
✓ Deployed to production
✓ Production: https://digimon-card.vercel.app
```

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel CLI Docs: https://vercel.com/docs/cli
- Vercel GitHub Integration: https://vercel.com/docs/git/vercel-for-github
- GitHub Actions Logs: https://github.com/irsyadpahlapi/digimon-card/actions

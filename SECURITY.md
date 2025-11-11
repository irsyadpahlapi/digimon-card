# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to the repository owner. All security vulnerabilities will be promptly addressed.

Please include the following information:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

## Security Measures

This project implements several security measures:

### 1. **Security Headers**

- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Content Security Policy (CSP)
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 2. **Input Validation**

- All user inputs are sanitized
- Username validation with character restrictions
- Numeric input bounds checking
- XSS prevention measures

### 3. **API Security**

- Request timeout protection (10s)
- Error handling and validation
- Response format validation
- Rate limiting on client side

### 4. **Environment Variables**

- Sensitive data in environment variables
- `.env.local` git-ignored
- Runtime environment validation

### 5. **Dependencies**

- Regular dependency updates via Dependabot
- Automated security scanning via GitHub Actions
- Code quality checks via SonarCloud

## Best Practices for Users

### For Developers:

1. **Never commit sensitive data**

   ```bash
   # Always use .env.local for local development
   cp .env.example .env.local
   ```

2. **Keep dependencies updated**

   ```bash
   yarn upgrade-interactive --latest
   ```

3. **Run security audits**

   ```bash
   yarn audit
   npm audit fix
   ```

4. **Validate environment variables**
   - Check that all required env vars are set
   - Use the provided validation utilities

### For Users:

1. **Use strong usernames**
   - 3-20 characters
   - Alphanumeric and basic punctuation only
   - No special characters or scripts

2. **Be cautious with browser extensions**
   - Extensions can access localStorage
   - Clear browser data if concerned

3. **Keep your browser updated**
   - Latest security patches
   - Enable automatic updates

## Security Features

### Client-Side Storage

- Data stored in localStorage is client-only
- No sensitive information persisted
- Can be cleared by user at any time

### API Communication

- HTTPS only in production
- Timeout protection
- Error handling prevents info leakage

### XSS Prevention

- Input sanitization
- CSP headers
- Output encoding

### CSRF Protection

- SameSite cookies (when implemented)
- Origin validation
- No state-changing GET requests

## Disclosure Policy

- Security issues are disclosed privately to maintainers
- Public disclosure after patch is available
- Credit given to reporters (with permission)

## Updates

This security policy is reviewed and updated regularly. Last updated: November 2025.

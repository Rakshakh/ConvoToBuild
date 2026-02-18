# Security Advisory

## Overview

This document tracks security vulnerabilities and their remediation in the ConvoToBuild project.

## Recent Security Updates

### 2026-02-18: Next.js DoS Vulnerability (CRITICAL - FIXED ✅)

**Vulnerability:** Next.js HTTP request deserialization DoS vulnerability
**Severity:** High
**Status:** ✅ FIXED

**Details:**
- **Affected Version:** Next.js 14.2.35
- **Issue:** HTTP request deserialization could lead to Denial of Service when using insecure React Server Components
- **CVE:** Multiple CVEs affecting versions 13.0.0 through various 15.x and 16.x branches

**Resolution:**
- **Date Fixed:** 2026-02-18
- **Action Taken:** Updated Next.js from 14.2.35 to 15.5.12
- **Patched Version:** 15.5.12
- **Status:** Fully resolved and tested

**Verification:**
- ✅ Build successful
- ✅ All tests passing (6/6)
- ✅ Linting clean
- ✅ No breaking changes detected

### Remaining Vulnerabilities (Non-Critical)

#### 1. ajv ReDoS (Moderate - Dev Dependency)

**Package:** ajv < 8.18.0
**Severity:** Moderate
**Impact:** Development only (ESLint dependency)
**Status:** ⚠️ Monitoring

**Details:**
- ReDoS vulnerability when using `$data` option
- Only affects development builds and linting
- Does not affect production runtime
- Breaking change required to fix (ESLint downgrade)

**Recommendation:** 
- No immediate action required
- Monitor for non-breaking fix
- Does not pose runtime security risk

#### 2. tar Vulnerabilities (High - Optional Dependency)

**Package:** tar <= 7.5.7
**Severity:** High
**Impact:** Optional build-time dependency (bcrypt)
**Status:** ⚠️ Monitoring

**Issues:**
- Arbitrary file overwrite vulnerability
- Path traversal via hardlinks
- Symlink poisoning
- Race condition on macOS APFS

**Details:**
- Dependency of @mapbox/node-pre-gyp (used by bcrypt)
- Only used during bcrypt native module compilation
- Does not affect runtime security
- Bcrypt functionality works correctly

**Recommendation:**
- No immediate action required
- Consider alternative authentication libraries if bcrypt updates not available
- Monitor for bcrypt package updates

## Security Best Practices

### Current Implementations

1. **Environment Variables**
   - All sensitive credentials stored in environment variables
   - No hardcoded secrets in codebase
   - `.env.example` provided without actual credentials

2. **Webhook Security**
   - Token-based verification for WhatsApp webhooks
   - Signature verification support ready

3. **Database Security**
   - Prisma ORM prevents SQL injection
   - Parameterized queries throughout
   - No raw SQL queries

4. **Input Validation**
   - Input sanitization utilities
   - TypeScript type checking
   - Zod schema validation ready

5. **API Security**
   - CORS configuration structure
   - Rate limiting structure ready
   - XSS protection via React

### Recommended Additional Security Measures

1. **Production Deployment:**
   - Enable webhook signature verification
   - Implement request rate limiting
   - Add API key rotation
   - Enable HTTPS only
   - Set up CSP headers
   - Configure CORS whitelist

2. **Monitoring:**
   - Set up error tracking (Sentry)
   - Enable security logging
   - Monitor failed authentication attempts
   - Track API usage patterns

3. **Access Control:**
   - Implement NextAuth.js authentication
   - Add role-based access control
   - Secure dashboard with authentication
   - Add API key management

4. **Data Protection:**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Implement data backup strategy
   - Add data retention policies

## Vulnerability Scanning

### Automated Scanning

The project uses GitHub Actions for automated security scanning:

```yaml
# .github/workflows/ci.yml
- Run npm audit on every push
- Check for known vulnerabilities
- Generate security reports
```

### Manual Scanning

```bash
# Check for vulnerabilities
npm audit

# Fix non-breaking vulnerabilities
npm audit fix

# View detailed report
npm audit --json > audit-report.json
```

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email security@convotobuild.com (if available)
3. Or create a private security advisory on GitHub
4. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

## Security Update Schedule

- **Critical vulnerabilities:** Immediate patching
- **High severity:** Within 7 days
- **Moderate severity:** Within 30 days
- **Low severity:** Next regular update cycle

## Dependency Update Policy

1. **Production Dependencies:**
   - Review security advisories weekly
   - Update to patch versions immediately
   - Test minor/major updates before deploying

2. **Development Dependencies:**
   - Review monthly
   - Update during maintenance windows
   - Ensure no breaking changes affect build

3. **Transitive Dependencies:**
   - Monitor via npm audit
   - Update parent packages when possible
   - Document known issues with no fixes

## Compliance

### Data Protection

- GDPR compliance considerations for EU users
- Data retention and deletion policies
- User consent for data collection
- Privacy policy requirements

### API Security

- WhatsApp Business API compliance
- OpenAI API usage terms
- GitHub API rate limits and terms
- Vercel deployment policies

## Security Checklist for Production

- [x] Update Next.js to patched version (15.5.12)
- [ ] Enable webhook signature verification
- [ ] Implement rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CORS whitelist
- [ ] Add authentication to dashboard
- [ ] Enable HTTPS only
- [ ] Set up CSP headers
- [ ] Implement API key rotation
- [ ] Add security logging
- [ ] Set up automated backups
- [ ] Configure firewall rules
- [ ] Review and update dependencies
- [ ] Conduct security audit
- [ ] Perform penetration testing
- [ ] Document incident response plan

## Change Log

### 2026-02-18
- ✅ Updated Next.js from 14.2.35 to 15.5.12
- ✅ Fixed critical DoS vulnerability
- ✅ Updated eslint-config-next to 15.0.8
- ✅ Verified all tests pass
- ✅ Verified build succeeds

## References

- [Next.js Security](https://nextjs.org/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Advisories](https://www.npmjs.com/advisories)
- [GitHub Security Advisories](https://github.com/advisories)

---

**Last Updated:** 2026-02-18  
**Next Review:** 2026-03-18

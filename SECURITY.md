# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          | Support Ends   |
| ------- | ------------------ | -------------- |
| 0.1.x   | :white_check_mark: | June 2026      |

Future versions will follow this support policy:
- **Major versions** (v1.x, v2.x): 18 months of security updates
- **Minor versions** (v0.x.y): Supported until next minor release
- **Patch versions**: Immediate upgrade recommended

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues. This could put all users at risk.

### 2. Report Privately

Send your security report via email to: **francois.lane@example.com**

Include:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if you have one)
- Your contact information

### 3. What to Expect

- **Initial Response**: Within 48 hours of your report
- **Status Update**: Within 7 days with initial assessment
- **Fix Timeline**: Critical issues within 7-14 days, others within 30 days
- **Disclosure**: We'll coordinate disclosure timing with you

### 4. Security Update Process

Once a vulnerability is confirmed:

1. We'll develop a fix in a private repository
2. We'll prepare a security advisory
3. We'll release a patch version
4. We'll publish the security advisory
5. We'll credit you (unless you prefer to remain anonymous)

## Security Best Practices

When using the Simple Site Framework:

### For Framework Users

1. **Keep Updated**
   ```bash
   npm update @zoyth/simple-site-framework
   ```
   - Subscribe to release notifications
   - Review changelogs for security fixes
   - Test updates in staging before production

2. **Validate User Input**
   - Use the framework's form validation
   - Sanitize data before rendering
   - Implement rate limiting for forms

3. **Protect Sensitive Data**
   - Never expose API keys in client code
   - Use environment variables for secrets
   - Implement proper CORS policies
   - Use HTTPS in production

4. **Content Security**
   - Implement Content Security Policy (CSP)
   - Validate uploaded files
   - Sanitize rich text content

### For Contributors

1. **Code Review**
   - All PRs require review
   - Security-sensitive changes need extra scrutiny
   - Run static analysis tools

2. **Dependencies**
   - Keep dependencies updated
   - Review dependency security advisories
   - Minimize dependency count

3. **Testing**
   - Test for XSS vulnerabilities
   - Test authentication/authorization
   - Test input validation

## Known Security Considerations

### Client-Side Framework

This is a client-side React framework. Security considerations:

- **No built-in authentication** - Implement your own auth
- **No server-side validation** - Validate on your backend
- **No data encryption** - Implement in your application layer

### Form Handling

The framework provides client-side validation:
- This is **not sufficient** for security
- Always validate on the server
- Implement rate limiting
- Use CAPTCHA for public forms

### XSS Protection

React provides built-in XSS protection via JSX:
- Don't use `dangerouslySetInnerHTML` without sanitization
- Sanitize user content with libraries like DOMPurify
- Implement Content Security Policy headers

## Security Features

### Built-In Protections

- **Form validation** - Zod schema validation
- **Spam protection** - Honeypot fields for ContactSection
- **Accessibility** - WCAG 2.1 AA compliance reduces phishing risks
- **Type safety** - TypeScript prevents many bugs
- **Secure defaults** - All components use secure coding practices

### What We Don't Provide

- Authentication/Authorization
- Server-side validation
- Data encryption
- Rate limiting
- CAPTCHA (though you can integrate)
- Session management

These must be implemented in your application.

## Vulnerability Disclosure Policy

### Our Commitment

- We'll acknowledge your report within 48 hours
- We'll keep you informed of progress
- We'll credit you in security advisories (if desired)
- We won't take legal action against good-faith security research

### Acceptable Research

- Testing against your own instance
- Responsible disclosure
- Not accessing user data
- Not disrupting service

### Unacceptable Research

- Social engineering of staff or users
- Denial of service testing
- Physical attacks on infrastructure
- Accessing user data without permission

## Past Security Issues

None reported yet. This section will be updated if any vulnerabilities are discovered and fixed.

## Security Contacts

- **Primary**: francois.lane@example.com
- **GitHub**: https://github.com/zoyth/simple-site-framework/security

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/deploying/production-checklist#security)

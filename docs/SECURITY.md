# Gunimi Security Overview

**Version:** 1.0  
**Last updated:** September 2026  
**Contact:** hello@gunimi.com

---

## 1. Infrastructure

Gunimi is built on enterprise-grade infrastructure operated by vendors with their own security certifications.

| Layer | Provider | Certification |
|---|---|---|
| Application hosting | Vercel | SOC 2 Type II |
| Database & Auth | Supabase | SOC 2 Type II |
| Email delivery | Postmark | SOC 2 Type II |
| Rate limiting / cache | Upstash | SOC 2 Type II |
| Error monitoring | Sentry | SOC 2 Type II |

All data is stored in the **European Union** (EU-West region). No data is stored or processed outside the EU.

---

## 2. Data Isolation

Every workspace in Gunimi is fully isolated at the database level using **Row Level Security (RLS)** enforced by PostgreSQL.

- RLS policies are defined at the database layer — not in application code
- Even if a bug existed in the application, a workspace cannot read, write or access another workspace's data
- Each authenticated request carries a verified JWT token; the database validates this token before executing any query
- There is no shared data between workspaces

---

## 3. Authentication

- Passwords are **never stored** by Gunimi — authentication is handled by Supabase Auth, which stores only bcrypt-hashed credentials
- Sessions use short-lived **JWT access tokens** (1 hour) with refresh token rotation
- All authentication traffic is encrypted over HTTPS/TLS 1.3
- **Brute force protection:** login attempts are rate-limited to 5 per 15 minutes per IP address. After 3 failed attempts, an automated security alert is sent to the platform team

---

## 4. Email Integration

Email is connected via **OAuth 2.0** (Google or Microsoft) — Gunimi never receives or stores your email password.

- Gunimi receives a scoped OAuth access token with read/send permissions only
- Tokens are stored encrypted in the database
- Access can be revoked at any time from your Google or Microsoft account settings — this immediately terminates Gunimi's access
- Email content is processed to extract signals and context; it is never sold or shared with third parties

---

## 5. Encryption

| What | How |
|---|---|
| Data at rest | AES-256 (Supabase managed) |
| Data in transit | TLS 1.3 |
| OAuth tokens | Encrypted at rest in database |
| Passwords | bcrypt (never stored in plaintext) |

---

## 6. Access Control

- **Gunimi employees** have no access to workspace data by default
- Database access requires MFA and is logged
- Production access is restricted to the founding team only
- All administrative actions are logged in an immutable audit trail

---

## 7. Monitoring & Incident Response

- Application errors are captured automatically by Sentry
- Failed login attempts trigger automated alerts at threshold
- Infrastructure is monitored 24/7 by Vercel and Supabase
- In the event of a confirmed security incident, affected users will be notified within **72 hours** in accordance with GDPR Article 33

---

## 8. GDPR Compliance

- Gunimi is operated from the European Union
- Data is stored in EU-based infrastructure
- Users may request export or deletion of their data at any time by contacting hello@gunimi.com
- A Data Processing Agreement (DPA) is available upon request for business customers

---

## 9. What We Don't Have Yet

We believe in transparency. The following enterprise-grade certifications are on our roadmap but not yet completed:

- **SOC 2 Type II** for Gunimi itself (our infrastructure providers hold this; we are working toward our own certification)
- **ISO 27001** certification
- **Formal penetration test** by an accredited third party
- **SAML/SSO** enterprise login

For most small teams and individual consultants, our current security posture is comparable to tools like Notion, Airtable, or Linear.

If your organization has specific compliance requirements, contact us at hello@gunimi.com and we will work with you directly.

---

## 10. Reporting a Security Vulnerability

If you discover a security vulnerability in Gunimi, please report it responsibly:

**Email:** security@gunimi.com  
**Response time:** We aim to acknowledge all reports within 24 hours.

Please do not publicly disclose vulnerabilities before we have had a chance to address them.

---

---

## 11. Verified Security Tests

The following tests were conducted manually in September 2026 against the production environment at gunimi.com.

| Test | Description | Result |
|---|---|---|
| Data isolation | User B accessed User A's contact URL directly | 404 — no data exposed |
| Auth bypass | Unauthenticated request to `/dashboard/contacts` | Redirected to `/login` |
| Brute force / rate limiting | 6 consecutive failed login attempts | Blocked after 5 attempts |
| API without authentication | `POST /api/ai/chat` and `GET /api/signals/health` without token | 401 Unauthorized |
| XSS injection | `<script>alert('xss')</script>` entered as contact name | Not executed — safely escaped |

All five tests passed. No vulnerabilities were found.

These tests cover the most common attack vectors for SaaS applications. They do not replace a formal penetration test by an accredited third party, which remains on our roadmap.

---

*Gunimi is committed to protecting your data and being transparent about how we do it.*

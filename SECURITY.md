# Security Policy

## Supported Versions

We actively provide security updates for the following versions of `vuetify-nuxt4-module`:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of this module seriously. If you discover a security vulnerability within this project, please follow the steps below to report it:

1.  **Do not open a public issue.** Publicly disclosing a vulnerability can put users at risk.
2.  **Email us directly.** Please send a detailed report to the maintainers at [your-email@example.com](mailto:your-email@example.com) (or use the GitHub "Report a vulnerability" feature if enabled).
3.  **Provide details.** Include as much information as possible, such as:
    *   A description of the vulnerability.
    *   Steps to reproduce the issue.
    *   Potential impact.
    *   Any suggested fixes or mitigations.

### Our Response Process

*   We will acknowledge receipt of your report within 48 hours.
*   We will investigate the issue and provide an estimated timeline for a fix.
*   Once a fix is ready, we will release a new version and, if appropriate, publish a security advisory.

## Security Practices

*   **Dependency Management**: We use automated tools to monitor and update dependencies for known vulnerabilities.
*   **Minimal Surface Area**: We aim to keep the module's runtime footprint as small as possible to reduce potential attack vectors.
*   **SSR Safety**: We prioritize security in Server-Side Rendering (SSR) contexts, ensuring that configuration data and persistence mechanisms (like cookies) are handled using Nuxt best practices.

Thank you for helping keep this project secure!

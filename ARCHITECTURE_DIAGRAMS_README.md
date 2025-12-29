# Architecture Diagrams - ViralForge Marketplace

This directory contains high-level architecture diagrams focused on security features, which are our major differentiator.

## Diagrams Overview

### 01-system-overview.mmd
**System Overview Architecture**
- High-level view of the entire system
- Shows client connections, security layers, API gateway, services, and data storage
- Perfect for executive presentations

### 02-security-architecture.mmd
**Security Architecture (Key Differentiator)**
- Comprehensive security features breakdown
- Input security (WAF, Rate Limiting, CSRF)
- Authentication security (Argon2, JWT, MFA, OAuth)
- Authorization (RBAC, Permissions)
- Data security (Encryption, SQL Injection Prevention, PII Protection)
- Payment security (Stripe Escrow, PCI Compliance)
- Security monitoring (Logging, Audit Trail)

### 03-data-flow-security.mmd
**Data Flow with Security Checkpoints**
- Shows how data flows through the system
- Highlights security layers at each step
- Edge security → API → Business Logic → Storage
- Emphasizes security at every checkpoint

### 04-payment-security-flow.mmd
**Secure Payment Escrow Flow**
- Sequence diagram showing secure payment process
- Brand → API → Stripe → Escrow → Creator flow
- Webhook verification and signature validation
- Escrow states: CREATED → FUNDED → COMPLETED → RELEASED

### 05-authentication-flow.mmd
**Authentication & Authorization Flow**
- Sequence diagram of secure login process
- Password hashing (Argon2)
- MFA integration
- JWT token generation and validation
- Role-based access control

### 06-infrastructure-security.mmd
**Docker & Infrastructure Security**
- Container security (non-root users, minimal images)
- Network isolation
- Secrets management
- Security monitoring
- Update and patching strategy

### 07-compliance-privacy.mmd
**GDPR & Privacy Compliance**
- GDPR compliance features
- Data minimization and retention
- User rights (access, deletion, portability)
- Privacy protection (encryption, anonymization)
- Audit trails and monitoring

## Usage

1. Use any online Mermaid renderer:
   - https://mermaid.live/
   - https://mermaid-js.github.io/mermaid-live-editor/
   - GitHub/GitLab (renders automatically)

2. Or use Mermaid CLI:
   ```bash
   npx @mermaid-js/mermaid-cli -i 01-system-overview.mmd -o 01-system-overview.png
   ```

3. For presentations, export as PNG/SVG at high resolution (300 DPI recommended)

## Focus Areas

These diagrams emphasize:
- **Security as a competitive advantage**
- **High-level architecture** (not implementation details)
- **Compliance and privacy** (GDPR, PCI)
- **Secure payment processing** (Escrow system)
- **Infrastructure security** (Docker, networking)

Perfect for marketing presentations and demonstrating security expertise to stakeholders.


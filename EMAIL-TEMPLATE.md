Subject: Azure AD Integration Request - AI Compass Application

Hi [IT Team/IT Security Team],

I'm requesting Azure AD integration for a new internal application called "AI Compass" - a secure catalog of AI tools for Sanofi employees.

## Quick Overview
- **Purpose**: Internal AI tools directory with analytics dashboard
- **Users**: Sanofi employees only (@sanofi.com, @genzyme.com, @aventis.com)
- **Security**: Corporate SSO with mandatory Terms & Conditions
- **Status**: Development complete, needs Azure AD authentication

## What I Need from IT
1. **Azure AD App Registration** in Sanofi tenant
2. **Client ID and Tenant ID** for configuration
3. **Microsoft Graph permissions**: User.Read, openid, profile, email (standard auth permissions)
4. **Production hosting guidance** (preferred domain/environment)

## Technical Details
- **Technology**: React + Microsoft MSAL library
- **Authentication**: Single Sign-On via corporate credentials
- **Data**: Internal tool catalog only (no external APIs or sensitive data)
- **Security**: Domain validation, session management, audit logging ready

## Business Value
- Centralized, secure access to approved AI tools
- Better governance and compliance for AI usage
- Analytics to inform AI strategy decisions
- Replaces manual spreadsheet processes

## Timeline
- **Target Go-Live**: [Your preferred date]
- **Estimated IT Effort**: 2-4 hours configuration + testing

I've prepared a detailed technical specification document with all requirements. Can we schedule a brief meeting to discuss the implementation approach?

**Attachments**: 
- IT-REQUEST-TEMPLATE.md (detailed specifications)
- AUTHENTICATION.md (technical setup guide)

Thanks for your support with this digital transformation initiative!

Best regards,
[Your Name]
[Your Title]
[Your Contact Information]

---

**For urgent questions**: [Your phone/Teams contact]
**Application Demo**: Available at http://localhost:5173/?demo=true (with demo parameter)

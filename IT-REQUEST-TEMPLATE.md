# IT Request: Azure AD Integration for AI Compass Application

## Application Overview
**Application Name**: AI Compass  
**Purpose**: Internal AI tools catalog and analytics dashboard for Sanofi employees  
**Current Status**: Development complete, requires Azure AD authentication integration  
**Requested By**: [Your Name]  
**Department**: [Your Department]  
**Priority**: [High/Medium/Low]  
**Target Go-Live Date**: [Your preferred date]

## Business Justification
- Centralized catalog of approved AI tools for Sanofi employees
- Secure access control limited to Sanofi personnel only
- Analytics dashboard for AI tools usage and capability assessment
- Supports digital transformation and AI governance initiatives
- Replaces manual processes with automated, secure solution

## Technical Requirements

### 1. Azure AD App Registration
**Request**: Create new Azure AD Application Registration in Sanofi tenant

**Configuration Needed**:
- **Application Name**: `AI-Compass` or `Sanofi-AI-Tools-Catalog`
- **Supported Account Types**: `Accounts in this organizational directory only (Sanofi)`
- **Application Type**: `Single Page Application (SPA)`
- **Redirect URIs**: 
  - Development: `http://localhost:5173/`
  - Production: `https://[your-production-domain]/` (to be provided)

### 2. API Permissions Required
The application needs the following **Microsoft Graph** permissions:

| Permission | Type | Purpose |
|------------|------|---------|
| `User.Read` | Delegated | Read user profile information |
| `openid` | Delegated | Sign in and read user profile |
| `profile` | Delegated | Read user's basic profile |
| `email` | Delegated | Read user's email address |

**Note**: These are standard permissions for user authentication - no elevated privileges required.

### 3. Information Required from IT
Please provide the following information after app registration:

**Essential Configuration Values**:
- **Application (Client) ID**: `[GUID from Azure AD]`
- **Directory (Tenant) ID**: `[Sanofi tenant GUID]`
- **Authority URL**: `https://login.microsoftonline.com/[tenant-id]`

### 4. Domain Validation
**Approved Email Domains** (already configured in application):
- `@sanofi.com`
- `@genzyme.com`
- `@aventis.com`
- `@merial.com` (if applicable)

**Question for IT**: Are there other Sanofi subsidiary domains that should be included?

### 5. Security Features
**Built-in Security Controls**:
- ✅ Email domain validation (Sanofi employees only)
- ✅ Mandatory Terms & Conditions acceptance
- ✅ Session management with secure logout
- ✅ No external data transmission (internal catalog only)
- ✅ Audit logging capabilities
- ✅ Responsive to Azure AD security policies

## Deployment Architecture

### Current Setup
- **Technology Stack**: React 18 + TypeScript + Vite
- **Authentication Library**: Microsoft MSAL (Microsoft Authentication Library)
- **Hosting**: [To be determined - internal servers/Azure/etc.]
- **Database**: None required (uses JSON configuration files)

### Production Requirements
- **SSL/HTTPS**: Required for production deployment
- **Domain**: Suggest `ai-compass.sanofi.com` or similar
- **Hosting Environment**: [Please advise - Azure App Service, internal IIS, etc.]

## Implementation Steps (For IT Team)

### Phase 1: Azure AD Configuration
1. Create Azure AD App Registration with specified settings
2. Configure API permissions and grant admin consent
3. Set up redirect URIs for development and production
4. Provide Client ID and Tenant ID to development team

### Phase 2: Application Deployment
1. Deploy application to production environment
2. Configure production environment variables
3. Test authentication flow with test users
4. Validate domain restrictions and security controls

### Phase 3: User Access & Testing
1. Test with limited user group
2. Validate Terms & Conditions workflow
3. Confirm audit logging functionality
4. Full rollout to authorized users

## Security Considerations

### Data Classification
- **Application Data**: Internal use only
- **User Data**: Standard corporate directory information
- **External Dependencies**: Microsoft Graph API only
- **Data Residency**: All data remains within Sanofi infrastructure

### Compliance
- ✅ Adheres to Sanofi IT security policies
- ✅ GDPR compliant (minimal data collection)
- ✅ No PII storage beyond session management
- ✅ Secure authentication via corporate identity provider

### Risk Assessment
- **Low Risk**: Standard internal web application
- **No External APIs**: Except Microsoft Graph (corporate approved)
- **No Sensitive Data**: Tool catalog information only
- **Standard Security**: Corporate SSO and domain restrictions

## Testing Requirements

### Pre-Production Testing
- [ ] Authentication flow with test users
- [ ] Domain validation (accept Sanofi emails, reject external)
- [ ] Terms & Conditions mandatory acceptance
- [ ] Logout functionality
- [ ] Session timeout behavior

### User Acceptance Testing
- [ ] Multiple departments/user types
- [ ] Different browsers and devices
- [ ] Mobile responsiveness
- [ ] Accessibility compliance

## Support & Maintenance

### Ongoing Support Needs
- **Application Support**: Development team
- **Authentication Issues**: IT Service Desk
- **Azure AD Changes**: IT Security team
- **User Questions**: Business application owner

### Monitoring Requirements
- Authentication success/failure rates
- User adoption metrics
- Error logging and alerting
- Security incident reporting

## Contact Information

**Technical Contact**: [Your name and email]  
**Business Owner**: [Business sponsor name and email]  
**Development Team**: [Team contact information]

## Questions for IT Team

1. **Timeline**: What is the typical timeline for Azure AD app registration?
2. **Testing**: Do you have a test Azure AD environment we can use first?
3. **Deployment**: What is the preferred hosting environment for this type of application?
4. **Domain**: Can we get a subdomain like `ai-compass.sanofi.com`?
5. **Monitoring**: What logging/monitoring tools should we integrate with?
6. **Support**: What is the process for ongoing Azure AD configuration changes?

## Attachments

**Technical Documentation**:
- Application architecture diagram (if available)
- Security assessment document
- Terms & Conditions legal text
- User interface screenshots

**Configuration Files**:
- `authConfig.ts` - Authentication configuration template
- `.env.example` - Environment variables template
- `AUTHENTICATION.md` - Complete setup guide

---

**Next Steps**: 
1. IT team reviews request and confirms feasibility
2. Schedule kickoff meeting to discuss timeline and requirements
3. Begin Azure AD app registration process
4. Development team provides production-ready build

**Estimated Effort**: 2-4 hours of IT configuration + testing time

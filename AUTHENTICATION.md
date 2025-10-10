# AI Compass - Authentication Setup Guide

## Overview
The AI Compass application now includes Single Sign-On (SSO) authentication using Microsoft Azure AD, restricting access to Sanofi employees only.

## Current Status
- ✅ **Demo Mode**: Mock authentication for development/testing
- 🔧 **Production Ready**: Framework ready for Azure AD integration

## Demo Authentication
The current implementation includes a mock authentication system that:
- Simulates Microsoft Azure AD login flow
- Validates Sanofi email domains (@sanofi.com, @genzyme.com, @aventis.com)
- Shows realistic login interface
- Stores user session in localStorage

## Production Setup

### 1. Azure AD App Registration
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App Registrations**
3. Click **New Registration**
4. Configure:
   - **Name**: AI Compass
   - **Supported Account Types**: Accounts in this organizational directory only (Sanofi)
   - **Redirect URI**: Web - `https://your-domain.com`

### 2. Configure Application
1. Note the **Application (client) ID**
2. Note the **Directory (tenant) ID**
3. Go to **Authentication**:
   - Add redirect URIs for development and production
   - Enable **ID tokens** and **Access tokens**
4. Go to **API Permissions**:
   - Add **Microsoft Graph** permissions:
     - `User.Read` (Delegated)
     - `openid` (Delegated)
     - `profile` (Delegated)
     - `email` (Delegated)

### 3. Update Configuration
1. Copy `.env.example` to `.env`
2. Update with your Azure AD settings:
   ```env
   VITE_AZURE_CLIENT_ID=your-client-id-here
   VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
   VITE_REDIRECT_URI=https://your-domain.com
   ```

### 4. Install Production Dependencies
```bash
npm install @azure/msal-react @azure/msal-browser
```

### 5. Replace Mock Authentication
In `src/Authentication.tsx`, replace the `mockAuthentication` function with actual MSAL implementation:

```typescript
import { useMsal } from '@azure/msal-react'
import { loginRequest } from './authConfig'

// Replace mockAuthentication with:
const { instance } = useMsal()
const handleLogin = () => {
  instance.loginRedirect(loginRequest)
}
```

## Security Features

### Domain Validation
- Restricts access to approved Sanofi domains
- Validates user email during authentication
- Rejects non-Sanofi accounts automatically

### Session Management
- Secure token storage
- Automatic session refresh
- Clean logout process

### Role-Based Access (Optional)
- Admin vs User roles
- Can be extended with Azure AD groups
- Configurable permissions

## User Experience

### Login Flow
1. User visits application
2. Redirected to authentication screen
3. Clicks "Sign in with Microsoft"
4. Redirected to Microsoft login
5. After successful auth, returns to app
6. User profile shown in header
7. Secure access to all features

### Logout Process
- Click logout button in header
- Session cleared from browser
- Redirected to login screen
- Optional: Global Microsoft logout

## Development vs Production

### Development (Current)
- Mock authentication (auto-login as Sonnil Le)
- No real Azure AD integration
- Perfect for development and demos

### Production (After Setup)
- Real Microsoft Azure AD authentication
- Actual Sanofi employee validation
- Secure token management
- Integration with corporate identity

## Testing
- **Demo User**: sonnil.le@sanofi.com
- **Auto-login**: 2-second delay simulation
- **Domain Validation**: Tests @sanofi.com restriction
- **UI/UX**: Full authentication flow simulation

## Support
For production deployment questions, contact:
- IT Security team for Azure AD setup
- Digital Innovation team for application configuration
- Sonnil Le (sonnil.le@sanofi.com) for technical support

// MSAL Configuration
export const msalConfig = {
  auth: {
    clientId: 'your-azure-app-client-id', // Replace with your Azure App Registration Client ID
    authority: 'https://login.microsoftonline.com/your-sanofi-tenant-id', // Replace with your Sanofi tenant ID
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
}

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
}

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
}

// Sanofi domain validation
export const validateSanofiUser = (account: any): boolean => {
  if (!account) return false
  
  // Check if user email ends with @sanofi.com or other approved Sanofi domains
  const approvedDomains = [
    '@sanofi.com',
    '@genzyme.com',
    '@aventis.com',
    '@merial.com',
    '@boehringer-ingelheim.com', // If applicable
    '@regeneron.com', // If applicable
    // Add other Sanofi subsidiary domains as needed
  ]
  
  const userEmail = account.username?.toLowerCase() || ''
  return approvedDomains.some(domain => userEmail.endsWith(domain))
}

// Role-based access control (optional)
export const getUserRole = (account: any): 'admin' | 'user' | 'guest' => {
  if (!account) return 'guest'
  
  const userEmail = account.username?.toLowerCase() || ''
  
  // Define admin users (you can also use Azure AD groups for this)
  const adminUsers = [
    'sonnil.le@sanofi.com',
    // Add other admin emails here:
    // 'it.admin@sanofi.com',
    // 'digital.lead@sanofi.com',
    // 'ai.team@sanofi.com',
  ]
  
  if (adminUsers.includes(userEmail)) {
    return 'admin'
  }
  
  return validateSanofiUser(account) ? 'user' : 'guest'
}

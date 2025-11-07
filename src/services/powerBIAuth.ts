/**
 * Power BI Authentication Service
 * Handles Azure AD authentication for Power BI REST API access
 */

import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/common',
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

// Power BI API scope
const powerBIScopes = ['https://analysis.windows.net/powerbi/api/.default'];

/**
 * Initialize MSAL instance
 */
export async function initializeMsal(): Promise<void> {
  await msalInstance.initialize();
}

/**
 * Get access token for Power BI API
 */
export async function getPowerBIAccessToken(): Promise<string | null> {
  try {
    const accounts = msalInstance.getAllAccounts();
    
    if (accounts.length > 0) {
      // Try silent token acquisition first
      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: powerBIScopes,
          account: accounts[0]
        });
        return response.accessToken;
      } catch (silentError) {
        console.log('Silent token acquisition failed, may need interactive login');
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting Power BI access token:', error);
    return null;
  }
}

/**
 * Trigger interactive login for Power BI access
 */
export async function loginForPowerBI(): Promise<string | null> {
  try {
    await initializeMsal();
    
    const response = await msalInstance.acquireTokenPopup({
      scopes: powerBIScopes,
    });
    
    return response.accessToken;
  } catch (error) {
    console.error('Error during Power BI login:', error);
    return null;
  }
}

/**
 * Check if user is authenticated for Power BI
 */
export function isPowerBIAuthenticated(): boolean {
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0;
}

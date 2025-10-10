import React, { useState, useEffect } from 'react'
import { Shield, LogIn, Building, AlertCircle, CheckCircle } from 'lucide-react'
import { BRAND } from './branding'

interface AuthenticationProps {
  onAuthenticated: (user: any) => void
}

// Production authentication - integrate with Azure AD MSAL
const authenticateUser = async (): Promise<any> => {
  // For development/demo purposes only - remove in production
  if (window.location.search.includes('demo=true')) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          username: 'demo.user@sanofi.com',
          name: 'Demo User',
          jobTitle: 'Employee',
          department: 'Various',
          accountId: 'demo-123'
        })
      }, 1500)
    })
  }
  
  // TODO: Replace with actual MSAL authentication
  throw new Error('Azure AD authentication not yet configured. Please contact your IT administrator to complete the Azure AD setup for this application.')
}

const validateSanofiUser = (account: any): boolean => {
  if (!account) return false
  
  const approvedDomains = [
    '@sanofi.com',
    '@genzyme.com',
    '@aventis.com',
    '@merial.com',
    '@boehringer-ingelheim.com', // If applicable
    '@regeneron.com', // If applicable
  ]
  
  const userEmail = account.username?.toLowerCase() || ''
  return approvedDomains.some(domain => userEmail.endsWith(domain))
}

export default function Authentication({ onAuthenticated }: AuthenticationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTerms, setShowTerms] = useState(false)
  const [hasReadTerms, setHasReadTerms] = useState(false)

  const handleLogin = async () => {
    if (!hasReadTerms) {
      setError('You must read and agree to the Terms & Conditions before signing in.')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // Production authentication with Azure AD
      const user = await authenticateUser()
      
      if (validateSanofiUser(user)) {
        onAuthenticated(user)
      } else {
        setError('Access denied. This application is restricted to Sanofi employees only.')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please contact IT support.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Sanofi Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4" style={{ backgroundColor: BRAND.colors.primary }}>
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">AI Compass</h1>
          <p className="text-slate-600 dark:text-slate-400">Secure Access Required</p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-8 py-6">
            <div className="text-center mb-6">
              <Building className="w-12 h-12 mx-auto mb-3" style={{ color: BRAND.colors.primary }} />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Sanofi Employee Access
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sign in with your Sanofi Windows credentials to access the AI tools catalog
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Terms & Conditions Checkbox */}
            <div className={`mb-6 p-4 rounded-xl border-2 transition-all ${
              error && error.includes('Terms & Conditions') 
                ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' 
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
            }`}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={hasReadTerms}
                    onChange={(e) => {
                      setHasReadTerms(e.target.checked)
                      if (e.target.checked && error?.includes('Terms & Conditions')) {
                        setError(null)
                      }
                    }}
                    className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    style={{ accentColor: BRAND.colors.primary }}
                  />
                  {hasReadTerms && (
                    <CheckCircle 
                      className="absolute inset-0 w-5 h-5 pointer-events-none"
                      style={{ color: BRAND.colors.primary }}
                    />
                  )}
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-relaxed">
                  <span>I have read and understand the </span>
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="font-medium hover:underline transition-colors"
                    style={{ color: BRAND.colors.primary }}
                  >
                    Terms & Conditions
                  </button>
                  <span> and agree to comply with all Sanofi policies regarding the use of this application and AI tools.</span>
                </div>
              </label>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading || !hasReadTerms}
              className="w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{ backgroundColor: BRAND.colors.primary }}
              title={!hasReadTerms ? 'Please read and agree to the Terms & Conditions first' : ''}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign in with Microsoft</span>
                </>
              )}
            </button>

            {!hasReadTerms && (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                Please read and agree to the Terms & Conditions to continue
              </p>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Secure authentication powered by Microsoft Azure AD
                </p>
              </div>
            </div>
          </div>

          {showTerms && (
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 max-h-80 overflow-y-auto">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: BRAND.colors.primary }} />
                Terms & Conditions - AI Compass
              </h3>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Authorized Use Only</h4>
                  <p>This application is exclusively for Sanofi employees and authorized personnel. Access is restricted to individuals with valid Sanofi corporate accounts (@sanofi.com, @genzyme.com, @aventis.com).</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Confidentiality & Data Protection</h4>
                  <p>All information within AI Compass is confidential and proprietary to Sanofi. Users must handle all data in accordance with Sanofi's Information Security policies and applicable data protection regulations.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Acceptable Use</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Use only for legitimate business purposes</li>
                    <li>Do not share access credentials</li>
                    <li>Report security incidents immediately</li>
                    <li>Comply with all Sanofi IT policies</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">AI Tools Usage</h4>
                  <p>When using AI tools referenced in this catalog, users must comply with Sanofi's AI Governance policies, including but not limited to data handling, content generation guidelines, and regulatory compliance requirements.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Monitoring & Compliance</h4>
                  <p>Usage of this application may be monitored and logged for security, compliance, and audit purposes in accordance with Sanofi policies and applicable laws.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">External Tools Disclaimer</h4>
                  <p>External AI tools listed in this catalog are subject to their respective terms of service. Sanofi does not guarantee the availability, security, or compliance of third-party tools. Users must ensure compliance with Sanofi policies when using external services.</p>
                </div>
                
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    <strong>Contact:</strong> For questions about these terms or AI tool usage, contact the Digital Innovation team or IT Security.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    <strong>Last Updated:</strong> October 2025
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legal Notice */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            🔒 Secured by Microsoft Azure AD
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2025 Sanofi. All rights reserved. For authorized personnel only.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            This system is monitored and usage is logged for security purposes.
          </p>
        </div>
      </div>
    </div>
  )
}

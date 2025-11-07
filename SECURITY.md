# Security Configuration Guide

## 🔐 API Key Management

### Overview
The AI Compass application uses OpenAI API for external agent responses. The API key is securely stored in environment variables and **never committed to the repository**.

### Setup Instructions

#### 1. Environment File (`.env`)
The OpenAI API key is stored in `.env` file at the root of the project:

```bash
# Server-side AI settings (used by Vercel functions in /api)
# These are NOT exposed to the browser and must not use VITE_
OPENAI_API_KEY=your-actual-openai-api-key-here
CHAT_MODEL=gpt-4o-mini
OPENAI_BASE=https://api.openai.com/v1
```

**✓ The `.env` file is automatically:**
- ✅ Loaded by Vite during development
- ✅ Ignored by Git (listed in `.gitignore`)
- ✅ Used by the API endpoints in `/api/ai-chat.ts`

#### 2. Git Protection
The following files/folders are **ignored by Git** (see `.gitignore`):

```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
secure/
```

**⚠️ NEVER commit:**
- `.env` file with real credentials
- Any files in the `secure/` folder
- API keys or secrets in code

#### 3. Production Deployment (Vercel/Other)
For production deployment, set environment variables in your hosting platform:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add: `OPENAI_API_KEY` with your production key
3. Add: `CHAT_MODEL` (optional, defaults to `gpt-4o-mini`)
4. Add: `OPENAI_BASE` (optional, defaults to OpenAI's API)

**Other platforms:**
Follow your platform's documentation for setting environment variables.

### How It Works

#### Backend (Secure)
The API endpoint (`/api/ai-chat.ts`) reads the key from environment variables:

```typescript
const OPENAI_KEY = process.env.OPENAI_API_KEY!
```

This key is **only accessible server-side** and never exposed to the browser.

#### Frontend (No Keys)
The frontend never has direct access to the OpenAI key. It makes requests to `/api/ai-chat` which handles the secure communication with OpenAI.

### Verification

#### Check if .env is properly ignored:
```bash
git check-ignore .env
# Should output: .env
```

#### Check if secure/ folder is ignored:
```bash
git check-ignore secure/
# Should output: secure/
```

#### Verify environment variable is loaded:
```bash
# Start dev server
npm run dev

# In another terminal
curl http://localhost:3000/api/ai-chat
# Should return: {"ok":true,"hasKey":true}
```

### Security Best Practices

1. **Never commit credentials** - Always use environment variables
2. **Rotate keys regularly** - Update OpenAI keys periodically
3. **Use different keys** - Separate keys for development/staging/production
4. **Monitor usage** - Check OpenAI dashboard for unexpected usage
5. **Limit key permissions** - Use API keys with minimal required scopes

### Troubleshooting

#### API not working?
1. Verify `.env` file exists in project root
2. Check `OPENAI_API_KEY` is set correctly
3. Restart dev server after changing `.env`
4. Check API key is valid in OpenAI dashboard

#### Key exposed in git?
If you accidentally committed a key:
1. **Immediately revoke** the key in OpenAI dashboard
2. Generate a new key
3. Update `.env` with new key
4. Use `git filter-branch` or BFG Repo-Cleaner to remove from git history
5. Force push to remote (if already pushed)

### Support
For security concerns or questions, contact: **sonnille@gmail.com**

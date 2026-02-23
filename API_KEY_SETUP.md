# 🔐 API Key Setup Guide

## ⚠️ Your API Key Was Leaked and Blocked

Your Gemini API key was detected as leaked (likely committed to GitHub) and has been disabled by Google for security reasons.

## 🔄 Steps to Fix

### 1. Get a New API Key

1. Go to **Google AI Studio**: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy your **NEW** API key

### 2. Create `.env` File

```bash
# In your project root directory:
cp .env.example .env
```

### 3. Add Your New API Key

Open the `.env` file and replace `your_api_key_here` with your actual API key:

```env
VITE_GEMINI_API_KEY=AIzaSyA_YOUR_NEW_KEY_HERE
```

### 4. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🛡️ Security Best Practices

### ✅ DO:
- Store API keys in `.env` file (already in `.gitignore`)
- Use environment variables (`import.meta.env.VITE_*`)
- Keep `.env.example` with placeholder values only
- Never commit `.env` to version control

### ❌ DON'T:
- Commit API keys to GitHub
- Share API keys in chat/email
- Put real keys in `.env.example`
- Expose keys in client-side code (for production apps)

## 🔍 Check If Your Key Is Safe

After fixing:
1. Check GitHub repository - make sure no `.env` file is committed
2. If found, **immediately**:
   - Delete the exposed key from Google AI Studio
   - Remove the file from git history: `git filter-branch` or use BFG Repo-Cleaner
   - Generate a new key

## 📝 Current Status

- ✅ `.env` is in `.gitignore` 
- ✅ Code uses environment variables
- ✅ `.env.example` now has placeholder only
- ⚠️ **You need to create `.env` with a NEW key**

## 🆘 Still Having Issues?

If you continue seeing the error after following these steps:
1. Double-check the `.env` file exists and has the correct key
2. Restart the dev server completely
3. Clear browser cache
4. Verify the key works by testing at: https://aistudio.google.com/

---

**Note:** The system has fallback to rule-based logic when AI is unavailable, so the app will still work (with reduced AI features) until you add a new key.

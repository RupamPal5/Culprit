# 🚀 Culprit AI Editor - Multi-Provider Auto-Fallback System

## ✨ Features

### 🔌 14 AI Providers Supported
**Premium:**
- Anthropic (Claude 3)
- OpenAI (GPT-4, GPT-3.5)
- Google (Gemini Pro)

**Free/Generous Tiers:**
- Groq (Mixtral - fastest!)
- Mistral AI
- Together AI
- Cerebras
- DeepSeek
- Hugging Face
- Cloudflare Workers AI
- Fireworks AI
- GitHub Models
- OpenRouter
- Ollama (local, no key needed)

### 🔄 Auto-Fallback System
- **Smart Switching**: If one provider fails or hits rate limit, automatically switches to next
- **Failure Tracking**: Disables providers after 3 consecutive failures
- **Priority Order**: Tries providers in order of reliability/speed
- **Demo Mode**: Works without any API keys (simulated responses)

### 💻 Code Editor Features
- Monaco Editor (VS Code engine)
- Syntax highlighting for 50+ languages
- Real-time AI chat assistance
- File explorer
- Terminal integration
- WebContainers support (coming soon)

---

## 🏃 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Add API Keys (Optional)
Edit `.env.local` and add your keys:
```bash
# Premium
ANTHROPIC_API_KEY=sk-ant-your-key
OPENAI_API_KEY=sk-your-key
GOOGLE_API_KEY=your-key

# Free tiers
GROQ_API_KEY=gsk_your-key
MISTRAL_API_KEY=your-key
TOGETHER_API_KEY=your-key
CEREBRAS_API_KEY=your-key
DEEPSEEK_API_KEY=your-key
HUGGINGFACE_API_KEY=hf_your-key
CLOUDFLARE_API_KEY=your-key
CLOUDFLARE_ACCOUNT_ID=your-account-id
FIREWORKS_API_KEY=your-key
GITHUB_TOKEN=ghp_your-token
OPENROUTER_API_KEY=your-key
```

**Note**: System works in demo mode without keys!

### 3. Run Server
```bash
npm start
```

### 4. Open Browser
```
http://localhost:3000
```

---

## 🔧 API Endpoints

### POST /api/chat
Send a message to AI with auto-fallback.
```json
{
  "message": "Write a React component",
  "context": "Using TypeScript and Tailwind"
}
```

Response:
```json
{
  "success": true,
  "response": "Here's your component...",
  "provider": "groq" // Shows which provider responded
}
```

### GET /api/providers
Check status of all providers.
```json
{
  "providers": [
    { "name": "anthropic", "enabled": true, "failures": 0 },
    { "name": "openai", "enabled": true, "failures": 0 },
    ...
  ]
}
```

### POST /api/code-execute
Execute code (sandbox coming soon).
```json
{
  "code": "console.log('Hello')",
  "language": "javascript"
}
```

---

## 📊 Disk Usage
- **Total**: ~70MB (well under 500MB limit!)
- **node_modules**: 31MB
- **Source code**: <1MB
- **Room for growth**: 430MB+

---

## 🎯 How Auto-Fallback Works

1. User sends a request
2. System tries first enabled provider (e.g., Anthropic)
3. If fails (rate limit, error, timeout):
   - Logs failure
   - Moves to next provider (e.g., OpenAI)
   - Retries automatically
4. On success:
   - Returns response
   - Resets failure count for that provider
   - Sets successful provider as new default
5. After 3 failures:
   - Provider temporarily disabled
   - Skipped in future requests until re-enabled

**Example Flow:**
```
Request → Anthropic (rate limited) ❌
        → OpenAI (success!) ✅
        → Response returned
        → Next request starts with OpenAI
```

---

## 🆓 Free API Keys Guide

### Groq (Recommended - Fast & Free)
1. Visit: https://console.groq.com/keys
2. Sign up (free)
3. Create API key
4. Add to `.env.local`: `GROQ_API_KEY=gsk_xxx`

### Google Gemini (Free Tier)
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Add: `GOOGLE_API_KEY=xxx`

### Hugging Face (Free)
1. Visit: https://huggingface.co/settings/tokens
2. Create token (read access)
3. Add: `HUGGINGFACE_API_KEY=hf_xxx`

### OpenRouter (Free Credits)
1. Visit: https://openrouter.ai/keys
2. Sign up (free $1 credit)
3. Create key
4. Add: `OPENROUTER_API_KEY=xxx`

### GitHub Models (Free Beta)
1. Visit: https://github.com/marketplace/models
2. Sign in with GitHub
3. Generate token
4. Add: `GITHUB_TOKEN=ghp_xxx`

### Ollama (Local - No Key)
1. Install: https://ollama.ai
2. Run: `ollama run llama3`
3. System auto-detects on localhost:11434

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **AI SDK**: Native fetch (no bloat)
- **Frontend**: React + Monaco Editor
- **State**: Zustand
- **Styling**: Tailwind CSS
- **Protocol**: WebSocket (real-time)

---

## 📝 License

MIT - Build something awesome!

---

## 🤝 Contributing

Add more providers by extending `AIFallbackSystem` class in `server.js`!

---

**Made with ❤️ by Culprit Team**

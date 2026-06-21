import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import http from 'http';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Multi-Provider AI System with Auto-Fallback
class AIFallbackSystem {
  constructor() {
    this.providers = [
      { name: 'anthropic', enabled: !!process.env.ANTHROPIC_API_KEY },
      { name: 'openai', enabled: !!process.env.OPENAI_API_KEY },
      { name: 'google', enabled: !!process.env.GOOGLE_API_KEY },
      { name: 'groq', enabled: !!process.env.GROQ_API_KEY },
      { name: 'mistral', enabled: !!process.env.MISTRAL_API_KEY },
      { name: 'together', enabled: !!process.env.TOGETHER_API_KEY },
      { name: 'cerebras', enabled: !!process.env.CEREBRAS_API_KEY },
      { name: 'deepseek', enabled: !!process.env.DEEPSEEK_API_KEY },
      { name: 'huggingface', enabled: !!process.env.HUGGINGFACE_API_KEY },
      { name: 'cloudflare', enabled: !!process.env.CLOUDFLARE_API_KEY && !!process.env.CLOUDFLARE_ACCOUNT_ID },
      { name: 'fireworks', enabled: !!process.env.FIREWORKS_API_KEY },
      { name: 'github', enabled: !!process.env.GITHUB_TOKEN },
      { name: 'openrouter', enabled: !!process.env.OPENROUTER_API_KEY },
      { name: 'ollama', enabled: true }
    ];
    this.currentIndex = 0;
    this.failureCounts = new Map();
  }

  async call(prompt, context = '') {
    const fullPrompt = `${context}\n\nUser: ${prompt}\n\nAssistant:`;
    
    for (let i = 0; i < this.providers.length; i++) {
      const providerIndex = (this.currentIndex + i) % this.providers.length;
      const provider = this.providers[providerIndex];
      
      if (!provider.enabled) continue;
      
      try {
        console.log(`🔄 Trying ${provider.name}...`);
        const response = await this.callProvider(provider.name, fullPrompt);
        this.currentIndex = providerIndex;
        this.failureCounts.set(provider.name, 0);
        return response;
      } catch (error) {
        console.error(`❌ ${provider.name} failed:`, error.message.slice(0, 100));
        this.failureCounts.set(provider.name, (this.failureCounts.get(provider.name) || 0) + 1);
        
        if (this.failureCounts.get(provider.name) >= 3) {
          provider.enabled = false;
          console.log(`⚠️  Disabled ${provider.name} after 3 failures`);
        }
      }
    }
    
    throw new Error('All AI providers failed');
  }

  async callProvider(name, prompt) {
    switch (name) {
      case 'anthropic': return this.callAnthropic(prompt);
      case 'openai': return this.callOpenAI(prompt);
      case 'google': return this.callGoogle(prompt);
      case 'groq': return this.callGroq(prompt);
      case 'mistral': return this.callMistral(prompt);
      case 'together': return this.callTogether(prompt);
      case 'cerebras': return this.callCerebras(prompt);
      case 'deepseek': return this.callDeepSeek(prompt);
      case 'huggingface': return this.callHuggingFace(prompt);
      case 'cloudflare': return this.callCloudflare(prompt);
      case 'fireworks': return this.callFireworks(prompt);
      case 'github': return this.callGitHub(prompt);
      case 'openrouter': return this.callOpenRouter(prompt);
      case 'ollama': return this.callOllama(prompt);
      default: throw new Error(`Unknown provider: ${name}`);
    }
  }

  async callAnthropic(prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!response.ok) throw new Error('Anthropic API error');
    const data = await response.json();
    return data.content[0].text;
  }

  async callOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    if (!response.ok) throw new Error('OpenAI API error');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callGoogle(prompt) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    if (!response.ok) throw new Error('Google API error');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async callGroq(prompt) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    if (!response.ok) throw new Error('Groq API error');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callMistral(prompt) {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    if (!response.ok) throw new Error('Mistral API error');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callTogether(prompt) {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    if (!response.ok) throw new Error('Together API error');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callCerebras(prompt) {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    if (!response.ok) throw new Error('Cerebras API error');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callDeepSeek(prompt) {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    if (!response.ok) throw new Error('DeepSeek API error');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callHuggingFace(prompt) {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );
    if (!response.ok) throw new Error('HuggingFace API error');
    const data = await response.json();
    return Array.isArray(data) ? data[0].generated_text : data.generated_text;
  }

  async callCloudflare(prompt) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
      }
    );
    if (!response.ok) throw new Error('Cloudflare API error');
    const data = await response.json();
    return data.result.response;
  }

  async callFireworks(prompt) {
    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIREWORKS_API_KEY}`
      },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/mixtral-8x7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    if (!response.ok) throw new Error('Fireworks API error');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callGitHub(prompt) {
    const response = await fetch(
      'https://models.inference.ai.azure.com/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024
        })
      }
    );
    if (!response.ok) throw new Error('GitHub Models API error');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callOpenRouter(prompt) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    if (!response.ok) throw new Error('OpenRouter API error');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callOllama(prompt) {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        stream: false
      })
    }).catch(() => { throw new Error('Ollama not running locally'); });
    if (!response.ok) throw new Error('Ollama API error');
    const data = await response.json();
    return data.response;
  }

  getStatus() {
    return this.providers.map(p => ({
      name: p.name,
      enabled: p.enabled,
      failures: this.failureCounts.get(p.name) || 0
    }));
  }
}

const aiSystem = new AIFallbackSystem();

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    const response = await aiSystem.call(message, context);
    res.json({ success: true, response, provider: 'auto' });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.json({ 
      success: false, 
      response: "🤖 Demo Mode: Add API keys to .env.local for real AI responses!\n\nSupported providers:\n- Anthropic (Claude)\n- OpenAI (GPT-4)\n- Google (Gemini)\n- Groq (Mixtral)\n- Mistral AI\n- Together AI\n- Cerebras\n- DeepSeek\n- Hugging Face\n- Cloudflare Workers AI\n- Fireworks AI\n- GitHub Models\n- OpenRouter\n- Ollama (local)\n\nAuto-fallback enabled: If one fails, switches automatically!",
      provider: 'demo'
    });
  }
});

app.get('/api/providers', (req, res) => {
  res.json({ providers: aiSystem.getStatus() });
});

app.post('/api/code-execute', async (req, res) => {
  const { code, language } = req.body;
  res.json({ 
    success: true, 
    output: `✅ Code executed!\nLanguage: ${language}\n\nNote: Full sandbox execution coming soon with WebContainers.`
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  const enabledCount = aiSystem.providers.filter(p => p.enabled).length;
  console.log(`\n🚀 Culprit AI Editor - Multi-Provider System Active!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔌 ${enabledCount}/${aiSystem.providers.length} providers enabled`);
  console.log(`\n💡 Add keys to .env.local:`);
  console.log('   ANTHROPIC_API_KEY=sk-ant-...');
  console.log('   OPENAI_API_KEY=sk-...');
  console.log('   GOOGLE_API_KEY=...');
  console.log('   GROQ_API_KEY=gsk_...');
  console.log('   MISTRAL_API_KEY=...');
  console.log('   ...and 9 more!\n');
  console.log('✨ Auto-switching enabled: Hits limit? Switches to next provider!\n');
});

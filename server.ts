import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { completePublicAction, getPublicCampaign, joinPublicCampaign } from './api/_lib/teable';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'viral-sweepstakes' });
});

app.get('/api/campaigns/:slug', async (req, res) => {
  try {
    const campaign = await getPublicCampaign(req.params.slug);
    if (!campaign) return res.status(404).json({ error: 'campaign not found' });
    return res.json({ campaign });
  } catch (error) {
    console.error('Campaign read failed:', error);
    return res.status(500).json({ error: 'campaign data unavailable' });
  }
});

app.post('/api/campaigns/:slug/join', async (req, res) => {
  try {
    const { name, email, referrerCode } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'name and a valid email are required' });
    }

    const result = await joinPublicCampaign({
      slug: req.params.slug,
      name,
      email,
      referrerCode: typeof referrerCode === 'string' ? referrerCode : undefined,
    });
    if (result.kind === 'not_found') return res.status(404).json({ error: 'campaign not found' });
    if (result.kind === 'inactive') return res.status(409).json({ error: 'campaign is not active' });
    if (result.kind === 'duplicate') return res.status(409).json({ error: 'email already entered this campaign' });
    return res.status(201).json(result);
  } catch (error) {
    console.error('Campaign join failed:', error);
    return res.status(500).json({ error: 'campaign join unavailable' });
  }
});

app.post('/api/campaigns/:slug/actions/:actionKey/complete', async (req, res) => {
  try {
    const { subscriberId } = req.body ?? {};
    if (typeof subscriberId !== 'string' || !subscriberId) {
      return res.status(400).json({ error: 'subscriberId is required' });
    }

    const result = await completePublicAction({
      slug: req.params.slug,
      actionKey: req.params.actionKey,
      subscriberId,
    });
    if (result.kind === 'not_found') return res.status(404).json({ error: 'campaign not found' });
    if (result.kind === 'subscriber_not_found') return res.status(404).json({ error: 'subscriber not found' });
    if (result.kind === 'action_not_found') return res.status(404).json({ error: 'action not found' });
    return res.status(201).json({ ok: true, awarded: result.awarded, status: result.status });
  } catch (error) {
    console.error('Campaign action failed:', error);
    return res.status(500).json({ error: 'action completion unavailable' });
  }
});

// Initialize Google GenAI on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint: AI Campaign & Strategy Generator
app.post('/api/ai/generate-campaign', async (req, res) => {
  try {
    const { prompt, industry, targetAudience, campaignType } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback with rich default generated structure if key is not attached yet
      return res.json({
        title: `${industry || 'Creator'} Viral Boost Launch`,
        headline: `Win the Ultimate ${industry || 'Pro'} Setup & VIP Access`,
        description: `Join thousands of enthusiasts competing in our high-energy viral drop. Complete quick challenges and refer friends for amplified tickets!`,
        clientName: `Apex ${industry || 'Studio'} Labs`,
        prizeTitle: `Flagship ${industry || 'Tech'} Grand Experience Package`,
        prizeDescription: `Delivered worldwide with priority warranty, exclusive founder perks, and a 1-year VIP subscription.`,
        prizeValueUsd: 2500,
        prizeImageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
        referralRewardEntries: 5,
        theme: {
          primaryColor: "#6366F1",
          accentColor: "#F59E0B",
          bgColor: "slate-950",
          headlineFont: "Plus Jakarta Sans",
          cardStyle: "glass",
          borderRadius: "rounded-3xl",
          bannerLayout: "hero_spotlight"
        },
        actions: [
          {
            id: `act-wa-${Date.now()}`,
            title: "Share on WhatsApp Group",
            platform: "whatsapp",
            reward: 3,
            description: "Direct 1-tap invite link for your inner circle",
            verificationType: "instant_click",
            category: "social"
          },
          {
            id: `act-tw-${Date.now()}`,
            title: "Retweet Launch Announcement on X",
            platform: "twitter",
            reward: 4,
            description: "Broadcast launch post with #ViralLaunch",
            verificationType: "instant_click",
            category: "social"
          },
          {
            id: `act-yt-${Date.now()}`,
            title: "Watch 30-Sec Teaser Trailer",
            platform: "youtube",
            reward: 5,
            description: "Watch our reveal clip on YouTube",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            verificationType: "timed_watch",
            timedSeconds: 10,
            category: "content"
          },
          {
            id: `act-tg-${Date.now()}`,
            title: "Join VIP Telegram Channel",
            platform: "telegram",
            reward: 5,
            description: "Get secret bonus ticket codes and early announcements",
            url: "https://t.me/telegram",
            verificationType: "instant_click",
            category: "community"
          }
        ],
        milestones: [
          {
            id: `ms-1-${Date.now()}`,
            title: "Early Pioneer Tier",
            requiredPoints: 5,
            rewardType: "badge",
            rewardValue: "VIP Launch Badge",
            icon: "ShieldCheck"
          },
          {
            id: `ms-2-${Date.now()}`,
            title: "Promoter 20% Off Code",
            requiredPoints: 15,
            rewardType: "discount_code",
            rewardValue: "EARLY20OFF",
            icon: "Gift"
          },
          {
            id: `ms-3-${Date.now()}`,
            title: "Exclusive Starter Asset Kit",
            requiredPoints: 30,
            rewardType: "digital_download",
            rewardValue: "Creator Masterclass Pack PDF",
            icon: "Percent"
          }
        ]
      });
    }

    const systemPrompt = `You are an elite viral growth hacker and promotional campaign strategist. 
Generate a high-converting, fully customized viral sweepstakes and referral campaign configuration in valid JSON format.
Ensure actions have high engagement mechanics and milestones motivate multi-referral behavior.`;

    const userPrompt = `Generate a complete viral marketing campaign based on:
Prompt / Concept: ${prompt || 'High ticket giveaway'}
Industry: ${industry || 'Tech & Creator'}
Target Audience: ${targetAudience || 'Digital enthusiasts & creators'}
Campaign Type: ${campaignType || 'sweepstakes'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            headline: { type: Type.STRING },
            description: { type: Type.STRING },
            clientName: { type: Type.STRING },
            prizeTitle: { type: Type.STRING },
            prizeDescription: { type: Type.STRING },
            prizeValueUsd: { type: Type.NUMBER },
            prizeImageUrl: { type: Type.STRING },
            referralRewardEntries: { type: Type.NUMBER },
            actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  reward: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  verificationType: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ['title', 'platform', 'reward', 'description', 'verificationType']
              }
            },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  requiredPoints: { type: Type.NUMBER },
                  rewardType: { type: Type.STRING },
                  rewardValue: { type: Type.STRING },
                  icon: { type: Type.STRING }
                },
                required: ['title', 'requiredPoints', 'rewardType', 'rewardValue']
              }
            }
          },
          required: ['title', 'headline', 'description', 'clientName', 'prizeTitle', 'prizeDescription', 'prizeValueUsd', 'referralRewardEntries', 'actions', 'milestones']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    
    // Add stable IDs and fallbacks
    const formattedActions = (parsed.actions || []).map((a: any, i: number) => ({
      id: `act-ai-${Date.now()}-${i}`,
      title: a.title || 'Social Action',
      platform: a.platform || 'whatsapp',
      reward: Number(a.reward) || 3,
      description: a.description || 'Complete action for extra entries',
      verificationType: a.verificationType === 'timed_watch' ? 'timed_watch' : 'instant_click',
      timedSeconds: a.verificationType === 'timed_watch' ? 10 : undefined,
      category: a.category || 'social'
    }));

    const formattedMilestones = (parsed.milestones || []).map((m: any, i: number) => ({
      id: `ms-ai-${Date.now()}-${i}`,
      title: m.title || 'Tier Reward',
      requiredPoints: Number(m.requiredPoints) || (i + 1) * 10,
      rewardType: m.rewardType || 'discount_code',
      rewardValue: m.rewardValue || 'VIP perk',
      icon: m.icon || 'Gift'
    }));

    return res.json({
      ...parsed,
      prizeImageUrl: parsed.prizeImageUrl || "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
      actions: formattedActions.length > 0 ? formattedActions : undefined,
      milestones: formattedMilestones.length > 0 ? formattedMilestones : undefined
    });

  } catch (error: any) {
    console.error('Gemini Campaign Generation Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI campaign' });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

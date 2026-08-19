import { createHmac } from 'node:crypto';
import { isSecureUpstream } from '../_lib/access.js';

type VercelRequest = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; setHeader(name: string, value: string): void; json(body: unknown): void };

function signature(value: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '').update(value).digest('base64url');
}

function safeReadBody(body: unknown): Record<string, unknown> {
  if (!body) return {};
  if (typeof body === 'object') return body as Record<string, unknown>;
  if (typeof body === 'string') {
    try { return JSON.parse(body) as Record<string, unknown>; } catch { return {}; }
  }
  return {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

    // Diagnostic: return body info immediately to see what Vercel delivers
    const bodyType = typeof req.body;
    let bodyPreview = 'n/a';
    if (bodyType === 'object' && req.body !== null) {
      try { bodyPreview = JSON.stringify(req.body).slice(0, 200); } catch { bodyPreview = '<stringify-failed>'; }
    } else if (bodyType === 'string') {
      bodyPreview = (req.body as string).slice(0, 200);
    } else if (req.body === undefined) {
      // bodyPreview stays 'n/a'
    }
    return res.status(200).json({ diagnostic: true, bodyType, bodyPreview, hasAuthSecret: !!process.env.AUTH_SECRET });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(200).json({ diagnostic: true, caught: message });
  }
}

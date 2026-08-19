import { createHmac } from 'node:crypto';
import { isSecureUpstream } from '../_lib/access.js';

type VercelRequest = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> };
type VercelResponse = { status(code: number): VercelResponse; setHeader(name: string, value: string): void; json(body: unknown): void };

function signature(value: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '').update(value).digest('base64url');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const raw = req.body;
    let rawValue = 'n/a';
    let rawType = typeof raw;
    if (rawType === 'string') {
      rawValue = raw.slice(0, 200);
    } else if (rawType === 'object' && raw !== null) {
      try {
        rawValue = JSON.stringify(raw).slice(0, 200);
      } catch {
        rawValue = '<unserializable>';
      }
    } else if (raw === undefined) {
      rawValue = '<undefined>';
      rawType = 'undefined';
    }
    return res.status(200).json({
      ok: true,
      method: req.method || '?',
      debug: { bodyType: rawType, bodyValue: rawValue },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(200).json({ ok: true, debug: { caught: message } });
  }
}

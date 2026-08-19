type TeableRecord = {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
};

type TeableTable = { id: string; name: string };

const apiBase = (process.env.TEABLE_API_BASE ?? 'https://app.teable.ai/api').replace(/\/$/, '');
const baseId = process.env.TEABLE_BASE_ID;
const token = process.env.TEABLE_API_TOKEN;

let tableCache: Map<string, string> | null = null;

function requireConfig(): void {
  if (!baseId || !token) {
    throw new Error('TEABLE_BASE_ID and TEABLE_API_TOKEN are required for Teable access.');
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  requireConfig();
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Teable request failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  return response.json() as Promise<T>;
}

async function getTableId(name: string): Promise<string> {
  if (!tableCache) {
    const data = await request<TeableTable[] | { tables?: TeableTable[] }>(`/base/${baseId}/table`);
    const tables = Array.isArray(data) ? data : data.tables ?? [];
    tableCache = new Map(tables.map((table) => [table.name, table.id]));
  }

  const id = tableCache.get(name);
  if (!id) throw new Error(`Teable table not found: ${name}`);
  return id;
}

async function readAll(tableName: string): Promise<TeableRecord[]> {
  const tableId = await getTableId(tableName);
  const pageSize = 100;
  const records: TeableRecord[] = [];

  for (let skip = 0; ; skip += pageSize) {
    const data = await request<{ records?: TeableRecord[] }>(
      `/table/${tableId}/record?take=${pageSize}&skip=${skip}`,
    );
    const page = data.records ?? [];
    records.push(...page);
    if (page.length < pageSize) return records;
  }
}

function stringField(fields: Record<string, unknown>, key: string): string {
  return typeof fields[key] === 'string' ? fields[key] as string : '';
}

function numberField(fields: Record<string, unknown>, key: string): number {
  return typeof fields[key] === 'number' ? fields[key] as number : 0;
}

function booleanField(fields: Record<string, unknown>, key: string): boolean {
  return fields[key] === true;
}

function linkId(value: unknown): string | null {
  if (Array.isArray(value)) return linkId(value[0]);
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const id = (value as { id?: unknown }).id;
    return typeof id === 'string' ? id : null;
  }
  return null;
}

const DEFAULT_WARNING_PCT = 80;

type CampaignCap = {
  count: number;
  cap: number;
  tier: string;
  status: string;
  enforcement: string;
  warningPct: number;
  pct: number;
  remaining: number;
  warningMessage: string;
  reachedMessage: string;
  upgradeUrl: string;
};

function campaignCap(fields: Record<string, unknown>): CampaignCap {
  const count = numberField(fields, 'Total_Subscribers');
  const cap = numberField(fields, 'Entrant_Cap');
  const status = stringField(fields, 'Entrant_Cap_Status') || 'Unlimited';
  const enforcement = stringField(fields, 'Cap_Enforcement') || 'Off';
  return {
    count,
    cap,
    tier: stringField(fields, 'Plan_Tier') || 'Starter',
    status,
    enforcement,
    warningPct: numberField(fields, 'Cap_Warning_Pct') || DEFAULT_WARNING_PCT,
    pct: numberField(fields, 'Entrant_Usage_Pct'),
    remaining: numberField(fields, 'Entrants_Remaining'),
    warningMessage: stringField(fields, 'Cap_Warning_Message'),
    reachedMessage: stringField(fields, 'Cap_Reached_Message'),
    upgradeUrl: stringField(fields, 'Upgrade_URL'),
  };
}

type CampaignUsage = {
  count: number;
  cap: number;
  tier: string;
  status: string;
  enforcement: string;
  pct: number;
  remaining: number;
  warningPct: number;
  resetsAt: string | null;
  upgradeUrl: string;
  warningMessage: string;
  reachedMessage: string;
};

function toUsage(cap: CampaignCap): CampaignUsage {
  return {
    count: cap.count,
    cap: cap.cap,
    tier: cap.tier,
    status: cap.status,
    enforcement: cap.enforcement,
    pct: cap.cap > 0 ? cap.pct : 0,
    remaining: cap.cap > 0 ? cap.remaining : -1,
    warningPct: cap.warningPct,
    resetsAt: null,
    upgradeUrl: cap.upgradeUrl,
    warningMessage: cap.warningMessage,
    reachedMessage: cap.reachedMessage,
  };
}

/** Authoritative entrant usage for a campaign from the computed Teable rollup. */
export async function getCampaignUsage(slug: string): Promise<CampaignUsage | null> {
  const campaignRecords = await readAll('Viral Referral Engine');
  const campaign = campaignRecords.find((item) => stringField(item.fields, 'Public_Slug') === slug);
  if (!campaign) return null;
  return toUsage(campaignCap(campaign.fields));
}

function isHardStop(usage: CampaignCap): boolean {
  const mode = usage.enforcement.toLowerCase().replace(/[^a-z]/g, '');
  return mode === 'hardstop' && usage.status.toLowerCase() === 'full' && usage.cap > 0;
}

export async function joinPublicCampaign(input: {
  slug: string;
  name: string;
  email: string;
  referrerCode?: string;
}) {
  const campaignRecords = await readAll('Viral Referral Engine');
  const campaign = campaignRecords.find((item) => stringField(item.fields, 'Public_Slug') === input.slug);
  if (!campaign) return { kind: 'not_found' as const };
  if (stringField(campaign.fields, 'Status').toLowerCase() !== 'active') return { kind: 'inactive' as const };

  const cap = campaignCap(campaign.fields);
  if (isHardStop(cap)) {
    return {
      kind: 'cap_reached' as const,
      count: cap.count,
      cap: cap.cap,
      tier: cap.tier,
      status: cap.status,
      enforcement: cap.enforcement,
      pct: cap.pct,
      message: cap.reachedMessage || 'this campaign has reached its entrant limit',
    };
  }

  const subscribers = await readAll('Subscribers');
  const email = input.email.trim().toLowerCase();
  const duplicate = subscribers.find((item) =>
    linkId(item.fields.Campaign) === campaign.id && stringField(item.fields, 'Email').toLowerCase() === email,
  );
  if (duplicate) return { kind: 'duplicate' as const };

  const referralCode = `REF-${input.name.replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase() || 'USER'}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const subscriberTable = await getTableId('Subscribers');
  const response = await request<{ records?: TeableRecord[] }>(`/table/${subscriberTable}/record`, {
    method: 'POST',
    body: JSON.stringify({
      records: [{
        fields: {
          Subscriber_ID: `sub_${crypto.randomUUID()}`,
          Email: email,
          First_Name: input.name.trim(),
          Campaign: [{ id: campaign.id }],
          Referral_Code: referralCode,
          Referral_Code_Used: input.referrerCode?.trim() || null,
          Subscriber_Status: 'Active',
          Fraud_Status: 'Clean',
        },
      }],
    }),
  });

  const approaching = cap.cap > 0 && (cap.status.toLowerCase() === 'approaching' || cap.status.toLowerCase() === 'full');

  return {
    kind: 'created' as const,
    subscriberId: response.records?.[0]?.fields.Subscriber_ID ?? '',
    referralCode,
    referredByCode: input.referrerCode?.trim() || undefined,
    usage: {
      count: cap.count,
      cap: cap.cap,
      tier: cap.tier,
      status: cap.status,
      pct: cap.pct,
      warning: approaching ? 'entrant_cap_approaching' as const : null,
    },
  };
}

export async function completePublicAction(input: {
  slug: string;
  subscriberId: string;
  actionKey: string;
}) {
  const campaignRecords = await readAll('Viral Referral Engine');
  const campaign = campaignRecords.find((item) => stringField(item.fields, 'Public_Slug') === input.slug);
  if (!campaign) return { kind: 'not_found' as const };

  const subscribers = await readAll('Subscribers');
  const subscriber = subscribers.find((item) =>
    stringField(item.fields, 'Subscriber_ID') === input.subscriberId && linkId(item.fields.Campaign) === campaign.id,
  );
  if (!subscriber) return { kind: 'subscriber_not_found' as const };

  const actionRecords = await readAll('Campaign_Actions');
  const action = actionRecords.find((item) =>
    linkId(item.fields.Campaign) === campaign.id &&
    (stringField(item.fields, 'Action_Key') === input.actionKey || item.id === input.actionKey) &&
    item.fields.Active !== false,
  );
  if (!action) return { kind: 'action_not_found' as const };

  const trackedActions = await readAll('Tracked_Actions');
  const alreadyLogged = trackedActions.some((item) =>
    linkId(item.fields.Subscriber) === subscriber.id &&
    linkId(item.fields.Campaign_Action) === action.id,
  );
  if (alreadyLogged) return { kind: 'duplicate' as const, awarded: 0, status: 'pending_verification' };

  const trackedTable = await getTableId('Tracked_Actions');
  await request(`/table/${trackedTable}/record`, {
    method: 'POST',
    body: JSON.stringify({
      records: [{
        fields: {
          Action_ID: `action_${crypto.randomUUID()}`,
          Subscriber: [{ id: subscriber.id }],
          Campaign_Action: [{ id: action.id }],
          Action_Type: stringField(action.fields, 'Action_Type') || stringField(action.fields, 'Social_Channel'),
          Points_Awarded: 0,
          Entries_Awarded: 0,
          Verified: false,
          External_Event_ID: `intent_${crypto.randomUUID()}`,
          Action_Metadata: JSON.stringify({ source: 'participant_action_intent' }),
          Timestamp: new Date().toISOString(),
        },
      }],
    }),
  });

  return { kind: 'logged' as const, awarded: 0, status: 'pending_verification' };
}

async function updateRecord(tableName: string, recordId: string, fields: Record<string, unknown>): Promise<void> {
  const tableId = await getTableId(tableName);
  await request(`/table/${tableId}/record`, {
    method: 'PATCH',
    body: JSON.stringify({ records: [{ id: recordId, fields }] }),
  });
}

/**
 * Persist a promoter's campaign legal settings onto the live Teable campaign record
 * (stored as a single Legal_Settings_JSON long-text field on the Viral Referral Engine table).
 */
export async function saveCampaignLegalSettings(slug: string, legalSettings: Record<string, unknown>): Promise<boolean> {
  const campaignRecords = await readAll('Viral Referral Engine');
  const record = campaignRecords.find((item) => stringField(item.fields, 'Public_Slug') === slug);
  if (!record) return false;
  await updateRecord('Viral Referral Engine', record.id, {
    Legal_Settings_JSON: JSON.stringify(legalSettings),
  });
  return true;
}

export type Promoter = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  accessStatus: string;
  planTier: string;
};

function toPromoter(record: TeableRecord): Promoter {
  return {
    id: record.id,
    email: stringField(record.fields, 'Email').toLowerCase(),
    name: stringField(record.fields, 'Name'),
    passwordHash: stringField(record.fields, 'Password_Hash'),
    accessStatus: stringField(record.fields, 'Access_Status') || 'unpaid',
    planTier: stringField(record.fields, 'Plan_Tier'),
  };
}

export async function findPromoterByEmail(email: string): Promise<Promoter | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const records = await readAll('Promoters').catch(() => []);
  const record = records.find((item) => stringField(item.fields, 'Email').toLowerCase() === normalized);
  return record ? toPromoter(record) : null;
}

export async function createPromoter(input: { email: string; name: string; passwordHash: string; accessStatus: string; planTier?: string }) {
  const tableId = await getTableId('Promoters');
  const response = await request<{ records?: TeableRecord[] }>(`/table/${tableId}/record`, {
    method: 'POST',
    body: JSON.stringify({
      records: [{
        fields: {
          Email: input.email.trim().toLowerCase(),
          Name: input.name.trim(),
          Password_Hash: input.passwordHash,
          Access_Status: input.accessStatus,
          Plan_Tier: input.planTier ?? null,
          Created_At: Date.now(),
        },
      }],
    }),
  });
  return response.records?.[0] ? toPromoter(response.records[0]) : null;
}

export async function setPromoterAccessStatus(recordId: string, accessStatus: string, planTier?: string): Promise<void> {
  const fields: Record<string, unknown> = { Access_Status: accessStatus };
  if (planTier !== undefined) fields.Plan_Tier = planTier;
  await updateRecord('Promoters', recordId, fields);
}

export async function setPromoterPassword(recordId: string, passwordHash: string): Promise<void> {
  await updateRecord('Promoters', recordId, { Password_Hash: passwordHash });
}

export async function setPromoterResetToken(email: string, token: string, expiresAt: number): Promise<boolean> {
  const records = await readAll('Promoters').catch(() => []);
  const record = records.find((item) => stringField(item.fields, 'Email').toLowerCase() === email.trim().toLowerCase());
  if (!record) return false;
  await updateRecord('Promoters', record.id, {
    Password_Reset_Token: token,
    Password_Reset_Expires: expiresAt,
  });
  return true;
}

export async function resetPromoterPassword(token: string, passwordHash: string): Promise<boolean> {
  const records = await readAll('Promoters').catch(() => []);
  const now = Date.now();
  const record = records.find((item) =>
    stringField(item.fields, 'Password_Reset_Token') === token &&
    numberField(item.fields, 'Password_Reset_Expires') > now,
  );
  if (!record) return false;
  await updateRecord('Promoters', record.id, {
    Password_Hash: passwordHash,
    Password_Reset_Token: null,
    Password_Reset_Expires: null,
  });
  return true;
}

export async function getPublicCampaign(slug: string) {
  const campaignRecords = await readAll('Viral Referral Engine');
  const record = campaignRecords.find((item) => stringField(item.fields, 'Public_Slug') === slug);
  if (!record) return null;

  const fields = record.fields;
  const campaignId = record.id;
  const [actionRecords, formRecords] = await Promise.all([
    readAll('Campaign_Actions').catch(() => []),
    readAll('Campaign_Form_Fields').catch(() => []),
  ]);

  const legalJson = stringField(fields, 'Legal_Settings_JSON');
  let legalSettings: Record<string, unknown> | null = null;
  if (legalJson) {
    try {
      legalSettings = JSON.parse(legalJson);
    } catch {
      legalSettings = null;
    }
  }

  return {
    id: stringField(fields, 'Campaign_ID') || campaignId,
    slug,
    title: stringField(fields, 'Campaign_Name'),
    headline: stringField(fields, 'Campaign_Headline') || stringField(fields, 'Campaign_Name'),
    description: stringField(fields, 'Description'),
    status: stringField(fields, 'Status'),
    rewardMode: stringField(fields, 'Reward_Mode') || 'Points',
    referralPoints: numberField(fields, 'Referral_Points'),
    referralEntries: numberField(fields, 'Referral_Entries'),
    pointsLabel: stringField(fields, 'Points_Label') || 'Points',
    entryLabel: stringField(fields, 'Entry_Label') || 'Entries',
    // Attachment URLs require a server-side signing step before public exposure.
    coverImage: null,
    prize: {
      title: stringField(fields, 'Prize_Title'),
      description: stringField(fields, 'Prize_Description'),
      value: stringField(fields, 'Prize_Value'),
      drawsAt: stringField(fields, 'Draws_At'),
      winnerCount: numberField(fields, 'Winner_Count'),
      claimDeadline: stringField(fields, 'Claim_Deadline'),
    },
    showLeaderboard: booleanField(fields, 'Show_Leaderboard'),
    leaderboard: {
      metric: stringField(fields, 'Leaderboard_Metric') || 'Points',
      limit: numberField(fields, 'Leaderboard_Limit') || 10,
      privacy: stringField(fields, 'Leaderboard_Privacy') || 'Anonymous',
    },
    instructions: stringField(fields, 'Participant_Instructions'),
    officialRules: stringField(fields, 'Official_Rules'),
    legalSettings,
    actions: actionRecords
      .filter((item) => linkId(item.fields.Campaign) === campaignId && item.fields.Active !== false)
      .sort((a, b) => numberField(a.fields, 'Sort_Order') - numberField(b.fields, 'Sort_Order'))
      .map((item) => ({
        id: stringField(item.fields, 'Action_Key') || item.id,
        title: stringField(item.fields, 'Label'),
        description: stringField(item.fields, 'Description'),
        platform: stringField(item.fields, 'Social_Channel') || stringField(item.fields, 'Action_Type'),
        destinationUrl: stringField(item.fields, 'Destination_URL'),
        points: numberField(item.fields, 'Points_Value'),
        entries: numberField(item.fields, 'Entries_Value'),
        verificationMethod: stringField(item.fields, 'Verification_Method'),
      })),
    formFields: formRecords
      .filter((item) => linkId(item.fields.Campaign) === campaignId && item.fields.Active !== false)
      .sort((a, b) => numberField(a.fields, 'Sort_Order') - numberField(b.fields, 'Sort_Order'))
      .map((item) => ({
        id: stringField(item.fields, 'Field_Key') || item.id,
        label: stringField(item.fields, 'Label'),
        inputType: stringField(item.fields, 'Input_Type') || 'text',
        required: booleanField(item.fields, 'Required'),
        placeholder: stringField(item.fields, 'Placeholder'),
        options: Array.isArray(item.fields.Options) ? item.fields.Options : [],
      })),
  };
}

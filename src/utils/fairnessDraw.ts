import { Subscriber, DrawWinner, DrawAuditRecord } from '../types';

// Simple deterministic hash function for pseudo-random audit generation in browser
export function pseudoSha256(input: string): string {
  let hash1 = 0xdeadbeef;
  let hash2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 2654435761);
    hash2 = Math.imul(hash2 ^ ch, 1597334677);
  }
  hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507) ^ Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
  hash2 = Math.imul(hash2 ^ (hash2 >>> 16), 2246822507) ^ Math.imul(hash1 ^ (hash1 >>> 13), 3266489909);
  const part1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  const part3 = ((hash1 ^ hash2) >>> 0).toString(16).padStart(8, '0');
  const part4 = ((hash1 + hash2) >>> 0).toString(16).padStart(8, '0');
  return `${part1}${part2}${part3}${part4}`;
}

export interface TicketRange {
  subscriber: Subscriber;
  startTicket: number;
  endTicket: number;
  totalTickets: number;
}

export function buildTicketPool(subscribers: Subscriber[]): {
  ticketPool: TicketRange[];
  totalTickets: number;
} {
  // Only include active subscribers with > 0 entries
  const eligible = subscribers.filter(s => s.status === 'active' && s.totalEntries > 0);
  let currentTicket = 1;
  const ticketPool: TicketRange[] = [];

  for (const sub of eligible) {
    const start = currentTicket;
    const end = currentTicket + sub.totalEntries - 1;
    ticketPool.push({
      subscriber: sub,
      startTicket: start,
      endTicket: end,
      totalTickets: sub.totalEntries
    });
    currentTicket = end + 1;
  }

  return {
    ticketPool,
    totalTickets: currentTicket - 1
  };
}

export function executeFairRaffleDraw(
  subscribers: Subscriber[],
  winnerCount: number = 1,
  prizeTitle: string = "Grand Prize",
  campaignId: string = "campaign-1",
  campaignTitle: string = "Viral Sweepstakes"
): DrawAuditRecord {
  const { ticketPool, totalTickets } = buildTicketPool(subscribers);

  if (totalTickets === 0 || ticketPool.length === 0) {
    throw new Error("No eligible subscribers found in ticket pool.");
  }

  const timestamp = new Date().toISOString();
  // Generate random seed combined with high-res timestamp
  const randomSalt = Math.random().toString(36).substring(2, 15);
  const seedString = `draw-${campaignId}-${timestamp}-${randomSalt}-${totalTickets}`;
  const sha256Proof = pseudoSha256(seedString);

  const selectedWinners: DrawWinner[] = [];
  const selectedSubscriberIds = new Set<string>();

  // Pick N winners without duplicates (unless pool is smaller than winnerCount)
  for (let i = 0; i < winnerCount; i++) {
    if (selectedSubscriberIds.size >= ticketPool.length) break;

    let pickedTicket: number;
    let foundRange: TicketRange | undefined;
    let attempts = 0;

    do {
      // Deterministic pseudo-random number derived from hash of seed + step
      const stepHash = pseudoSha256(`${sha256Proof}-step-${i}-${attempts}`);
      const intVal = parseInt(stepHash.substring(0, 8), 16);
      pickedTicket = (intVal % totalTickets) + 1;

      foundRange = ticketPool.find(
        range => pickedTicket >= range.startTicket && pickedTicket <= range.endTicket
      );
      attempts++;
    } while (
      foundRange && 
      selectedSubscriberIds.has(foundRange.subscriber.id) && 
      attempts < 50 &&
      selectedSubscriberIds.size < ticketPool.length
    );

    if (foundRange) {
      selectedSubscriberIds.add(foundRange.subscriber.id);
      const sub = foundRange.subscriber;

      selectedWinners.push({
        subscriberId: sub.id,
        subscriberName: sub.name,
        subscriberEmail: sub.email,
        referralCode: sub.referralCode,
        totalEntriesAtDraw: sub.totalEntries,
        winningTicketNumber: pickedTicket,
        totalTicketsInPool: totalTickets,
        drawTimestamp: timestamp,
        auditHash: pseudoSha256(`winner-${sub.id}-${pickedTicket}-${timestamp}`),
        prizeTitle
      });
    }
  }

  return {
    campaignId,
    campaignTitle,
    drawnAt: timestamp,
    seed: seedString,
    totalEligibleSubscribers: ticketPool.length,
    totalTickets,
    winners: selectedWinners,
    sha256VerificationProof: sha256Proof
  };
}

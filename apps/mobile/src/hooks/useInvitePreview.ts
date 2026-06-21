import { useQuery } from '@tanstack/react-query';
import { env } from '@/lib/env';
import type { InvitePreviewStatus } from '@homeshared/shared';

export interface InvitePreview {
  status: InvitePreviewStatus;
  token: string;
  expiresAt: string;
  group: {
    name: string;
    description: string | null;
    imageUrl: string | null;
    memberCount: number;
  };
  invitedBy: string;
}

async function fetchInvitePreview(token: string): Promise<InvitePreview> {
  const url = `${env.API_URL}/api/invites/preview?token=${encodeURIComponent(token)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<InvitePreview>;
}

export function useInvitePreview(token: string | undefined) {
  const trimmed = token?.trim();
  return useQuery({
    queryKey: ['invite-preview', trimmed],
    queryFn: () => fetchInvitePreview(trimmed!),
    enabled: Boolean(trimmed && trimmed.length >= 10),
    staleTime: 60_000,
    retry: 1,
  });
}

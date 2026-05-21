import { apiRequest } from './client';

export interface GameApi {
  id: string;
  name: string;
  currency: string;
  abbr: string;
  color: string;
  icon: string;
  description: string;
  tag: string;
  banner: string;
  about: string;
}

export interface PackageApi {
  id: string;
  gameId: string;
  amount: number;
  label: string;
  price: number;
  oldPrice?: number;
  bonus?: string;
  badge?: string;
  popular: boolean;
}

export async function fetchGames(): Promise<GameApi[]> {
  const res = await apiRequest<GameApi[]>('/api/games');
  return res.data ?? [];
}

export async function fetchPackagesByGame(gameId: string): Promise<PackageApi[]> {
  const res = await apiRequest<PackageApi[]>(`/api/games/${gameId}/packages`);
  return res.data ?? [];
}

export async function fetchAllPackages(): Promise<PackageApi[]> {
  const res = await apiRequest<PackageApi[]>('/api/packages');
  return res.data ?? [];
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function createGame(
  game: GameApi
): Promise<{ ok: boolean; data?: GameApi; error?: string }> {
  return apiRequest<GameApi>('/api/games', {
    method: 'POST',
    body: JSON.stringify(game),
  });
}

export async function updateGame(
  id: string,
  game: GameApi
): Promise<{ ok: boolean; data?: GameApi; error?: string }> {
  return apiRequest<GameApi>(`/api/games/${id}`, {
    method: 'PUT',
    body: JSON.stringify(game),
  });
}

export async function deleteGame(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  return apiRequest(`/api/games/${id}`, { method: 'DELETE' });
}

export async function createPackage(
  pkg: PackageApi
): Promise<{ ok: boolean; data?: PackageApi; error?: string }> {
  return apiRequest<PackageApi>('/api/packages', {
    method: 'POST',
    body: JSON.stringify(pkg),
  });
}

export async function updatePackage(
  id: string,
  pkg: PackageApi
): Promise<{ ok: boolean; data?: PackageApi; error?: string }> {
  return apiRequest<PackageApi>(`/api/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pkg),
  });
}

export async function deletePackage(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  return apiRequest(`/api/packages/${id}`, { method: 'DELETE' });
}
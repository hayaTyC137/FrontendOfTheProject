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
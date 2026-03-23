export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  category: string;
  distance: number; // miles
  priceLevel: number; // 1-4
  rating: number;
  imageUrl: string;
  address: string;
  tags: string[];
}

export interface SessionSettings {
  mode: 'solo' | 'group';
  minPrice: number; // 1-4
  maxPrice: number; // 1-4
  radius: number; // miles
  timer: number; // minutes
  filters: string[];
  location: { lat: number; lng: number; pinX?: number; pinY?: number } | null;
}

export type VoteType = 'superlike' | 'like' | 'dislike' | 'veto';

export interface Vote {
  restaurantId: string;
  vote: VoteType;
  score: number;
}

export const VOTE_SCORES: Record<VoteType, number> = {
  superlike: 3,
  like: 1,
  dislike: -1,
  veto: -3,
};

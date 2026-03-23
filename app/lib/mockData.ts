import { Restaurant, SessionSettings } from './types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Chick-Fil-A',
    cuisine: 'American',
    category: 'Fast Food',
    distance: 0.8,
    priceLevel: 2,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1716068107414-fad614ac83a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '123 Peachtree St NE',
    tags: ['American', 'Chicken', 'Fast Food'],
  },
  {
    id: '2',
    name: 'Sakura Sushi',
    cuisine: 'Japanese',
    category: 'Sushi',
    distance: 1.2,
    priceLevel: 3,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1621871908119-295c8ce5cee4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '456 Midtown Ave',
    tags: ['Japanese', 'Sushi', 'Asian'],
  },
  {
    id: '3',
    name: 'Bella Pizzeria',
    cuisine: 'Italian',
    category: 'Pizza',
    distance: 0.5,
    priceLevel: 2,
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1767713362918-d6db856570ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '789 Italian Way',
    tags: ['Italian', 'Pizza'],
  },
  {
    id: '4',
    name: 'The Burger Spot',
    cuisine: 'American',
    category: 'Burgers',
    distance: 1.8,
    priceLevel: 2,
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1632898657999-ae6920976661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '321 Burger Lane',
    tags: ['American', 'Burgers', 'Fast Casual'],
  },
  {
    id: '5',
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    category: 'Mexican',
    distance: 0.9,
    priceLevel: 1,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1722239319565-ace2d79a5623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '654 Salsa Blvd',
    tags: ['Mexican', 'Tacos', 'Casual'],
  },
  {
    id: '6',
    name: 'Bangkok Kitchen',
    cuisine: 'Thai',
    category: 'Thai',
    distance: 1.4,
    priceLevel: 2,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1707546944460-dda9069b9c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '987 Spice Road',
    tags: ['Thai', 'Asian', 'Noodles'],
  },
  {
    id: '7',
    name: 'Smoke & Barrel',
    cuisine: 'American',
    category: 'BBQ',
    distance: 2.1,
    priceLevel: 3,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1546642232-29c87497b459?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '147 Smokehouse Dr',
    tags: ['BBQ', 'American', 'Ribs'],
  },
  {
    id: '8',
    name: 'Dim Sum Palace',
    cuisine: 'Chinese',
    category: 'Chinese',
    distance: 1.1,
    priceLevel: 2,
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1563245370-63ffc97abdbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '258 Dragon Ave',
    tags: ['Chinese', 'Dim Sum', 'Asian'],
  },
  {
    id: '9',
    name: 'Curry House',
    cuisine: 'Indian',
    category: 'Indian',
    distance: 1.7,
    priceLevel: 2,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1767114915989-c6ab3c8fc42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '369 Spice Market',
    tags: ['Indian', 'Curry', 'South Asian'],
  },
  {
    id: '10',
    name: 'The Olive Branch',
    cuisine: 'Mediterranean',
    category: 'Mediterranean',
    distance: 0.7,
    priceLevel: 3,
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1651326710058-fd7acf9f68c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    address: '741 Mediterranean Way',
    tags: ['Mediterranean', 'Healthy', 'Greek'],
  },
];

export const DEFAULT_SETTINGS: SessionSettings = {
  mode: 'group',
  minPrice: 1,
  maxPrice: 3,
  radius: 5,
  timer: 5,
  filters: [],
  location: { lat: 33.749, lng: -84.388, pinX: 50, pinY: 50 },
};

export const CUISINE_FILTERS = [
  'American', 'Italian', 'Mexican', 'Japanese', 'Chinese',
  'Thai', 'Indian', 'Mediterranean', 'BBQ', 'Pizza', 'Fast Food',
];

export const RADIUS_OPTIONS = [0.5, 1, 2, 5, 10, 25];
export const TIMER_OPTIONS = [2, 5, 10, 15];

export const PRICE_LABELS: Record<number, string> = {
  1: '$',
  2: '$$',
  3: '$$$',
  4: '$$$$',
};

export const generateRoomCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

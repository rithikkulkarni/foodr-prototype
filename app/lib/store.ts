import { SessionSettings, Vote } from './types';
import { MOCK_RESTAURANTS, DEFAULT_SETTINGS } from './mockData';
import { Restaurant } from './types';

interface AppState {
  userName: string;
  isHost: boolean;
  roomCode: string;
  settings: SessionSettings;
  restaurants: Restaurant[];
  votes: Vote[];
  joinedCount: number;
}

const initialState: AppState = {
  userName: '',
  isHost: false,
  roomCode: '',
  settings: { ...DEFAULT_SETTINGS },
  restaurants: [...MOCK_RESTAURANTS],
  votes: [],
  joinedCount: 1,
};

let _state: AppState = { ...initialState };

export const getStore = () => ({ ..._state });

export const setStore = (updates: Partial<AppState>) => {
  _state = { ..._state, ...updates };
};

export const resetStore = () => {
  _state = {
    ...initialState,
    settings: { ...DEFAULT_SETTINGS },
    restaurants: [...MOCK_RESTAURANTS],
    votes: [],
  };
};

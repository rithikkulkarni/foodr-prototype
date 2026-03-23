import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronDown, Search, Timer, Radius, DollarSign } from 'lucide-react';
import { MapEmbed } from '../components/MapEmbed';
import { getStore, setStore } from '../lib/store';
import { SessionSettings } from '../lib/types';
import {
  DEFAULT_SETTINGS,
  CUISINE_FILTERS,
  RADIUS_OPTIONS,
  TIMER_OPTIONS,
  PRICE_LABELS,
  generateRoomCode,
} from '../lib/mockData';

const PRICE_RANGES = [
  { label: '$', value: 1, desc: 'Budget' },
  { label: '$$', value: 2, desc: 'Moderate' },
  { label: '$$$', value: 3, desc: 'Pricey' },
  { label: '$$$$', value: 4, desc: 'Splurge' },
];

export function CreateSession() {
  const navigate = useNavigate();
  const store = getStore();

  const [settings, setSettings] = useState<SessionSettings>({
    ...DEFAULT_SETTINGS,
    ...store.settings,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pin, setPin] = useState<{ x: number; y: number } | null>(
    store.settings.location?.pinX != null
      ? { x: store.settings.location.pinX, y: store.settings.location.pinY ?? 50 }
      : null
  );

  const handleLocationSelect = (x: number, y: number) => {
    setPin({ x, y });
    setSettings((s) => ({
      ...s,
      location: { lat: 33.749, lng: -84.388, pinX: x, pinY: y },
    }));
  };

  const toggleFilter = (filter: string) => {
    setSettings((s) => ({
      ...s,
      filters: s.filters.includes(filter)
        ? s.filters.filter((f) => f !== filter)
        : [...s.filters, filter],
    }));
  };

  const togglePriceLevel = (level: number) => {
    setSettings((s) => {
      let { minPrice, maxPrice } = s;
      if (level < minPrice) minPrice = level;
      else if (level > maxPrice) maxPrice = level;
      else if (level === minPrice && level === maxPrice) {
        minPrice = 1; maxPrice = 4;
      } else if (level === minPrice) minPrice = level + 1 > maxPrice ? maxPrice : level + 1;
      else maxPrice = level - 1 < minPrice ? minPrice : level - 1;
      return { ...s, minPrice, maxPrice };
    });
  };

  const isPriceSelected = (level: number) =>
    level >= settings.minPrice && level <= settings.maxPrice;

  const handleContinue = () => {
    setStore({ settings });
    if (settings.mode === 'solo') {
      navigate('/vote');
    } else {
      navigate('/confirm');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-emerald-600 text-white px-5 pt-12 pb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-emerald-100 hover:text-white mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-white" style={{ fontWeight: 700, fontSize: '1.625rem' }}>
          Create A Session
        </h1>
        <p className="text-emerald-100 text-sm mt-1">Configure your restaurant search</p>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-5">
        {/* Map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>
            Search Location
          </p>
          <MapEmbed
            onLocationSelect={handleLocationSelect}
            selectedPin={pin}
            interactive
            height="190px"
          />
          {!pin && (
            <p className="text-gray-400 text-xs mt-2 text-center">
              Tap the map to set the center of your search
            </p>
          )}
        </div>

        {/* Search Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-5">
          <p className="text-gray-500 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>
            Search Settings
          </p>

          {/* Price Range */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-gray-700" style={{ fontWeight: 600 }}>Price Range</span>
              <span className="ml-auto text-emerald-700 text-sm" style={{ fontWeight: 700 }}>
                {PRICE_LABELS[1]} – {PRICE_LABELS[settings.maxPrice]}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={settings.maxPrice}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setSettings((s) => ({
                  ...s,
                  minPrice: 1,
                  maxPrice: val
                }));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$ Budget</span>
              <span>$$$$ Splurge</span>
            </div>
          </div>

          {/* Radius */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Radius className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                Search Radius
              </span>
              <span className="ml-auto text-emerald-700 text-sm" style={{ fontWeight: 700 }}>
                {settings.radius} {settings.radius === 1 ? 'mile' : 'miles'}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={settings.radius}
              onChange={(e) => setSettings((s) => ({ ...s, radius: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.5 mi</span>
              <span>10 mi</span>
            </div>
          </div>

          {/* Timer */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-gray-700" style={{ fontWeight: 600 }}>Voting Timer</span>
              <span className="ml-auto text-emerald-700 text-sm" style={{ fontWeight: 700 }}>
                {settings.timer} min
              </span>
            </div>
            <div className="flex gap-1.5">
              {TIMER_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSettings((s) => ({ ...s, timer: t }))}
                  className={`flex-1 py-2 rounded-lg text-xs border transition ${
                    settings.timer === t
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {t}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cuisine Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center gap-2 text-gray-700"
          >
            <Search className="w-4 h-4 text-emerald-600" />
            <span className="text-sm" style={{ fontWeight: 600 }}>
              Cuisine Filters
              {settings.filters.length > 0 && (
                <span className="ml-2 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                  {settings.filters.length} selected
                </span>
              )}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {CUISINE_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    settings.filters.includes(f)
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {!showFilters && settings.filters.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {settings.filters.map((f) => (
                <span
                  key={f}
                  className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full"
                  style={{ fontWeight: 500 }}
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition active:scale-95 mt-1"
          style={{ fontWeight: 700, fontSize: '1rem' }}
        >
          {settings.mode === 'solo' ? '🔍 Find Restaurants' : '👥 Create Group'}
        </button>
      </div>
    </div>
  );
}
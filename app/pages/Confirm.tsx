import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, DollarSign, Ruler, Clock, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { MapEmbed } from '../components/MapEmbed';
import { getStore, setStore } from '../lib/store';
import { generateRoomCode, PRICE_LABELS } from '../lib/mockData';

export function Confirm() {
  const navigate = useNavigate();
  const { settings, userName } = getStore();

  const handleCreate = () => {
    const roomCode = generateRoomCode();
    setStore({ roomCode, isHost: true, joinedCount: 1 });
    navigate('/group');
  };

  const handleCancel = () => {
    navigate('/create-session');
  };

  const priceLabel =
    settings.minPrice === settings.maxPrice
      ? PRICE_LABELS[settings.minPrice]
      : `${PRICE_LABELS[settings.minPrice]} – ${PRICE_LABELS[settings.maxPrice]}`;

  const pin =
    settings.location?.pinX != null
      ? { x: settings.location.pinX, y: settings.location.pinY ?? 50 }
      : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-emerald-600 text-white px-5 pt-12 pb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-emerald-100 hover:text-white mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Edit Settings</span>
        </button>
        <h1 className="text-white" style={{ fontWeight: 700, fontSize: '1.625rem' }}>
          Confirm Settings
        </h1>
        <p className="text-emerald-100 text-sm mt-1">Review your session before going live</p>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-4">
        {/* Host card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-700" style={{ fontWeight: 700 }}>
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{userName}'s Group</p>
              <p className="text-gray-400 text-xs">You're the host</p>
            </div>
            <div className="ml-auto">
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
                Group
              </span>
            </div>
          </div>
        </div>

        {/* Map preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>
            Search Area
          </p>
          <MapEmbed
            selectedPin={pin ?? undefined}
            interactive={false}
            height="160px"
          />
          <div className="flex items-center gap-1.5 mt-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <p className="text-gray-500 text-xs">
              {pin ? 'Custom location selected' : 'Default location — Atlanta, GA'}
            </p>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-4" style={{ fontWeight: 600 }}>
            Session Settings
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Price Range</p>
                <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{priceLabel}</p>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Ruler className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Radius</p>
                <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
                  {settings.radius} {settings.radius === 1 ? 'mile' : 'miles'}
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Voting Timer</p>
                <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
                  {settings.timer} minutes
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Cuisine Filters</p>
                <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
                  {settings.filters.length > 0 ? settings.filters.join(', ') : 'None — showing all cuisines'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-emerald-700 text-xs leading-relaxed">
            Once you create the group, a room code will be generated. Share it with your friends so they can join!
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={handleCancel}
            className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition active:scale-95"
            style={{ fontWeight: 600 }}
          >
            Edit
          </button>
          <button
            onClick={handleCreate}
            className="flex-2 flex-grow-[2] py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-sm"
            style={{ fontWeight: 700 }}
          >
            Create Group 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, Copy, CheckCheck, Play, X, ChefHat, Clock, DollarSign, Ruler } from 'lucide-react';
import { getStore, setStore } from '../lib/store';
import { PRICE_LABELS } from '../lib/mockData';

const FAKE_NAMES = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Drew'];

export function Group() {
  const navigate = useNavigate();
  const store = getStore();
  const { roomCode, userName, isHost, joinedCount, settings } = store;

  const [count, setCount] = useState(joinedCount);
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState<string[]>([userName]);

  // Simulate people joining over time (host only)
  useEffect(() => {
    if (!isHost) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [3500, 7000, 12000, 18000];
    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        const name = FAKE_NAMES[i % FAKE_NAMES.length];
        setMembers((prev) => [...prev, name]);
        setCount((c) => c + 1);
      }, delay);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [isHost]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    setStore({ joinedCount: count });
    navigate('/vote');
  };

  const handleCancel = () => {
    navigate('/');
  };

  const priceLabel =
    settings.minPrice === settings.maxPrice
      ? PRICE_LABELS[settings.minPrice]
      : `${PRICE_LABELS[settings.minPrice]} – ${PRICE_LABELS[settings.maxPrice]}`;

  return (
    <div className="flex flex-col min-h-screen px-5 pt-12 pb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ChefHat className="w-6 h-6 text-emerald-600" />
          <span className="text-emerald-600 text-sm" style={{ fontWeight: 600 }}>FOODR</span>
        </div>
        <h1 className="text-gray-900 mt-1" style={{ fontWeight: 800, fontSize: '1.75rem' }}>
          {isHost ? `${userName}'s Group` : `${userName}'s Group`}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {isHost ? 'Share the code below with your friends!' : 'Waiting for the host to start...'}
        </p>
      </div>

      {/* Room Code */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>
          Room Code
        </p>
        <div
          className="text-4xl text-gray-900 tracking-[0.25em] mb-4"
          style={{ fontWeight: 800, fontFamily: 'monospace' }}
        >
          {roomCode || '------'}
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-sm transition ${
            copied
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          style={{ fontWeight: 600 }}
        >
          {copied ? (
            <>
              <CheckCheck className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy code
            </>
          )}
        </button>
      </div>

      {/* Members */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-emerald-600" />
          <span className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>
            People Joined
          </span>
          <span className="ml-auto bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 700 }}>
            {count}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {members.map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-xl"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 text-xs" style={{ fontWeight: 700 }}>
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-700 text-sm" style={{ fontWeight: 500 }}>{name}</span>
              {i === 0 && (
                <span className="ml-auto text-xs text-emerald-600" style={{ fontWeight: 500 }}>Host</span>
              )}
            </div>
          ))}
          {isHost && count < 8 && (
            <div className="flex items-center gap-3 py-2 px-3 border border-dashed border-gray-200 rounded-xl">
              <div className="w-7 h-7 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
                <span className="text-gray-300 text-xs">+</span>
              </div>
              <span className="text-gray-300 text-xs italic">Waiting for more friends...</span>
            </div>
          )}
        </div>
      </div>

      {/* Session Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>
          Session Details
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
            <DollarSign className="w-4 h-4 text-emerald-600 mb-1" />
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-sm text-gray-800 mt-0.5" style={{ fontWeight: 700 }}>{priceLabel}</p>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
            <Ruler className="w-4 h-4 text-emerald-600 mb-1" />
            <p className="text-xs text-gray-400">Radius</p>
            <p className="text-sm text-gray-800 mt-0.5" style={{ fontWeight: 700 }}>{settings.radius}mi</p>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
            <Clock className="w-4 h-4 text-emerald-600 mb-1" />
            <p className="text-xs text-gray-400">Timer</p>
            <p className="text-sm text-gray-800 mt-0.5" style={{ fontWeight: 700 }}>{settings.timer}m</p>
          </div>
        </div>
      </div>

      {/* Status / Actions */}
      {isHost ? (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleStart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            style={{ fontWeight: 700, fontSize: '1rem' }}
          >
            <Play className="w-5 h-5 fill-white" />
            Start Voting
          </button>
          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2 transition"
            style={{ fontWeight: 600 }}
          >
            <X className="w-4 h-4" />
            Cancel Session
          </button>
        </div>
      ) : (
        <div className="text-center mt-auto">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-5 py-3 rounded-xl">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-sm" style={{ fontWeight: 600 }}>Waiting for host to start...</span>
          </div>
          <button
            onClick={handleCancel}
            className="block mx-auto mt-4 text-gray-400 text-sm hover:text-gray-600 transition"
          >
            Leave group
          </button>
        </div>
      )}
    </div>
  );
}

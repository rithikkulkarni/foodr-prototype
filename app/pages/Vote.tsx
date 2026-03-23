import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { ThumbsUp, ThumbsDown, Star, XCircle, MapPin, ChefHat, Info, Clock } from 'lucide-react';
import { getStore, setStore } from '../lib/store';
import { Vote as VoteData, VOTE_SCORES, VoteType, Restaurant } from '../lib/types';

const SWIPE_THRESHOLD = 100;

interface VoteCardProps {
  restaurant: Restaurant;
  onVote: (vote: VoteType) => void;
  index: number;
  total: number;
  timerSeconds: number;
}

function VoteCard({ restaurant, onVote, index, total, timerSeconds }: VoteCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);
  const cardOpacity = useTransform(x, [-250, -200, 0, 200, 250], [0, 1, 1, 1, 0]);
  const [showInfo, setShowInfo] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const onVoteRef = useRef(onVote);
  onVoteRef.current = onVote;

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          onVoteRef.current('dislike');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const priceStr = Array.from({ length: restaurant.priceLevel }, () => '$').join('');
  const timePercent = (timeLeft / timerSeconds) * 100;

  return (
    <div className="relative flex flex-col">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <ChefHat className="w-3.5 h-3.5" />
          <span style={{ fontWeight: 600 }}>
            {total - index} of {total} restaurants
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
            timeLeft <= 30 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
          }`}
          style={{ fontWeight: 600 }}
        >
          <Clock className="w-3 h-3" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Swipe card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.85}
        style={{ x, rotate, opacity: cardOpacity, touchAction: 'none' }}
        onDragEnd={(_, info) => {
          if (info.offset.x > SWIPE_THRESHOLD) onVote('like');
          else if (info.offset.x < -SWIPE_THRESHOLD) onVote('dislike');
        }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none relative"
      >
        {/* Like stamp */}
        <motion.div
          className="absolute inset-0 z-10 flex items-start justify-start p-6 pointer-events-none"
          style={{ opacity: likeOpacity }}
        >
          <div className="border-4 border-emerald-500 text-emerald-500 px-3 py-1 rounded-xl -rotate-12">
            <span style={{ fontWeight: 800, fontSize: '1.375rem', letterSpacing: '0.05em' }}>
              LIKE
            </span>
          </div>
        </motion.div>

        {/* Nope stamp */}
        <motion.div
          className="absolute inset-0 z-10 flex items-start justify-end p-6 pointer-events-none"
          style={{ opacity: nopeOpacity }}
        >
          <div className="border-4 border-red-500 text-red-500 px-3 py-1 rounded-xl rotate-12">
            <span style={{ fontWeight: 800, fontSize: '1.375rem', letterSpacing: '0.05em' }}>
              NOPE
            </span>
          </div>
        </motion.div>

        {/* Image */}
        <div className="relative" style={{ height: '280px' }}>
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo((s) => !s);
            }}
            className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition"
          >
            <Info className="w-4 h-4" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-white" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
              {restaurant.name}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-emerald-300 text-sm" style={{ fontWeight: 600 }}>
                {restaurant.cuisine}
              </span>
              <span className="text-white/50 text-sm">•</span>
              <span className="text-amber-300 text-sm" style={{ fontWeight: 700 }}>
                {priceStr}
              </span>
              <span className="text-white/50 text-sm">•</span>
              <span className="text-white/80 text-sm">★ {restaurant.rating}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>{restaurant.distance} miles away</span>
            <span className="text-gray-300 mx-1">·</span>
            <span className="text-gray-400 text-xs truncate">{restaurant.address}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {restaurant.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full"
                style={{ fontWeight: 500 }}
              >
                {tag}
              </span>
            ))}
          </div>

          {showInfo && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-1">
              <p className="text-emerald-700 text-xs leading-relaxed" style={{ fontWeight: 500 }}>
                📍 {restaurant.address} · {restaurant.distance} mi away<br />
                🍽️ {restaurant.category} — {restaurant.cuisine} cuisine<br />
                ⭐ Rated {restaurant.rating}/5.0 · Price: {priceStr}
              </p>
            </div>
          )}

          <p className="text-gray-300 text-xs text-center mt-1">← Swipe or tap buttons below →</p>
        </div>
      </motion.div>
    </div>
  );
}

export function Vote() {
  const navigate = useNavigate();
  const store = getStore();
  const [restaurants] = useState(() => [...store.restaurants]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastVote, setLastVote] = useState<VoteType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const votesRef = useRef<VoteData[]>([]);
  const transitioningRef = useRef(false);
  const currentIndexRef = useRef(0);

  const total = restaurants.length;
  const timerSeconds = store.settings.timer * 60;

  const handleVote = useCallback(
    (voteType: VoteType) => {
      if (transitioningRef.current) return;

      const prevIndex = currentIndexRef.current;
      const restaurant = restaurants[prevIndex];
      if (!restaurant) return;

      transitioningRef.current = true;
      setIsTransitioning(true);

      const newVote: VoteData = {
        restaurantId: restaurant.id,
        vote: voteType,
        score: VOTE_SCORES[voteType],
      };
      votesRef.current = [...votesRef.current, newVote];
      setLastVote(voteType);

      setTimeout(() => {
        const nextIndex = prevIndex + 1;
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        transitioningRef.current = false;
        setIsTransitioning(false);
        setLastVote(null);

        if (nextIndex >= total) {
          setStore({ votes: votesRef.current });
          navigate('/results');
        }
      }, 320);
    },
    [restaurants, total, navigate]
  );

  const current = restaurants[currentIndex];
  const next = restaurants[currentIndex + 1];
  const remaining = total - currentIndex;

  const feedbackStyle: Record<VoteType, { cls: string; label: string }> = {
    superlike: { cls: 'bg-blue-100 text-blue-700', label: '⭐ Super Like!' },
    like: { cls: 'bg-emerald-100 text-emerald-700', label: '👍 Liked!' },
    dislike: { cls: 'bg-orange-100 text-orange-700', label: '👎 Passed' },
    veto: { cls: 'bg-red-100 text-red-700', label: '🚫 Vetoed' },
  };

  if (!current && currentIndex >= total) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5">
        <div className="text-2xl mb-2">🍽️</div>
        <p className="text-gray-500 text-sm">Tallying results...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-5 pt-10 pb-6 bg-green-50">
      {/* App bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-700 text-sm" style={{ fontWeight: 700 }}>
            FOODR
          </span>
        </div>
        <div
          className="bg-white border border-gray-200 text-gray-500 text-xs px-3 py-1.5 rounded-full shadow-sm"
          style={{ fontWeight: 600 }}
        >
          {remaining} left
        </div>
      </div>

      {/* Feedback toast */}
      <AnimatePresence>
        {lastVote && (
          <motion.div
            key={String(currentIndex) + lastVote}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`text-center text-sm py-2 px-4 rounded-xl mb-3 ${feedbackStyle[lastVote].cls}`}
            style={{ fontWeight: 600 }}
          >
            {feedbackStyle[lastVote].label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card stack area */}
      <div className="relative flex-1">
        {/* Background card (next restaurant) */}
        {next && (
          <div
            className="absolute inset-x-0 top-0 bg-white rounded-3xl shadow-md overflow-hidden"
            style={{
              transform: 'scale(0.95) translateY(-6px)',
              zIndex: 0,
              opacity: 0.55,
              height: '280px',
            }}
          >
            <img
              src={next.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Active card */}
        <AnimatePresence mode="wait">
          {current && !isTransitioning && (
            <motion.div
              key={current.id}
              initial={{ scale: 0.93, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <VoteCard
                restaurant={current}
                onVote={handleVote}
                index={currentIndex}
                total={total}
                timerSeconds={timerSeconds}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="mt-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <button
            onClick={() => handleVote('veto')}
            className="w-12 h-12 bg-white hover:bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center shadow-sm transition active:scale-90"
            title="Veto"
          >
            <XCircle className="w-5 h-5 text-red-400" />
          </button>

          <button
            onClick={() => handleVote('dislike')}
            className="w-14 h-14 bg-white hover:bg-orange-50 border-2 border-orange-200 rounded-full flex items-center justify-center shadow-sm transition active:scale-90"
            title="Pass"
          >
            <ThumbsDown className="w-6 h-6 text-orange-400" />
          </button>

          <button
            onClick={() => handleVote('like')}
            className="w-14 h-14 bg-white hover:bg-emerald-50 border-2 border-emerald-300 rounded-full flex items-center justify-center shadow-sm transition active:scale-90"
            title="Like"
          >
            <ThumbsUp className="w-6 h-6 text-emerald-500" />
          </button>

          <button
            onClick={() => handleVote('superlike')}
            className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm transition active:scale-90"
            title="Super Like"
          >
            <Star className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span className="w-12 text-center text-red-300 text-xs" style={{ fontWeight: 500 }}>Veto</span>
          <span className="w-14 text-center text-orange-400 text-xs" style={{ fontWeight: 500 }}>Pass</span>
          <span className="w-14 text-center text-emerald-500 text-xs" style={{ fontWeight: 600 }}>Like</span>
          <span className="w-12 text-center text-blue-400 text-xs" style={{ fontWeight: 500 }}>Super</span>
        </div>
      </div>
    </div>
  );
}
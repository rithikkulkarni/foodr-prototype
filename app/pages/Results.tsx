import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Trophy, RotateCcw, MapPin, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'motion/react';
import { getStore, resetStore } from '../lib/store';
import { MOCK_RESTAURANTS } from '../lib/mockData';
import { Vote, VOTE_SCORES, VoteType } from '../lib/types';

const MEDAL_STYLES = [
  { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-400', text: 'text-amber-700', emoji: '🥇', label: 'Top Pick' },
  { bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-400', text: 'text-gray-600', emoji: '🥈', label: '2nd Place' },
  { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-400', text: 'text-orange-700', emoji: '🥉', label: '3rd Place' },
];

function generateGroupVotes(votes: Vote[], restaurantIds: string[]): Record<string, number> {
  const scores: Record<string, number> = {};
  restaurantIds.forEach((id) => { scores[id] = 0; });

  // Apply user votes
  votes.forEach((v) => {
    scores[v.restaurantId] = (scores[v.restaurantId] || 0) + v.score;
  });

  // Add simulated group member votes (for group mode)
  const { settings, joinedCount } = getStore();
  if (settings.mode === 'group' && joinedCount > 1) {
    const voteTypes: VoteType[] = ['superlike', 'like', 'like', 'dislike', 'veto'];
    restaurantIds.forEach((id, i) => {
      const seed = parseInt(id) || i;
      for (let member = 1; member < joinedCount; member++) {
        const typeIndex = (seed + member * 3) % voteTypes.length;
        const voteType = voteTypes[typeIndex];
        scores[id] = (scores[id] || 0) + VOTE_SCORES[voteType];
      }
    });
  }

  return scores;
}

export function Results() {
  const navigate = useNavigate();
  const { votes, restaurants, settings, joinedCount, userName } = getStore();

  const allRestaurants = restaurants.length > 0 ? restaurants : MOCK_RESTAURANTS;
  const restaurantIds = allRestaurants.map((r) => r.id);

  const scores = useMemo(() => generateGroupVotes(votes, restaurantIds), [votes, restaurantIds]);

  const ranked = useMemo(() => {
    return [...allRestaurants]
      .map((r) => ({ ...r, score: scores[r.id] ?? 0 }))
      .sort((a, b) => b.score - a.score);
  }, [allRestaurants, scores]);

  const maxScore = ranked[0]?.score ?? 1;

  const getUserVote = (id: string): VoteType | null => {
    return votes.find((v) => v.restaurantId === id)?.vote ?? null;
  };

  const handleRestart = () => {
    resetStore();
    navigate('/');
  };

  const voteIcon = (v: VoteType) => {
    if (v === 'superlike') return <Star className="w-3 h-3" fill="currentColor" />;
    if (v === 'like') return <ThumbsUp className="w-3 h-3" />;
    if (v === 'dislike') return <ThumbsDown className="w-3 h-3" />;
    return <span className="text-xs">🚫</span>;
  };

  const voteColors: Record<VoteType, string> = {
    superlike: 'bg-blue-100 text-blue-600',
    like: 'bg-emerald-100 text-emerald-600',
    dislike: 'bg-orange-100 text-orange-500',
    veto: 'bg-red-100 text-red-500',
  };

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Header */}
      <div className="bg-emerald-600 px-5 pt-12 pb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-7 h-7 text-amber-300" />
          <h1 className="text-white" style={{ fontWeight: 800, fontSize: '2rem' }}>Results</h1>
        </div>
        <p className="text-emerald-100 text-sm">
          {settings.mode === 'group'
            ? `Group favorites for ${userName}'s crew (${joinedCount} voters)`
            : `Your top picks`}
        </p>
      </div>

      <div className="flex-1 px-5 -mt-4">
        {/* Top 3 */}
        <div className="flex flex-col gap-3 mb-6">
          {ranked.slice(0, 3).map((restaurant, i) => {
            const medal = MEDAL_STYLES[i];
            const userVote = getUserVote(restaurant.id);
            const scorePercent = maxScore > 0 ? Math.max(0, (restaurant.score / maxScore) * 100) : 0;
            const priceStr = Array.from({ length: restaurant.priceLevel }, () => '$').join('');

            return (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.35 }}
                className={`rounded-2xl border ${medal.bg} ${medal.border} overflow-hidden shadow-sm`}
              >
                {/* Image section */}
                <div className="relative" style={{ height: i === 0 ? '180px' : '120px' }}>
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Medal badge */}
                  <div className="absolute top-3 left-3">
                    <div className={`${medal.badge} text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow`} style={{ fontWeight: 700 }}>
                      <span>{medal.emoji}</span>
                      <span>{medal.label}</span>
                    </div>
                  </div>

                  {/* User vote badge */}
                  {userVote && (
                    <div className="absolute top-3 right-3">
                      <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${voteColors[userVote]}`} style={{ fontWeight: 600 }}>
                        {voteIcon(userVote)}
                        <span>You</span>
                      </div>
                    </div>
                  )}

                  {/* Name on image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-white" style={{ fontWeight: 800, fontSize: i === 0 ? '1.25rem' : '1rem' }}>
                      {restaurant.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-emerald-300 text-xs">{restaurant.cuisine}</span>
                      <span className="text-white/50 text-xs">•</span>
                      <span className="text-amber-300 text-xs">{priceStr}</span>
                    </div>
                  </div>
                </div>

                {/* Score bar */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{restaurant.distance} miles away</span>
                    </div>
                    <div className={`text-xs ${medal.text}`} style={{ fontWeight: 700 }}>
                      Score: {restaurant.score > 0 ? '+' : ''}{restaurant.score}
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercent}%` }}
                      transition={{ delay: i * 0.12 + 0.3, duration: 0.6 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rest of the list */}
        {ranked.length > 3 && (
          <div className="mb-6">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 px-1" style={{ fontWeight: 600 }}>
              Other Options
            </p>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {ranked.slice(3).map((restaurant, i) => {
                const userVote = getUserVote(restaurant.id);
                const priceStr = Array.from({ length: restaurant.priceLevel }, () => '$').join('');
                return (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.25 }}
                    className={`flex items-center gap-4 px-4 py-3 ${i < ranked.length - 4 ? 'border-b border-gray-100' : ''}`}
                  >
                    <span className="text-gray-400 text-xs w-4" style={{ fontWeight: 600 }}>
                      {i + 4}
                    </span>
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm truncate" style={{ fontWeight: 600 }}>
                        {restaurant.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {restaurant.cuisine} • {priceStr} • {restaurant.distance}mi
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-gray-500 text-xs" style={{ fontWeight: 600 }}>
                        {restaurant.score > 0 ? '+' : ''}{restaurant.score}
                      </span>
                      {userVote && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${voteColors[userVote]}`}>
                          {userVote}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Group note */}
        {settings.mode === 'group' && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-center">
            <p className="text-emerald-700 text-sm" style={{ fontWeight: 600 }}>
              🎉 Based on votes from {joinedCount} people
            </p>
            <p className="text-emerald-500 text-xs mt-1">
              Scores combine everyone's ratings to find the best match for your group!
            </p>
          </div>
        )}

        {/* Restart */}
        <button
          onClick={handleRestart}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
          style={{ fontWeight: 700 }}
        >
          <RotateCcw className="w-4 h-4" />
          Start New Session
        </button>
      </div>
    </div>
  );
}
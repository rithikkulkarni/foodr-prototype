import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, UserCircle, ArrowRight, ChefHat } from 'lucide-react';
import { setStore } from '../lib/store';

export function Home() {
  const navigate = useNavigate();
  const [hostName, setHostName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [hostError, setHostError] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleCreateGroup = () => {
    if (!hostName.trim()) {
      setHostError('Please enter your name');
      return;
    }
    setHostError('');
    setStore({ userName: hostName.trim(), isHost: true });
    navigate('/create-session');
  };

  const handleJoinGroup = () => {
    if (!joinCode.trim() || joinCode.trim().length < 4) {
      setJoinError('Please enter a valid room code');
      return;
    }
    if (!joinName.trim()) {
      setJoinError('Please enter your name');
      return;
    }
    setJoinError('');
    setStore({ userName: joinName.trim(), isHost: false, roomCode: joinCode.trim(), joinedCount: 2 });
    navigate('/group');
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-12 pb-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="w-9 h-9 text-emerald-600" />
          <h1 className="text-5xl text-emerald-700 tracking-tight" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            FOODR
          </h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">Stop arguing. Start eating.</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Host a Group */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Host a Group</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">Start a new session for your friends to join!</p>

          <div className="flex flex-col gap-3">
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={hostName}
                onChange={(e) => { setHostName(e.target.value); setHostError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                maxLength={30}
              />
              {hostError && <p className="text-red-500 text-xs mt-1 ml-1">{hostError}</p>}
            </div>
            <button
              onClick={handleCreateGroup}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95"
              style={{ fontWeight: 600 }}
            >
              Create Group
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Join Existing Group */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <UserCircle className="w-5 h-5 text-violet-500" />
            <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Join Existing Group</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">Enter the room code your host shared with you.</p>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Room code (e.g. 571761)"
              value={joinCode}
              onChange={(e) => { setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setJoinError(''); }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition text-center tracking-[0.15em]"
              maxLength={6}
            />
            <input
              type="text"
              placeholder="Your name"
              value={joinName}
              onChange={(e) => { setJoinName(e.target.value); setJoinError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinGroup()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              maxLength={30}
            />
            {joinError && <p className="text-red-500 text-xs mt-0.5 ml-1">{joinError}</p>}
            <button
              onClick={handleJoinGroup}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95"
              style={{ fontWeight: 600 }}
            >
              Join Group
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-gray-300 text-xs">Made for indecisive groups everywhere 🍔</p>
      </div>
    </div>
  );
}

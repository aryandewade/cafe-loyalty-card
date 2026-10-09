import React, { useState } from 'react';
import { LoyaltyCard } from './components/loyalty/LoyaltyCard';
import { User, Membership, Reward } from './types';

const INITIAL_USER: User = {
  id: 'usr_arjun_9842',
  firstName: 'Arjun',
  lastName: 'Mehta',
  email: 'arjun.mehta@atelier-coffee.com',
  phone: '+91 98201 44829',
  memberSince: 'October 2024',
  membershipId: 'AT-48291',
  tier: 'Gold Member',
  favoriteDrink: 'Chikmagalur Pour Over (Attikan Estate)',
  milkPreference: 'Oatly Barista / A2 Desi Cow Milk',
  roastPreference: 'Medium-Light (Western Ghats Shade-Grown)',
  notificationsEnabled: true
};

const INITIAL_MEMBERSHIP: Membership = {
  currentStamps: 7,
  maxStamps: 10,
  lifetimeVisits: 27,
  points: 420,
  rewardsRedeemedCount: 3,
  currentStreak: 4
};

export const App: React.FC = () => {
  const [user] = useState<User>(INITIAL_USER);
  const [membership, setMembership] = useState<Membership>(INITIAL_MEMBERSHIP);

  const [ownerPin, setOwnerPin] = useState('1234');

  const handleAddStamp = () => {
    setMembership(prev => {
      const nextStamps = prev.currentStamps >= prev.maxStamps ? 1 : prev.currentStamps + 1;
      return {
        ...prev,
        currentStamps: nextStamps,
        lifetimeVisits: prev.lifetimeVisits + 1,
        points: prev.points + 25
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#181311] py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#FDF1EA] text-[#BC5A2B] border border-[#BC5A2B]/20 mb-3">
            Atelier Loyalty Club • India
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal">Every cup brings you closer.</h1>
          <p className="text-[#6E5A52] mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Digital membership card honoring the ritual of daily specialty coffee across Mumbai, Bengaluru, Delhi & Pune.
          </p>
        </header>

        <div className="mb-8">
          <LoyaltyCard
            user={user}
            membership={membership}
            onAddStamp={handleAddStamp}
            ownerPin={ownerPin}
          />
        </div>

        <div className="flex justify-center items-center gap-3 flex-wrap">
          <div className="text-xs text-[#6E5A52] bg-white border border-[#E8E2D8] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2">
            <span>🔐 Owner Stamp PIN:</span>
            <span className="font-mono font-bold text-[#181311]">{ownerPin}</span>
            <span className="text-[10px] text-[#A69386]">(Default demo PIN)</span>
          </div>
          <button
            onClick={() => setMembership(prev => ({ ...prev, currentStamps: Math.max(0, prev.currentStamps - 1) }))}
            className="px-4 py-1.5 rounded-full border border-[#E8E2D8] bg-white text-xs font-medium text-[#6E5A52] hover:bg-[#FAF8F5] transition"
          >
            -1 Undo
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

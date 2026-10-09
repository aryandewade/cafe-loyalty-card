import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Membership } from '../../types';

export type CardSkin = 'espresso' | 'holo' | 'matcha' | 'cyber';

interface LoyaltyCardProps {
  user: User;
  membership: Membership;
  onFlip?: () => void;
  onAddStamp?: () => void;
  ownerPin?: string;
  initialSkin?: CardSkin;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  user,
  membership,
  onAddStamp,
  ownerPin = '1234',
  initialSkin = 'espresso'
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [skin, setSkin] = useState<CardSkin>(initialSkin);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [showWrappedModal, setShowWrappedModal] = useState(false);

  // Café Owner Stamp PIN Authorization States
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const stamps = membership.currentStamps;
  const maxStamps = membership.maxStamps;
  const streak = membership.currentStreak || 4;

  const isLocked = lockedUntil ? Date.now() < lockedUntil : false;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x, y });
  };

  // Handle Owner PIN Digit Entry
  const handleKeypadPress = (val: string) => {
    if (pinSuccess || enteredPin.length >= 4 || isLocked) return;

    if (val === 'clear') {
      setEnteredPin('');
      setPinError(false);
      return;
    }

    if (val === 'back') {
      setEnteredPin(prev => prev.slice(0, -1));
      setPinError(false);
      return;
    }

    const nextPin = enteredPin + val;
    setEnteredPin(nextPin);

    if (nextPin.length === 4) {
      if (nextPin === ownerPin) {
        setPinSuccess(true);
        setFailedAttempts(0);
        setTimeout(() => {
          onAddStamp?.();
          setShowPinModal(false);
          setEnteredPin('');
          setPinSuccess(false);
        }, 550);
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockedUntil(Date.now() + 5 * 60 * 1000); // 5 min lockout
        }
        setPinError(true);
        setTimeout(() => {
          setEnteredPin('');
          setPinError(false);
        }, 800);
      }
    }
  };

  // Skin background and accent configs
  const getSkinFrontStyles = () => {
    switch (skin) {
      case 'holo':
        return {
          background: 'linear-gradient(135deg, #1A1828 0%, #282138 40%, #171E2D 80%, #111A24 100%)',
          borderColor: 'rgba(255, 255, 255, 0.45)',
          boxShadow: '0 24px 60px -12px rgba(130, 80, 220, 0.45), 0 0 24px rgba(100, 200, 255, 0.25)'
        };
      case 'matcha':
        return {
          background: 'radial-gradient(circle at 80% 20%, #26382B 0%, #19271E 65%, #101B14 100%)',
          borderColor: 'rgba(212, 180, 110, 0.4)',
          boxShadow: '0 24px 60px -12px rgba(25, 45, 30, 0.5)'
        };
      case 'cyber':
        return {
          background: 'linear-gradient(145deg, #0D0C0B 0%, #161311 50%, #080807 100%)',
          borderColor: 'rgba(255, 140, 40, 0.55)',
          boxShadow: '0 24px 60px -12px rgba(255, 100, 0, 0.3)'
        };
      case 'espresso':
      default:
        return {
          background: 'radial-gradient(circle at 85% 15%, #342721 0%, #201714 65%, #150F0D 100%)',
          borderColor: 'rgba(200, 157, 75, 0.35)',
          boxShadow: '0 24px 60px -12px rgba(24, 19, 17, 0.3)'
        };
    }
  };

  return (
    <div className="loyalty-card-component max-w-[440px] mx-auto">
      <div
        className="loyalty-card-wrapper perspective-1000"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="loyalty-card relative aspect-[1.586] w-full cursor-pointer preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.34, 1.3, 0.64, 1] }}
          whileHover={{ scale: 1.02 }}
        >
          {/* FRONT: Dynamic Skin with Streak Pill & Holo Shimmer */}
          <div
            className="card-face card-face-front absolute inset-0 rounded-[22px] p-6 flex flex-col justify-between text-[#FAF6ED] backface-hidden shadow-2xl overflow-hidden border"
            style={getSkinFrontStyles()}
          >
            {/* Dynamic Holographic Glare Overlay */}
            {skin === 'holo' && (
              <div
                className="pointer-events-none absolute inset-[-100%] opacity-80 mix-blend-overlay transition-transform duration-75"
                style={{
                  background:
                    'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.4) 45%, rgba(255,130,220,0.45) 50%, rgba(100,220,255,0.45) 55%, transparent 70%)',
                  transform: `translate(${glarePosition.x - 50}%, ${glarePosition.y - 50}%)`
                }}
              />
            )}

            {/* Header: Brand Name + Duolingo-style Streak + Tier Pill */}
            <div className="flex justify-between items-start z-10">
              <div>
                <span className="font-serif text-xl tracking-widest uppercase font-medium">Atelier Café</span>
                <span className="block text-[10px] tracking-[0.2em] text-[#C89D4B] uppercase mt-0.5">Roastery & Club</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Ritual Streak Pill with 1.5x Points Multiplier */}
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FF6B00]/15 border border-[#FF6B00]/40 rounded-full text-[10px] font-bold text-[#FFA26B] uppercase tracking-wider"
                  title="4-day daily coffee ritual! 1.5x multiplier active"
                >
                  <span className="animate-bounce">🔥</span>
                  <span>{streak}d Streak</span>
                  <span className="px-1 py-0.2 bg-[#FF6B00] text-white rounded text-[9px] font-mono font-extrabold">
                    1.5x
                  </span>
                </div>

                {/* Tier Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#C89D4B]/15 border border-[#C89D4B]/40 rounded-full text-[11px] font-semibold text-[#E2BC6E] uppercase">
                  <span>★</span>
                  <span>{user.tier}</span>
                </div>
              </div>
            </div>

            {/* 10 Stamp Grid */}
            <div className="grid grid-cols-5 gap-2 my-2 z-10">
              {Array.from({ length: maxStamps }).map((_, idx) => {
                const num = idx + 1;
                const isStamped = num <= stamps;
                const isNext = num === stamps + 1;
                const rot = ((num * 17) % 11) - 5;

                return (
                  <div
                    key={num}
                    onClick={(e) => {
                      if (isNext) {
                        e.stopPropagation();
                        setShowPinModal(true);
                      }
                    }}
                    className={`aspect-square rounded-full flex items-center justify-center transition-all ${
                      isStamped
                        ? skin === 'matcha'
                          ? 'bg-gradient-to-br from-[#78A77E] to-[#3B5F43] border border-[#A9D5AF] shadow-md'
                          : skin === 'cyber'
                          ? 'bg-gradient-to-br from-[#FF7B25] to-[#B84705] border border-[#FFAA70] shadow-[0_0_12px_rgba(255,120,20,0.5)]'
                          : 'bg-gradient-to-br from-[#D89F43] to-[#B27C27] border border-[#FFE6AA]/60 shadow-md'
                        : isNext
                        ? 'border-2 border-[#C89D4B] bg-black/20 animate-pulse text-[#C89D4B] hover:scale-110 hover:border-white cursor-pointer shadow-[0_0_12px_rgba(200,157,75,0.6)]'
                        : 'border border-dashed border-[#C89D4B]/30 bg-black/20 text-[#FAF6ED]/40'
                    }`}
                    style={isStamped ? { transform: `rotate(${rot}deg)` } : undefined}
                    title={isNext ? 'Tap to stamp card (Requires Owner PIN)' : undefined}
                  >
                    {isStamped ? (
                      <svg className="w-3/5 h-3/5 text-[#1A110D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      </svg>
                    ) : (
                      <span className="font-mono text-xs">{num}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end text-xs font-mono text-[#FAF6ED]/70 z-10">
              <div>
                <div className="font-sans font-medium text-sm text-[#FAF4EA] capitalize">{user.firstName} {user.lastName}</div>
                <div className="text-[10px] text-[#AA9588]">Member since {user.memberSince}</div>
              </div>
              <div className="text-right">
                <div className="text-[#C89D4B]">{user.membershipId}</div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(!isFlipped);
                  }}
                  className="text-[11px] text-[#B5A196] hover:text-[#FAF4EA] flex items-center gap-1 mt-0.5"
                >
                  Pass QR ↻
                </button>
              </div>
            </div>
          </div>

          {/* BACK: Pass QR */}
          <div
            className="card-face card-face-back absolute inset-0 rounded-[22px] p-6 flex flex-col justify-between bg-[#FAF8F4] text-[#1A1310] rotate-y-180 backface-hidden shadow-2xl border border-[#E8E2D8]"
            onClick={() => setIsFlipped(false)}
          >
            <div className="flex justify-between items-start">
              <div className="text-left">
                <div className="font-serif text-lg font-semibold uppercase">Digital Member Pass</div>
                <div className="text-xs text-[#6E5A52]">Scan at till for stamp & perks</div>
              </div>
              <span className="text-xs text-[#BC5A2B] font-medium">Front ↻</span>
            </div>

            <div className="flex flex-col items-center justify-center my-1">
              <div className="bg-white p-2.5 rounded-xl border border-[#E8E2D8] shadow-sm">
                <div className="w-28 h-28 bg-[#181311] rounded-lg flex items-center justify-center text-white font-mono text-sm">
                  [QR PASS]
                </div>
              </div>
              <div className="font-mono text-sm font-semibold tracking-widest mt-2">{user.membershipId}</div>
            </div>

            <div className="flex justify-between text-xs text-[#6E5A52] border-t border-dashed border-[#E8E2D8] pt-2">
              <span>{stamps}/10 Stamps Earned</span>
              <span>{membership.points} Reward Points</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Collectible Card Skins Switcher */}
      <div className="flex justify-center items-center gap-1.5 mt-4 flex-wrap">
        <button
          type="button"
          onClick={() => setSkin('espresso')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            skin === 'espresso'
              ? 'bg-[#181311] text-[#FAF6ED] border-[#181311] shadow-sm'
              : 'bg-white text-[#6E5A52] border-[#E8E2D8] hover:border-[#C89D4B]'
          }`}
        >
          ☕ Espresso Noir
        </button>
        <button
          type="button"
          onClick={() => setSkin('holo')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            skin === 'holo'
              ? 'bg-[#2A1F45] text-white border-[#A882DD] shadow-[0_0_12px_rgba(168,130,221,0.5)]'
              : 'bg-white text-[#6E5A52] border-[#E8E2D8] hover:border-[#A882DD]'
          }`}
        >
          🪩 Prismatic Holo
        </button>
        <button
          type="button"
          onClick={() => setSkin('matcha')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            skin === 'matcha'
              ? 'bg-[#1C2E24] text-white border-[#4E8062] shadow-sm'
              : 'bg-white text-[#6E5A52] border-[#E8E2D8] hover:border-[#4E8062]'
          }`}
        >
          🍵 Matcha Sage
        </button>
        <button
          type="button"
          onClick={() => setSkin('cyber')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            skin === 'cyber'
              ? 'bg-[#0E0C0B] text-[#FFA26B] border-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.4)]'
              : 'bg-white text-[#6E5A52] border-[#E8E2D8] hover:border-[#FF6B00]'
          }`}
        >
          ⚡ Cyber Amber
        </button>
      </div>

      {/* Action Row: Collect Stamp (Requires Owner PIN) & 9:16 Wrapped */}
      <div className="flex justify-center items-center gap-3 mt-3 flex-wrap">
        <button
          type="button"
          onClick={() => setShowPinModal(true)}
          className="px-4 py-2 rounded-full bg-[#181311] text-white text-xs font-semibold shadow hover:bg-[#2D2320] transition inline-flex items-center gap-1.5"
        >
          <span>🔐</span>
          <span>Barista Stamp Verification</span>
        </button>

        <button
          type="button"
          onClick={() => setShowWrappedModal(true)}
          className="text-xs text-[#BC5A2B] hover:text-[#913E18] font-semibold inline-flex items-center gap-1 transition"
        >
          <span>📸 Monthly Wrapped (9:16)</span>
          <span>↗</span>
        </button>
      </div>

      {/* 🔐 Café Owner Stamp Authorization PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-[340px] bg-white rounded-3xl p-6 text-center shadow-2xl border border-[#E8E2D8] ${
                pinError ? 'animate-[shake_0.45s_ease-in-out]' : ''
              }`}
            >
              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setEnteredPin('');
                    setPinError(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#C89D4B]/40 flex items-center justify-center mx-auto mb-3 text-2xl">
                🔐
              </div>

              <h3 className="font-serif text-2xl font-normal text-[#181311]">
                Owner Stamp PIN
              </h3>
              <p className="text-xs text-[#6E5A52] mt-1 mb-4">
                {isLocked ? (
                  <span className="text-red-600 font-bold">⛔ Security Lockout: 5 failed attempts.<br/>Keypad locked for 5 minutes.</span>
                ) : pinSuccess ? (
                  <span className="text-[#2E473B] font-semibold">✓ Cryptographically Verified! Stamping card...</span>
                ) : pinError ? (
                  <span className="text-red-600 font-semibold">✕ Incorrect PIN ({Math.max(0, 5 - failedAttempts)} attempts left before lockout)</span>
                ) : (
                  'Please present to the café owner or barista to authorize this stamp.'
                )}
              </p>

              {/* 4 Dots */}
              <div className="flex justify-center items-center gap-3.5 my-4">
                {[0, 1, 2, 3].map(idx => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                      pinSuccess
                        ? 'bg-[#2E473B] border-[#2E473B]'
                        : pinError
                        ? 'bg-red-600 border-red-600'
                        : idx < enteredPin.length
                        ? 'bg-[#181311] border-[#181311] scale-110'
                        : 'border-[#E8E2D8] bg-transparent'
                    }`}
                  />
                ))}
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto my-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map(key => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeypadPress(key)}
                    className="h-12 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-[#181311] font-semibold text-lg hover:bg-white hover:border-[#C89D4B] active:scale-95 transition flex items-center justify-center shadow-xs"
                  >
                    {key === 'clear' ? (
                      <span className="text-xs font-medium text-[#6E5A52]">Clear</span>
                    ) : key === 'back' ? (
                      <span className="text-sm font-medium text-[#6E5A52]">⌫</span>
                    ) : (
                      key
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-dashed border-[#E8E2D8] text-[11px] text-[#6E5A52]">
                ✦ Default Café Owner PIN: <strong className="font-mono text-[#C89D4B]">{ownerPin}</strong>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9:16 Caffeine Wrapped Modal */}
      <AnimatePresence>
        {showWrappedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-[360px]"
            >
              {/* 9:16 Story Frame */}
              <div className="aspect-[9/16] w-full rounded-[28px] border-2 border-[#C89D4B]/40 bg-radial from-[#2A1F1B] via-[#150F0D] to-[#0D0A09] text-[#FAF4EA] p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-serif text-lg tracking-widest uppercase font-medium block">Atelier Café</span>
                    <span className="text-[9px] text-[#D4B06A] tracking-[0.2em] uppercase font-semibold">Monthly Caffeine Wrapped</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowWrappedModal(false)}
                    className="text-white/60 hover:text-white text-lg p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="my-auto space-y-4">
                  <div>
                    <div className="text-xs text-white/70">Ritual dossier for {user.firstName} {user.lastName}</div>
                    <h3 className="font-serif text-2xl font-normal mt-1 leading-tight text-white">
                      A season of shade-grown rituals.
                    </h3>
                  </div>

                  {/* Aura Box */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#C89D4B]/20 to-[#BC5A2B]/20 border border-[#C89D4B]/40">
                    <div className="text-[10px] text-[#E8C17A] uppercase font-bold tracking-wider">✦ Primary Coffee Aura</div>
                    <div className="font-serif text-lg font-medium text-white mt-0.5">Bergamot & Wild Honey Cold Drip</div>
                    <div className="text-[11px] text-white/70 mt-0.5">Top 2% early morning pour-over purist</div>
                  </div>

                  {/* 2x2 Stats Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
                      <div className="font-serif text-2xl font-bold text-[#F7D488] leading-none mb-1">{membership.lifetimeVisits}</div>
                      <div className="text-[9px] uppercase tracking-wider text-white/70">Cups Brewed</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
                      <div className="font-serif text-2xl font-bold text-[#FFA26B] leading-none mb-1">🔥 {streak}d</div>
                      <div className="text-[9px] uppercase tracking-wider text-white/70">Daily Ritual Streak</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
                      <div className="font-serif text-2xl font-bold text-[#F7D488] leading-none mb-1">{membership.points}</div>
                      <div className="text-[9px] uppercase tracking-wider text-white/70">Reward Points</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
                      <div className="font-serif text-2xl font-bold text-[#A9D5AF] leading-none mb-1">🌱 14</div>
                      <div className="text-[9px] uppercase tracking-wider text-white/70">Cups Saved (Zero-Waste)</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#C89D4B]/30 pt-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-mono font-semibold text-[#E8C17A]">{user.membershipId}</div>
                    <div className="text-[10px] text-white/60">{user.tier}</div>
                  </div>
                  <div className="text-white/60 text-[10px]">Share to Instagram Story ⚡</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-center mt-3">
                <button
                  type="button"
                  onClick={() => alert('✨ 9:16 Story Graphic generated! Ready to post on Instagram / TikTok Stories.')}
                  className="px-4 py-2 bg-[#181311] text-white text-xs font-semibold rounded-full shadow hover:bg-black transition"
                >
                  📸 Download Story (9:16)
                </button>
                <button
                  type="button"
                  onClick={() => setShowWrappedModal(false)}
                  className="px-4 py-2 bg-white text-[#181311] text-xs font-semibold rounded-full border border-gray-200 hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoyaltyCard;

/* ==========================================================================
   ATELIER LOYALTY STORE & REACTIVE STATE MANAGER
   Full persistent state with event bus and realistic café data models
   ========================================================================== */

const STORAGE_KEY = 'atelier_loyalty_state_v3';

const DEFAULT_SETTINGS = {
  rupeesPerPoint: 1, // Rule: ₹1 spent = 1 point
  ownerStampPin: '1234', // Café Owner PIN / Password required to stamp cards
  currencySymbol: '₹',
  programName: 'Atelier Loyalty Club',
  googleReviewUrl: 'https://www.google.com/search?q=Atelier+Coffee+Bandra+West+Mumbai+reviews'
};

const DEFAULT_PRODUCTS = [
  {
    id: 'prod_cappuccino',
    name: 'Cappuccino',
    price: 180,
    category: 'Coffee',
    description: 'Double espresso with textured microfoam.',
    icon: '☕'
  },
  {
    id: 'prod_kaapi',
    name: 'Artisan South Indian Kaapi',
    price: 280,
    category: 'Specialty Kaapi',
    description: 'Traditional brass dabara filter coffee.',
    icon: '🏺'
  },
  {
    id: 'prod_v60',
    name: 'Chikmagalur Single-Estate V60',
    price: 360,
    category: 'Brew Bar',
    description: 'Single-estate light roast pour-over.',
    icon: '🧪'
  },
  {
    id: 'prod_cold_drip',
    name: 'Araku Valley Cold Drip Reserve',
    price: 390,
    category: 'Brew Bar',
    description: '14-hour slow chilled extraction.',
    icon: '🧊'
  },
  {
    id: 'prod_cortado',
    name: 'Coorg Sun-Dried Cortado',
    price: 320,
    category: 'Coffee',
    description: 'Espresso with warm steamed milk.',
    icon: '☕'
  },
  {
    id: 'prod_flat_white',
    name: 'Oat Flat White',
    price: 340,
    category: 'Coffee',
    description: 'Velvety oat milk over double espresso.',
    icon: '🥛'
  },
  {
    id: 'prod_saffron_brioche',
    name: 'Cardamom & Saffron Morning Brioche',
    price: 260,
    category: 'Bakery',
    description: 'Flaky spiced saffron pastry.',
    icon: '🥐'
  },
  {
    id: 'prod_aeropress',
    name: 'Monsooned Malabar Aeropress',
    price: 310,
    category: 'Brew Bar',
    description: 'Smooth low-acid immersion brew.',
    icon: '☕'
  },
  {
    id: 'prod_tartine',
    name: 'Avocado & Zaatar Sourdough Tartine',
    price: 420,
    category: 'Provisions',
    description: 'Crushed avocado on toasted sourdough.',
    icon: '🥑'
  },
  {
    id: 'prod_beans',
    name: 'Araku Valley Micro-Lot Beans (250g)',
    price: 650,
    category: 'Retail',
    description: 'Organic whole-bean coffee bag (250g).',
    icon: '🫘'
  }
];

const DEFAULT_STATE = {
  isAuthenticated: false,
  cardSkin: 'espresso', // 'espresso' | 'holo' | 'matcha' | 'cyber'
  settings: DEFAULT_SETTINGS,
  products: DEFAULT_PRODUCTS,
  user: null,
  membership: {
    currentStamps: 0,
    maxStamps: 10,
    lifetimeVisits: 0,
    points: 0,
    rewardsRedeemedCount: 0,
    currentStreak: 0,
    streakFreezeAvailable: 1,
    streakMultiplier: 1.0
  },
  rewards: [
    {
      id: 'rew_pourover',
      title: 'Chikmagalur Single-Estate Pour Over',
      description: 'Single-estate pour-over coffee.',
      requiredVisits: 5,
      icon: '☕',
      category: 'Beverage',
      status: 'ready' // ready, in-progress, locked, redeemed
    },
    {
      id: 'rew_pastry',
      title: 'Cardamom & Saffron Morning Brioche',
      description: 'Freshly baked spiced brioche bun.',
      requiredVisits: 8,
      icon: '🥐',
      category: 'Pastry',
      status: 'in-progress'
    },
    {
      id: 'rew_beans',
      title: 'Araku Valley Micro-Lot Whole Bean (250g)',
      description: 'Freshly roasted whole beans (250g).',
      requiredVisits: 12,
      icon: '🫘',
      category: 'Roastery',
      status: 'locked'
    },
    {
      id: 'rew_cupping',
      title: 'Monsooned Malabar & Estate Tasting Flight',
      description: 'Guided tasting session for two.',
      requiredVisits: 18,
      icon: '✨',
      category: 'Experience',
      status: 'locked'
    },
    {
      id: 'rew_tumbler',
      title: 'Artisan Brass & Ceramic Davara Tumbler',
      description: 'Brass & ceramic travel tumbler.',
      requiredVisits: 25,
      icon: '🏺',
      category: 'Provisions',
      status: 'locked'
    }
  ],
  activities: [
    {
      id: 'act_101',
      type: 'transaction',
      title: '+25 Loyalty Points',
      subtitle: 'Chikmagalur V60 & Cardamom Saffron Bun (₹620 spent)',
      productName: 'Chikmagalur V60 & Cardamom Bun',
      amountSpent: 620,
      pointsEarned: 25,
      previousBalance: 395,
      newBalance: 420,
      conversionRate: 10,
      receiptNumber: 'RCP-89241',
      date: 'Today',
      time: '08:45 AM',
      location: 'Bandra West Flagship, Mumbai'
    },
    {
      id: 'act_102',
      type: 'transaction',
      title: '+28 Loyalty Points',
      subtitle: 'Artisanal South Indian Specialty Kaapi (₹280 spent)',
      productName: 'Artisanal South Indian Kaapi',
      amountSpent: 280,
      pointsEarned: 28,
      previousBalance: 367,
      newBalance: 395,
      conversionRate: 10,
      receiptNumber: 'RCP-84192',
      date: 'Yesterday',
      time: '03:15 PM',
      location: 'Indiranagar Roastery, Bengaluru'
    },
    {
      id: 'act_103',
      type: 'redemption',
      title: 'Reward Redeemed',
      subtitle: 'Free Cardamom & Saffron Morning Brioche',
      date: 'Sep 28, 2026',
      time: '10:20 AM',
      pointsEarned: 0,
      location: 'Khan Market, New Delhi'
    },
    {
      id: 'act_104',
      type: 'transaction',
      title: '+39 Loyalty Points',
      subtitle: 'Araku Valley Slow Drip Cold Brew (₹390 spent)',
      productName: 'Araku Valley Slow Drip Cold Brew',
      amountSpent: 390,
      pointsEarned: 39,
      previousBalance: 328,
      newBalance: 367,
      conversionRate: 10,
      receiptNumber: 'RCP-78192',
      date: 'Sep 25, 2026',
      time: '09:10 AM',
      location: 'Koregaon Park Roastery, Pune'
    },
    {
      id: 'act_105',
      type: 'transaction',
      title: '+32 Loyalty Points',
      subtitle: 'Coorg Honey Sun-Dried Cortado (₹320 spent)',
      productName: 'Coorg Sun-Dried Cortado',
      amountSpent: 320,
      pointsEarned: 32,
      previousBalance: 296,
      newBalance: 328,
      conversionRate: 10,
      receiptNumber: 'RCP-71934',
      date: 'Sep 22, 2026',
      time: '04:00 PM',
      location: 'Bandra West Flagship, Mumbai'
    }
  ],
  activeRedemptionPass: null // Set when a reward is redeemed
};

class Store {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
    this.recomputeRewardsStatus();

    // Auto-refresh fresh data from Supabase Cloud PostgreSQL
    if (window.AtelierSupabase) {
      const session = window.AtelierSupabase.getSession();
      if (session && session.userId) {
        this.refreshFromSupabase(session.userId);
      }
    }
  }

  loadState() {
    try {
      const session = window.AtelierSupabase ? window.AtelierSupabase.getSession() : null;
      let saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        saved = localStorage.getItem('atelier_loyalty_state_v2');
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.settings) {
          parsed.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        } else {
          // If previous cached rate was 10, migrate to new 1:1 rule (₹1 = 1 point)
          if (!parsed.settings.rupeesPerPoint || parsed.settings.rupeesPerPoint === 10) {
            parsed.settings.rupeesPerPoint = 1;
          }
        }
        if (!parsed.products || !Array.isArray(parsed.products) || parsed.products.length === 0) {
          parsed.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
        } else {
          // Guarantee Cappuccino is in the menu
          const hasCappuccino = parsed.products.some(p => p.name.toLowerCase().includes('cappuccino'));
          if (!hasCappuccino) {
            parsed.products.unshift(DEFAULT_PRODUCTS[0]);
          }
        }
        if (!parsed.settings.ownerStampPin) {
          parsed.settings.ownerStampPin = '1234';
        }
        if (!parsed.cardSkin) {
          parsed.cardSkin = 'espresso';
        }

        // Strict Session Gate: If no active Supabase session, reset to unauthenticated state
        if (!session) {
          parsed.isAuthenticated = false;
          parsed.user = null;
          parsed.membership = JSON.parse(JSON.stringify(DEFAULT_STATE.membership));
          parsed.activities = [];
        } else {
          parsed.isAuthenticated = true;
          if (!parsed.user) {
            parsed.user = {
              id: session.userId || 'usr_member',
              firstName: 'Connoisseur',
              lastName: '',
              email: session.email || '',
              phone: '+91 98201 44829',
              dob: '',
              memberSince: 'October 2026',
              membershipId: session.membershipId || (session.userId ? `AT-${String(session.userId).slice(-5)}` : 'AT-CLUB'),
              favoriteDrink: 'Chikmagalur Pour Over (Attikan Estate)',
              milkPreference: 'Oatly Barista / A2 Desi Cow Milk',
              roastPreference: 'Medium-Light (Western Ghats Shade-Grown)',
              notificationsEnabled: true
            };
          }
          if (!parsed.membership) {
            parsed.membership = JSON.parse(JSON.stringify(DEFAULT_STATE.membership));
          }
          if (!Array.isArray(parsed.activities)) {
            parsed.activities = [];
          }
          if (parsed.membership && parsed.membership.streakMultiplier === undefined) {
            parsed.membership.streakMultiplier = 1.5;
            parsed.membership.streakFreezeAvailable = 1;
            parsed.membership.currentStreak = parsed.membership.currentStreak || 1;
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not load localStorage, using defaults');
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  // Café Owner Stamp Password / PIN Security Engine
  getOwnerStampPin() {
    return this.state.settings?.ownerStampPin || '1234';
  }

  setOwnerStampPin(newPin) {
    if (!newPin || typeof newPin !== 'string' || newPin.trim().length === 0) return false;
    this.state.settings.ownerStampPin = newPin.trim();
    this.saveState();
    if (window.AtelierSecurity) {
      window.AtelierSecurity.logEvent({
        type: 'PIN_UPDATED',
        status: 'SUCCESS',
        details: 'Café Owner PIN updated and re-hashed via Security Engine'
      });
    }
    return true;
  }

  async verifyOwnerPin(inputPin, extraData = {}) {
    if (window.AtelierSecurity) {
      return await window.AtelierSecurity.verifyOwnerPin(inputPin, this.getOwnerStampPin(), extraData);
    }
    const current = this.getOwnerStampPin();
    const isValid = String(inputPin).trim() === String(current).trim();
    return { success: isValid, remainingAttempts: isValid ? 5 : 4 };
  }

  setCardSkin(skin) {
    const validSkins = ['espresso', 'holo', 'matcha', 'cyber'];
    if (validSkins.includes(skin)) {
      this.state.cardSkin = skin;
      this.saveState();
      if (this.state.isAuthenticated && this.state.user?.id && window.AtelierSupabase) {
        window.AtelierSupabase.syncMembership(this.state.user.id, { card_skin: skin });
      }
      if (window.AtelierAudio && window.AtelierAudio.playTap) {
        window.AtelierAudio.playTap();
      }
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save to localStorage');
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event) {
    this.listeners.forEach(l => {
      try {
        l(this.state, event);
      } catch (e) {
        console.warn('Store subscriber error:', e);
      }
    });
  }

  notifyListeners(event) {
    this.notify(event);
  }

  getState() {
    return this.state;
  }

  recomputeRewardsStatus() {
    const visits = this.state.membership ? this.state.membership.currentStamps : 0;
    const redeemedKeywords = (this.state.activities || [])
      .filter(a => a.type === 'redemption' || (a.title && a.title.toLowerCase().includes('redeem')) || (a.productName && a.productName.toLowerCase().includes('reward redeemed')))
      .map(a => `${a.title || ''} ${a.subtitle || ''} ${a.productName || ''}`.toLowerCase());

    this.state.rewards.forEach(rew => {
      const wasRedeemed = rew.status === 'redeemed' ||
        (this.state.activeRedemptionPass && this.state.activeRedemptionPass.rewardId === rew.id) ||
        redeemedKeywords.some(kw => kw.includes(rew.title.toLowerCase()) || kw.includes(rew.id.toLowerCase()));

      if (wasRedeemed) {
        rew.status = 'redeemed';
        return;
      }
      if (visits >= rew.requiredVisits) {
        rew.status = 'ready';
      } else if (visits >= Math.max(1, rew.requiredVisits - 3)) {
        rew.status = 'in-progress';
      } else {
        rew.status = 'locked';
      }
    });
  }

  // Points Conversion & Calculation Engine
  getRupeesPerPoint() {
    return this.state.settings?.rupeesPerPoint || 1;
  }

  // Calculate points from spend amount using current conversion rate
  // Rule: ₹1 spent = 1 point
  calculatePoints(amountSpent) {
    const rate = this.getRupeesPerPoint();
    if (!rate || rate <= 0) return 0;
    return Math.floor(Math.max(0, Number(amountSpent) || 0) / rate);
  }

  // Helper to obtain a product's point value dynamically
  getProductPoints(productOrPrice) {
    const price = typeof productOrPrice === 'number' ? productOrPrice : (productOrPrice?.price || 0);
    return this.calculatePoints(price);
  }

  // Café Owner Action: Change conversion rate (e.g. ₹10 = 1 pt -> ₹5 = 1 pt)
  setConversionRate(newRupeesPerPoint) {
    const rate = Number(newRupeesPerPoint);
    if (isNaN(rate) || rate <= 0) return false;
    this.state.settings.rupeesPerPoint = rate;
    this.saveState();
    if (window.AtelierAudio) {
      if (window.AtelierAudio.playRewardUnlock) window.AtelierAudio.playRewardUnlock();
    }
    return true;
  }

  // Product Catalog Management
  addProduct({ name, price, category = 'Coffee', description = '', icon = '☕' }) {
    const id = 'prod_' + Date.now();
    const newProduct = {
      id,
      name: name.trim(),
      price: Math.max(0, Number(price) || 0),
      category,
      description: description.trim() || 'Signature atelier selection.',
      icon: icon || '☕'
    };
    this.state.products.push(newProduct);
    this.saveState();
    return newProduct;
  }

  updateProduct(id, updates) {
    const prod = this.state.products.find(p => p.id === id);
    if (!prod) return false;
    if (updates.name !== undefined) prod.name = updates.name.trim();
    if (updates.price !== undefined) prod.price = Math.max(0, Number(updates.price) || 0);
    if (updates.category !== undefined) prod.category = updates.category;
    if (updates.description !== undefined) prod.description = updates.description.trim();
    if (updates.icon !== undefined) prod.icon = updates.icon;
    this.saveState();
    return true;
  }

  deleteProduct(id) {
    this.state.products = this.state.products.filter(p => p.id !== id);
    this.saveState();
    return true;
  }

  resetProductsToDefault() {
    this.state.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    this.saveState();
  }

  // Transaction Engine: Customer buys a product
  // Example: Customer buys Cappuccino ₹180 -> ₹180 spent -> +18 pts -> New balance: 438 pts
  createTransaction({ productId = null, productName = '', amountSpent = null, addStamp = true, baristaNotes = '' } = {}) {
    let product = null;
    if (productId) {
      product = this.state.products.find(p => p.id === productId);
    } else if (productName) {
      product = this.state.products.find(p => p.name.toLowerCase() === productName.toLowerCase());
    }

    const name = product ? product.name : (productName || 'Cappuccino');
    const spent = amountSpent !== null && amountSpent !== undefined ? Number(amountSpent) : (product ? product.price : 180);
    const rate = this.getRupeesPerPoint();
    const pointsEarned = this.calculatePoints(spent);

    const prevBalance = this.state.membership.points;
    const newBalance = prevBalance + pointsEarned;
    this.state.membership.points = newBalance;

    let stampResult = null;
    if (addStamp) {
      const prevVisits = Number(this.state.membership.currentStamps || 0);
      let newVisits = prevVisits + 1;
      let cardCompleted = false;
      if (newVisits >= this.state.membership.maxStamps) {
        newVisits = this.state.membership.maxStamps; // Full card at maxStamps (10/10)
        cardCompleted = true;
      }
      this.state.membership.currentStamps = newVisits;
      this.state.membership.lifetimeVisits = (Number(this.state.membership.lifetimeVisits || 0)) + 1;
      stampResult = { newVisits, cardCompleted };
    }

    const receiptNumber = 'RCP-' + Math.floor(10000 + Math.random() * 90000);
    const newAct = {
      id: 'txn_' + Date.now(),
      type: 'transaction',
      title: `+${pointsEarned} Loyalty Points`,
      subtitle: `${name} (₹${spent} spent)`,
      productName: name,
      amountSpent: spent,
      pointsEarned: pointsEarned,
      previousBalance: prevBalance,
      newBalance: newBalance,
      conversionRate: rate,
      receiptNumber: receiptNumber,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: 'Bandra West Flagship, Mumbai',
      baristaNotes: baristaNotes || 'Till Register #02'
    };

    this.state.activities.unshift(newAct);
    this.recomputeRewardsStatus();
    this.saveState();

    // Persist to Supabase Cloud Database if user authenticated
    if (this.state.isAuthenticated && this.state.user?.id && window.AtelierSupabase) {
      window.AtelierSupabase.syncMembership(this.state.user.id, {
        current_stamps: this.state.membership.currentStamps,
        lifetime_visits: this.state.membership.lifetimeVisits,
        points: this.state.membership.points
      });
      window.AtelierSupabase.recordTransaction({
        id: newAct.id,
        user_id: this.state.user.id,
        product_name: newAct.productName,
        amount_spent: newAct.amountSpent,
        points_earned: newAct.pointsEarned,
        stamps_added: stampResult ? 1 : 0,
        receipt_number: newAct.receiptNumber,
        location: newAct.location
      });
    }

    if (window.AtelierAudio) {
      if (window.AtelierAudio.playCashRegister) {
        window.AtelierAudio.playCashRegister();
      } else if (window.AtelierAudio.playStampSound) {
        window.AtelierAudio.playStampSound();
      }
    }

    // Trigger celebration if points reach a new Saga Level (500 pts difference) or stamp milestone
    if (stampResult) {
      const prevLvl = window.candyEngine ? window.candyEngine.calculateCurrentLevel({ points: prevBalance }) : 1;
      const newLvl = window.candyEngine ? window.candyEngine.calculateCurrentLevel(this.state.membership) : 1;

      if (newLvl > prevLvl) {
        setTimeout(() => {
          const hasSagaModal = document.getElementById('saga-advance-backdrop');
          if (!hasSagaModal) {
            if (window.candyEngine) {
              window.candyEngine.triggerLevelUpCelebration(newLvl);
            } else if (window.launchAtelierCelebration) {
              window.launchAtelierCelebration();
            }
          }
        }, 400);
      } else if (stampResult.newVisits === 5 || stampResult.newVisits === 8 || stampResult.newVisits === 10) {
        setTimeout(() => {
          const hasSagaModal = document.getElementById('saga-advance-backdrop');
          if (!hasSagaModal) {
            if (window.AtelierAudio) window.AtelierAudio.playRewardUnlock();
            if (window.launchAtelierCelebration) window.launchAtelierCelebration();
          }
        }, 350);
      }
    }

    return {
      transaction: newAct,
      productName: name,
      amountSpent: spent,
      pointsEarned,
      previousBalance: prevBalance,
      newBalance,
      conversionRate: rate,
      stampResult
    };
  }

  // Barista / Customer Action: Add Visit Stamp (convenience wrapper that supports bill amount)
  addStamp(drinkName = 'Chikmagalur Single-Estate Pour Over', amountSpent = null) {
    const spent = amountSpent !== null && amountSpent !== undefined && Number(amountSpent) > 0
      ? Number(amountSpent)
      : null;

    if (spent !== null) {
      const res = this.createTransaction({
        productName: drinkName || 'Specialty Coffee Order',
        amountSpent: spent,
        addStamp: true
      });
      return {
        newVisits: res.stampResult.newVisits,
        cardCompleted: res.stampResult.cardCompleted,
        pointsEarned: res.pointsEarned,
        newBalance: res.newBalance
      };
    }

    // Check if drinkName matches a known product
    const matchedProduct = this.state.products.find(p =>
      drinkName.toLowerCase().includes(p.name.toLowerCase()) ||
      p.name.toLowerCase().includes(drinkName.toLowerCase())
    );

    if (matchedProduct) {
      const res = this.createTransaction({ productId: matchedProduct.id, addStamp: true });
      return {
        newVisits: res.stampResult.newVisits,
        cardCompleted: res.stampResult.cardCompleted,
        pointsEarned: res.pointsEarned,
        newBalance: res.newBalance
      };
    }

    // Fallback: ₹250 spent -> 25 points at ₹10=1pt
    const res = this.createTransaction({ productName: drinkName, amountSpent: 250, addStamp: true });
    return {
      newVisits: res.stampResult.newVisits,
      cardCompleted: res.stampResult.cardCompleted,
      pointsEarned: res.pointsEarned,
      newBalance: res.newBalance
    };
  }

  // Undo / Subtract Stamp & Transaction
  removeStamp() {
    if (this.state.membership.currentStamps > 0) {
      this.state.membership.currentStamps -= 1;
      this.state.membership.lifetimeVisits = Math.max(0, this.state.membership.lifetimeVisits - 1);

      // If the latest activity was a stamp or transaction, revert its points
      let pointsToDeduct = 25;
      if (this.state.activities.length > 0 && this.state.activities[0].type === 'transaction') {
        pointsToDeduct = this.state.activities[0].pointsEarned || 18;
        this.state.activities.shift(); // remove reverted activity
      }
      this.state.membership.points = Math.max(0, this.state.membership.points - pointsToDeduct);
      this.recomputeRewardsStatus();
      this.saveState();

      if (this.state.isAuthenticated && this.state.user?.id && window.AtelierSupabase) {
        window.AtelierSupabase.syncMembership(this.state.user.id, {
          current_stamps: this.state.membership.currentStamps,
          lifetime_visits: this.state.membership.lifetimeVisits,
          points: this.state.membership.points
        });
      }

      if (window.AtelierAudio) window.AtelierAudio.playTap();
    }
  }

  awardPoints(amount = 50) {
    if (!this.state.membership) return;
    const prevLvl = window.candyEngine ? window.candyEngine.calculateCurrentLevel(this.state.membership) : 1;
    this.state.membership.points = (this.state.membership.points || 0) + amount;
    const newLvl = window.candyEngine ? window.candyEngine.calculateCurrentLevel(this.state.membership) : 1;
    this.saveState();

    if (this.state.isAuthenticated && this.state.user?.id && window.AtelierSupabase) {
      window.AtelierSupabase.syncMembership(this.state.user.id, {
        points: this.state.membership.points
      });
      window.AtelierSupabase.recordTransaction({
        id: 'tx_bonus_' + Date.now(),
        user_id: this.state.user.id,
        product_name: `Bonus Reward (+${amount} Pts)`,
        amount_spent: 0,
        points_earned: amount,
        stamps_added: 0,
        receipt_number: 'RCP-' + Math.floor(10000 + Math.random() * 90000),
        location: 'Bandra West Flagship, Mumbai'
      });
    }

    if (newLvl > prevLvl && window.candyEngine) {
      setTimeout(() => window.candyEngine.triggerLevelUpCelebration(newLvl), 350);
    } else if (window.AtelierAudio) {
      window.AtelierAudio.playRewardUnlock();
    }
  }

  // Redeem Reward -> Generates Digital Pass
  redeemReward(rewardId) {
    const reward = this.state.rewards.find(r => r.id === rewardId);
    if (!reward) return null;
    if (reward.status === 'redeemed') {
      if (this.state.activeRedemptionPass && this.state.activeRedemptionPass.rewardId === rewardId) {
        return this.state.activeRedemptionPass;
      }
      return null;
    }

    const passCode = 'RD-' + Math.floor(10000 + Math.random() * 90000);
    const pass = {
      passId: 'pass_' + Date.now(),
      rewardId: reward.id,
      rewardTitle: reward.title,
      code: passCode,
      createdAt: Date.now(),
      expiresInMinutes: 15,
      customerName: `${this.state.user.firstName} ${this.state.user.lastName}`,
      membershipId: this.state.user.membershipId,
      status: 'active'
    };

    reward.status = 'redeemed';
    this.state.activeRedemptionPass = pass;
    this.state.membership.rewardsRedeemedCount += 1;

    // Log Activity
    this.state.activities.unshift({
      id: 'act_' + Date.now(),
      type: 'redemption',
      title: 'Reward Redeemed',
      subtitle: `${reward.title} (Pass #${passCode})`,
      date: 'Just now',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pointsEarned: 0,
      location: 'Bandra West Flagship, Mumbai'
    });

    this.saveState();

    if (this.state.isAuthenticated && this.state.user?.id && window.AtelierSupabase) {
      window.AtelierSupabase.syncMembership(this.state.user.id, {
        rewards_redeemed_count: this.state.membership.rewardsRedeemedCount
      });
      window.AtelierSupabase.recordTransaction({
        id: 'tx_redeem_' + Date.now(),
        user_id: this.state.user.id,
        product_name: `Reward Redeemed: ${reward.title}`,
        amount_spent: 0,
        points_earned: 0,
        stamps_added: 0,
        receipt_number: passCode,
        location: 'Bandra West Flagship, Mumbai'
      });
    }

    if (window.AtelierAudio) window.AtelierAudio.playRewardUnlock();
    if (window.launchAtelierCelebration) window.launchAtelierCelebration();

    return pass;
  }

  // Staff completes verification of active pass
  confirmPassVerification() {
    if (this.state.activeRedemptionPass) {
      this.state.activeRedemptionPass = null;
      this.saveState();
      if (window.AtelierAudio) window.AtelierAudio.playTap();
    }
  }

  // Customer / Barista Action: Renew Full Loyalty Card (Resets stamps to 0, grants celebration + bonus)
  renewLoyaltyCard() {
    if (!this.state.membership) return false;

    // Reset stamps to 0
    this.state.membership.currentStamps = 0;
    this.state.membership.cardCyclesCompleted = (Number(this.state.membership.cardCyclesCompleted || 0)) + 1;
    const cycleNum = this.state.membership.cardCyclesCompleted;

    // Bonus 50 points for completing and renewing card
    const bonusPoints = 50;
    const prevPoints = Number(this.state.membership.points || 0);
    const newPoints = prevPoints + bonusPoints;
    this.state.membership.points = newPoints;

    const receiptNumber = 'RNW-' + Math.floor(10000 + Math.random() * 90000);
    const renewalAct = {
      id: 'renew_' + Date.now(),
      type: 'reward',
      title: 'Card Renewed 🔄',
      subtitle: `Completed 10-Stamp Card #${cycleNum}! +${bonusPoints} Bonus Pts`,
      productName: `Card #${cycleNum} Renewal`,
      amountSpent: 0,
      pointsEarned: bonusPoints,
      previousBalance: prevPoints,
      newBalance: newPoints,
      conversionRate: this.getRupeesPerPoint(),
      receiptNumber: receiptNumber,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: 'Bandra West Flagship, Mumbai'
    };

    this.state.activities.unshift(renewalAct);
    this.recomputeRewardsStatus();
    this.saveState();

    // Persist to Supabase if authenticated
    if (this.state.isAuthenticated && this.state.user?.id && window.AtelierSupabase) {
      window.AtelierSupabase.syncMembership(this.state.user.id, {
        current_stamps: 0,
        lifetime_visits: this.state.membership.lifetimeVisits,
        points: this.state.membership.points
      });
      window.AtelierSupabase.recordTransaction({
        id: renewalAct.id,
        user_id: this.state.user.id,
        product_name: renewalAct.productName,
        amount_spent: 0,
        points_earned: bonusPoints,
        stamps_added: 0,
        receipt_number: renewalAct.receiptNumber,
        location: renewalAct.location
      });
    }

    if (window.AtelierAudio) {
      if (window.AtelierAudio.playRewardUnlock) window.AtelierAudio.playRewardUnlock();
      else if (window.AtelierAudio.playSuccessChime) window.AtelierAudio.playSuccessChime();
    }
    if (window.launchAtelierCelebration) {
      window.launchAtelierCelebration();
    }

    this.notify({ type: 'CARD_RENEWED', cycleNum, bonusPoints });
    return { cycleNum, bonusPoints };
  }

  // --------------------------------------------------------------------------
  // Supabase Live Data Synchronization Engine
  // --------------------------------------------------------------------------
  applyUserData(user, membership, transactions = []) {
    if (!user) return;
    this.state.isAuthenticated = true;
    const userId = user.id || 'usr_connoisseur';
    this.state.user = {
      id: userId,
      firstName: user.first_name || user.firstName || 'Connoisseur',
      lastName: user.last_name || user.lastName || '',
      email: user.email || '',
      phone: user.phone || '+91 98201 44829',
      dob: user.dob || '',
      memberSince: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'October 2026',
      membershipId: user.membership_id || (user.id ? `AT-${String(user.id).slice(-5)}` : 'AT-CLUB'),
      favoriteDrink: user.favorite_drink || 'Chikmagalur Pour Over (Attikan Estate)',
      milkPreference: 'Oatly Barista / A2 Desi Cow Milk',
      roastPreference: 'Medium-Light (Western Ghats Shade-Grown)',
      notificationsEnabled: true
    };

    if (membership) {
      this.state.membership = {
        currentStamps: Number(membership.current_stamps ?? 0),
        maxStamps: Number(membership.max_stamps ?? 10),
        lifetimeVisits: Number(membership.lifetime_visits ?? 0),
        points: Number(membership.points ?? 0),
        currentStreak: Number(membership.current_streak ?? 0),
        rewardsRedeemedCount: Number(membership.rewards_redeemed_count ?? 0),
        streakFreezeAvailable: 1,
        streakMultiplier: 1.5
      };
      if (membership.card_skin) {
        this.state.cardSkin = membership.card_skin;
      }
    } else if (!this.state.membership) {
      this.state.membership = JSON.parse(JSON.stringify(DEFAULT_STATE.membership));
    }

    if (Array.isArray(transactions) && transactions.length > 0) {
      this.state.activities = transactions.map(tx => ({
        id: tx.id,
        type: (tx.stamps_added > 0 || String(tx.product_name).toLowerCase().includes('stamp')) ? 'stamp' : 'transaction',
        title: tx.points_earned > 0 ? `+${tx.points_earned} Loyalty Points` : (tx.product_name || 'Café Visit'),
        subtitle: `${tx.product_name || 'Specialty Roast'} (${tx.amount_spent > 0 ? '₹' + tx.amount_spent + ' spent' : 'Complimentary'})`,
        productName: tx.product_name || 'Coffee Item',
        amountSpent: Number(tx.amount_spent || 0),
        pointsEarned: Number(tx.points_earned || 0),
        stampsAdded: Number(tx.stamps_added || 0),
        receiptNumber: tx.receipt_number || 'RCP-89241',
        date: tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today',
        time: tx.created_at ? new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        location: tx.location || 'Bandra West Flagship, Mumbai'
      }));
    } else if (!Array.isArray(this.state.activities)) {
      this.state.activities = [];
    }

    this.recomputeRewardsStatus();
    this.saveState();
    this.notifyListeners({ type: 'AUTH_SUCCESS', user: this.state.user });
  }

  async refreshFromSupabase(userId) {
    if (!window.AtelierSupabase || !userId) return;
    try {
      const data = await window.AtelierSupabase.fetchUserData(userId);
      if (data && data.user) {
        this.applyUserData(data.user, data.membership, data.transactions);
      }
    } catch (err) {
      console.warn('Could not refresh from Supabase:', err);
    }
  }

  // Auth Operations
  async login(email, password) {
    if (!window.AtelierSupabase) {
      throw new Error('Supabase Client is not initialized.');
    }
    const result = await window.AtelierSupabase.signIn(email, password);
    this.applyUserData(result.user, result.membership, result.transactions);
    return result;
  }

  async register(userData) {
    if (!window.AtelierSupabase) {
      throw new Error('Supabase Client is not initialized.');
    }
    const result = await window.AtelierSupabase.signUp(userData);
    this.applyUserData(result.user, result.membership, result.transactions);
    return result;
  }

  async updateUserProfile(updates) {
    if (!this.state.user) return;
    this.state.user = {
      ...this.state.user,
      ...updates
    };
    this.saveState();

    // Persist to Supabase if configured
    if (window.AtelierSupabase && this.state.user.id) {
      const dbUpdates = {};
      if (updates.dob !== undefined) dbUpdates.dob = updates.dob;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
      if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;

      try {
        await window.AtelierSupabase.update('users', dbUpdates, 'id', this.state.user.id);
      } catch (err) {
        console.warn('Could not persist profile updates to Supabase:', err);
      }
    }

    // Persist to backend server if available
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: this.state.user.id, ...updates })
      });
    } catch (e) { }

    this.notifyListeners({ type: 'PROFILE_UPDATED', user: this.state.user });
  }

  logout() {
    if (window.AtelierSupabase) {
      window.AtelierSupabase.signOut();
    }
    this.state.isAuthenticated = false;
    this.state.user = null;
    this.state.membership = JSON.parse(JSON.stringify(DEFAULT_STATE.membership));
    this.state.activities = [];
    this.saveState();
  }

  resetToCleanDefaults() {
    this.logout();
    if (window.AtelierAudio && window.AtelierAudio.playTap) window.AtelierAudio.playTap();
  }
}

window.AtelierStore = new Store();

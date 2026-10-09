/* ==========================================================================
   ATELIER LOYALTY STORE & REACTIVE STATE MANAGER
   Full persistent state with event bus and realistic café data models
   ========================================================================== */

const STORAGE_KEY = 'atelier_loyalty_state_v3';

const DEFAULT_SETTINGS = {
  rupeesPerPoint: 10, // Default Rule: ₹10 spent = 1 point
  ownerStampPin: '1234', // Café Owner PIN / Password required to stamp cards
  currencySymbol: '₹',
  programName: 'Atelier Loyalty Club'
};

const DEFAULT_PRODUCTS = [
  {
    id: 'prod_cappuccino',
    name: 'Cappuccino',
    price: 180,
    category: 'Coffee',
    description: 'Double espresso pulled over silky textured microfoam with dusted dark cocoa.',
    icon: '☕'
  },
  {
    id: 'prod_kaapi',
    name: 'Artisan South Indian Kaapi',
    price: 280,
    category: 'Specialty Kaapi',
    description: 'Slow-dripped brass dabara extraction with estate chicory and frothed A2 milk.',
    icon: '🏺'
  },
  {
    id: 'prod_v60',
    name: 'Chikmagalur Single-Estate V60',
    price: 360,
    category: 'Brew Bar',
    description: 'Light roast hand-pour from Attikan Estate (notes of nectarine & raw honey).',
    icon: '🧪'
  },
  {
    id: 'prod_cold_drip',
    name: 'Araku Valley Cold Drip Reserve',
    price: 390,
    category: 'Brew Bar',
    description: '14-hour chilled Kyoto drip tower extraction from organic Eastern Ghats micro-lot.',
    icon: '🧊'
  },
  {
    id: 'prod_cortado',
    name: 'Coorg Sun-Dried Cortado',
    price: 320,
    category: 'Coffee',
    description: '1:1 ratio of rich espresso and steamed milk cut with green cardamom bitters.',
    icon: '☕'
  },
  {
    id: 'prod_flat_white',
    name: 'Oat Flat White',
    price: 340,
    category: 'Coffee',
    description: 'Velvety microfoam over a double ristretto shot with Swedish Oatly Barista edition.',
    icon: '🥛'
  },
  {
    id: 'prod_saffron_brioche',
    name: 'Cardamom & Saffron Morning Brioche',
    price: 260,
    category: 'Bakery',
    description: 'Hand-laminated flaky brioche bun with cultured butter and Kashmiri saffron syrup.',
    icon: '🥐'
  },
  {
    id: 'prod_aeropress',
    name: 'Monsooned Malabar Aeropress',
    price: 310,
    category: 'Brew Bar',
    description: 'Low-acid monsoon-cured beans brewed inverted with sweet earthy finish.',
    icon: '☕'
  },
  {
    id: 'prod_tartine',
    name: 'Avocado & Zaatar Sourdough Tartine',
    price: 420,
    category: 'Provisions',
    description: 'Crushed Hass avocado on toasted country loaf with house dukkah & olive oil.',
    icon: '🥑'
  },
  {
    id: 'prod_beans',
    name: 'Araku Valley Micro-Lot Beans (250g)',
    price: 650,
    category: 'Retail',
    description: 'Whole-bean coffee bag from tribal farmer collective, freshly roasted in Bandra.',
    icon: '🫘'
  }
];

const DEFAULT_STATE = {
  isAuthenticated: true,
  cardSkin: 'espresso', // 'espresso' | 'holo' | 'matcha' | 'cyber'
  settings: DEFAULT_SETTINGS,
  products: DEFAULT_PRODUCTS,
  user: {
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
  },
  membership: {
    currentStamps: 7,
    maxStamps: 10,
    lifetimeVisits: 27,
    points: 420,
    rewardsRedeemedCount: 3,
    currentStreak: 4,
    streakFreezeAvailable: 1,
    streakMultiplier: 1.5
  },
  rewards: [
    {
      id: 'rew_pourover',
      title: 'Chikmagalur Single-Estate Pour Over',
      description: 'Hand-brewed V60 from our shade-grown harvest in Baba Budangiri & Attikan Estate, Karnataka.',
      requiredVisits: 5,
      icon: '☕',
      category: 'Beverage',
      status: 'ready' // ready, in-progress, locked, redeemed
    },
    {
      id: 'rew_pastry',
      title: 'Cardamom & Saffron Morning Brioche',
      description: 'Hand-laminated morning bun with cultured butter, green Idukki cardamom, and Kashmiri saffron glaze.',
      requiredVisits: 8,
      icon: '🥐',
      category: 'Pastry',
      status: 'in-progress'
    },
    {
      id: 'rew_beans',
      title: 'Araku Valley Micro-Lot Whole Bean (250g)',
      description: 'Direct-trade, high-altitude organic Arabica from tribal cooperatives in Eastern Ghats, freshly roasted.',
      requiredVisits: 12,
      icon: '🫘',
      category: 'Roastery',
      status: 'locked'
    },
    {
      id: 'rew_cupping',
      title: 'Monsooned Malabar & Estate Tasting Flight',
      description: 'Guided sensory coffee cupping session for two exploring 4 iconic Indian micro-lots with our Master Roaster.',
      requiredVisits: 18,
      icon: '✨',
      category: 'Experience',
      status: 'locked'
    },
    {
      id: 'rew_tumbler',
      title: 'Artisan Brass & Ceramic Davara Tumbler',
      description: 'Traditional dabara-inspired double-wall ceramic and hammered brass travel vessel.',
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
  }

  loadState() {
    try {
      // Check v3 first, fall back to v2 for seamless upgrade
      let saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        saved = localStorage.getItem('atelier_loyalty_state_v2');
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.settings) {
          parsed.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
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
        if (parsed.membership && parsed.membership.streakMultiplier === undefined) {
          parsed.membership.streakMultiplier = 1.5;
          parsed.membership.streakFreezeAvailable = 1;
          parsed.membership.currentStreak = parsed.membership.currentStreak || 4;
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

  async verifyOwnerPin(inputPin) {
    if (window.AtelierSecurity) {
      return await window.AtelierSecurity.verifyOwnerPin(inputPin, this.getOwnerStampPin());
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

  notify() {
    this.listeners.forEach(l => l(this.state));
  }

  getState() {
    return this.state;
  }

  recomputeRewardsStatus() {
    const visits = this.state.membership.currentStamps;
    this.state.rewards.forEach(rew => {
      if (rew.status === 'redeemed') return;
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
    return this.state.settings?.rupeesPerPoint || 10;
  }

  // Calculate points from spend amount using current conversion rate
  // Default rule: ₹10 spent = 1 point
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
      const prevVisits = this.state.membership.currentStamps;
      let newVisits = prevVisits + 1;
      let cardCompleted = false;
      if (newVisits > this.state.membership.maxStamps) {
        newVisits = 1; // Start fresh card cycle!
        cardCompleted = true;
      }
      this.state.membership.currentStamps = newVisits;
      this.state.membership.lifetimeVisits += 1;
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

    if (window.AtelierAudio) {
      if (window.AtelierAudio.playCashRegister) {
        window.AtelierAudio.playCashRegister();
      } else if (window.AtelierAudio.playStampSound) {
        window.AtelierAudio.playStampSound();
      }
    }

    // Trigger celebration if stamp milestone reached
    if (stampResult && (stampResult.newVisits === 5 || stampResult.newVisits === 8 || stampResult.newVisits === 10)) {
      setTimeout(() => {
        if (window.AtelierAudio) window.AtelierAudio.playRewardUnlock();
        if (window.launchAtelierCelebration) window.launchAtelierCelebration();
      }, 350);
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

  // Barista / Customer Action: Add Visit Stamp (convenience wrapper that supports products)
  addStamp(drinkName = 'Chikmagalur Pour Over & Cardamom Bun') {
    // Check if drinkName matches a known product
    const matchedProduct = this.state.products.find(p =>
      drinkName.toLowerCase().includes(p.name.toLowerCase()) ||
      p.name.toLowerCase().includes(drinkName.toLowerCase())
    );

    if (matchedProduct) {
      const res = this.createTransaction({ productId: matchedProduct.id, addStamp: true });
      return { newVisits: res.stampResult.newVisits, cardCompleted: res.stampResult.cardCompleted, pointsEarned: res.pointsEarned };
    }

    // Fallback: ₹250 spent -> 25 points at ₹10=1pt
    const res = this.createTransaction({ productName: drinkName, amountSpent: 250, addStamp: true });
    return { newVisits: res.stampResult.newVisits, cardCompleted: res.stampResult.cardCompleted, pointsEarned: res.pointsEarned };
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
      if (window.AtelierAudio) window.AtelierAudio.playTap();
    }
  }

  awardPoints(amount = 50) {
    this.state.membership.points += amount;
    this.saveState();
    if (window.AtelierAudio) window.AtelierAudio.playRewardUnlock();
  }

  // Redeem Reward -> Generates Digital Pass
  redeemReward(rewardId) {
    const reward = this.state.rewards.find(r => r.id === rewardId);
    if (!reward) return null;

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

  // Auth Operations
  login(email, password) {
    this.state.isAuthenticated = true;
    this.saveState();
  }

  register(userData) {
    const memberNum = Math.floor(10000 + Math.random() * 90000);
    this.state.user = {
      id: 'usr_' + Date.now(),
      firstName: userData.firstName || 'Guest',
      lastName: userData.lastName || 'Connoisseur',
      email: userData.email || 'guest@atelier-coffee.com',
      phone: userData.phone || '+1 (555) 019-2834',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      membershipId: `AT-${memberNum}`,
      tier: 'Reserve Member',
      favoriteDrink: 'Oat Flat White',
      milkPreference: 'Oat Milk',
      roastPreference: 'Light Roast',
      notificationsEnabled: true
    };
    this.state.membership = {
      currentStamps: 1, // 1st Complimentary welcome stamp!
      maxStamps: 10,
      lifetimeVisits: 1,
      points: 100, // 100 Welcome points!
      rewardsRedeemedCount: 0,
      currentStreak: 1
    };
    this.state.isAuthenticated = true;
    this.recomputeRewardsStatus();
    this.saveState();
  }

  logout() {
    this.state.isAuthenticated = false;
    this.saveState();
  }

  resetToDemoDefaults() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
    if (window.AtelierAudio) window.AtelierAudio.playTap();
  }
}

window.AtelierStore = new Store();

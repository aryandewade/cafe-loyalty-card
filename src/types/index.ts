export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberSince: string;
  membershipId: string;
  tier: string;
  favoriteDrink: string;
  milkPreference: string;
  roastPreference: string;
  notificationsEnabled: boolean;
}

export interface Membership {
  currentStamps: number;
  maxStamps: number;
  lifetimeVisits: number;
  points: number;
  rewardsRedeemedCount: number;
  currentStreak: number;
  streakMultiplier?: number;
  streakFreezeAvailable?: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  requiredVisits: number;
  icon: string;
  category: string;
  status: 'ready' | 'in-progress' | 'locked' | 'redeemed';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  icon?: string;
  points?: number;
}

export interface LoyaltySettings {
  rupeesPerPoint: number;
  currencySymbol: string;
  programName: string;
}

export interface Activity {
  id: string;
  type: 'stamp' | 'redemption' | 'transaction';
  title: string;
  subtitle: string;
  date: string;
  time: string;
  pointsEarned: number;
  location: string;
  productName?: string;
  amountSpent?: number;
  previousBalance?: number;
  newBalance?: number;
  conversionRate?: number;
  receiptNumber?: string;
  baristaNotes?: string;
}

export interface RedemptionPass {
  passId: string;
  rewardId: string;
  rewardTitle: string;
  code: string;
  createdAt: number;
  expiresInMinutes: number;
  customerName: string;
  membershipId: string;
  status: 'active' | 'used';
}


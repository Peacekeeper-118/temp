
export type PostType = 'COMMUNITY' | 'LISTING';

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  line1: string;
  line2?: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl: string;
  isVerified: boolean;
  sustainabilityScore?: number;
  city?: string;
  college?: string;
  bio?: string;
  instagramHandle?: string;
  email?: string;
  createdAt?: string;
  savedPostIds?: string[]; // New: Wishlist
  // Seller & Verification
  isSellerEligible: boolean; // 18+ for payouts
  phoneVerified: boolean;
  kycStatus: 'none' | 'pending' | 'verified' | 'rejected';
  sellerRating: number;
  totalSales: number;
  isAmbassador?: boolean;
  // New Fields
  gender?: string;
  addresses?: Address[];
  isAdmin?: boolean; // New: Admin Flag
}

export interface ImageMetadata {
    method: 'client' | 'server';
    durationMs: number;
    modelVersion?: string;
    qualityScore?: number;
    backgroundColor?: string;
    isCleaned: boolean;
}

export interface Post {
  id: string;
  type: PostType;
  user: User;
  imageUrl: string; 
  additionalImages: string[];
  imageMeta?: ImageMetadata[]; // New: AI Processing Metadata
  description: string;
  price: number;
  originalPrice?: number;
  likes: number;
  comments: number;
  tags: string[];
  size: string;
  brand: string;
  condition: 'New with tags' | 'Like new' | 'Good' | 'Fair';
  conditionRating: 1 | 2 | 3 | 4;
  isSold: boolean;
  timePosted: string;
  createdAt?: string;
  location: string;
  story?: string;
  // New Attributes
  material?: string;
  color?: string;
  measurements?: string;
  isAdminPost?: boolean; // New: Official Updates
}

export interface Offer {
    id: string;
    postId: string;
    buyerId: string;
    offerAmount: number;
    status: 'pending' | 'accepted' | 'rejected';
    timestamp: string;
}

export enum Tab {
  HOME = 'HOME',
  SHOP = 'SHOP',
  SELL = 'SELL',
  CHALLENGES = 'CHALLENGES',
  PROFILE = 'PROFILE',
  CART = 'CART',
  ACTIVITY_VIEW = 'ACTIVITY_VIEW',
  SELLER_DASHBOARD = 'SELLER_DASHBOARD',
  ORDER_TRACKING = 'ORDER_TRACKING',
  SETTINGS = 'SETTINGS',
  YOUR_POSTS = 'YOUR_POSTS'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

export type OrderStatus = 'created' | 'paid' | 'purchased' | 'pickup_scheduled' | 'at_hub' | 'inspection_passed' | 'inspection_failed' | 'out_for_delivery' | 'delivered' | 'completed';

export interface Order {
  id: string;
  item: Post;
  buyerId: string;
  sellerId: string;
  status: OrderStatus;
  trackingSteps: {
    status: string;
    timestamp: string;
    description: string;
    duration?: string;
    isCompleted?: boolean;
    icon?: string;
    title?: string;
    eventId?: string;
  }[];
  inspectionNotes?: string;
  payoutStatus: 'pending' | 'eligible' | 'paid';
  createdAt: string;
  // New Fields
  totalAmount?: number;
  commission?: number;
  refreshedFee?: number;
  deliveryFee?: number;
  paidAt?: string;
  eta?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystemMessage?: boolean;
}

export interface ChatThread {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  relatedItemId?: string;
}


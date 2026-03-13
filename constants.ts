
import { Post, Category, Order, User } from './types';

// Feature Flag: Set to true to load demo data
export const DEMO_MODE = true; 

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Streetwear', icon: 'skateboard', color: 'bg-pop-orange' },
  { id: '2', name: 'Y2K', icon: 'butterfly', color: 'bg-pop-purple' },
  { id: '3', name: 'Ethnic', icon: 'sparkles', color: 'bg-pop-rose' },
  { id: '4', name: 'Sneakers', icon: 'sneaker', color: 'bg-pop-cyan' },
  { id: '5', name: 'Vintage', icon: 'cassette', color: 'bg-pop-yellow' },
];

// Optional Seed Data for Demo Mode
const SEED_USER: User = {
  id: 'u1',
  username: 'demo_user',
  displayName: 'Demo User',
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  isVerified: true,
  sustainabilityScore: 100,
  city: 'Mumbai',
  bio: 'Sustainable fashion enthusiast. Thrifting my way through life. 🌱',
  instagramHandle: '@demo_thrift',
  isSellerEligible: true,
  phoneVerified: true,
  kycStatus: 'verified',
  sellerRating: 5.0,
  totalSales: 5
};

const SEED_POSTS: Post[] = [
  {
    id: 'p2',
    type: 'LISTING',
    user: SEED_USER,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1000', 
    additionalImages: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1000'],
    description: 'Straight Fit Vintage Denim Jeans - High Waisted',
    price: 450,
    originalPrice: 2499,
    likes: 56,
    comments: 4,
    tags: ['LEVIS', '32'],
    size: '32',
    brand: 'LEVIS',
    condition: 'Good',
    conditionRating: 2,
    isSold: false,
    timePosted: '2h ago',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    location: 'Pune',
    material: 'Heavyweight Denim',
    color: 'Classic Blue'
  },
  {
    id: 'p1',
    type: 'LISTING',
    user: SEED_USER,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000', 
    additionalImages: ['https://images.unsplash.com/photo-1621072156002-e2fcced0b170?auto=format&fit=crop&q=80&w=1000'],
    description: 'Classic Light Blue Oxford Shirt - Super Soft Cotton',
    price: 399,
    originalPrice: 1299,
    likes: 124,
    comments: 8,
    tags: ['Shirt', 'Minimalist', 'Basic', 'Formal'],
    size: 'M',
    brand: 'H&M',
    condition: 'Like new',
    conditionRating: 3,
    isSold: false,
    timePosted: '12m ago',
    createdAt: new Date(Date.now() - 720000).toISOString(),
    location: 'Mumbai',
    material: '100% Cotton',
    color: 'Light Blue'
  },
  {
    id: 'p3',
    type: 'COMMUNITY',
    user: SEED_USER,
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000', 
    additionalImages: [],
    description: 'Check out these thrifted shirts I found today for under 300! ♻️🔥 #ThriftFinds #Mumbai',
    price: 0,
    likes: 245,
    comments: 18,
    tags: ['ThriftShop', 'Mumbai', 'Shirts'],
    size: '',
    brand: '',
    condition: 'Good',
    conditionRating: 1,
    isSold: false,
    timePosted: '3h ago',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    location: 'Mumbai'
  }
];

const SEED_ORDERS: Order[] = [
    {
        id: 'o1',
        item: { ...SEED_POSTS[1], isSold: true },
        buyerId: 'u1',
        sellerId: 'u1',
        status: 'at_hub',
        payoutStatus: 'pending',
        createdAt: '2023-10-25',
        trackingSteps: [
            { 
                status: 'Seller Requests Pickup', 
                timestamp: 'Oct 25, 10:30 AM', 
                description: 'Seller initiated the request.', 
                duration: '1-2 business days for pickup scheduling',
                isCompleted: true, 
                icon: 'User' 
            },
            { 
                status: 'Local Pickup From Seller', 
                timestamp: 'Oct 26, 2:00 PM', 
                description: 'Package picked up by courier.', 
                duration: '1 business day for pickup',
                isCompleted: true, 
                icon: 'Truck' 
            },
            { 
                status: 'Revendre Refresh Hub', 
                timestamp: 'Oct 27, 11:00 AM', 
                description: 'Quality check & sanitization.', 
                duration: '2-4 business days for preparation',
                isCompleted: true, 
                icon: 'Warehouse' 
            },
            { 
                status: 'Delivery Partner Assigned', 
                timestamp: '', 
                description: 'Optimizing route to your location.', 
                duration: '1 day for assignment',
                isCompleted: false, 
                icon: 'Globe' 
            },
            { 
                status: 'Delivery to Buyer', 
                timestamp: '', 
                description: 'Package arriving soon.', 
                duration: '1-7 days depending on route',
                isCompleted: false, 
                icon: 'Package' 
            }
        ]
    }
];

export const MOCK_USER: User | null = DEMO_MODE ? SEED_USER : null;
export const MOCK_POSTS: Post[] = DEMO_MODE ? SEED_POSTS : [];
export const MOCK_ORDERS: Order[] = DEMO_MODE ? SEED_ORDERS : [];

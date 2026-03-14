
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { FeedItem } from './components/FeedItem';
import { UploadModal } from './components/UploadModal';
import { Profile } from './components/Profile';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { SellerDashboard } from './components/SellerDashboard';
import { OrderTracking } from './components/OrderTracking';
import { YourPostsScreen } from './components/YourPostsScreen';
import { YourOrdersScreen } from './components/YourOrdersScreen';
import { YourAddressesScreen } from './components/YourAddressesScreen';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { Settings } from './components/Settings';
import { FilterModal } from './components/FilterModal';
import { PaymentModal } from './components/PaymentModal';
import { CheckoutAddressModal } from './components/CheckoutAddressModal';
import { SplashScreen } from './components/SplashScreen';
import { ProductDetail } from './components/ProductDetail';
import { Tab, Post, User as UserType, Category, Order, Address } from './types';
import { MOCK_POSTS, CATEGORIES, MOCK_ORDERS } from './constants';
import { Search, ShoppingBag, Trash2, ArrowRight, ShieldCheck, LogOut, SlidersHorizontal, Sparkles } from 'lucide-react';
import { auth, googleProvider, db, isMock, signInWithPopup, onAuthStateChanged, signOut, deleteUser } from './services/firebase';
import { searchPosts } from './services/searchService';
import { doc, setDoc, updateDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit, deleteDoc } from 'firebase/firestore';
import { NeoSkateboard, NeoButterfly, NeoSparkles, NeoSneaker, NeoCassette, NeoFire, NeoBag, NeoGhost, NeoStar } from './components/NeoIcons';
import { Button } from './components/Button';

const CATEGORY_ICONS: Record<string, React.FC<{className?: string}>> = {
  'skateboard': NeoSkateboard,
  'butterfly': NeoButterfly,
  'sparkles': NeoSparkles,
  'sneaker': NeoSneaker,
  'cassette': NeoCassette
};

const ITEM_TYPES = ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Dress', 'Accessory'];

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [settingsView, setSettingsView] = useState<'menu' | 'account'>('menu');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [cart, setCart] = useState<Post[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<{ 
    sort: string; 
    size: string[]; 
    brand: string[];
    category: string[];
    color: string[];
  }>({
    sort: 'newest',
    size: [],
    brand: [],
    category: [],
    color: []
  });

  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [viewingAddresses, setViewingAddresses] = useState(false);
  const [viewingOrders, setViewingOrders] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUser = params.get('u');
    const sharedPostId = params.get('p');
    
    if (sharedUser) {
      setActiveTab(Tab.PROFILE);
    }
    
    if (sharedPostId) {
      const post = posts.find(p => p.id === sharedPostId);
      if (post) {
        setViewingPost(post);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Hard-cap: never show splash longer than 8 seconds total
    const timeoutId = setTimeout(() => {
      if (mounted && authLoading) setAuthLoading(false);
    }, 8000);

    let unsubscribe: (() => void) | undefined;

    // Races a promise against a timeout — whichever resolves first wins
    const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T | null> =>
      Promise.race([
        promise,
        new Promise<null>(resolve => setTimeout(() => resolve(null), ms))
      ]);

    const buildUser = (firebaseUser: any): UserType => {
      const base: UserType = {
        id: firebaseUser.uid,
        username: '',
        displayName: firebaseUser.displayName || '',
        avatarUrl: firebaseUser.photoURL || '',
        isVerified: false,
        isSellerEligible: false,
        sustainabilityScore: 0,
        phoneVerified: !!firebaseUser.phoneNumber,
        kycStatus: 'none',
        sellerRating: 0,
        totalSales: 0,
        savedPostIds: [],
        isAdmin: false,
        addresses: []
      };
      if (firebaseUser.email) base.email = firebaseUser.email;
      if (firebaseUser.phoneNumber) base.phoneNumber = firebaseUser.phoneNumber;
      return base;
    };

    const initAuth = async () => {
      try {
        if (!auth || typeof auth.onAuthStateChanged !== 'function') {
          if (mounted) setAuthLoading(false);
          return;
        }

        // No redirect pending — onAuthStateChanged handles sign-in state directly

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
          if (!mounted) return;

          if (firebaseUser) {
            try {
              if (isMock) {
                setUser({
                  id: firebaseUser.uid,
                  username: firebaseUser.displayName || 'Guest',
                  displayName: firebaseUser.displayName || 'Guest',
                  avatarUrl: firebaseUser.photoURL || 'https://picsum.photos/200',
                  isVerified: false,
                  isSellerEligible: true,
                  sustainabilityScore: 0,
                  phoneVerified: false,
                  kycStatus: 'none',
                  sellerRating: 0,
                  totalSales: 0,
                  savedPostIds: [],
                  isAdmin: false,
                  addresses: []
                });
                setHasCompletedOnboarding(true);
              } else {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const wasOnboarded = !!localStorage.getItem(`onboarded_${firebaseUser.uid}`);

                // Fetch Firestore doc — bail out after 4s if still not connected
                const userDoc = await withTimeout(getDoc(userDocRef), 4000);

                if (userDoc && userDoc.exists()) {
                  // Returning user — restore full profile from Firestore
                  const userData = userDoc.data() as UserType;
                  setUser(userData);
                  setSavedPostIds(userData.savedPostIds || []);
                  setHasCompletedOnboarding(true);
                  localStorage.setItem(`onboarded_${firebaseUser.uid}`, '1');
                } else if (wasOnboarded) {
                  // Firestore timed out / offline but user has onboarded before — skip onboarding
                  setUser(buildUser(firebaseUser));
                  setHasCompletedOnboarding(true);
                } else {
                  // Genuinely new user
                  setUser(buildUser(firebaseUser));
                  setHasCompletedOnboarding(false);
                }
              }
            } catch (e) {
              console.error("Auth state error:", e);
              setUser(buildUser(firebaseUser));
              setHasCompletedOnboarding(false);
            }
          } else {
            setUser(null);
          }
          if (mounted) setAuthLoading(false);
        });
      } catch (err) {
        if (mounted) setAuthLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isMock) return;

    // Remove orderBy to avoid composite index requirement if Firestore isn't indexed yet
    const postsQuery = query(
      collection(db, 'posts'),
      limit(50)
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      console.log("Posts snapshot received, count:", snapshot.docs.length);
      const fetchedPosts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore timestamp to ISO string if it exists
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        };
      }) as Post[];
      
      // Sort locally since we removed it from the query
      fetchedPosts.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
      });

      setPosts(prevPosts => {
        const realIds = new Set(fetchedPosts.map(p => p.id));
        const uniqueMocks = MOCK_POSTS.filter(mp => !realIds.has(mp.id));
        return [...fetchedPosts, ...uniqueMocks];
      });
    }, (error) => {
      console.error("Error fetching posts:", error);
      setNotification("Firestore error: " + error.message);
    });

    return () => unsubscribe();
  }, []);

  const createDemoUser = (ageEligibleForPayouts: boolean, data?: { phoneNumber?: string, isSignup?: boolean }) => {
      const demoId = `demo-user-${Date.now()}`;
      const newDemoUser: UserType = {
        id: demoId,
        username: 'Guest',
        displayName: 'Guest User',
        avatarUrl: `https://picsum.photos/seed/${demoId}/200/200`,
        isVerified: false,
        isSellerEligible: ageEligibleForPayouts,
        sustainabilityScore: 0,
        phoneVerified: !!data?.phoneNumber,
        kycStatus: 'none',
        sellerRating: 0,
        totalSales: 0,
        savedPostIds: [],
        isAdmin: false,
        addresses: []
      };
      
      setUser(newDemoUser);
      setHasCompletedOnboarding(data?.isSignup === false); 
      setAuthLoading(false);
  };

  const handleLoginSuccess = async (method: string, ageEligibleForPayouts: boolean, data?: any) => {
    if (isMock) {
        createDemoUser(ageEligibleForPayouts, data);
        return;
    }

    if (method === 'mobile') {
        // Firebase phone auth already completed in Auth.tsx (confirmationResult.confirm() succeeded).
        // onAuthStateChanged fires automatically — just show the loading screen.
        setAuthLoading(true);
        return;
    }

    // Google sign-in
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setAuthLoading(false);
      const cancelled = error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request';
      if (!cancelled) {
        setNotification('Google sign-in failed. Please try again.');
      }
    }
  };

  const handleOnboardingComplete = (data: any) => {
    if (!user) return;
    const updatedUser: UserType = { 
        ...user, 
        ...data, 
        isVerified: false,
        createdAt: new Date().toISOString()
    };
    // Update UI immediately — don't block on Firestore (it may be offline/slow)
    setUser(updatedUser);
    setHasCompletedOnboarding(true);
    if (!isMock) localStorage.setItem(`onboarded_${updatedUser.id}`, '1');
    // Fire-and-forget save in background
    if (!isMock) {
        // Omit undefined/empty fields — Firestore rejects undefined values
        const docData: Partial<UserType> = { ...updatedUser };
        if (!docData.email) delete docData.email;
        setDoc(doc(db, "users", user.id), docData, { merge: true })
            .catch(e => console.error("Failed to save onboarding data:", e));
    }
  };

  const handleUpdateProfile = async (updatedData: Partial<UserType>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    // Update UI immediately
    setUser(newUser);
    setNotification('Profile updated!');
    // Fire-and-forget save
    if (!isMock) {
        // Strip undefined fields — Firestore rejects them
        const cleanData = Object.fromEntries(
            Object.entries(updatedData).filter(([, v]) => v !== undefined)
        );
        updateDoc(doc(db, "users", user.id), cleanData)
            .catch(e => {
                console.error("Failed to update profile:", e);
                setNotification('Changes saved locally (will sync when online).');
            });
    }
  };

  const handleShareProfile = async () => {
    if (!user) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?u=${user.username}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.username}'s Profile on Revendre`,
          text: `Check out ${user.username}'s closet on Revendre!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setNotification('Profile link copied to clipboard!');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleShareProduct = async (post: Post) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?p=${post.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this ${post.brand} item on Revendre`,
          text: post.description,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setNotification('Product link copied to clipboard!');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleLogout = async () => {
      try {
        const isDemoUser = user?.id?.startsWith('demo-user-');
        if (user && !isDemoUser) {
            if (user.id) localStorage.removeItem(`onboarded_${user.id}`);
            await signOut(auth);
        }
      } catch (e) {}
      setUser(null);
      setActiveTab(Tab.HOME);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      if (!isMock && auth.currentUser) {
        // 1. Delete user data from Firestore
        await deleteDoc(doc(db, "users", user.id));
        
        // 2. Delete user account from Firebase Auth
        await deleteUser(auth.currentUser);
        
        setNotification('Account deleted successfully.');
      } else {
        // Mock mode deletion
        setNotification('Demo account "deleted" (mock).');
      }
      
      // 3. Clear local state and go home
      if (user.id) localStorage.removeItem(`onboarded_${user.id}`);
      setUser(null);
      setActiveTab(Tab.HOME);
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      if (error.code === 'auth/requires-recent-login') {
        setNotification('Please log out and log back in to delete your account for security.');
      } else {
        setNotification('Failed to delete account. Please try again.');
      }
      throw error; // Re-throw to stop the loading state in Settings.tsx
    }
  };

  const handlePost = async (data: any) => {
    if (!user) return;
    
    const newPostData: any = {
        type: 'LISTING',
        user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            isVerified: user.isVerified
        },
        imageUrl: data.images[0] || 'https://picsum.photos/800/800',
        additionalImages: data.images,
        description: data.caption,
        price: Number(data.price),
        likes: 0,
        comments: 0,
        tags: [data.itemType || 'New', data.material || 'Fashion', 'NewArrival'],
        size: data.size,
        brand: data.brand,
        condition: data.condition,
        conditionRating: 4, 
        isSold: false,
        timePosted: 'Just now',
        createdAt: new Date().toISOString(),
        location: data.location,
        material: data.material,
        color: data.color,
        measurements: data.measurements
    };

    if (isMock) {
        setPosts([{ id: `new-${Date.now()}`, ...newPostData }, ...posts]);
    } else {
        try {
            await addDoc(collection(db, 'posts'), {
                ...newPostData,
                createdAt: serverTimestamp()
            });
            setNotification('Post published successfully!');
        } catch (error) {
            console.error("Error adding post: ", error);
            setNotification('Failed to publish post.');
        }
    }
    
    setIsUploadOpen(false);
    setActiveTab(Tab.HOME); 
  };

  const handleAddToCart = (post: Post) => {
    if (!cart.find(item => item.id === post.id)) {
        setCart([...cart, post]);
    }
  };

  const removeFromCart = (postId: string) => {
      setCart(cart.filter(item => item.id !== postId));
  };

  const handleDeletePost = async (postId: string) => {
    if (isMock) {
      setPosts(posts.filter(post => post.id !== postId));
    } else {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        setNotification('Post deleted successfully!');
      } catch (error) {
        console.error("Error deleting post: ", error);
        setNotification('Failed to delete post.');
      }
    }
  };

  const handleInitiateCheckout = () => {
      // Step 1: Open mandatory address modal
      setIsAddressOpen(true);
  };

  const handleAddressConfirmed = (selectedAddress: Address) => {
      // Step 2: Save address and proceed to payment
      if (user && (!user.addresses || !user.addresses.find(a => a.id === selectedAddress.id))) {
          const updatedAddresses = [...(user.addresses || []), selectedAddress];
          handleUpdateProfile({ addresses: updatedAddresses });
      }

      const newOrders: Order[] = cart.map(item => ({
          id: `order-${Date.now()}-${item.id}`,
          item: { ...item },
          buyerId: user?.id || 'guest',
          sellerId: item.user.id,
          status: 'created',
          payoutStatus: 'pending',
          createdAt: new Date().toISOString(),
          totalAmount: item.price + 100,
          commission: item.price * 0.1,
          refreshedFee: 50,
          deliveryFee: 50,
          trackingSteps: [] 
      }));

      if (newOrders.length > 0) {
          setOrders([...newOrders, ...orders]);
          setCart([]);
          setPendingPaymentOrder(newOrders[0]);
          setIsAddressOpen(false);
          setIsPaymentOpen(true);
      }
  };

  const handlePayNow = (order: Order) => {
      setPendingPaymentOrder(order);
      setIsPaymentOpen(true);
  };

  const handlePaymentComplete = (method: 'COD' | 'ONLINE') => {
      if (!pendingPaymentOrder) return;

      const updatedOrder: Order = {
          ...pendingPaymentOrder,
          status: 'paid',
          paidAt: new Date().toISOString(),
          eta: '3-5 days',
          item: { ...pendingPaymentOrder.item, isSold: true },
          trackingSteps: [
              {
                  eventId: `evt-${Date.now()}`,
                  status: 'paid',
                  title: 'Payment Confirmed',
                  description: method === 'COD' ? 'Cash on Delivery confirmed.' : 'Secure payment received.',
                  timestamp: new Date().toISOString(),
                  icon: 'CreditCard'
              },
              {
                  eventId: `evt-${Date.now()}-2`,
                  status: 'pickup_scheduled',
                  title: 'Processing',
                  description: 'Seller notified to schedule pickup.',
                  timestamp: new Date(Date.now() + 1000).toISOString(),
                  icon: 'User'
              }
          ]
      };

      setOrders(prevOrders => prevOrders.map(o => o.id === pendingPaymentOrder.id ? updatedOrder : o));
      setPosts(prevPosts => prevPosts.map(p => p.id === pendingPaymentOrder.item.id ? { ...p, isSold: true } : p));

      setPendingPaymentOrder(null);
      setIsPaymentOpen(false);
      setActiveTab(Tab.ORDER_TRACKING);
  };

  const handleToggleSave = (post: Post) => {
    const isSaved = savedPostIds.includes(post.id);
    let newSavedIds;
    if (isSaved) {
        newSavedIds = savedPostIds.filter(id => id !== post.id);
    } else {
        newSavedIds = [...savedPostIds, post.id];
    }
    setSavedPostIds(newSavedIds);
    if(user) {
        handleUpdateProfile({ savedPostIds: newSavedIds });
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIsUploadOpen(false);
  };

  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter(p => p.type === 'LISTING' || p.type === 'COMMUNITY');

    if (!searchQuery && activeTab === Tab.HOME) {
    } else if (!searchQuery && activeTab === Tab.SHOP) {
        result = result.filter(p => p.type === 'LISTING');
    }

    if (searchQuery) result = searchPosts(result, searchQuery);

    if (activeCategory) {
       const catName = CATEGORIES.find(c => c.id === activeCategory)?.name.toLowerCase();
       if (catName) {
           result = result.filter(p => p.tags.some(t => t.toLowerCase().includes(catName)) || p.description.toLowerCase().includes(catName));
       }
    }

    if (filters.size.length > 0) {
        result = result.filter(p => filters.size.includes(p.size));
    }
    if (filters.brand.length > 0) {
        result = result.filter(p => filters.brand.includes(p.brand));
    }
    if (filters.category.length > 0) {
        result = result.filter(p => {
            const combinedText = [...p.tags, p.description].join(' ').toLowerCase();
            return filters.category.some(cat => combinedText.includes(cat.toLowerCase()));
        });
    }
    if (filters.color.length > 0) {
        result = result.filter(p => p.color && filters.color.some(c => c.toLowerCase() === p.color?.toLowerCase()));
    }

    if (filters.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'newest') {
      if (!searchQuery) {
          result.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
      }
    }

    return result;
  }, [posts, searchQuery, activeCategory, filters, activeTab]);

  const availableSizes = useMemo(() => Array.from(new Set(posts.map(p => p.size).filter(Boolean))), [posts]);
  const availableBrands = useMemo(() => Array.from(new Set(posts.map(p => p.brand).filter(Boolean))), [posts]);
  const availableColors = useMemo(() => Array.from(new Set(posts.map(p => p.color).filter((c): c is string => !!c))), [posts]);
  
  const savedPostsList = useMemo(() => posts.filter(p => savedPostIds.includes(p.id)), [posts, savedPostIds]);

  const activeFiltersCount = filters.size.length + filters.brand.length + filters.category.length + filters.color.length + (filters.sort !== 'newest' ? 1 : 0);

  if (showSplash || authLoading) return <SplashScreen />;
  if (!user) return <Auth onLoginSuccess={handleLoginSuccess} />;
  if (!hasCompletedOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;

  const renderTabContent = () => {
    switch (activeTab) {
      case Tab.SELLER_DASHBOARD:
          return <SellerDashboard user={user} onBack={() => setActiveTab(Tab.PROFILE)} />;
      case Tab.ORDER_TRACKING:
          return (
            <OrderTracking 
                onBack={() => setActiveTab(Tab.PROFILE)} 
                orders={orders} 
                onPayNow={handlePayNow} 
            />
          );
      case Tab.SETTINGS:
          return (
            <Settings 
                currentUser={user} 
                onUpdateUser={handleUpdateProfile} 
                onDeleteAccount={handleDeleteAccount}
                onBack={() => setActiveTab(Tab.PROFILE)} 
                initialView={settingsView}
            />
          );
      case Tab.YOUR_POSTS:
          return (
            <YourPostsScreen 
                user={user} 
                posts={posts}
                onBack={() => setActiveTab(Tab.PROFILE)}
                onDeletePost={handleDeletePost}
            />
          );
      case Tab.HOME:
        return (
          <div className="pt-0">
             <div className="mx-4 mt-6 mb-4 relative h-44 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white animate-fade-in-up group">
                 <video 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    autoPlay muted loop playsInline
                    poster="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
                 >
                    <source src="https://v1.pexels.com/video-files/4440954/4440954-sd_640_360_25fps.mp4" type="video/mp4" />
                 </video>
                 <div className="absolute inset-0 bg-gradient-to-r from-earth-900/80 via-earth-900/40 to-transparent"></div>
                 <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
                 <div className="relative z-10 flex flex-col justify-center h-full px-8 gap-3">
                     <div className="flex items-center gap-2">
                        <div className="bg-pop-lime p-2 rounded-2xl shadow-xl border-2 border-white animate-float">
                            <Sparkles className="w-5 h-5 text-earth-900 fill-white" />
                        </div>
                     </div>
                     <h2 className="text-[18px] font-display font-black text-white leading-tight uppercase tracking-tight drop-shadow-2xl max-w-[240px]">
                         Picked up, cleaned & checked before delivery
                     </h2>
                     <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-pop-lime animate-pulse"></span>
                        Guaranteed Authentic Thrifting
                     </p>
                 </div>
             </div>
             <div className="pt-2">
             {filteredAndSortedPosts.length === 0 ? (
                 <div className="text-center py-20 opacity-50 flex flex-col items-center">
                     <NeoGhost className="w-16 h-16 mb-4" />
                     <p className="font-display font-bold text-xl text-earth-400">No posts yet.</p>
                     <p className="text-sm text-earth-400">Be the first to drop some heat!</p>
                 </div>
             ) : (
                filteredAndSortedPosts.map((post, idx) => (
                    <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                        <FeedItem 
                            post={post} 
                            isSaved={savedPostIds.includes(post.id)}
                            onAddToCart={handleAddToCart} 
                            onToggleSave={handleToggleSave}
                            onPostClick={setViewingPost}
                        />
                    </div>
                ))
             )}
             </div>
          </div>
        );
      case Tab.SHOP:
        return (
          <div className="px-6 pb-24 min-h-screen">
             <div className="flex gap-2 items-center mb-6 mt-4">
                 <div className="relative flex-1">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                     <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white pl-12 pr-4 py-4 rounded-2xl shadow-sm font-bold text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-earth-300" 
                        placeholder="Search fits..." 
                     />
                 </div>
                 <button 
                    onClick={() => setIsFilterOpen(true)}
                    className={`p-4 rounded-2xl shadow-sm transition-all active:scale-95 flex items-center justify-center border-2 ${activeFiltersCount > 0 ? 'bg-earth-900 text-white border-earth-900' : 'bg-white text-earth-900 border-transparent'}`}
                 >
                     <SlidersHorizontal className="w-5 h-5" strokeWidth={3} />
                     {activeFiltersCount > 0 && (
                         <span className="ml-1.5 text-[10px] font-black bg-pop-lime text-earth-900 px-1.5 rounded-full min-w-[16px] text-center">{activeFiltersCount}</span>
                     )}
                 </button>
             </div>
             <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-4 snap-x">
                {CATEGORIES.map((cat, idx) => {
                    const Icon = CATEGORY_ICONS[cat.icon] || NeoSparkles;
                    const isActive = activeCategory === cat.id;
                    return (
                        <button 
                            key={cat.id} 
                            onClick={() => setActiveCategory(isActive ? null : cat.id)}
                            className={`snap-start flex-shrink-0 px-6 py-6 rounded-[1.5rem] ${isActive ? 'bg-earth-900 text-white ring-4 ring-offset-2 ring-earth-900' : cat.color} shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center gap-2 min-w-[100px] animate-pop`} 
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <Icon className="w-12 h-12" />
                            <span className={`text-xs font-black uppercase tracking-wide px-2 py-0.5 rounded-lg ${isActive ? 'text-white' : 'text-earth-900 bg-white/50'}`}>{cat.name}</span>
                        </button>
                    );
                })}
             </div>
             <div className="flex items-center gap-2 mb-4">
                 <h3 className="font-display font-black text-2xl text-earth-900">
                    {activeCategory ? CATEGORIES.find(c => c.id === activeCategory)?.name : (searchQuery ? `Results for "${searchQuery}"` : 'Trending Now')}
                 </h3>
                 <NeoFire className="w-6 h-6" />
             </div>
             {filteredAndSortedPosts.length === 0 ? (
                  <div className="text-center py-20 opacity-50 flex flex-col items-center">
                      <NeoGhost className="w-16 h-16 mb-4" />
                      <p className="text-earth-400 font-bold">No vibe matches found.</p>
                      <Button variant="ghost" onClick={() => { setSearchQuery(''); setActiveCategory(null); setFilters({sort:'newest', size:[], brand:[], category: [], color: []}); }} className="mt-2 text-brand-600">Clear all filters</Button>
                  </div>
             ) : (
                 <div className="columns-2 gap-4 space-y-4">
                     {filteredAndSortedPosts.map((post, idx) => (
                        <div 
                          key={post.id} 
                          className="break-inside-avoid bg-white p-2 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer animate-fade-in-up" 
                          onClick={() => setViewingPost(post)}
                        >
                            <div className="relative rounded-xl overflow-hidden mb-2 aspect-[3/4]">
                                <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" decoding="async" />
                                {post.isSold && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">Sold</div>}
                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-black shadow-sm text-earth-900">
                                    ₹{post.price}
                                </div>
                            </div>
                            <div className="px-1 mb-1">
                                <p className="font-bold text-xs text-earth-900 line-clamp-1">{post.description}</p>
                                <p className="text-xs text-earth-500 font-medium">{post.size} • {post.brand}</p>
                            </div>
                        </div>
                     ))}
                 </div>
             )}
          </div>
        );
      case Tab.CART:
          const total = cart.reduce((sum, item) => sum + item.price, 0);
          return (
              <div className="px-6 min-h-full">
                  <div className="flex items-center gap-2 mb-6 mt-4">
                     <h2 className="font-display font-black text-3xl">My Bag <span className="text-pop-cyan">.</span></h2>
                     <NeoBag className="w-8 h-8" />
                  </div>
                  {cart.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-xl animate-fade-in-up flex flex-col items-center">
                          <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <ShoppingBag className="w-8 h-8 text-earth-400" />
                          </div>
                          <p className="font-black text-earth-900 text-lg">Empty Bag</p>
                          <p className="text-earth-400 text-sm mb-6 font-medium">Find some heat to refresh your fit.</p>
                          <Button size="sm" onClick={() => setActiveTab(Tab.SHOP)}>Start Hunting</Button>
                      </div>
                  ) : (
                      <div className="space-y-4 pb-40">
                          {cart.map((item) => (
                              <div key={item.id} className="bg-white p-3 pr-5 rounded-[2rem] shadow-md flex items-center gap-4 animate-slide-up">
                                  <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                                  <div className="flex-1">
                                      <h4 className="font-bold text-sm text-earth-900 line-clamp-1">{item.description}</h4>
                                      <p className="text-xs text-earth-500 mb-1 font-medium">{item.size} • {item.brand}</p>
                                      <span className="font-black text-earth-900 bg-earth-100 px-2 py-0.5 rounded text-xs">₹{item.price}</span>
                                  </div>
                                  <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 rounded-full bg-earth-50 flex items-center justify-center text-earth-400 hover:bg-pop-rose hover:text-white transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                          <div className="fixed bottom-28 left-6 right-6 bg-earth-900 text-white p-5 rounded-[2rem] shadow-2xl flex items-center justify-between z-30 animate-bounce-in">
                              <div>
                                  <p className="text-earth-400 text-[10px] font-bold uppercase tracking-wider">Total</p>
                                  <p className="font-display font-black text-xl">₹{total}</p>
                              </div>
                              <button 
                                onClick={handleInitiateCheckout}
                                className="bg-pop-lime text-earth-900 px-5 py-2.5 rounded-xl font-black text-sm hover:bg-lime-400 transition-colors flex items-center gap-2 shadow-lg"
                              >
                                  Checkout <ArrowRight className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          );
      case Tab.CHALLENGES:
          return (
              <div className="px-6 pt-6 h-full flex flex-col items-center justify-center pb-24">
                  <div className="bg-white w-full rounded-[2.5rem] p-10 shadow-xl border border-earth-100 flex flex-col items-center justify-center relative overflow-hidden animate-fade-in-up aspect-[4/5] max-h-[600px]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-pop-yellow/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-pop-cyan/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
                      <div className="mb-8 relative">
                           <div className="w-28 h-28 bg-earth-50 rounded-[2rem] flex items-center justify-center shadow-inner transform rotate-3 transition-transform hover:rotate-6 duration-700">
                               <NeoSparkles className="w-14 h-14 text-earth-900" />
                           </div>
                           <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-earth-50">
                               <NeoStar className="w-6 h-6 text-pop-purple" />
                           </div>
                      </div>
                      <h2 className="font-display font-black text-3xl text-earth-900 mb-2 leading-tight text-center">
                          Challenges &<br/>Rewards
                      </h2>
                      <p className="text-earth-500 font-medium text-base mb-8 max-w-[240px] leading-relaxed text-center">
                          We’re building fun rewards for our early community.
                      </p>
                      <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-earth-900 rounded-xl shadow-lg shadow-earth-900/10">
                          <Sparkles className="w-3 h-3 text-pop-lime animate-pulse" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Coming Soon</span>
                      </div>
                      <p className="text-xs text-earth-400 font-bold text-center">
                          Use Revendre. Something special unlocks soon.
                      </p>
                  </div>
              </div>
          );
      case Tab.ACTIVITY_VIEW:
          return (
              <div className="px-6 py-6">
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="font-display font-black text-2xl">Updates</h2>
                  </div>
                  <div className="bg-white p-5 rounded-[2rem] shadow-md flex gap-4 animate-fade-in-up">
                      <div className="w-12 h-12 rounded-full bg-pop-lime/20 flex items-center justify-center text-pop-lime shrink-0">
                          <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                          <h4 className="font-bold text-earth-900 text-sm">Order Processed</h4>
                          <p className="text-xs text-earth-500 mt-1 font-medium">Your 'Vintage Levis' has passed the Hub check and is verified for delivery.</p>
                      </div>
                  </div>
              </div>
          )
      case Tab.PROFILE:
        if (viewingAddresses) {
          return (
            <YourAddressesScreen
              user={user!}
              onBack={() => setViewingAddresses(false)}
              onUpdateAddresses={(addresses) => {
                setUser({ ...user!, addresses });
              }}
            />
          );
        }
        if (viewingOrders) {
          return (
            <YourOrdersScreen
              user={user!}
              orders={orders}
              onBack={() => setViewingOrders(false)}
              onTrackOrder={(order) => {
                setViewingOrders(false);
                setActiveTab(Tab.ORDER_TRACKING);
              }}
            />
          );
        }
        return (
            <div className="relative">
                 <button onClick={handleLogout} className="absolute top-6 left-6 z-20 bg-white/20 backdrop-blur p-2 rounded-full hover:bg-white/40 text-white transition-colors"><LogOut className="w-5 h-5"/></button>
                 <Profile 
                    user={user!} 
                    posts={posts} 
                    savedPosts={savedPostsList}
                    onOpenDashboard={() => setActiveTab(Tab.SELLER_DASHBOARD)} 
                    onOpenOrderTracking={() => setActiveTab(Tab.ORDER_TRACKING)}
                    onOpenYourPosts={() => setActiveTab(Tab.YOUR_POSTS)}
                    onOpenSettings={() => { setSettingsView('menu'); setActiveTab(Tab.SETTINGS); }}
                    onOpenYourOrders={() => setViewingOrders(true)}
                    onOpenShipping={() => setViewingAddresses(true)}
                    onPostClick={setViewingPost}
                    onShare={handleShareProfile}
                 />
            </div>
        );
      default:
        return null;
    }
  };

  const isModalOpen = isUploadOpen || isSettingsOpen || isFilterOpen || isPaymentOpen || isAddressOpen || !!viewingPost || viewingAddresses || viewingOrders || activeTab === Tab.SETTINGS || activeTab === Tab.YOUR_POSTS;

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={handleTabChange} 
      onOpenUpload={() => setIsUploadOpen(true)} 
      cartCount={cart.length}
      hideNav={isModalOpen}
    >
      {renderTabContent()}
      {viewingPost && (
          <ProductDetail 
            post={viewingPost}
            onClose={() => setViewingPost(null)}
            onAddToCart={handleAddToCart}
            onBuyNow={(p) => {
                handleAddToCart(p);
                setActiveTab(Tab.CART);
                setViewingPost(null);
            }}
            isSaved={savedPostIds.includes(viewingPost.id)}
            onToggleSave={handleToggleSave}
            onShare={handleShareProduct}
          />
      )}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onPost={handlePost} />
      {user && (
          <ProfileSettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            currentUser={user} 
            onUpdateUser={handleUpdateProfile} 
          />
      )}
      <FilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        availableSizes={availableSizes}
        availableBrands={availableBrands}
        availableCategories={ITEM_TYPES}
        availableColors={availableColors}
        currentFilters={filters}
        onApply={setFilters}
      />
      <CheckoutAddressModal
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        existingAddresses={user?.addresses || []}
        onConfirm={handleAddressConfirmed}
      />
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={pendingPaymentOrder ? (pendingPaymentOrder.totalAmount || 0) : cart.reduce((sum, item) => sum + item.price, 0)}
        onComplete={handlePaymentComplete}
      />
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-earth-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up border border-white/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-pop-lime" />
          <span className="font-black text-sm tracking-tight">{notification}</span>
        </div>
      )}
    </Layout>
  );
};

export default App;

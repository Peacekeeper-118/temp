
import React, { useState } from 'react';
import { User, Post } from '../types';
import { Settings, Grid, BarChart2, Truck, Share2, Bookmark, MapPin, Package, FileText, BadgeCheck } from 'lucide-react';
import { NeoStar } from './NeoIcons';

interface ProfileProps {
  user: User;
  posts: Post[];
  savedPosts?: Post[]; 
  onOpenDashboard?: () => void;
  onOpenOrderTracking?: () => void;
  onOpenYourOrders?: () => void;
  onOpenShipping?: () => void;
  onOpenYourPosts?: () => void;
  onOpenSettings?: () => void;
  onPostClick?: (post: Post) => void;
  onShare?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, posts, savedPosts = [], onOpenDashboard, onOpenOrderTracking, onOpenYourOrders, onOpenShipping, onOpenYourPosts, onOpenSettings, onPostClick, onShare }) => {
  const [activeTab, setActiveTab] = useState<'closet' | 'saved'>('closet');
  const userPosts = posts.filter(p => p.user.id === user.id);
  const displayPosts = activeTab === 'closet' ? userPosts : savedPosts;

  return (
    <div className="bg-[#F0F0F0] min-h-full pb-32 animate-fade-in-up">
      <div className="h-40 bg-earth-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={onShare}
                className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 text-white transition-colors"
              >
                <Share2 className="w-5 h-5"/>
              </button>
              <button 
                onClick={onOpenSettings}
                className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 text-white transition-colors"
              >
                  <Settings className="w-5 h-5"/>
              </button>
          </div>
      </div>

      <div className="px-4 sm:px-6 -mt-16 relative z-10">
          <div className="bg-white p-5 sm:p-6 rounded-[2.5rem] shadow-xl text-center">
              <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-white mx-auto shadow-lg">
                      <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover" alt="" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-pop-yellow text-earth-900 text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <NeoStar className="w-3 h-3" /> {user.sellerRating || 0}
                  </div>
              </div>
              
              {user.displayName && (
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <h2 className="font-display font-black text-xl sm:text-2xl text-earth-900">{user.displayName}</h2>
                  {user.isVerified && <BadgeCheck className="w-5 h-5 text-pop-cyan fill-earth-900" aria-label="Verified Store" />}
                </div>
              )}
              <p className="text-earth-400 text-xs sm:text-sm font-medium mb-1">@{user.username || 'user'}</p>
              <p className="text-earth-500 text-xs sm:text-sm font-bold mb-4">{user.bio || 'No bio yet.'}</p>
              
              <div className="flex justify-center items-center gap-4 sm:gap-6 py-4 border-t border-earth-100 mb-4 border-dashed">
                  <div className="text-center">
                      <div className="font-black text-lg sm:text-xl text-earth-900">{user.totalSales}</div>
                      <div className="text-[9px] sm:text-[10px] uppercase font-black text-earth-400 tracking-wide">Sold</div>
                  </div>
                  <div className="text-center">
                      <div className="font-black text-lg sm:text-xl text-earth-900">0</div>
                      <div className="text-[9px] sm:text-[10px] uppercase font-black text-earth-400 tracking-wide">Follows</div>
                  </div>
                  <div className="text-center">
                      <div className="font-black text-lg sm:text-xl text-earth-900">{userPosts.length}</div>
                      <div className="text-[9px] sm:text-[10px] uppercase font-black text-earth-400 tracking-wide">Posted</div>
                  </div>
              </div>

              <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                      {onOpenDashboard && (
                          <button onClick={onOpenDashboard} className="bg-earth-900 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:bg-earth-800 active:scale-95 transition-all flex items-center justify-center gap-2">
                              <BarChart2 className="w-4 h-4"/> Dashboard
                          </button>
                      )}
                      {onOpenOrderTracking && (
                          <button onClick={onOpenOrderTracking} className="bg-earth-50 text-earth-900 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-earth-100 active:scale-95 transition-all flex items-center justify-center gap-2">
                              <Truck className="w-4 h-4"/> Tracking
                          </button>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* Account Quick Actions Grid */}
      <div className="px-4 sm:px-6 mt-6 sm:mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <button 
                onClick={onOpenYourOrders}
                className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-earth-200 shadow-sm hover:shadow-md hover:border-earth-300 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group"
              >
                  <Package className="w-5 h-5 sm:w-6 h-6 text-earth-400 group-hover:text-earth-900 transition-colors" />
                  <span className="font-black text-earth-900 text-xs sm:text-sm tracking-tight">Your Orders</span>
              </button>
              <button 
                onClick={onOpenShipping}
                className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-earth-200 shadow-sm hover:shadow-md hover:border-earth-300 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group"
              >
                  <MapPin className="w-5 h-5 sm:w-6 h-6 text-earth-400 group-hover:text-earth-900 transition-colors" />
                  <span className="font-black text-earth-900 text-xs sm:text-sm tracking-tight">Addresses</span>
              </button>
              <button 
                onClick={onOpenYourPosts}
                className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-earth-200 shadow-sm hover:shadow-md hover:border-earth-300 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group col-span-2 sm:col-span-1"
              >
                  <FileText className="w-5 h-5 sm:w-6 h-6 text-earth-400 group-hover:text-earth-900 transition-colors" />
                  <span className="font-black text-earth-900 text-xs sm:text-sm tracking-tight">Your Posts</span>
              </button>
          </div>
      </div>

      <div className="px-6 mt-10">
          <div className="flex items-center gap-6 mb-4 border-b border-earth-200">
              <button 
                onClick={() => setActiveTab('closet')}
                className={`flex items-center gap-2 pb-3 font-display font-bold text-lg transition-colors relative ${activeTab === 'closet' ? 'text-earth-900' : 'text-earth-400'}`}
              >
                  <Grid className="w-5 h-5" /> Closet
                  {activeTab === 'closet' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-pop-cyan rounded-t-full"></span>}
              </button>
              <button 
                onClick={() => setActiveTab('saved')}
                className={`flex items-center gap-2 pb-3 font-display font-bold text-lg transition-colors relative ${activeTab === 'saved' ? 'text-earth-900' : 'text-earth-400'}`}
              >
                  <Bookmark className="w-5 h-5" /> Saved
                  {activeTab === 'saved' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-pop-purple rounded-t-full"></span>}
              </button>
          </div>
          
          {displayPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[2rem] border-2 border-earth-100 border-dashed animate-fade-in-up">
                  <div className="w-12 h-12 bg-earth-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Grid className="w-6 h-6 text-earth-300"/>
                  </div>
                  <p className="text-earth-400 text-sm font-bold">{activeTab === 'closet' ? 'Closet is empty.' : 'No saved items.'}</p>
                  <p className="text-earth-300 text-xs mt-1">{activeTab === 'closet' ? 'Upload your first fit!' : 'Bookmark items to save them.'}</p>
              </div>
          ) : (
              <div className="columns-2 gap-4 space-y-4">
                  {displayPosts.map((post, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => onPostClick && onPostClick(post)}
                        className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                      >
                          <img src={post.imageUrl} className="w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                          {post.isSold && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <span className="bg-white text-earth-900 text-xs font-black px-3 py-1 rounded uppercase tracking-widest -rotate-6 shadow-lg">Sold</span>
                              </div>
                          )}
                          <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-black shadow-sm text-earth-900 truncate">
                              ₹{post.price}
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
};

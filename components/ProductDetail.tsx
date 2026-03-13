
import React, { useState } from 'react';
import { Post, User } from '../types';
import { X, Share2, Heart, ShieldCheck, Truck, Package, ShoppingBag, ChevronRight, MapPin } from 'lucide-react';
import { Button } from './Button';
import { NeoSparkles, NeoTag, NeoStar, NeoCheck } from './NeoIcons';

interface ProductDetailProps {
  post: Post;
  onClose: () => void;
  onAddToCart: (post: Post) => void;
  onBuyNow: (post: Post) => void;
  isSaved?: boolean;
  onToggleSave?: (post: Post) => void;
  onShare?: (post: Post) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  post, 
  onClose, 
  onAddToCart, 
  onBuyNow,
  isSaved = false,
  onToggleSave,
  onShare
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const allImages = [post.imageUrl, ...(post.additionalImages || [])];
  
  // Format time
  const timePosted = post.timePosted || "Recently";

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-slide-up overflow-hidden">
      
      {/* Top Navigation Bar (Absolute) */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 pointer-events-none">
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-earth-900 hover:bg-white pointer-events-auto transition-transform active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex gap-3 pointer-events-auto">
           <button 
             onClick={() => onShare && onShare(post)}
             className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-earth-900 hover:bg-white transition-transform active:scale-95"
           >
             <Share2 className="w-5 h-5" />
           </button>
           <button 
              onClick={() => onToggleSave && onToggleSave(post)}
              className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 ${isSaved ? 'bg-pop-purple text-white' : 'bg-white/80 backdrop-blur-md text-earth-900'}`}
           >
             <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
           </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32 no-scrollbar bg-[#FAFAF9]">
         
         {/* Image Gallery */}
         <div className="relative w-full aspect-[4/5] bg-earth-100">
             <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                 {allImages.map((img, idx) => (
                     <img 
                        key={idx}
                        src={img} 
                        className="w-full h-full object-cover snap-center shrink-0"
                        alt={`Product view ${idx + 1}`}
                        decoding="async"
                     />
                 ))}
             </div>
             
             {/* Pagination Dots */}
             {allImages.length > 1 && (
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/20 backdrop-blur rounded-full">
                     {allImages.map((_, idx) => (
                         <div 
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${activeImageIndex === idx ? 'bg-white w-3' : 'bg-white/50'}`} 
                         />
                     ))}
                 </div>
             )}

             {post.isSold && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                     <div className="bg-white text-earth-900 font-black text-2xl uppercase tracking-widest px-6 py-2 rounded-xl -rotate-6 shadow-2xl">
                         Sold Out
                     </div>
                 </div>
             )}
         </div>

         {/* Content Container */}
         <div className="px-6 -mt-8 relative z-10">
             
             {/* Main Info Card */}
             <div className="bg-white rounded-[2.5rem] p-6 shadow-xl mb-6">
                 {/* Seller Row */}
                 <div className="flex items-center justify-between mb-6 border-b border-earth-100 pb-4">
                     <div className="flex items-center gap-3">
                         <div className="relative">
                             <img src={post.user.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-earth-100" decoding="async" />
                             {post.user.isVerified && <div className="absolute -bottom-1 -right-1 bg-pop-cyan rounded-full p-0.5 border-2 border-white"><NeoCheck className="w-2 h-2"/></div>}
                         </div>
                         <div>
                             <h4 className="font-bold text-sm text-earth-900">{post.user.username}</h4>
                             <div className="flex items-center gap-1 text-[10px] text-earth-500 font-bold">
                                 <NeoStar className="w-3 h-3 text-pop-yellow" /> {post.user.sellerRating} Rating
                             </div>
                         </div>
                     </div>
                     <span className="text-[10px] font-bold text-earth-400 uppercase tracking-wide bg-earth-50 px-2 py-1 rounded-lg">
                        {timePosted}
                     </span>
                 </div>

                 {/* Title & Price */}
                 <h1 className="font-display font-black text-2xl text-earth-900 leading-tight mb-2">
                     {post.description}
                 </h1>
                 <div className="flex items-end gap-3 mb-6">
                     <span className="font-display font-black text-4xl text-earth-900">₹{post.price}</span>
                     {post.originalPrice && (
                         <span className="text-earth-400 font-bold line-through text-lg mb-1">₹{post.originalPrice}</span>
                     )}
                     {post.originalPrice && (
                         <span className="mb-1.5 text-[10px] font-black text-pop-lime bg-earth-900 px-2 py-0.5 rounded uppercase tracking-wide">
                             {Math.round(((post.originalPrice - post.price) / post.originalPrice) * 100)}% OFF
                         </span>
                     )}
                 </div>

                 {/* Attributes Grid */}
                 <div className="grid grid-cols-2 gap-3 mb-6">
                     <div className="bg-earth-50 p-3 rounded-2xl">
                         <p className="text-[10px] font-bold text-earth-400 uppercase tracking-wide mb-1">Size</p>
                         <p className="font-bold text-earth-900">{post.size}</p>
                     </div>
                     <div className="bg-earth-50 p-3 rounded-2xl">
                         <p className="text-[10px] font-bold text-earth-400 uppercase tracking-wide mb-1">Brand</p>
                         <p className="font-bold text-earth-900">{post.brand}</p>
                     </div>
                     <div className="bg-earth-50 p-3 rounded-2xl">
                         <p className="text-[10px] font-bold text-earth-400 uppercase tracking-wide mb-1">Condition</p>
                         <div className="flex items-center gap-1">
                             <NeoSparkles className="w-3 h-3 text-pop-yellow"/>
                             <p className="font-bold text-earth-900">{post.condition}</p>
                         </div>
                     </div>
                     <div className="bg-earth-50 p-3 rounded-2xl">
                         <p className="text-[10px] font-bold text-earth-400 uppercase tracking-wide mb-1">Location</p>
                         <div className="flex items-center gap-1">
                             <MapPin className="w-3 h-3 text-pop-purple"/>
                             <p className="font-bold text-earth-900 truncate">{post.location || 'India'}</p>
                         </div>
                     </div>
                 </div>

                 {/* Description */}
                 <div className="mb-4">
                     <h3 className="font-bold text-sm text-earth-900 mb-2">Description</h3>
                     <p className="text-sm text-earth-600 leading-relaxed font-medium">
                         {post.description} — {post.material ? `${post.material}.` : ''} 
                         {post.measurements ? ` Measurements: ${post.measurements}.` : ''}
                         Still in great condition with plenty of life left. 
                         Ready for a new home! ♻️
                     </p>
                 </div>

                 {/* Tags */}
                 <div className="flex flex-wrap gap-2">
                     {post.tags.map((tag, i) => (
                         <span key={i} className="text-[10px] font-bold text-earth-500 bg-earth-50 px-2 py-1 rounded-lg">
                             #{tag}
                         </span>
                     ))}
                 </div>
             </div>

             {/* Trust & Safety */}
             <div className="bg-white rounded-[2.5rem] p-6 shadow-md space-y-4 mb-6">
                 <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-pop-lime/20 flex items-center justify-center shrink-0">
                         <ShieldCheck className="w-5 h-5 text-earth-900" />
                     </div>
                     <div>
                         <h4 className="font-bold text-earth-900 text-sm">Refreshed Processing</h4>
                         <p className="text-xs text-earth-500 font-medium leading-relaxed">
                             Every ordered item goes to our Hub for quality check & sanitization before reaching you.
                         </p>
                     </div>
                 </div>
                 <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-pop-cyan/20 flex items-center justify-center shrink-0">
                         <Package className="w-5 h-5 text-earth-900" />
                     </div>
                     <div>
                         <h4 className="font-bold text-earth-900 text-sm">Buyer Protection</h4>
                         <p className="text-xs text-earth-500 font-medium leading-relaxed">
                             Money held safely until you receive and approve the item.
                         </p>
                     </div>
                 </div>
             </div>

         </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-earth-100 p-4 pb-8 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          {!post.isSold ? (
              <div className="flex gap-2 items-center">
                  <button 
                     onClick={() => onAddToCart(post)}
                     className="w-12 h-12 bg-white border-2 border-earth-100 text-earth-900 rounded-xl hover:bg-earth-50 hover:border-earth-300 transition-all active:scale-95 flex flex-col items-center justify-center"
                     title="Add to Bag"
                  >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="text-[8px] font-bold uppercase mt-0.5">Add</span>
                  </button>

                  <button 
                     onClick={() => onBuyNow(post)}
                     className="flex-1 bg-earth-900 text-white font-bold h-12 rounded-xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                      Buy Now
                  </button>
              </div>
          ) : (
              <div className="w-full bg-earth-100 text-earth-400 font-bold py-4 rounded-2xl text-center cursor-not-allowed">
                  Item Sold
              </div>
          )}
      </div>

    </div>
  );
};

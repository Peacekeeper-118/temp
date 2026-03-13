
import React, { useState } from 'react';
import { Post } from '../types';
import { BadgeCheck, ShoppingBag, Bookmark, Heart } from 'lucide-react';
import { NeoSparkles, NeoBookmark, NeoTag, NeoHeart } from './NeoIcons';

interface FeedItemProps {
  post: Post;
  isSaved?: boolean;
  onAddToCart?: (post: Post) => void;
  onToggleSave?: (post: Post) => void;
  onPostClick?: (post: Post) => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({ post, isSaved = false, onAddToCart, onToggleSave, onPostClick }) => {
  const [liked, setLiked] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 300);
    }
    setLiked(!liked);
  };

  const isListing = post.type === 'LISTING';

  return (
    <article className="w-full px-4 mb-8" aria-label={`Post by ${post.user.username}`}>
      <div 
        onClick={() => onPostClick && onPostClick(post)}
        className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-earth-900 shadow-2xl group transition-transform duration-500 cursor-pointer"
      >
        
        {/* Main Image */}
        <img 
          src={post.imageUrl} 
          alt={post.description || "Post image"} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          decoding="async"
          loading="lazy"
        />
        
        {/* Sold Overlay */}
        {post.isSold && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <div className="bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 rounded-3xl transform -rotate-12 shadow-2xl">
              <span className="text-white font-display font-black text-4xl uppercase tracking-tighter">Sold Out</span>
            </div>
          </div>
        )}

        {/* Dark Gradient Overlay - Optimized for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" aria-hidden="true"></div>

        {/* Top Header Floating */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
            {/* User Chip */}
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur pl-1 pr-3 py-1 rounded-full shadow-lg">
                <img src={post.user.avatarUrl} className="w-8 h-8 rounded-full object-cover bg-earth-200" alt={`${post.user.username}'s avatar`} decoding="async" />
                <span className="text-earth-900 text-[11px] font-black tracking-tight">{post.user.username}</span>
                {post.user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-pop-cyan fill-earth-900" aria-label="Verified User" />}
            </div>

            {/* Condition Badge - Matching Screenshot (Yellow) */}
            {isListing && (
                <div className="bg-[#FFE66D] px-4 py-2 rounded-full text-earth-900 text-[11px] font-black uppercase tracking-wider flex items-center gap-2 shadow-lg" aria-label={`Condition: ${post.condition}`}>
                    <NeoSparkles className="w-3.5 h-3.5" />
                    {post.condition}
                </div>
            )}
        </div>

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            {/* Title - Bold Outfit Font */}
            <h3 className="text-white font-display font-black text-2xl leading-[1.15] mb-4 line-clamp-2 pr-4 drop-shadow-md tracking-tight">
                {post.description}
            </h3>
            
            {/* Tags Row - Dark Rounded Pills */}
            {isListing && (
                <div className="flex items-center gap-3 mb-6" aria-label={`Brand: ${post.brand}, Size: ${post.size}`}>
                    <span className="bg-[#333333]/80 backdrop-blur-md text-white px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border border-white/5">{post.brand}</span>
                    <span className="text-white/20 font-bold" aria-hidden="true">•</span>
                    <span className="bg-[#333333]/80 backdrop-blur-md text-white px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border border-white/5">{post.size}</span>
                </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {isListing && <span className="font-display font-black text-4xl text-white tracking-tighter" aria-label={`Price: ${post.price} rupees`}>₹{post.price}</span>}
                </div>

                <div className="flex items-center gap-2">
                    {/* Circle White Buttons */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(post); }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${isSaved ? 'bg-pop-purple' : 'bg-white hover:bg-earth-50'}`}
                        aria-label={isSaved ? "Remove from saved" : "Save post"}
                    >
                         {isSaved ? <NeoBookmark className="w-5 h-5" /> : <Bookmark className="w-6 h-6 text-earth-900" />}
                    </button>

                    <button 
                        onClick={handleLike}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${liked ? 'bg-pop-pink' : 'bg-white hover:bg-earth-50'}`}
                        aria-label={liked ? "Unlike post" : "Like post"}
                    >
                        {liked ? (
                          <Heart className={`w-6 h-6 transition-transform stroke-2 fill-white text-white ${isLikeAnimating ? 'animate-pop' : ''}`} aria-hidden="true" />
                        ) : (
                          <NeoHeart className="w-6 h-6" />
                        )}
                    </button>
                    
                    {isListing && onAddToCart && !post.isSold && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onAddToCart(post); }}
                            className="h-12 px-6 rounded-full bg-[#C7F464] text-earth-900 font-black text-[13px] flex items-center gap-2 shadow-xl active:scale-95 transition-all hover:bg-lime-300"
                            aria-label="Add to cart"
                        >
                            <ShoppingBag className="w-4 h-4 text-earth-900" strokeWidth={3} aria-hidden="true" /> Add
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </article>
  );
};

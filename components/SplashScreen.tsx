
import React, { useEffect, useState } from 'react';
import { NeoSparkles, NeoLightning, NeoCheck, NeoStar, NeoSneaker, NeoBag, NeoHeart, NeoFire } from './NeoIcons';
import { Users, RefreshCw, Sparkles } from 'lucide-react';

const Avatar = ({ className, img, delay }: { className?: string, img: string, delay: string }) => (
  <div className={`absolute ${className} z-20 animate-pop-in`} style={{ animationDelay: delay }}>
      <div className="w-12 h-12 rounded-full border-[3px] border-white shadow-xl overflow-hidden bg-earth-100 relative z-10 transition-transform hover:scale-110 duration-300">
          <img src={img} className="w-full h-full object-cover" alt="User" decoding="async" />
      </div>
      <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-sm z-20 border border-earth-50 animate-bounce" style={{ animationDelay: `calc(${delay} + 0.5s)` }}>
          <NeoHeart className="w-3 h-3 text-pop-pink fill-pop-pink" />
      </div>
  </div>
);

const OrbitItem = ({ icon: Icon, bg, delay, className, style }: { icon: any, bg: string, delay: string, className?: string, style?: React.CSSProperties }) => (
    <div className={`absolute w-14 h-14 bg-white rounded-2xl border-2 border-earth-900 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] flex items-center justify-center ${className} z-30`} style={style}>
        <div className={`absolute inset-0 opacity-20 ${bg}`}></div>
        <Icon className="w-7 h-7 relative z-10" />
    </div>
);

export const SplashScreen: React.FC = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Optimized timing for snappier load
    const t1 = setTimeout(() => setStage(1), 10);
    const t2 = setTimeout(() => setStage(2), 500); 
    const t3 = setTimeout(() => setStage(3), 1000); 
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAFAF9] flex flex-col items-center justify-center font-sans overflow-hidden selection:bg-none">
        
        {/* === BACKGROUND LAYERS === */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-40"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/0 via-transparent to-earth-50/50 pointer-events-none"></div>

        {/* === SCENE: COMMUNITY ECOSYSTEM === */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${stage >= 2 ? 'opacity-0 scale-50 blur-sm pointer-events-none' : 'opacity-100 scale-100'}`}>
            
            {/* Ripple Effect Background */}
            <div className="absolute w-[150vw] h-[150vw] max-w-[600px] max-h-[600px] rounded-full border border-earth-200/50 opacity-0 animate-ripple"></div>

            <div className="relative w-[80vw] h-[80vw] max-w-[340px] max-h-[340px] flex items-center justify-center scale-90 sm:scale-100">
                
                {/* 1. Orbit Tracks */}
                <div className="absolute inset-0 rounded-full border border-dashed border-earth-200 opacity-60 animate-spin-slow"></div>
                <div className="absolute inset-[12%] rounded-full border border-earth-100 opacity-40"></div>

                {/* 2. Central Hub */}
                <div className="absolute z-40 animate-pop-in will-change-transform">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-earth-900 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl relative z-10 group">
                         <div className="absolute inset-0 bg-white/10 rounded-[2rem] sm:rounded-[2.5rem] animate-pulse-soft"></div>
                         <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 animate-spin-reverse-slow text-pop-lime" />
                    </div>
                </div>

                {/* 3. Orbiting Items (Planetary System with Depth) */}
                <div className="absolute inset-[-6%] animate-orbit-container z-30 pointer-events-none">
                    {/* Top Item */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-orbit-item">
                        <OrbitItem icon={NeoSneaker} bg="bg-pop-cyan" delay="0s" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    {/* Bottom Right Item */}
                    <div className="absolute bottom-12 right-0 animate-orbit-item" style={{ animationDelay: '-4s' }}>
                        <OrbitItem icon={NeoBag} bg="bg-pop-purple" delay="0s" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    {/* Bottom Left Item */}
                    <div className="absolute bottom-12 left-0 animate-orbit-item" style={{ animationDelay: '-8s' }}>
                        <OrbitItem icon={NeoStar} bg="bg-pop-yellow" delay="0s" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                </div>

                {/* 4. Community Members (Pop in around circle) */}
                <div className="absolute inset-[-15%]">
                    <Avatar img="https://picsum.photos/seed/u1/100" className="top-4 left-4 sm:left-10" delay="0.1s" />
                    <Avatar img="https://picsum.photos/seed/u2/100" className="top-4 right-4 sm:right-10" delay="0.2s" />
                    <Avatar img="https://picsum.photos/seed/u3/100" className="bottom-4 left-4 sm:left-10" delay="0.3s" />
                    <Avatar img="https://picsum.photos/seed/u4/100" className="bottom-4 right-4 sm:right-10" delay="0.4s" />
                </div>

                {/* 5. Social Popups */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-50 pointer-events-none">
                     <div className="absolute top-[-30px] left-0 animate-float-slow" style={{ animationDelay: '0.4s' }}>
                         <div className="bg-white p-2 px-3 rounded-xl rounded-bl-none shadow-xl border border-earth-100 flex items-center gap-2 transform -rotate-6 animate-pop-in opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.4s' }}>
                             <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-earth-50 overflow-hidden border border-white"><img src="https://picsum.photos/seed/u5/100" className="w-full h-full object-cover" decoding="async"/></div>
                             <span className="text-[9px] sm:text-[10px] font-black text-earth-900">Cop?</span>
                         </div>
                     </div>
                     <div className="absolute bottom-[-20px] right-0 animate-float-slow" style={{ animationDelay: '0.6s' }}>
                         <div className="bg-earth-900 text-white p-1.5 sm:p-2 px-2.5 sm:px-3 rounded-xl rounded-tr-none shadow-xl flex items-center gap-1.5 sm:gap-2 transform rotate-3 animate-pop-in opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.6s' }}>
                             <NeoCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pop-lime" />
                             <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight">Sold!</span>
                         </div>
                     </div>
                </div>
            </div>

            {/* Bottom Text */}
            <div className="absolute bottom-12 sm:bottom-16 w-full text-center px-6">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-earth-900 mb-3 animate-slide-up leading-tight">
                    Wear it. Love it.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pop-cyan to-pop-purple">Pass it on.</span>
                </h2>
            </div>
        </div>

        {/* === SCENE: LOGO REVEAL === */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${stage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-y-8'}`}>
             
             {/* Logo Container */}
             <div className="relative mb-6 sm:mb-8">
                 <div className="w-28 h-28 sm:w-36 sm:h-36 bg-earth-900 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 animate-float-slow will-change-transform">
                     <Users className="w-12 h-12 sm:w-16 sm:h-16 text-pop-lime" strokeWidth={2.5} />
                 </div>
                 
                 <div className="absolute inset-0 bg-pop-lime/30 blur-2xl rounded-full animate-pulse-soft"></div>
             </div>

             <h1 className="font-logo font-black text-5xl sm:text-6xl text-earth-900 mb-1 sm:mb-2 tracking-tighter">Revendre<span className="text-pop-cyan">.</span></h1>
             <p className="text-earth-500 font-bold tracking-wide uppercase text-xs sm:text-sm">Social Thrift</p>
        </div>
    </div>
  );
};

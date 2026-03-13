import React from 'react';
import { NeoFire, NeoStar, NeoLightning } from './NeoIcons';

export const StoryTray: React.FC = () => {
    const stories = [
        { id: 1, name: "New Drops", type: "special", icon: NeoFire, color: "bg-pop-orange" },
        { id: 2, name: "Staff Picks", type: "special", icon: NeoStar, color: "bg-pop-purple" },
        { id: 3, name: "Flash Sale", type: "special", icon: NeoLightning, color: "bg-pop-yellow" },
        { id: 4, name: "adidas", img: "https://picsum.photos/seed/adidas/100/100" },
        { id: 5, name: "vintage", img: "https://picsum.photos/seed/vintage/100/100" },
        { id: 6, name: "denim", img: "https://picsum.photos/seed/denim/100/100" },
    ];

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-4 px-4 bg-white/50 backdrop-blur-sm border-b border-earth-100/50">
            <div className="flex gap-4 min-w-max">
                {stories.map((story) => (
                    <div key={story.id} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="p-[3px] rounded-full bg-gradient-to-tr from-pop-pink via-pop-purple to-pop-cyan">
                            <div className={`w-16 h-16 rounded-full border-[3px] border-white flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 ${story.color || 'bg-earth-100'}`}>
                                {story.type === 'special' ? (
                                    <story.icon className="w-8 h-8" />
                                ) : (
                                    <img src={story.img} className="w-full h-full object-cover" alt={story.name} />
                                )}
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-earth-900 uppercase tracking-wide">{story.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

import React from 'react';
import { Home, Search, Plus, User, Sparkles, ShoppingBag, Bell } from 'lucide-react';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onOpenUpload: () => void;
  cartCount?: number;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onOpenUpload, cartCount = 0, hideNav = false }) => {
  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label?: string }) => {
      const isActive = activeTab === tab;
      return (
          <button 
            onClick={() => onTabChange(tab)}
            className={`relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-200 ${isActive ? '-translate-y-2' : 'hover:-translate-y-1'}`}
          >
              <div className={`p-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-pop-yellow shadow-lg text-earth-900' : 'bg-transparent hover:bg-earth-100 text-earth-500'}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
          </button>
      );
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center font-sans text-earth-900">
        <div className="w-full max-w-md min-h-screen relative shadow-2xl flex flex-col overflow-hidden bg-white">
            
            {/* Header */}
            {activeTab !== Tab.SELLER_DASHBOARD && activeTab !== Tab.ORDER_TRACKING && (
                <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between bg-white/90 backdrop-blur-md">
                    <h1 
                        onClick={() => onTabChange(Tab.HOME)}
                        className="font-logo font-bold text-4xl tracking-tight cursor-pointer text-earth-900 drop-shadow-sm pt-2"
                    >
                        Revendre<span className="text-pop-cyan">.</span>
                    </h1>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => onTabChange(Tab.ACTIVITY_VIEW)}
                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-earth-900 hover:bg-earth-50 transition-all active:scale-95 relative"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 -right-1 w-3 h-3 bg-pop-pink rounded-full border-2 border-white"></span>
                        </button>

                        <button 
                            onClick={() => onTabChange(Tab.CART)}
                            className="w-10 h-10 rounded-full bg-pop-cyan shadow-md flex items-center justify-center text-earth-900 hover:bg-cyan-300 transition-all active:scale-95 relative"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-pop-pink text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                    {cartCount}
                                </div>
                            )}
                        </button>
                    </div>
                </header>
            )}

            {/* Content */}
            <main className={`flex-1 overflow-y-auto no-scrollbar w-full ${[Tab.SELLER_DASHBOARD, Tab.ORDER_TRACKING].includes(activeTab) ? 'pb-0' : 'pb-28'}`}>
                {children}
            </main>

            {/* Floating Navigation Dock */}
            {![Tab.SELLER_DASHBOARD, Tab.ORDER_TRACKING].includes(activeTab) && !hideNav && (
                <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] h-[76px] glass-panel rounded-[2rem] shadow-2xl flex items-center justify-between px-6 z-50 animate-slide-up">
                    <NavItem tab={Tab.HOME} icon={Home} />
                    <NavItem tab={Tab.SHOP} icon={Search} />
                    
                    {/* Floating Add Button */}
                    <button 
                        onClick={onOpenUpload}
                        className="relative -top-8 w-16 h-16 bg-earth-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl hover:-translate-y-9 hover:bg-earth-800 transition-all group"
                    >
                        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
                    </button>

                    <NavItem tab={Tab.CHALLENGES} icon={Sparkles} />
                    <NavItem tab={Tab.PROFILE} icon={User} />
                </nav>
            )}
        </div>
    </div>
  );
};

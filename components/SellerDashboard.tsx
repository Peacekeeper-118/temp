
import React, { useState } from 'react';
import { User } from '../types';
import { ChevronLeft, ArrowUpRight, Zap, TrendingUp, PieChart, BarChart2 } from 'lucide-react';
import { MOCK_ORDERS } from '../constants';
import { NeoSparkles } from './NeoIcons';
import { WithdrawScreen } from './WithdrawScreen';
import { SalesHistoryScreen } from './SalesHistoryScreen';

interface SellerDashboardProps {
  user: User;
  onBack: () => void;
}

type ScreenType = 'dashboard' | 'withdraw' | 'history';

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, onBack }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  
  // Filter orders where current user is seller
  const sales = MOCK_ORDERS.filter(o => o.sellerId === user.id);
  const totalEarnings = sales.reduce((acc, order) => acc + order.item.price, 0);
  const avgSellingPrice = sales.length > 0 ? Math.round(totalEarnings / sales.length) : 0;

  // Return early if showing other screens
  if (currentScreen === 'withdraw') {
    return (
      <WithdrawScreen
        user={user}
        totalEarned={totalEarnings}
        onBack={() => setCurrentScreen('dashboard')}
      />
    );
  }

  if (currentScreen === 'history') {
    return (
      <SalesHistoryScreen
        sales={sales}
        onBack={() => setCurrentScreen('dashboard')}
      />
    );
  }

  // Mock Analytics Data (In a real app, this comes from backend aggregation)
  const categoryData = [
    { label: 'Streetwear', value: 45, color: 'bg-pop-orange' },
    { label: 'Vintage', value: 30, color: 'bg-pop-purple' },
    { label: 'Sneakers', value: 15, color: 'bg-pop-cyan' },
    { label: 'Accs', value: 10, color: 'bg-pop-yellow' },
  ];

  const cityData = [
      { city: 'Mumbai', pct: 40, color: 'bg-earth-900' },
      { city: 'Delhi', pct: 35, color: 'bg-brand-500' },
      { city: 'Bangalore', pct: 25, color: 'bg-pop-lime' },
  ];

  // Simple SVG Line Chart Points (Mock Weekly Data)
  const trendPoints = "0,40 20,35 40,50 60,30 80,20 100,5";

  return (
    <div className="bg-[#FAFAF9] min-h-full pb-20 animate-fade-in-up">
        {/* Header */}
        <div className="p-6 pt-8 flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white border border-earth-100 flex items-center justify-center text-earth-600 hover:scale-105 transition-transform"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="font-display font-black text-2xl text-earth-900">Seller Hub</h2>
        </div>

        <div className="px-6 space-y-6">
            {/* Main Card */}
            <div className="bg-earth-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-earth-900/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <p className="text-earth-400 font-medium text-sm mb-1 flex items-center gap-2"><NeoSparkles className="w-4 h-4 text-pop-yellow"/> Total Earnings</p>
                    <h1 className="font-display font-black text-5xl mb-6 tracking-tight">₹{totalEarnings}</h1>
                    <div className="flex gap-3">
                        <button onClick={() => setCurrentScreen('withdraw')} className="flex-1 bg-white text-earth-900 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-earth-50 transition-colors">Withdraw</button>
                        <button onClick={() => setCurrentScreen('history')} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors">History</button>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[2rem] border border-earth-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-earth-500 text-xs font-bold uppercase">
                        <ArrowUpRight className="w-4 h-4 text-pop-lime" /> Sold Items
                    </div>
                    <h3 className="font-black text-3xl text-earth-900">{sales.length}</h3>
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-earth-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-earth-500 text-xs font-bold uppercase">
                        <Zap className="w-4 h-4 text-pop-cyan" /> Rating
                    </div>
                    <h3 className="font-black text-3xl text-earth-900">{user.sellerRating || '-'}/5</h3>
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-earth-100 shadow-sm col-span-2 flex items-center justify-between">
                     <div>
                        <div className="flex items-center gap-2 mb-1 text-earth-500 text-xs font-bold uppercase">
                            <TrendingUp className="w-4 h-4 text-pop-purple" /> Avg. Selling Price
                        </div>
                        <h3 className="font-black text-3xl text-earth-900">₹{avgSellingPrice}</h3>
                     </div>
                     <div className="h-12 w-24">
                        {/* Mini SVG Sparkline */}
                        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                            <polyline 
                                points={trendPoints} 
                                fill="none" 
                                stroke="#9D4EDD" 
                                strokeWidth="4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                     </div>
                </div>
            </div>

            {/* Category Analytics Chart */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-earth-100 shadow-sm">
                <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-earth-400"/> Top Categories
                </h3>
                <div className="space-y-4">
                    {categoryData.map((cat, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-earth-900">{cat.label}</span>
                                <span className="text-earth-500">{cat.value}%</span>
                            </div>
                            <div className="w-full h-3 bg-earth-100 rounded-full overflow-hidden border border-earth-100">
                                <div 
                                    className={`h-full rounded-full ${cat.color}`} 
                                    style={{ width: `${cat.value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Demographics Visualization */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-earth-100 shadow-sm">
                <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-earth-400"/> Buyer Cities
                </h3>
                
                {/* Stacked Bar */}
                <div className="flex h-12 w-full rounded-2xl overflow-hidden border-2 border-white shadow-lg mb-6">
                    {cityData.map((d, i) => (
                        <div 
                            key={i} 
                            style={{ width: `${d.pct}%` }} 
                            className={`${d.color} h-full relative group`}
                        >
                            {/* Tooltip on hover could go here */}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex justify-between">
                    {cityData.map((d, i) => (
                        <div key={i} className="text-center">
                            <div className={`w-3 h-3 rounded-full ${d.color} mx-auto mb-1`}></div>
                            <p className="text-[10px] font-bold text-earth-900 uppercase">{d.city}</p>
                            <p className="text-xs font-medium text-earth-500">{d.pct}%</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity (Existing) */}
            <div>
                <h3 className="font-display font-bold text-lg mb-4 ml-2">Recent Orders</h3>
                {sales.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-[2rem] border border-earth-100 border-dashed">
                        <p className="text-earth-400 text-sm font-bold">No sales yet.</p>
                    </div>
                ) : (
                    sales.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-[2rem] border border-earth-100 shadow-sm flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 bg-earth-100 rounded-xl overflow-hidden">
                                <img src={order.item.imageUrl} className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <p className="font-bold text-earth-900 text-sm line-clamp-1">{order.item.description}</p>
                                <p className="text-xs text-earth-500 capitalize">{order.status.replace('_', ' ')}</p>
                            </div>
                            <div className="ml-auto font-black text-earth-900">₹{order.item.price}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

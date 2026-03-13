import React from 'react';
import { Order, User } from '../types';
import { ChevronLeft, TrendingUp } from 'lucide-react';

interface SalesHistoryScreenProps {
  sales: Order[];
  onBack: () => void;
}

export const SalesHistoryScreen: React.FC<SalesHistoryScreenProps> = ({ sales, onBack }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-pop-lime/20 text-pop-lime';
      case 'at_hub':
      case 'inspection_passed':
        return 'bg-pop-cyan/20 text-pop-cyan';
      case 'inspection_failed':
        return 'bg-pop-orange/20 text-pop-orange';
      default:
        return 'bg-earth-100 text-earth-600';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((acc, order) => acc + order.item.price, 0);

  return (
    <div className="bg-[#FAFAF9] min-h-full pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="p-6 pt-8 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-earth-100 flex items-center justify-center text-earth-600 hover:scale-105 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-display font-black text-2xl text-earth-900">Sales History</h2>
      </div>

      <div className="px-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] border border-earth-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-earth-500 text-xs font-bold uppercase">
              <TrendingUp className="w-4 h-4 text-pop-purple" /> Total Sales
            </div>
            <h3 className="font-black text-3xl text-earth-900">{totalSales}</h3>
          </div>
          <div className="bg-white p-5 rounded-[2rem] border border-earth-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-earth-500 text-xs font-bold uppercase">
              <span className="text-pop-lime">💰</span> Total Revenue
            </div>
            <h3 className="font-black text-3xl text-earth-900">₹{totalRevenue}</h3>
          </div>
        </div>

        {/* Sales List */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4 text-earth-900">Items Sold</h3>

          {sales.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-earth-100 border-dashed">
              <p className="text-earth-400 text-sm font-bold">No sales yet. Start listing items!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sales.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-[2rem] border border-earth-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Item Image and Details Row */}
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 bg-earth-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={order.item.imageUrl}
                        alt={order.item.description}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-earth-900 text-sm line-clamp-2">
                        {order.item.description}
                      </p>
                      <p className="text-xs text-earth-500 font-medium capitalize mt-1">
                        Category: <span className="text-earth-700">{order.item.brand || 'General'}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-earth-900 text-lg">₹{order.item.price}</p>
                    </div>
                  </div>

                  {/* Details Row */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-earth-100">
                    {/* Buyer Location */}
                    <div>
                      <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">📍 Buyer Location</p>
                      <p className="text-xs font-bold text-earth-900">{order.item.location}</p>
                    </div>

                    {/* Date Sold */}
                    <div>
                      <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">📅 Date Sold</p>
                      <p className="text-xs font-bold text-earth-900">{formatDate(order.createdAt)}</p>
                    </div>

                    {/* Size */}
                    <div>
                      <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">📏 Size</p>
                      <p className="text-xs font-bold text-earth-900">{order.item.size}</p>
                    </div>

                    {/* Condition */}
                    <div>
                      <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">✨ Condition</p>
                      <p className="text-xs font-bold text-earth-900">{order.item.condition}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

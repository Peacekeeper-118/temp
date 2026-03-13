import React, { useMemo } from 'react';
import { User, Order } from '../types';
import { ChevronLeft, Package, Truck } from 'lucide-react';
import { Button } from './Button';

interface YourOrdersScreenProps {
  user: User;
  orders: Order[];
  onBack: () => void;
  onTrackOrder: (order: Order) => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'created':
      return 'bg-earth-100 text-earth-900';
    case 'paid':
    case 'purchased':
      return 'bg-pop-cyan/10 text-pop-cyan';
    case 'pickup_scheduled':
    case 'at_hub':
    case 'inspection_passed':
      return 'bg-pop-purple/10 text-pop-purple';
    case 'out_for_delivery':
      return 'bg-pop-orange/10 text-pop-orange';
    case 'delivered':
    case 'completed':
      return 'bg-pop-lime/10 text-pop-lime';
    case 'inspection_failed':
    case 'cancelled':
      return 'bg-pop-rose/10 text-pop-rose';
    default:
      return 'bg-earth-50 text-earth-600';
  }
};

const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export const YourOrdersScreen: React.FC<YourOrdersScreenProps> = ({ user, orders, onBack, onTrackOrder }) => {
  // Filter orders where user is the buyer
  const userOrders = useMemo(() => {
    return orders.filter(order => order.buyerId === user.id).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, user.id]);

  return (
    <div className="bg-[#F0F0F0] min-h-full pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="p-6 pt-8 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-earth-50 border border-earth-200 flex items-center justify-center text-earth-600 hover:scale-105 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-display font-black text-2xl text-earth-900">Your Orders</h2>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {userOrders.length === 0 ? (
          // Empty State
          <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-earth-100 border-dashed animate-fade-in-up">
            <div className="w-12 h-12 bg-earth-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-earth-300" />
            </div>
            <p className="text-earth-400 text-sm font-bold">No purchases yet.</p>
            <p className="text-earth-300 text-xs mt-1">Start shopping to see your orders here!</p>
          </div>
        ) : (
          // Orders List
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-[2rem] border border-earth-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-earth-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={order.item.imageUrl}
                      alt={order.item.description}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    {/* Product Name and Price */}
                    <h3 className="font-bold text-earth-900 text-sm line-clamp-2 mb-1">
                      {order.item.description}
                    </h3>
                    <p className="text-sm font-black text-brand-600 mb-2">₹{order.item.price}</p>

                    {/* Order Info */}
                    <div className="flex items-center gap-3 text-[10px] font-bold text-earth-500 uppercase tracking-wide mb-3">
                      <span>Order: {order.id}</span>
                      <span>•</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>

                    {/* Status and Action */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wide ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTrackOrder(order)}
                        className="flex items-center gap-1 whitespace-nowrap"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Track
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-3 pt-3 border-t border-earth-100 grid grid-cols-3 gap-3 text-[10px]">
                  <div>
                    <p className="font-bold text-earth-500 uppercase mb-1">Seller</p>
                    <p className="font-black text-earth-900 truncate">{order.item.brand || 'Seller'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-earth-500 uppercase mb-1">Size</p>
                    <p className="font-black text-earth-900">{order.item.size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-earth-500 uppercase mb-1">Condition</p>
                    <p className="font-black text-earth-900">{order.item.condition || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

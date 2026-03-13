

import React, { useState } from 'react';
import { ChevronLeft, Package, Truck, Warehouse, Globe, User, Clock } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingProps {
  onBack: () => void;
  orders: Order[];
  onPayNow?: (order: Order) => void;
}

const STEP_ICONS: Record<string, any> = {
    'User': User,
    'Truck': Truck,
    'Warehouse': Warehouse,
    'Globe': Globe,
    'Package': Package
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({ onBack, orders, onPayNow }) => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  if (selectedOrder) {
      return (
        <div className="bg-[#FAFAF9] min-h-full pb-20 animate-slide-up">
           <div className="p-6 pt-8 flex items-center gap-3 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-earth-100/50">
              <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-white border border-earth-100 flex items-center justify-center text-earth-600 hover:scale-105 transition-transform"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="font-display font-black text-xl text-earth-900">Delivery Portal</h2>
           </div>

           <div className="px-6 mt-4 pb-20">
              {/* Order Summary Card */}
              <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-earth-900/5 mb-8 flex gap-5 items-center border border-earth-100">
                  <img src={selectedOrder.item.imageUrl} className="w-20 h-24 rounded-2xl object-cover bg-earth-100" />
                  <div>
                      <h3 className="font-bold text-earth-900 mb-1">{selectedOrder.item.description}</h3>
                      <p className="text-sm font-black text-brand-600">₹{selectedOrder.item.price}</p>
                      <span className="inline-block mt-2 bg-pop-lime/20 text-earth-900 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
                          {selectedOrder.status.replace('_', ' ')}
                      </span>
                  </div>
              </div>

              <h3 className="font-display font-bold text-lg text-earth-900 mb-4 ml-2">Shipment Journey</h3>

              {/* Timeline Container */}
              <div className="relative pl-6 space-y-8 before:absolute before:left-[29px] before:top-4 before:bottom-4 before:w-0.5 before:bg-earth-200/50">
                  {selectedOrder.trackingSteps.map((step: any, idx: number) => {
                      const Icon = STEP_ICONS[step.icon] || Package;
                      const isActive = step.isCompleted;
                      
                      // Alternate styling similar to the image concepts
                      const isPurple = idx % 2 === 0; // Seller(0), Hub(2), Globe(3-ish) - loosely map colors
                      const colorClass = idx === 0 ? 'bg-pop-purple' : 
                                       idx === 1 ? 'bg-pop-orange' : 
                                       idx === 2 ? 'bg-pop-purple' : 
                                       idx === 3 ? 'bg-pop-purple' : 'bg-pop-orange';
                      
                      const iconBgClass = isActive ? colorClass : 'bg-earth-200';
                      const textClass = isActive ? 'text-earth-900' : 'text-earth-400';

                      return (
                          <div key={idx} className={`relative flex gap-5 group ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                              {/* Connector Dot/Icon */}
                              <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 ${iconBgClass} border-4 border-[#FAFAF9]`}>
                                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                              </div>

                              {/* Content Card */}
                              <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-earth-100">
                                  <div className="flex justify-between items-start mb-1">
                                      <h4 className={`font-bold text-sm ${textClass}`}>{step.status}</h4>
                                      {step.timestamp && <span className="text-[10px] font-bold text-earth-400 bg-earth-50 px-2 py-1 rounded-lg">{step.timestamp}</span>}
                                  </div>
                                  
                                  <p className="text-xs text-earth-500 font-medium mb-3">{step.description}</p>
                                  
                                  {/* Duration Pill */}
                                  {step.duration && (
                                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold ${isActive ? 'bg-earth-50 text-earth-600' : 'bg-earth-50/50 text-earth-300'}`}>
                                          <Clock className="w-3 h-3" />
                                          {step.duration}
                                      </div>
                                  )}
                              </div>
                          </div>
                      );
                  })}
              </div>
           </div>
        </div>
      );
  }

  return (
    <div className="bg-[#FAFAF9] min-h-full pb-20 animate-fade-in-up">
        <div className="p-6 pt-8 flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white border border-earth-100 flex items-center justify-center text-earth-600 hover:scale-105 transition-transform"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="font-display font-black text-2xl text-earth-900">Delivery Portal</h2>
        </div>

       <div className="px-6 space-y-4">
           {orders.length === 0 ? (
               <div className="text-center py-12 opacity-50">
                   <Package className="w-12 h-12 mx-auto text-earth-300 mb-2"/>
                   <p className="font-bold text-earth-500">No active shipments.</p>
               </div>
           ) : (
               orders.map((order) => (
                   <div key={order.id} onClick={() => setSelectedOrder(order)} className="bg-white p-4 rounded-[2rem] border border-earth-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] group">
                       <div className="w-16 h-16 rounded-2xl overflow-hidden bg-earth-100 relative">
                           <img src={order.item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       </div>
                       <div className="flex-1">
                           <div className="flex justify-between items-start">
                               <h3 className="font-bold text-earth-900 text-sm line-clamp-1">{order.item.description}</h3>
                               <span className="w-2 h-2 rounded-full bg-pop-lime"></span>
                           </div>
                           <p className="text-xs text-earth-500 font-medium capitalize mt-1 mb-2">{order.status.replace('_', ' ')}</p>
                           {order.status === 'created' && onPayNow ? (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); onPayNow(order); }}
                                 className="text-[10px] font-bold text-white bg-earth-900 px-3 py-1.5 rounded-lg hover:bg-pop-lime hover:text-earth-900 transition-colors"
                               >
                                   Pay Now
                               </button>
                           ) : (
                               <div className="flex items-center gap-1 text-[10px] font-bold text-earth-400 bg-earth-50 self-start px-2 py-1 rounded-lg w-fit">
                                   <Truck className="w-3 h-3"/> Estimated: {order.eta || '2 days'}
                               </div>
                           )}
                       </div>
                       <div className="w-8 h-8 rounded-full bg-earth-900 flex items-center justify-center text-white group-hover:bg-pop-cyan group-hover:text-earth-900 transition-colors">
                            <ChevronLeft className="w-4 h-4 rotate-180" />
                       </div>
                   </div>
               ))
           )}
       </div>
    </div>
  );
};

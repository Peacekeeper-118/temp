
import React, { useState } from 'react';
import { X, CreditCard, Banknote, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { NeoCheck } from './NeoIcons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onComplete: (method: 'COD' | 'ONLINE') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalAmount, onComplete }) => {
  const [method, setMethod] = useState<'COD' | 'ONLINE'>('ONLINE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setTimeout(() => {
            onComplete(method);
            setTimeout(() => {
                setIsSuccess(false); 
            }, 300);
        }, 1000);
    }, 1000);
  };

  if (isSuccess) {
      return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-earth-900/60 backdrop-blur-sm p-4 animate-fade-in-up">
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl p-8 flex flex-col items-center justify-center text-center border-4 border-earth-100">
                <div className="w-20 h-20 bg-pop-lime rounded-full flex items-center justify-center mb-6 animate-bounce-in border-4 border-earth-900 shadow-xl">
                    <NeoCheck className="w-10 h-10" />
                </div>
                <h3 className="font-display font-black text-3xl text-earth-900 mb-2">Order Placed!</h3>
                <p className="text-earth-500 font-bold">Your fit is on the way.</p>
                <p className="text-earth-400 text-xs mt-4 font-black uppercase tracking-widest bg-earth-50 px-3 py-1 rounded-full">Redirecting to tracker...</p>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-earth-900/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden">
         <div className="p-6 border-b border-earth-100 flex items-center justify-between">
            <h2 className="font-display font-black text-2xl text-earth-900">Checkout</h2>
            <button onClick={onClose} className="p-2 bg-earth-50 rounded-full hover:bg-earth-100 transition-colors">
                <X className="w-5 h-5 text-earth-500" />
            </button>
         </div>

         <div className="p-6">
             <div className="bg-earth-50 rounded-2xl p-6 text-center mb-8 border border-earth-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-pop-lime/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
                 <div className="absolute bottom-0 left-0 w-20 h-20 bg-pop-cyan/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
                 <p className="text-earth-500 font-bold text-xs uppercase tracking-wider mb-1 relative z-10">Total to Pay</p>
                 <h1 className="font-display font-black text-5xl text-earth-900 relative z-10">₹{totalAmount}</h1>
             </div>

             <div className="space-y-3 mb-8">
                 <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.98] ${method === 'ONLINE' ? 'border-earth-900 bg-earth-900 text-white shadow-xl' : 'border-earth-200 bg-white text-earth-600 hover:border-earth-300'}`}>
                     <input type="radio" className="hidden" name="payment" checked={method === 'ONLINE'} onChange={() => setMethod('ONLINE')} />
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${method === 'ONLINE' ? 'bg-white/10 border-white/20' : 'bg-earth-50 border-earth-100'}`}>
                        <CreditCard className="w-6 h-6" />
                     </div>
                     <div className="flex-1">
                         <p className="font-bold text-base">UPI / Card</p>
                         <p className={`text-[10px] font-bold uppercase tracking-wider ${method === 'ONLINE' ? 'text-white/60' : 'text-earth-400'}`}>Instant Payment</p>
                     </div>
                     {method === 'ONLINE' && <CheckCircle2 className="w-6 h-6 text-pop-lime" fill="black" />}
                 </label>

                 <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.98] ${method === 'COD' ? 'border-earth-900 bg-earth-900 text-white shadow-xl' : 'border-earth-200 bg-white text-earth-600 hover:border-earth-300'}`}>
                     <input type="radio" className="hidden" name="payment" checked={method === 'COD'} onChange={() => setMethod('COD')} />
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${method === 'COD' ? 'bg-white/10 border-white/20' : 'bg-earth-50 border-earth-100'}`}>
                        <Banknote className="w-6 h-6" />
                     </div>
                     <div className="flex-1">
                         <p className="font-bold text-base">Cash on Delivery</p>
                         <p className={`text-[10px] font-bold uppercase tracking-wider ${method === 'COD' ? 'text-white/60' : 'text-earth-400'}`}>Pay at doorstep</p>
                     </div>
                     {method === 'COD' && <CheckCircle2 className="w-6 h-6 text-pop-lime" fill="black" />}
                 </label>
             </div>

             <div className="flex items-center justify-center gap-2 mb-6 opacity-60">
                 <ShieldCheck className="w-4 h-4 text-earth-500" />
                 <span className="text-[10px] font-bold text-earth-500 uppercase">Secure Payment Processing</span>
             </div>

             <Button onClick={handlePay} className="w-full py-3 text-base bg-pop-lime text-earth-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] active:shadow-none transition-all border-2 border-earth-900" disabled={isProcessing}>
                 {isProcessing ? (
                     <span className="flex items-center gap-2">Processing <Loader2 className="w-5 h-5 animate-spin"/></span>
                 ) : (
                     <span className="flex items-center gap-2 font-black">{method === 'COD' ? 'Place COD Order' : `Pay ₹${totalAmount}`}</span>
                 )}
             </Button>
         </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, Briefcase, ShieldCheck, Loader2, CheckCircle2, ChevronRight, Plus, Map } from 'lucide-react';
import { Button } from './Button';
import { Address } from '../types';

interface CheckoutAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: Address) => void;
  existingAddresses: Address[];
}

// Mock Pincode Data
const MOCK_PINCODES: Record<string, { city: string, state: string }> = {
    '40': { city: 'Mumbai', state: 'Maharashtra' },
    '11': { city: 'New Delhi', state: 'Delhi' },
    '56': { city: 'Bengaluru', state: 'Karnataka' },
    '60': { city: 'Chennai', state: 'Tamil Nadu' },
    '70': { city: 'Kolkata', state: 'West Bengal' },
};

export const CheckoutAddressModal: React.FC<CheckoutAddressModalProps> = ({ isOpen, onClose, onConfirm, existingAddresses }) => {
  const [view, setView] = useState<'list' | 'form'>(existingAddresses.length > 0 ? 'list' : 'form');
  const [selectedId, setSelectedId] = useState<string | null>(existingAddresses.find(a => a.isDefault)?.id || (existingAddresses[0]?.id) || null);
  
  const [formData, setFormData] = useState<Omit<Address, 'id' | 'isDefault'>>({
    fullName: '',
    mobile: '',
    line1: '',
    line2: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    type: 'Home'
  });

  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  if (!isOpen) return null;

  const handlePincodeChange = (code: string) => {
    setFormData(prev => ({ ...prev, pincode: code }));
    if (code.length === 6) {
        setIsPincodeLoading(true);
        setTimeout(() => {
            const prefix = code.substring(0, 2);
            const data = MOCK_PINCODES[prefix];
            if (data) {
                setFormData(prev => ({ ...prev, city: data.city, state: data.state }));
            }
            setIsPincodeLoading(false);
        }, 400);
    }
  };

  const handleConfirm = () => {
    if (view === 'list' && selectedId) {
      const addr = existingAddresses.find(a => a.id === selectedId);
      if (addr) onConfirm(addr);
    } else {
      const newAddr: Address = {
        ...formData,
        id: `addr-${Date.now()}`,
        isDefault: existingAddresses.length === 0
      };
      onConfirm(newAddr);
    }
  };

  const isFormValid = formData.fullName && formData.mobile.length === 10 && formData.line1 && formData.pincode.length === 6 && formData.city;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-earth-900/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col border-4 border-earth-100">
        
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start">
            <div>
                <h2 className="font-display font-black text-3xl text-earth-900 mb-1">Shipping Details 📦</h2>
                <p className="text-earth-800 text-sm font-black">Where should we send your finds?</p>
            </div>
            <button onClick={onClose} className="p-2 bg-earth-50 rounded-full hover:bg-earth-100">
                <X className="w-5 h-5 text-earth-900" />
            </button>
        </div>

        <div className="px-6 pb-4">
             <div className="inline-flex items-center gap-1.5 bg-earth-50 border border-earth-100 px-2 py-1.5 rounded-lg">
                <ShieldCheck className="w-3 h-3 text-earth-900" />
                <span className="text-[10px] font-black text-earth-900 uppercase tracking-wide">Used only for pickups & deliveries</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-6 pb-6">
            {view === 'list' ? (
                <div className="space-y-4">
                    {existingAddresses.map((addr) => (
                        <div 
                            key={addr.id}
                            onClick={() => setSelectedId(addr.id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${selectedId === addr.id ? 'border-earth-900 bg-earth-50 shadow-md' : 'border-earth-200 hover:border-earth-400'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {addr.type === 'Home' ? <Home className="w-4 h-4 text-earth-900" /> : <Briefcase className="w-4 h-4 text-earth-900" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest text-earth-900">{addr.type}</span>
                                </div>
                                {selectedId === addr.id && <CheckCircle2 className="w-5 h-5 text-pop-lime" />}
                            </div>
                            <h4 className="font-black text-earth-900 text-sm">{addr.fullName}</h4>
                            <p className="text-xs text-earth-700 font-bold line-clamp-2 mt-1">{addr.line1}, {addr.city}</p>
                            <p className="text-xs text-earth-900 font-black mt-1">{addr.mobile}</p>
                        </div>
                    ))}
                    <button 
                        onClick={() => setView('form')}
                        className="w-full py-4 rounded-2xl border-2 border-dashed border-earth-300 text-earth-600 font-black text-sm flex items-center justify-center gap-2 hover:border-earth-900 hover:text-earth-900 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add New Address
                    </button>
                </div>
            ) : (
                <div className="space-y-6 animate-slide-in-right">
                    {existingAddresses.length > 0 && (
                        <button onClick={() => setView('list')} className="text-xs font-black text-brand-800 uppercase mb-2">← Back to saved</button>
                    )}
                    
                    <div className="space-y-3">
                        <h4 className="text-xs font-black text-earth-900 uppercase tracking-widest flex items-center gap-2"><User className="w-3 h-3"/> Contact</h4>
                        <div className="bg-earth-50 p-1 rounded-2xl border border-earth-200">
                            <div className="relative border-b border-earth-200">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-900" />
                                <input 
                                    value={formData.fullName}
                                    onChange={(e) => setFormData(prev => ({...prev, fullName: e.target.value}))}
                                    className="w-full bg-transparent pl-12 pr-4 py-4 font-black text-sm text-earth-900 outline-none placeholder:text-earth-500 placeholder:font-bold"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-900" />
                                <input 
                                    value={formData.mobile}
                                    onChange={(e) => setFormData(prev => ({...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)}))}
                                    className="w-full bg-transparent pl-12 pr-4 py-4 font-black text-sm text-earth-900 outline-none placeholder:text-earth-500 placeholder:font-bold"
                                    placeholder="Mobile Number"
                                    type="tel"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-black text-earth-900 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3"/> Location</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-earth-50 rounded-2xl px-4 py-3 border border-earth-200 relative">
                                <label className="text-[10px] font-black text-earth-900 uppercase block mb-1">Pincode</label>
                                <input 
                                    value={formData.pincode}
                                    onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full bg-transparent font-black text-earth-900 outline-none placeholder:text-earth-500"
                                    placeholder="000000"
                                />
                                {isPincodeLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-earth-900"/>}
                            </div>
                            <div className="bg-earth-50 rounded-2xl px-4 py-3 border border-earth-200">
                                <label className="text-[10px] font-black text-earth-900 uppercase block mb-1">City</label>
                                <input 
                                    value={formData.city}
                                    onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                                    className="w-full bg-transparent font-black text-earth-900 outline-none placeholder:text-earth-500"
                                    placeholder="City"
                                />
                            </div>
                        </div>
                        <div className="bg-earth-50 p-4 rounded-2xl border border-earth-200 space-y-4">
                            <input 
                                value={formData.line1}
                                onChange={(e) => setFormData(prev => ({...prev, line1: e.target.value}))}
                                className="w-full bg-transparent border-b border-earth-300 pb-2 font-black text-sm text-earth-900 outline-none placeholder:text-earth-500"
                                placeholder="Flat, House no., Building"
                            />
                            <input 
                                value={formData.line2}
                                onChange={(e) => setFormData(prev => ({...prev, line2: e.target.value}))}
                                className="w-full bg-transparent border-b border-earth-300 pb-2 font-black text-sm text-earth-900 outline-none placeholder:text-earth-500"
                                placeholder="Area, Street, Sector"
                            />
                            <div className="grid grid-cols-2 gap-4 pt-1">
                                <input 
                                    value={formData.landmark}
                                    onChange={(e) => setFormData(prev => ({...prev, landmark: e.target.value}))}
                                    className="w-full bg-transparent font-black text-sm text-earth-900 outline-none placeholder:text-earth-500"
                                    placeholder="Landmark"
                                />
                                <input 
                                    value={formData.state}
                                    onChange={(e) => setFormData(prev => ({...prev, state: e.target.value}))}
                                    className="w-full bg-transparent font-black text-sm text-earth-900 outline-none placeholder:text-earth-500 text-right"
                                    placeholder="State"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pb-2">
                        <h4 className="text-xs font-black text-earth-900 uppercase tracking-widest flex items-center gap-2"><Map className="w-3 h-3"/> Save As</h4>
                        <div className="bg-earth-50 p-1 rounded-xl flex gap-1 border border-earth-200">
                            {[
                                { id: 'Home', icon: Home }, 
                                { id: 'Work', icon: Briefcase }, 
                                { id: 'Other', icon: MapPin }
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setFormData(prev => ({...prev, type: t.id as any}))}
                                    className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                                        formData.type === t.id 
                                        ? 'bg-earth-900 text-white shadow-md border border-earth-900' 
                                        : 'text-earth-600 hover:text-earth-900'
                                    }`}
                                >
                                    <t.icon className="w-3.5 h-3.5" /> {t.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="p-6 bg-white border-t border-earth-100">
            <Button 
                onClick={handleConfirm}
                className="w-full py-4 text-base shadow-xl"
                disabled={view === 'list' ? !selectedId : !isFormValid}
            >
                Confirm & Continue <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
        </div>
      </div>
    </div>
  );
};

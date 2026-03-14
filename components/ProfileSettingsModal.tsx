
import React, { useState, useEffect } from 'react';
import { User, Address } from '../types';
import { X, Save, Loader2, AlertTriangle, User as UserIcon, Phone, MapPin, Home, Briefcase, Map, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (updatedData: Partial<User>) => Promise<void>;
}

// Mock Pincode Data
const MOCK_PINCODES: Record<string, { city: string, state: string }> = {
    '40': { city: 'Mumbai', state: 'Maharashtra' },
    '11': { city: 'New Delhi', state: 'Delhi' },
    '56': { city: 'Bengaluru', state: 'Karnataka' },
    '60': { city: 'Chennai', state: 'Tamil Nadu' },
    '70': { city: 'Kolkata', state: 'West Bengal' },
};

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose, currentUser, onUpdateUser }) => {
  // Shipping Address State (Editing the default or first address)
  const defaultAddress = currentUser.addresses?.[0] || {
    fullName: '',
    mobile: '',
    line1: '',
    line2: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    type: 'Home' as 'Home' | 'Work' | 'Other'
  };

  const [address, setAddress] = useState(defaultAddress);
  const [isLoading, setIsLoading] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setAddress(currentUser.addresses?.[0] || defaultAddress);
    } else {
      setError(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handlePincodeChange = (code: string) => {
    setAddress(prev => ({ ...prev, pincode: code }));
    if (code.length === 6) {
        setIsPincodeLoading(true);
        setTimeout(() => {
            const prefix = code.substring(0, 2);
            const data = MOCK_PINCODES[prefix];
            if (data) {
                setAddress(prev => ({ ...prev, city: data.city, state: data.state }));
            }
            setIsPincodeLoading(false);
        }, 400);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Update the first address in the array
      const updatedAddresses = currentUser.addresses ? [...currentUser.addresses] : [];
      if (updatedAddresses.length > 0) {
          updatedAddresses[0] = { ...address, id: updatedAddresses[0].id, isDefault: true };
      } else {
          updatedAddresses.push({ ...address, id: `addr-${Date.now()}`, isDefault: true });
      }

      await onUpdateUser({
        addresses: updatedAddresses,
        city: address.city // Keep legacy city field in sync
      });

      onClose();
    } catch (err) {
      console.error("Failed to update shipping details", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-earth-900/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Simple & Clean */}
        <div className="px-8 py-6 border-b border-earth-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="font-display font-black text-2xl text-earth-900">Shipping Details</h2>
          <button onClick={onClose} className="p-2 bg-earth-50 rounded-full hover:bg-earth-100 transition-colors">
            <X className="w-5 h-5 text-earth-900" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto no-scrollbar flex-1 space-y-8">
          {/* Managed Address Section */}
          <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-earth-900 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-pop-cyan"/> Primary Address
                </h3>
                <div className="bg-earth-100 px-2 py-1 rounded text-[8px] font-black text-earth-500 uppercase tracking-tighter">Verified for Deliveries</div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-earth-900 uppercase tracking-widest opacity-60 ml-1">Contact Information</h4>
                  <div className="bg-earth-50 p-1 rounded-2xl border-2 border-earth-100">
                      <div className="relative border-b-2 border-earth-100">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-900" />
                          <input 
                              id="profile-fullname"
                              name="fullName"
                              autoComplete="name"
                              value={address.fullName}
                              onChange={(e) => setAddress(prev => ({...prev, fullName: e.target.value}))}
                              className="w-full bg-transparent pl-12 pr-4 py-4 font-black text-sm text-earth-900 outline-none placeholder:text-earth-400 placeholder:font-bold"
                              placeholder="Receiver's Full Name"
                          />
                      </div>
                      <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-900" />
                          <input 
                              id="profile-mobile"
                              name="mobile"
                              autoComplete="tel"
                              value={address.mobile}
                              onChange={(e) => setAddress(prev => ({...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)}))}
                              className="w-full bg-transparent pl-12 pr-4 py-4 font-black text-sm text-earth-900 outline-none placeholder:text-earth-400 placeholder:font-bold"
                              placeholder="10-digit Mobile Number"
                              type="tel"
                          />
                      </div>
                  </div>
              </div>

              {/* Address & Location */}
              <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-earth-900 uppercase tracking-widest opacity-60 ml-1">Address & Location</h4>
                  <div className="grid grid-cols-2 gap-3">
                      <div className="bg-earth-50 rounded-2xl px-5 py-4 border-2 border-earth-100 relative focus-within:border-earth-900 focus-within:bg-white transition-all">
                          <label htmlFor="profile-pincode" className="text-[10px] font-black text-earth-900 uppercase block mb-1">Pincode</label>
                          <input 
                              id="profile-pincode"
                              name="pincode"
                              autoComplete="postal-code"
                              value={address.pincode}
                              onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="w-full bg-transparent font-black text-base text-earth-900 outline-none"
                              placeholder="000000"
                          />
                          {isPincodeLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-earth-900"/>}
                      </div>
                      <div className="bg-earth-50 rounded-2xl px-5 py-4 border-2 border-earth-100 focus-within:border-earth-900 focus-within:bg-white transition-all">
                          <label htmlFor="profile-city" className="text-[10px] font-black text-earth-900 uppercase block mb-1">City</label>
                          <input 
                              id="profile-city"
                              name="city"
                              autoComplete="address-level2"
                              value={address.city}
                              onChange={(e) => setAddress(prev => ({...prev, city: e.target.value}))}
                              className="w-full bg-transparent font-black text-base text-earth-900 outline-none placeholder:text-earth-400"
                              placeholder="City"
                          />
                      </div>
                  </div>
                  
                  <div className="bg-earth-50 p-5 rounded-2xl border-2 border-earth-100 space-y-5 focus-within:bg-white transition-all">
                      <input 
                          id="profile-line1"
                          name="line1"
                          autoComplete="address-line1"
                          value={address.line1}
                          onChange={(e) => setAddress(prev => ({...prev, line1: e.target.value}))}
                          className="w-full bg-transparent border-b-2 border-earth-100 pb-3 font-black text-sm text-earth-900 outline-none focus:border-earth-900"
                          placeholder="Flat, House no., Building, Apartment"
                      />
                      <input 
                          id="profile-line2"
                          name="line2"
                          autoComplete="address-line2"
                          value={address.line2}
                          onChange={(e) => setAddress(prev => ({...prev, line2: e.target.value}))}
                          className="w-full bg-transparent border-b-2 border-earth-100 pb-3 font-black text-sm text-earth-900 outline-none focus:border-earth-900"
                          placeholder="Area, Street, Sector, Village"
                      />
                      <div className="grid grid-cols-2 gap-4">
                          <input 
                              id="profile-landmark"
                              name="landmark"
                              value={address.landmark}
                              onChange={(e) => setAddress(prev => ({...prev, landmark: e.target.value}))}
                              className="w-full bg-transparent font-black text-sm text-earth-900 outline-none placeholder:text-earth-400"
                              placeholder="Landmark (Optional)"
                          />
                          <input 
                              id="profile-state"
                              name="state"
                              autoComplete="address-level1"
                              value={address.state}
                              onChange={(e) => setAddress(prev => ({...prev, state: e.target.value}))}
                              className="w-full bg-transparent font-black text-sm text-earth-900 outline-none text-right placeholder:text-earth-400"
                              placeholder="State"
                          />
                      </div>
                  </div>
              </div>

              {/* Address Label */}
              <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-earth-900 uppercase tracking-widest opacity-60 ml-1">Label Address As</h4>
                  <div className="bg-earth-50 p-1.5 rounded-2xl flex gap-2 border-2 border-earth-100">
                      {[
                          { id: 'Home', icon: Home }, 
                          { id: 'Work', icon: Briefcase }, 
                          { id: 'Other', icon: MapPin }
                      ].map((t) => (
                          <button
                              key={t.id}
                              onClick={() => setAddress(prev => ({...prev, type: t.id as 'Home' | 'Work' | 'Other'}))}
                              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                                  address.type === t.id 
                                  ? 'bg-earth-900 text-white shadow-xl scale-100' 
                                  : 'text-earth-600 hover:text-earth-900'
                              }`}
                          >
                              <t.icon className="w-4 h-4" /> {t.id}
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {error && (
            <div className="mt-4 bg-pop-rose/10 border-2 border-pop-rose/20 p-4 rounded-2xl flex gap-3 items-start animate-bounce-in">
                <AlertTriangle className="w-5 h-5 text-pop-rose shrink-0" />
                <p className="text-xs font-black text-pop-rose">{error}</p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-8 bg-white border-t border-earth-100 flex flex-col gap-3">
            <Button onClick={handleSave} className="w-full py-4 text-lg bg-earth-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-2xl" disabled={isLoading}>
                {isLoading ? (
                    <span className="flex items-center gap-2">Saving... <Loader2 className="w-5 h-5 animate-spin"/></span>
                ) : (
                    <span className="flex items-center gap-2 font-black">Update Address <Save className="w-5 h-5 ml-1" /></span>
                )}
            </Button>
            <p className="text-[10px] text-center font-black text-earth-400 uppercase tracking-widest">Updates are synced instantly</p>
        </div>
      </div>
    </div>
  );
};

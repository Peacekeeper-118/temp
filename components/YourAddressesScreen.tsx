import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Edit2, Trash2, Phone, MapPin, Home, Briefcase, Globe } from 'lucide-react';

// --- Types & Interfaces ---
// Defining these locally to ensure the code runs immediately. 
// You can move these to your ../types file later.

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  line1: string;
  line2?: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface User {
  addresses?: Address[];
}

interface YourAddressesScreenProps {
  user: User;
  onBack: () => void;
  onUpdateAddresses: (addresses: Address[]) => void;
}

// --- Constants ---

const MOCK_PINCODES: Record<string, { city: string; state: string }> = {
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bangalore', state: 'Karnataka' },
  '110001': { city: 'Delhi', state: 'Delhi' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
};

const INITIAL_FORM: Omit<Address, 'id'> = {
  fullName: '', mobile: '', line1: '', line2: '',
  landmark: '', pincode: '', city: '', state: '',
  type: 'Home', isDefault: false
};

const generateId = () => `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// --- Sub-Components ---

/**
 * Bulletproof Input Component
 * Destructures onChange to ensure it only passes the string value to the parent.
 */
const Input = ({ label, onChange, className = "", ...props }: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-black uppercase tracking-widest text-earth-400 ml-1">
        {label}
      </label>
      <input 
        {...props} 
        onChange={handleChange}
        className={`w-full p-4 font-bold transition-all border outline-none bg-earth-50 border-earth-100 rounded-2xl focus:border-pop-lime focus:ring-4 focus:ring-pop-lime/10 text-earth-900 placeholder:text-earth-300 ${className}`} 
      />
    </div>
  );
};

const AddressCard: React.FC<{ address: Address; onEdit: () => void; onDelete: () => void }> = ({ address, onEdit, onDelete }) => {
  const Icon = address.type === 'Home' ? Home : address.type === 'Work' ? Briefcase : Globe;
  return (
    <div className="relative p-5 transition-all bg-white border shadow-sm group rounded-3xl border-earth-100 hover:border-pop-lime/50">
      {address.isDefault && (
        <span className="absolute top-4 right-4 bg-pop-lime/20 text-earth-900 text-[10px] font-black px-2 py-0.5 rounded-full">DEFAULT</span>
      )}
      <div className="flex gap-4">
        <div className="flex items-center justify-center w-12 h-12 border rounded-2xl bg-earth-50 border-earth-100 flex-shrink-0">
          <Icon className="w-6 h-6 text-earth-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-earth-900 truncate">{address.fullName}</h3>
          <p className="text-[10px] font-black tracking-widest uppercase text-earth-400">{address.type}</p>
          <div className="pt-2 text-sm text-earth-600 leading-snug">
            <p className="line-clamp-1">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
            <p>{address.city}, {address.state} - {address.pincode}</p>
          </div>
          <div className="flex items-center gap-2 pt-2 font-bold text-earth-900">
            <Phone className="w-3.5 h-3.5 text-earth-400" />
            <span className="text-sm">{address.mobile}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={onEdit} className="p-2 rounded-xl bg-earth-50 text-earth-600 hover:bg-pop-lime hover:text-earth-900 transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-2 rounded-xl bg-earth-50 text-pop-orange hover:bg-pop-orange hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

// --- Main Application Screen ---

export const YourAddressesScreen: React.FC<YourAddressesScreenProps> = ({ user, onBack, onUpdateAddresses }) => {
  const [addresses, setAddresses] = useState<Address[]>(user.addresses || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>(INITIAL_FORM);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string | null }>({
    isOpen: false, id: null, name: null
  });

  const maxReached = addresses.length >= 5;

  useEffect(() => {
    if (user.addresses) setAddresses(user.addresses);
  }, [user.addresses]);

  const handleOpenForm = (address?: Address) => {
    if (address) {
      setEditingId(address.id);
      setFormData({ ...address });
    } else {
      setEditingId(null);
      setFormData({ ...INITIAL_FORM, isDefault: addresses.length === 0 });
    }
    setIsFormOpen(true);
  };

  const handlePincodeChange = (val: string) => {
    // val is guaranteed to be a string due to our Input component logic
    const cleanPincode = val.replace(/\D/g, '').slice(0, 6);
    const lookup = MOCK_PINCODES[cleanPincode];
    setFormData(prev => ({
      ...prev,
      pincode: cleanPincode,
      city: lookup?.city || prev.city,
      state: lookup?.state || prev.state
    }));
  };

  const saveAddress = () => {
    if (!formData.fullName || formData.mobile.length !== 10 || !formData.pincode || !formData.line1) {
      alert("Please check your details. Mobile must be 10 digits and Pincode 6 digits.");
      return;
    }

    let updatedList: Address[];
    const entryToSave: Address = { ...formData, id: editingId || generateId() };

    if (editingId) {
      updatedList = addresses.map(a => a.id === editingId ? entryToSave : a);
    } else {
      updatedList = [...addresses, entryToSave];
    }

    if (entryToSave.isDefault) {
      updatedList = updatedList.map(a => a.id === entryToSave.id ? a : { ...a, isDefault: false });
    }

    setAddresses(updatedList);
    onUpdateAddresses(updatedList);
    setIsFormOpen(false);
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-earth-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 transition-transform rounded-full bg-earth-50 hover:scale-110">
            <ChevronLeft className="w-6 h-6 text-earth-900" />
          </button>
          <h1 className="text-2xl font-black tracking-tight text-earth-900">Your Addresses</h1>
        </div>
        {!maxReached && !isFormOpen && (
          <button onClick={() => handleOpenForm()} className="flex items-center justify-center w-10 h-10 font-bold transition-all shadow-lg rounded-xl bg-pop-lime text-earth-900 hover:rotate-90">
            <Plus className="w-6 h-6" />
          </button>
        )}
      </header>

      <main className="p-6 space-y-6">
        {isFormOpen ? (
          <div className="p-6 bg-white border-2 border-pop-lime/10 rounded-[2.5rem] shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <h2 className="mb-6 text-xl font-black text-earth-900">{editingId ? 'Update' : 'Add New'} Address</h2>
            <div className="grid gap-5">
              <Input label="Full Name" value={formData.fullName} onChange={(val: string) => setFormData({...formData, fullName: val})} placeholder="Receiver's Name" />
              
              <Input 
                label="Mobile Number" 
                value={formData.mobile} 
                onChange={(val: string) => {
                  const clean = val.replace(/\D/g, '').slice(0, 10);
                  setFormData({...formData, mobile: clean});
                }} 
                placeholder="10-digit number" 
                maxLength={10} 
              />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-earth-400">Address Type</label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((t: any) => (
                    <button key={t} type="button" onClick={() => setFormData({...formData, type: t})} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${formData.type === t ? 'bg-pop-lime text-earth-900' : 'bg-earth-50 text-earth-400 border border-earth-100'}`}>{t}</button>
                  ))}
                </div>
              </div>

              <Input label="Pincode" value={formData.pincode} onChange={handlePincodeChange} placeholder="6-digit PIN" maxLength={6} />
              <Input label="Address Line" value={formData.line1} onChange={(val: string) => setFormData({...formData, line1: val})} placeholder="House No, Street Name" />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={formData.city} readOnly className="bg-earth-100 opacity-70 cursor-not-allowed" />
                <Input label="State" value={formData.state} readOnly className="bg-earth-100 opacity-70 cursor-not-allowed" />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-5 h-5 accent-pop-lime rounded cursor-pointer" id="def-check" />
                <label htmlFor="def-check" className="text-sm font-bold text-earth-700 cursor-pointer">Set as default address</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-4 font-bold rounded-2xl bg-earth-50 text-earth-600">Cancel</button>
                <button type="button" onClick={saveAddress} className="flex-1 py-4 font-bold rounded-2xl bg-pop-lime text-earth-900 shadow-lg shadow-pop-lime/20">Save Address</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {addresses.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed rounded-[3rem] border-earth-200 bg-white/50">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-earth-200" />
                <h3 className="text-lg font-bold text-earth-900">No addresses yet</h3>
                <p className="mb-6 text-sm text-earth-400">Add an address to start ordering.</p>
                <button onClick={() => handleOpenForm()} className="px-8 py-3 font-bold transition-all shadow-md rounded-2xl bg-pop-lime text-earth-900 hover:scale-105">Add New Address</button>
              </div>
            ) : (
              <div className="grid gap-4">
                {addresses.map(addr => (
                  <AddressCard 
                    key={addr.id} 
                    address={addr} 
                    onEdit={() => handleOpenForm(addr)} 
                    onDelete={() => setDeleteDialog({ isOpen: true, id: addr.id, name: addr.fullName })}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-earth-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm p-8 bg-white shadow-2xl rounded-[2.5rem] animate-in zoom-in-95">
            <h3 className="mb-2 text-2xl font-black text-earth-900">Delete Address?</h3>
            <p className="mb-8 text-sm text-earth-500">Are you sure you want to remove the address for <span className="font-bold text-earth-900">{deleteDialog.name}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteDialog({ isOpen: false, id: null, name: null })} className="flex-1 py-4 font-bold rounded-2xl bg-earth-50 text-earth-600">Cancel</button>
              <button 
                onClick={() => {
                  const updated = addresses.filter(a => a.id !== deleteDialog.id);
                  setAddresses(updated);
                  onUpdateAddresses(updated);
                  setDeleteDialog({ isOpen: false, id: null, name: null });
                }} 
                className="flex-1 py-4 font-bold text-white rounded-2xl bg-pop-orange shadow-lg shadow-pop-orange/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
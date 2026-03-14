
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { ArrowRight, Droplets, Truck, Users, CheckCircle2, AlertCircle, MapPin, Briefcase, Home, Loader2, User, Phone, Map, ShieldCheck } from 'lucide-react'; 
import { NeoSparkles, NeoCamera } from './NeoIcons';
import { Address } from '../types';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

// Mock taken usernames for demo
const TAKEN_USERNAMES = ['admin', 'revendre', 'test', 'user', 'support', 'thrift_king'];

// Mock Pincode Data
const MOCK_PINCODES: Record<string, { city: string, state: string }> = {
    '40': { city: 'Mumbai', state: 'Maharashtra' },
    '11': { city: 'New Delhi', state: 'Delhi' },
    '56': { city: 'Bengaluru', state: 'Karnataka' },
    '60': { city: 'Chennai', state: 'Tamil Nadu' },
    '70': { city: 'Kolkata', state: 'West Bengal' },
    '50': { city: 'Hyderabad', state: 'Telangana' },
    '38': { city: 'Ahmedabad', state: 'Gujarat' },
    '30': { city: 'Jaipur', state: 'Rajasthan' },
    '41': { city: 'Pune', state: 'Maharashtra' }, 
    '20': { city: 'Noida', state: 'Uttar Pradesh' }, 
};

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  
  // Setup Steps: 0 = Intro Slides, 1 = Profile Basics, 2 = Address
  const [setupStep, setSetupStep] = useState(0);

  // Profile State
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<string>(''); 
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  //Adress is connected to firebase automatically so no speacific function is needed to save it. 
  // Address State
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    line1: '',
    line2: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    type: 'Home' as 'Home' | 'Work' | 'Other'
  });
  
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  // Set default avatar based on username if not set
  useEffect(() => {
    if (!avatarFile) {
        const seed = username || 'User';
        setAvatarUrl(`https://ui-avatars.com/api/?background=E7E5E4&color=1C1917&name=${seed}&size=200&bold=true`);
    }
  }, [username, avatarFile]);

  // Revoke blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const slides = [
    {
      id: 1,
      title: "The Revendre\nCommunity",
      desc: "Welcome to the fam! We are India's #1 social thrift marketplace. Buy, sell, and discover pre-loved fashion.",
      color: "bg-pop-yellow",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600",
      icon: <NeoSparkles className="w-10 h-10" />
    },
    {
      id: 2,
      title: "The Green\nRevolution",
      desc: "Every reused outfit saves water, energy, and reduces textile waste. Support a greener future.",
      color: "bg-pop-lime",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
      icon: <Droplets className="w-10 h-10 text-earth-900" strokeWidth={2.5} />
    },
    {
      id: 3,
      title: "Creating\nLivelihoods",
      desc: "Revendre helps create jobs and steady income for small local businesses and delivery partners.",
      color: "bg-pop-cyan",
      image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=600",
      icon: <div className="flex gap-1.5"><Users className="w-6 h-6 text-earth-900"/><Truck className="w-6 h-6 text-earth-900"/></div>
    }
  ];

  const handleNextSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setSetupStep(1); 
    }
  };

  const handleSkip = () => {
    setSetupStep(1); 
  };

  const handleUsernameChange = (val: string) => {
    const cleanVal = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleanVal);
    
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);

    if (cleanVal.length < 3) {
      setUsernameStatus(cleanVal.length === 0 ? 'idle' : 'invalid');
      setSuggestions([]);
      return;
    }

    setUsernameStatus('checking');
    
    checkTimeoutRef.current = setTimeout(() => {
      if (TAKEN_USERNAMES.includes(cleanVal)) {
        setUsernameStatus('taken');
        setSuggestions([
            `${cleanVal}_thrifter`,
            `real_${cleanVal}`,
            `${cleanVal}${Math.floor(Math.random() * 99)}`
        ]);
      } else {
        setUsernameStatus('available');
        setSuggestions([]);
      }
    }, 200); 
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = () => {
    if (usernameStatus !== 'available' || !gender) return;
    setSetupStep(2); 
  };

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
          }, 300); 
      }
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleFinalSubmit = () => {
    if (!address.fullName || address.mobile.length !== 10 || !address.line1 || address.pincode.length !== 6 || !address.city) return;

    const finalAddress: Address = {
        id: `addr-${Date.now()}`,
        ...address,
        isDefault: true
    };

    const userData = {
        username,
        gender,
        displayName: address.fullName || username,
        avatarUrl, 
        addresses: [finalAddress],
        city: address.city
    };

    onComplete(userData);
  };

  const handleSkipAddress = () => {
    const userData = {
        username,
        gender,
        displayName: username,
        avatarUrl, 
        addresses: [],
        city: ''
    };
    onComplete(userData);
  };

  if (setupStep === 1) {
      return (
          <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 animate-fade-in-up">
              <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-8 border border-earth-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pop-yellow/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                      <div className="text-center mb-8">
                          <h2 className="font-display font-black text-3xl text-earth-900 mb-2">Create Profile ✨</h2>
                          <p className="text-earth-600 text-sm font-bold">Let's get you set up.</p>
                      </div>

                      <div className="flex flex-col items-center mb-8">
                          <div className="relative group cursor-pointer">
                              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-earth-100 relative z-10">
                                  <img src={avatarUrl} className="w-full h-full object-cover" alt="Profile" decoding="async" />
                              </div>
                              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                                  <NeoCamera className="w-8 h-8 text-white" />
                                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                              </label>
                              <div className="absolute bottom-1 right-1 bg-earth-900 p-2.5 rounded-full border-4 border-white shadow-md pointer-events-none z-30">
                                  <NeoCamera className="w-4 h-4 text-white" />
                              </div>
                          </div>
                          <p className="text-[10px] text-earth-600 font-black uppercase tracking-wide mt-3">Upload Picture (Optional)</p>
                      </div>

                      <div className="space-y-6 mb-8">
                          <div>
                              <label htmlFor="onboarding-username" className="block text-xs font-black text-earth-900 uppercase tracking-wide mb-1 ml-1">Username <span className="text-pop-rose">*</span></label>
                              <div className={`relative flex items-center bg-earth-50 border-2 rounded-2xl transition-all ${
                                  usernameStatus === 'taken' ? 'border-pop-rose' : 
                                  usernameStatus === 'available' ? 'border-pop-lime' : 
                                  'border-transparent focus-within:border-earth-900 focus-within:bg-white'
                              }`}>
                                  <span className="pl-4 text-earth-500 font-bold text-lg">@</span>
                                  <input 
                                      id="onboarding-username"
                                      name="username"
                                      autoComplete="username"
                                      value={username}
                                      onChange={(e) => handleUsernameChange(e.target.value)}
                                      className="w-full bg-transparent py-4 pl-1 pr-12 font-black text-lg text-earth-900 outline-none placeholder:text-earth-400"
                                      placeholder="thrift_king"
                                      autoFocus
                                  />
                                  <div className="absolute right-4">
                                      {usernameStatus === 'checking' && <Loader2 className="w-5 h-5 text-earth-600 animate-spin" />}
                                      {usernameStatus === 'available' && <CheckCircle2 className="w-6 h-6 text-pop-lime fill-earth-50" />}
                                      {usernameStatus === 'taken' && <AlertCircle className="w-6 h-6 text-pop-rose fill-earth-50" />}
                                  </div>
                              </div>
                              
                              {usernameStatus === 'taken' && (
                                  <div className="mt-3 animate-slide-up bg-pop-rose/5 p-3 rounded-xl border border-pop-rose/10">
                                      <p className="text-xs text-pop-rose font-black mb-2">Username taken. Try these:</p>
                                      <div className="flex flex-wrap gap-2">
                                          {suggestions.map(s => (
                                              <button 
                                                key={s} 
                                                onClick={() => handleUsernameChange(s)}
                                                className="text-[10px] bg-white border border-pop-rose/20 px-3 py-1.5 rounded-lg font-black text-pop-rose hover:bg-pop-rose hover:text-white transition-colors shadow-sm"
                                              >
                                                  @{s}
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                              )}
                          </div>

                          <div>
                              <label className="block text-xs font-black text-earth-900 uppercase tracking-wide mb-2 ml-1">Gender <span className="text-pop-rose">*</span></label>
                              <div className="grid grid-cols-2 gap-3">
                                  {['Men', 'Women', 'Non-binary', 'Not interested'].map((opt) => (
                                      <button
                                          key={opt}
                                          onClick={() => setGender(opt)}
                                          className={`py-3.5 px-4 rounded-2xl text-sm font-black transition-all border-2 flex items-center justify-center ${
                                              gender === opt 
                                              ? 'bg-earth-900 text-white border-earth-900 shadow-lg scale-[1.02]' 
                                              : 'bg-white text-earth-600 border-earth-100 hover:border-earth-300 active:scale-95'
                                          }`}
                                      >
                                          {opt}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>

                      <Button 
                        onClick={handleProfileSubmit} 
                        className="w-full py-3 text-base shadow-lg"
                        disabled={usernameStatus !== 'available' || !gender}
                      >
                          Next: Address <ArrowRight className="w-5 h-5 ml-2"/>
                      </Button>
                  </div>
              </div>
          </div>
      );
  }

  if (setupStep === 2) {
      return (
          <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 overflow-y-auto animate-slide-in-right">
              <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-8 border border-earth-100 relative overflow-hidden flex flex-col max-h-[90vh]">
                  
                  <div className="relative z-10 flex flex-col flex-1 min-h-0">
                      <div className="mb-6 shrink-0">
                          <h2 className="font-display font-black text-3xl text-earth-900 mb-1">Shipping Details 📦</h2>
                          <p className="text-earth-800 text-sm font-bold mb-3">Where should we send your finds?</p>
                          
                          <div className="inline-flex items-center gap-1.5 bg-earth-50 border border-earth-100 px-2 py-1.5 rounded-lg">
                              <ShieldCheck className="w-3 h-3 text-earth-900" />
                              <span className="text-[10px] font-black text-earth-900 uppercase tracking-wide">Used only for pickups & deliveries</span>
                          </div>
                      </div>

                      <div className="space-y-6 overflow-y-auto pr-2 pb-4 flex-1 no-scrollbar">
                          
                          <div className="space-y-3">
                              <h4 className="text-xs font-black text-earth-900 uppercase tracking-widest mb-2 flex items-center gap-2"><User className="w-3 h-3"/> Contact</h4>
                              <div className="bg-earth-50 p-1 rounded-2xl border border-earth-100">
                                  <div className="relative border-b border-earth-100">
                                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-900" />
                                      <input 
                                          id="onboarding-fullname"
                                          name="fullName"
                                          autoComplete="name"
                                          value={address.fullName}
                                          onChange={(e) => handleAddressChange('fullName', e.target.value)}
                                          className="w-full bg-transparent pl-12 pr-4 py-4 font-black text-sm text-earth-900 outline-none placeholder:text-earth-500 placeholder:font-bold"
                                          placeholder="Full Name"
                                      />
                                  </div>
                                  <div className="relative">
                                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-900" />
                                      <input 
                                          id="onboarding-mobile"
                                          name="mobile"
                                          autoComplete="tel"
                                          value={address.mobile}
                                          onChange={(e) => handleAddressChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                          className="w-full bg-transparent pl-12 pr-4 py-4 font-black text-sm text-earth-900 outline-none placeholder:text-earth-500 placeholder:font-bold"
                                          placeholder="Mobile Number"
                                          type="tel"
                                          maxLength={10}
                                      />
                                      {address.mobile.length === 10 && (
                                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pop-lime" />
                                      )}
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-3">
                              <h4 className="text-xs font-black text-earth-900 uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin className="w-3 h-3"/> Location</h4>
                              
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-earth-50 rounded-2xl px-4 py-3 border border-earth-100 relative">
                                      <label htmlFor="onboarding-pincode" className="text-[10px] font-black text-earth-900 uppercase tracking-wide block mb-1">Pincode</label>
                                      <input 
                                          id="onboarding-pincode"
                                          name="pincode"
                                          autoComplete="postal-code"
                                          value={address.pincode}
                                          onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                          className="w-full bg-transparent font-black text-earth-900 outline-none placeholder:text-earth-500"
                                          placeholder="000000"
                                          type="tel"
                                          maxLength={6}
                                      />
                                      {isPincodeLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-earth-900"/>}
                                  </div>
                                  <div className="bg-earth-50 rounded-2xl px-4 py-3 border border-earth-100">
                                      <label htmlFor="onboarding-city" className="text-[10px] font-black text-earth-900 uppercase tracking-wide block mb-1">City</label>
                                      <input 
                                          id="onboarding-city"
                                          name="city"
                                          autoComplete="address-level2"
                                          value={address.city}
                                          onChange={(e) => handleAddressChange('city', e.target.value)}
                                          className="w-full bg-transparent font-black text-earth-900 outline-none placeholder:text-earth-500"
                                          placeholder="City"
                                      />
                                  </div>
                              </div>

                              <div className="bg-earth-50 p-4 rounded-2xl border border-earth-100 space-y-4">
                                  <input 
                                      id="onboarding-line1"
                                      name="line1"
                                      autoComplete="address-line1"
                                      value={address.line1}
                                      onChange={(e) => handleAddressChange('line1', e.target.value)}
                                      className="w-full bg-transparent border-b border-earth-300 pb-2 font-black text-sm text-earth-900 outline-none placeholder:text-earth-500 focus:border-earth-600 transition-colors"
                                      placeholder="Flat, House no., Building, Apartment"
                                  />
                                  <input 
                                      id="onboarding-line2"
                                      name="line2"
                                      autoComplete="address-line2"
                                      value={address.line2}
                                      onChange={(e) => handleAddressChange('line2', e.target.value)}
                                      className="w-full bg-transparent border-b border-earth-300 pb-2 font-black text-sm text-earth-900 outline-none placeholder:text-earth-500 focus:border-earth-600 transition-colors"
                                      placeholder="Area, Street, Sector, Village"
                                  />
                                  <div className="grid grid-cols-2 gap-4">
                                      <input 
                                          id="onboarding-landmark"
                                          name="landmark"
                                          value={address.landmark}
                                          onChange={(e) => handleAddressChange('landmark', e.target.value)}
                                          className="w-full bg-transparent font-black text-sm text-earth-900 outline-none placeholder:text-earth-500"
                                          placeholder="Landmark"
                                      />
                                      <input 
                                          id="onboarding-state"
                                          name="state"
                                          autoComplete="address-level1"
                                          value={address.state}
                                          onChange={(e) => handleAddressChange('state', e.target.value)}
                                          className="w-full bg-transparent font-black text-sm text-earth-900 outline-none placeholder:text-earth-500 text-right"
                                          placeholder="State"
                                      />
                                  </div>
                              </div>
                          </div>

                          <div>
                              <h4 className="text-xs font-black text-earth-900 uppercase tracking-widest mb-2 flex items-center gap-2"><Map className="w-3 h-3"/> Save As</h4>
                              <div className="bg-earth-50 p-1 rounded-xl flex gap-1">
                                  {[
                                      { id: 'Home', icon: Home }, 
                                      { id: 'Work', icon: Briefcase }, 
                                      { id: 'Other', icon: MapPin }
                                  ].map((t) => (
                                      <button
                                          key={t.id}
                                          onClick={() => handleAddressChange('type', t.id as 'Home' | 'Work' | 'Other')}
                                          className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                                              address.type === t.id 
                                              ? 'bg-earth-900 text-white shadow-sm border border-earth-900' 
                                              : 'text-earth-600 hover:text-earth-900'
                                          }`}
                                      >
                                          <t.icon className="w-3.5 h-3.5" /> {t.id}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-earth-100 shrink-0 flex flex-col gap-3">
                           <Button 
                              onClick={handleFinalSubmit} 
                              className="w-full py-3 text-base shadow-lg"
                              disabled={!address.fullName || address.mobile.length < 10 || !address.line1 || address.pincode.length < 6 || !address.city}
                            >
                              Complete Setup <CheckCircle2 className="w-5 h-5 ml-2"/>
                           </Button>
                           <button 
                              onClick={handleSkipAddress}
                              className="text-xs font-black text-earth-600 uppercase tracking-wide hover:text-earth-900 transition-colors py-2"
                           >
                              Skip for now
                           </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  const currentSlide = slides[slideIndex];

  return (
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 relative">
          <button 
            onClick={handleSkip} 
            className="absolute top-6 right-6 text-earth-600 text-sm font-black uppercase tracking-wide hover:text-earth-900 z-50 px-4 py-2"
          >
            Skip Intro
          </button>

          <div className="w-full max-w-sm flex flex-col h-[85vh]">
              <div className={`flex-1 rounded-[3rem] ${currentSlide.color} mb-8 overflow-hidden shadow-2xl relative group animate-pop`} key={slideIndex}>
                  <img 
                    src={currentSlide.image} 
                    className="w-full h-full object-cover mix-blend-multiply opacity-80 transition-transform duration-700 group-hover:scale-110" 
                    alt="Slide visual"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-6 right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce-in overflow-hidden">
                      {currentSlide.icon}
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                      <h2 className="text-white font-display font-black text-4xl leading-[0.9] drop-shadow-md whitespace-pre-line mb-2 animate-slide-up">
                        {currentSlide.title}
                      </h2>
                  </div>
              </div>

              <div className="mb-6 px-2 animate-slide-up" key={`text-${slideIndex}`}>
                  <p className="text-earth-700 font-bold text-lg leading-relaxed">
                      {currentSlide.desc}
                  </p>
              </div>

              <div className="mt-auto">
                  <div className="flex gap-2 mb-6 justify-center">
                      {slides.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`h-2 rounded-full transition-all duration-300 ${idx === slideIndex ? `w-8 bg-earth-900` : 'w-2 bg-earth-300'}`}
                          />
                      ))}
                  </div>

                  <Button onClick={handleNextSlide} className="w-full py-3 text-base shadow-lg hover:translate-y-[-2px] transition-transform">
                      {slideIndex === slides.length - 1 ? 'Start Setup' : 'Next'} <ArrowRight className="w-5 h-5 ml-2"/>
                  </Button>
              </div>
          </div>
      </div>
  );
};

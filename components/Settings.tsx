
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  Save, 
  Loader2, 
  AlertTriangle, 
  User as UserIcon, 
  Phone, 
  Home, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  Search,
  ChevronRight,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Headphones,
  Info,
  UserX,
  ShieldAlert,
  Flag,
  MessageSquare,
  X,
  Activity,
  History,
  Fingerprint,
  UserCheck,
  Sparkles,
  ShoppingCart,
  DollarSign,
  Truck,
  Package,
  FileText,
  ScrollText
} from 'lucide-react';
import { Button } from './Button';

interface SettingsProps {
  currentUser: User;
  onUpdateUser: (updatedData: Partial<User>) => Promise<void>;
  onBack: () => void;
  initialView?: SettingsView;
}

// Mock Pincode Data
const MOCK_PINCODES: Record<string, { city: string, state: string }> = {
    '40': { city: 'Mumbai', state: 'Maharashtra' },
    '11': { city: 'New Delhi', state: 'Delhi' },
    '56': { city: 'Bengaluru', state: 'Karnataka' },
    '60': { city: 'Chennai', state: 'Tamil Nadu' },
    '70': { city: 'Kolkata', state: 'West Bengal' },
};

type SettingsView = 'menu' | 'account' | 'notifications' | 'appearance' | 'privacy' | 'help' | 'about' | 'refresh-hub' | 'buying' | 'selling' | 'shipping' | 'legal' | 'privacy-policy' | 'terms-conditions';

// --- Sub-Components ---

const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
  <button 
    onClick={onToggle}
    className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-black' : 'bg-gray-200'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
  </button>
);

const MenuView = ({ onBack, onNavigate, searchQuery, onSearchChange }: { 
  onBack: () => void, 
  onNavigate: (view: SettingsView) => void,
  searchQuery: string,
  onSearchChange: (val: string) => void
}) => {
  const menuItems = [
    { id: 'account', label: 'Account', icon: UserIcon, view: 'account' as SettingsView },
    { id: 'notifications', label: 'Notifications', icon: Bell, view: 'notifications' as SettingsView },
    { id: 'appearance', label: 'Appearance', icon: Eye, view: 'appearance' as SettingsView },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock, view: 'privacy' as SettingsView },
    { id: 'help', label: 'Help and Support', icon: Headphones, view: 'help' as SettingsView },
    { id: 'about', label: 'About', icon: Info, view: 'about' as SettingsView },
  ];

  const filteredItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="px-6 py-8 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Settings</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6 pt-6">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-300" />
          <input 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#F5F5F5] pl-12 pr-4 py-4 rounded-2xl font-bold text-earth-900 focus:outline-none transition-all placeholder:text-earth-300 placeholder:font-medium" 
            placeholder="Search for a setting..." 
          />
        </div>

        <div className="space-y-0">
          {filteredItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.view)}
              className="w-full py-5 flex items-center justify-between group active:bg-earth-50 transition-colors border-b border-earth-50 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="p-1">
                  <item.icon className="w-6 h-6 text-earth-900" strokeWidth={2} />
                </div>
                <span className="font-bold text-[17px] text-earth-900">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-earth-900 opacity-60 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AccountView = ({ currentUser, onUpdateUser, onBackToMenu }: { 
  currentUser: User, 
  onUpdateUser: (data: Partial<User>) => Promise<void>,
  onBackToMenu: () => void 
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'personal'>('account');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button onClick={onBackToMenu} className="mb-6 hover:bg-earth-50 p-2 -ml-2 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="text-3xl font-display font-black text-earth-900">Account information</h1>
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-6 border-b border-earth-100 mb-8">
        <button 
          onClick={() => setActiveTab('account')}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'account' ? 'text-earth-900' : 'text-earth-400'}`}
        >
          Account data
          {activeTab === 'account' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-earth-900" />}
        </button>
        <button 
          onClick={() => setActiveTab('personal')}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'personal' ? 'text-earth-900' : 'text-earth-400'}`}
        >
          Personal data
          {activeTab === 'personal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-earth-900" />}
        </button>
      </div>

      {/* Content */}
      <div className="px-6 flex-1">
        {activeTab === 'account' ? (
          <div className="space-y-6">
            <div className="border-b border-earth-100 pb-2">
              <label className="text-xs text-earth-400 font-medium block mb-1">Email address</label>
              <input 
                type="email" 
                defaultValue={currentUser.email || 'm.grygierczyk99@gmail.com'} 
                className="w-full text-base font-medium text-earth-900 outline-none bg-transparent"
              />
            </div>
            <div className="border-b border-earth-100 pb-2 relative">
              <label className="text-xs text-earth-400 font-medium block mb-1">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                defaultValue="************" 
                className="w-full text-base font-medium text-earth-900 outline-none bg-transparent pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-0 bottom-2 text-earth-400 hover:text-earth-900 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="pt-8 space-y-4">
              <h3 className="font-bold text-earth-900">Delete account</h3>
              <p className="text-sm text-earth-500 font-medium leading-tight pr-4">
                Your account will be permanently removed from the application. All your data will be lost.
              </p>
              <button className="w-full py-4 mt-2 bg-red-50 text-red-500 font-bold rounded-2xl active:scale-[0.98] transition-all">
                Delete account
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-earth-100 pb-2">
              <label className="text-xs text-earth-400 font-medium block mb-1">First name</label>
              <input 
                type="text" 
                defaultValue={(currentUser.displayName || '').split(' ')[0] || ''} 
                className="w-full text-base font-medium text-earth-900 outline-none bg-transparent"
                placeholder="Enter first name"
              />
            </div>
            <div className="border-b border-earth-100 pb-2">
              <label className="text-xs text-earth-400 font-medium block mb-1">Last name</label>
              <input 
                type="text" 
                defaultValue={(currentUser.displayName || '').split(' ').slice(1).join(' ') || ''} 
                className="w-full text-base font-medium text-earth-900 outline-none bg-transparent"
                placeholder="Enter last name"
              />
            </div>
            <div className="border-b border-earth-100 pb-2">
              <label className="text-xs text-earth-400 font-medium block mb-1">Phone number</label>
              <input 
                type="tel" 
                defaultValue={currentUser.addresses?.[0]?.mobile || ''} 
                className="w-full text-base font-medium text-earth-900 outline-none bg-transparent"
                placeholder="Enter phone number"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save Button */}
      <div className="px-6 py-8 mt-auto pb-12">
        <button className="w-full py-4 bg-black text-white font-bold rounded-full active:scale-[0.98] transition-all shadow-lg">
          Save
        </button>
      </div>
    </div>
  );
};

const NotificationsView = ({ onBack }: { onBack: () => void }) => {
  const [toggles, setToggles] = useState({
    systemPush: true,
    systemEmail: false,
    systemSms: false,
    marketingPush: true,
    marketingEmail: false,
    marketingSms: false,
  });

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="px-6 pt-12 pb-6">
        <button onClick={onBack} className="mb-6 hover:bg-earth-50 p-2 -ml-2 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="text-3xl font-display font-black text-earth-900">Notifications</h1>
      </div>

      <div className="px-6 space-y-10">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-earth-900">System notifications</h3>
            <p className="text-sm text-earth-400 font-medium leading-tight mt-1">
              Receive notifications about latest news & system updates from us.
            </p>
          </div>
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between py-2 border-b border-earth-50">
              <span className="font-bold text-earth-900">Push</span>
              <Toggle active={toggles.systemPush} onToggle={() => setToggles(t => ({...t, systemPush: !t.systemPush}))} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-earth-50">
              <span className="font-bold text-earth-900">Email</span>
              <Toggle active={toggles.systemEmail} onToggle={() => setToggles(t => ({...t, systemEmail: !t.systemEmail}))} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-earth-50">
              <span className="font-bold text-earth-900">SMS</span>
              <Toggle active={toggles.systemSms} onToggle={() => setToggles(t => ({...t, systemSms: !t.systemSms}))} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-earth-900">Marketing notifications</h3>
            <p className="text-sm text-earth-400 font-medium leading-tight mt-1">
              Receive notifications with personalized offers and information about promotions.
            </p>
          </div>
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between py-2 border-b border-earth-50">
              <span className="font-bold text-earth-900">Push</span>
              <Toggle active={toggles.marketingPush} onToggle={() => setToggles(t => ({...t, marketingPush: !t.marketingPush}))} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-earth-50">
              <span className="font-bold text-earth-900">Email</span>
              <Toggle active={toggles.marketingEmail} onToggle={() => setToggles(t => ({...t, marketingEmail: !t.marketingEmail}))} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-earth-50">
              <span className="font-bold text-earth-900">SMS</span>
              <Toggle active={toggles.marketingSms} onToggle={() => setToggles(t => ({...t, marketingSms: !t.marketingSms}))} />
            </div>
          </div>
        </div>
        <div className="pt-2">
          <h3 className="text-lg font-bold text-earth-900">Reminders</h3>
        </div>
      </div>
    </div>
  );
};

const PrivacySecurityView = ({ onBack }: { onBack: () => void }) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [showActivity, setShowActivity] = useState(true);

  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button onClick={onBack} className="mb-6 hover:bg-earth-50 p-2 -ml-2 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="text-3xl font-display font-black text-earth-900">Privacy & Security</h1>
      </div>

      <div className="px-6 space-y-10 pb-12">
        {/* Account Privacy */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Account Privacy</h3>
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Lock className="w-5 h-5 text-earth-900" />
                </div>
                <div>
                  <h4 className="font-bold text-earth-900">Private Account</h4>
                  <p className="text-[11px] text-earth-400 font-medium">Only people you approve can see your posts.</p>
                </div>
              </div>
              <Toggle active={isPrivate} onToggle={() => setIsPrivate(!isPrivate)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Activity className="w-5 h-5 text-earth-900" />
                </div>
                <div>
                  <h4 className="font-bold text-earth-900">Show Activity Status</h4>
                  <p className="text-[11px] text-earth-400 font-medium">Allow accounts you follow to see when you're online.</p>
                </div>
              </div>
              <Toggle active={showActivity} onToggle={() => setShowActivity(!showActivity)} />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Security Settings</h3>
          <div className="space-y-3">
            {[
              { id: '2fa', title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', icon: ShieldCheck, color: 'text-pop-lime' },
              { id: 'login', title: 'Login Activity', desc: 'See where and when you\'ve logged in.', icon: History, color: 'text-pop-cyan' },
              { id: 'security-check', title: 'Security Checkup', desc: 'Review your security settings and recovery info.', icon: Fingerprint, color: 'text-pop-rose' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => console.log(`Navigating to ${item.id}`)}
                className="w-full text-left bg-[#F9F9F9] p-5 rounded-[2rem] flex items-center gap-4 group hover:bg-earth-50 transition-all active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-earth-900 text-sm">{item.title}</h4>
                  <p className="text-[11px] text-earth-400 font-medium leading-tight">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-earth-300 group-hover:text-earth-900 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Interactions */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Interactions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'tags', title: 'Tags & Mentions', icon: UserCheck },
              { id: 'blocked', title: 'Blocked Users', icon: UserX }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => console.log(`Navigating to ${item.id}`)}
                className="bg-[#F9F9F9] p-5 rounded-[2rem] flex flex-col items-center gap-3 hover:bg-earth-50 transition-all group active:scale-[0.95]"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <item.icon className="w-6 h-6 text-earth-900" />
                </div>
                <span className="font-bold text-earth-900 text-xs">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderView = ({ title, onBack }: { title: string, onBack: () => void }) => (
  <div className="min-h-screen bg-white animate-fade-in">
    <div className="px-6 py-8 flex items-center gap-4 border-b border-earth-50">
      <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
        <ArrowLeft className="w-6 h-6 text-earth-900" />
      </button>
      <h1 className="font-display font-black text-2xl text-earth-900">{title}</h1>
    </div>
    <div className="p-12 text-center">
      <div className="w-20 h-20 bg-earth-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Info className="w-10 h-10 text-earth-300" />
      </div>
      <h3 className="font-black text-earth-900 text-xl mb-2">{title} Settings</h3>
      <p className="text-earth-400 font-bold">This section is coming soon.</p>
    </div>
  </div>
);

const HelpSupportView = ({ onBack }: { onBack: () => void }) => {
  const [activeHelpView, setActiveHelpView] = useState<'menu' | 'blocked' | 'report-user' | 'report-product' | 'contact'>('menu');

  const supportItems = [
    {
      id: 'blocked',
      title: 'Blocked Users',
      description: "Manage users you've previously blocked from contacting you or seeing your profile.",
      icon: UserX,
      color: 'text-rose-400',
      bgColor: 'bg-rose-50'
    },
    {
      id: 'report-user',
      title: 'Report a User',
      description: 'Report suspicious activity, harassment, or policy violations by another community member.',
      icon: ShieldAlert,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'report-product',
      title: 'Report a Product',
      description: 'Flag items that are counterfeit, prohibited, or miscategorized in our marketplace.',
      icon: Flag,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'contact',
      title: 'Contact Customer Support',
      description: 'Need more help? Our dedicated support team is available 24/7 to assist you.',
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  if (activeHelpView === 'blocked') {
    return (
      <div className="min-h-screen bg-white animate-fade-in flex flex-col">
        <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
          <button onClick={() => setActiveHelpView('menu')} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-earth-900" />
          </button>
          <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2 text-center">Blocked Users</h1>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 px-6 py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
            <UserX className="w-10 h-10 text-rose-400" />
          </div>
          <h2 className="text-xl font-display font-black text-earth-900">No Blocked Users</h2>
          <p className="text-earth-400 font-medium max-w-[240px]">
            You haven't blocked anyone yet. Blocked users will appear here.
          </p>
        </div>
      </div>
    );
  }

  if (activeHelpView === 'report-user') {
    return (
      <div className="min-h-screen bg-white animate-fade-in flex flex-col">
        <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
          <button onClick={() => setActiveHelpView('menu')} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-earth-900" />
          </button>
          <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2 text-center">Report User</h1>
          <div className="w-10"></div>
        </div>
        <div className="px-6 py-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-earth-900 uppercase tracking-wider">Username or User ID</label>
            <input className="w-full bg-[#F5F5F5] px-6 py-4 rounded-2xl font-bold text-earth-900 focus:outline-none" placeholder="@username" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-earth-900 uppercase tracking-wider">Reason for reporting</label>
            <select className="w-full bg-[#F5F5F5] px-6 py-4 rounded-2xl font-bold text-earth-900 focus:outline-none appearance-none">
              <option>Spam or scam</option>
              <option>Harassment or hate speech</option>
              <option>Inappropriate content</option>
              <option>Counterfeit items</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-earth-900 uppercase tracking-wider">Details</label>
            <textarea rows={4} className="w-full bg-[#F5F5F5] px-6 py-4 rounded-2xl font-bold text-earth-900 focus:outline-none resize-none" placeholder="Please describe the issue..." />
          </div>
          <button className="w-full py-5 bg-earth-900 text-white font-black rounded-full hover:bg-black transition-colors">Submit Report</button>
        </div>
      </div>
    );
  }

  if (activeHelpView === 'report-product') {
    return (
      <div className="min-h-screen bg-white animate-fade-in flex flex-col">
        <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
          <button onClick={() => setActiveHelpView('menu')} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-earth-900" />
          </button>
          <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2 text-center">Report Product</h1>
          <div className="w-10"></div>
        </div>
        <div className="px-6 py-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-earth-900 uppercase tracking-wider">Product Link or ID</label>
            <input className="w-full bg-[#F5F5F5] px-6 py-4 rounded-2xl font-bold text-earth-900 focus:outline-none" placeholder="e.g. #123456" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-earth-900 uppercase tracking-wider">Issue category</label>
            <select className="w-full bg-[#F5F5F5] px-6 py-4 rounded-2xl font-bold text-earth-900 focus:outline-none appearance-none">
              <option>Counterfeit or fake</option>
              <option>Prohibited item</option>
              <option>Misleading description</option>
              <option>Inappropriate images</option>
              <option>Copyright infringement</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-earth-900 uppercase tracking-wider">Details</label>
            <textarea rows={4} className="w-full bg-[#F5F5F5] px-6 py-4 rounded-2xl font-bold text-earth-900 focus:outline-none resize-none" placeholder="Tell us more about the problem..." />
          </div>
          <button className="w-full py-5 bg-earth-900 text-white font-black rounded-full hover:bg-black transition-colors">Submit Report</button>
        </div>
      </div>
    );
  }

  if (activeHelpView === 'contact') {
    return (
      <div className="min-h-screen bg-white animate-fade-in flex flex-col">
        <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
          <button onClick={() => setActiveHelpView('menu')} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-earth-900" />
          </button>
          <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2 text-center">Contact Us</h1>
          <div className="w-10"></div>
        </div>
        <div className="px-6 py-8 space-y-4">
          <button className="w-full bg-blue-50 p-6 rounded-[2rem] flex items-center gap-6 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <MessageSquare className="w-7 h-7 text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-display font-black text-lg text-earth-900">Live Chat</h3>
              <p className="text-xs font-black text-earth-400">Average response time: 2 mins</p>
            </div>
            <ChevronRight className="w-5 h-5 text-earth-900" />
          </button>
          <button className="w-full bg-purple-50 p-6 rounded-[2rem] flex items-center gap-6 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Phone className="w-7 h-7 text-purple-500" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-display font-black text-lg text-earth-900">Callback</h3>
              <p className="text-xs font-black text-earth-400">We'll call you within 15 mins</p>
            </div>
            <ChevronRight className="w-5 h-5 text-earth-900" />
          </button>
          <button className="w-full bg-cyan-50 p-6 rounded-[2rem] flex items-center gap-6 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Package className="w-7 h-7 text-cyan-500" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-display font-black text-lg text-earth-900">Order Issues</h3>
              <p className="text-xs font-black text-earth-400">Resolution for specific orders</p>
            </div>
            <ChevronRight className="w-5 h-5 text-earth-900" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Help & Support</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 space-y-6">
        {supportItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveHelpView(item.id as any)}
            className="w-full text-left bg-[#F9F9F9] p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-earth-50 transition-all active:scale-[0.98]"
          >
            <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center shrink-0`}>
              <item.icon className={`w-8 h-8 ${item.color}`} strokeWidth={2} />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-display font-black text-[17px] text-earth-900">{item.title}</h3>
              <p className="text-sm text-earth-400 font-medium leading-snug">
                {item.description}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-earth-300 group-hover:text-earth-900 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Policy Detail Views ---

const RefreshHubView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Refresh Hub</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>
      <div className="flex-1 px-6 py-8 pb-20 overflow-y-auto">
        <div className="space-y-6">
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Our Verification Process</h2>
            <p className="text-earth-600 text-sm leading-relaxed">We verify every item to ensure quality and authenticity. Our expert team checks condition, functionality, and material composition.</p>
          </section>
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Sanitization Standards</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Every item is professionally sanitized using eco-friendly methods to meet the highest hygiene standards before it reaches you.</p>
          </section>
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Expert Packing</h2>
            <p className="text-earth-600 text-sm leading-relaxed">We use sustainable packaging materials and professional packing techniques to ensure your items arrive in perfect condition.</p>
          </section>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Revendre Marketplace Pvt Ltd.
        </p>
      </div>
    </div>
  );
};

const BuyingView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Buying Guide</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>
      <div className="flex-1 px-6 py-8 pb-20 overflow-y-auto">
        <div className="space-y-6">
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Safe Payments</h2>
            <p className="text-earth-600 text-sm leading-relaxed">We offer secure payment methods including credit cards, debit cards, and digital wallets. Your financial information is encrypted and protected.</p>
          </section>
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Escrow Protection</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Your payment is held in escrow until you receive and confirm the item. This ensures both buyer and seller security throughout the transaction.</p>
          </section>
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Buyer Safety Guidelines</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Always communicate through Revendre, check item photos carefully, read seller reviews, and verify item condition upon receipt.</p>
          </section>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Revendre Marketplace Pvt Ltd.
        </p>
      </div>
    </div>
  );
};

const SellingView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Selling & Payouts</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>
      <div className="flex-1 px-6 py-8 pb-20 overflow-y-auto">
        <div className="space-y-6">
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">How to List Items</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Upload clear photos, write accurate descriptions, set fair prices, and include relevant details about condition and brand. You can list multiple items quickly.</p>
          </section>
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Selling Rules</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Only sell authentic items in good condition. Prohibited items include weapons, counterfeit goods, and hazardous materials. Violating rules may result in account suspension.</p>
          </section>
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Payout Schedule</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Payouts are processed within 48-72 hours after buyer confirmation. Your earnings are deposited to your registered bank account or digital wallet.</p>
          </section>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Revendre Marketplace Pvt Ltd.
        </p>
      </div>
    </div>
  );
};

const ShippingView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Shipping & Returns</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>
      <div className="flex-1 px-6 py-8 pb-20 overflow-y-auto">
        <div className="space-y-6">
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Delivery Timelines</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Standard delivery takes 3-5 business days across major cities in India. Express delivery is available for selected locations within 24-48 hours.</p>
          </section>
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">Order Tracking</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Track your orders in real-time through the app. You'll receive updates at each stage: packed, dispatched, out for delivery, and delivered.</p>
          </section>
          <section>
            <h2 className="font-display font-black text-xl text-earth-900 mb-3">7-Day Return Policy</h2>
            <p className="text-earth-600 text-sm leading-relaxed">If the item doesn't match the description or is damaged, you can initiate a return within 7 days of delivery. Returns are free and hassle-free.</p>
          </section>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Revendre Marketplace Pvt Ltd.
        </p>
      </div>
    </div>
  );
};

// --- Privacy Policy Detail View ---

const PrivacyPolicyDetailView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Privacy Policy</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>
      <div className="flex-1 px-6 py-8 pb-20 overflow-y-auto">
        <div className="space-y-8">
          <section>
            <h2 className="font-display font-black text-2xl text-earth-900 mb-4">Privacy Policy</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Effective Date: January 1, 2026</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">1. Company Information</h3>
            <p className="text-earth-600 text-sm leading-relaxed">Revendre Marketplace Pvt Ltd. ("Company," "we," "us," or "our") operates the Revendre platform, a marketplace for buying and selling pre-loved items. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our mobile application and engage with our services.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">2. Information We Collect</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2"><strong>Personal Information:</strong> When you register an account, we collect your name, email address, phone number, date of birth, profile photo, and bio. When you make a purchase or list an item for sale, we also collect payment and bank account information necessary to process transactions.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2"><strong>Address Information:</strong> We collect your residential and shipping addresses to facilitate order delivery and validate user location.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2"><strong>Device Information:</strong> We automatically collect device identifiers, operating system type, app version, and mobile network information to improve app performance and security.</p>
            <p className="text-earth-600 text-sm leading-relaxed"><strong>Usage Data:</strong> We track pages viewed, items clicked, searches performed, time spent on the app, and interaction patterns to enhance user experience.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">3. How We Use Your Information</h3>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-2">
              <li>• To create and maintain your account and provide access to platform features</li>
              <li>• To process transactions, verify seller authenticity, and ensure buyer safety</li>
              <li>• To send transactional notifications about orders, payments, and shipments</li>
              <li>• To prevent fraud, detect unauthorized access, and maintain platform security</li>
              <li>• To personalize your experience and show relevant item recommendations</li>
              <li>• To conduct customer service, respond to inquiries, and resolve disputes</li>
              <li>• To improve our services through analytics and user behavior analysis</li>
              <li>• To comply with legal obligations and government requests</li>
            </ul>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">4. Listing Images and Uploaded Content</h3>
            <p className="text-earth-600 text-sm leading-relaxed">Images and descriptions uploaded by sellers become part of public listings visible to all users. We may use these images for moderation, quality assurance, and to train our verification systems. By uploading content, you grant Revendre a non-exclusive license to use this content on our platform and marketing materials.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">5. Payment Processing</h3>
            <p className="text-earth-600 text-sm leading-relaxed">Payment information including credit card numbers, debit card details, and bank account information is encrypted and never stored on our servers. All payments are processed through PCI-DSS compliant payment gateways. We use tokenization to ensure your payment details remain secure across transactions.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">6. Information Sharing</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">We DO NOT sell your personal information to third parties. We may share information with:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-2">
              <li>• <strong>Service Providers:</strong> Shipping partners, payment processors, and customer support vendors under confidentiality agreements</li>
              <li>• <strong>Legal Requirements:</strong> Law enforcement agencies when required by court order or legal process</li>
              <li>• <strong>Fraud Prevention:</strong> Other platforms may receive flagged accounts to prevent abuse across the e-commerce ecosystem</li>
            </ul>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">7. Data Storage and Security</h3>
            <p className="text-earth-600 text-sm leading-relaxed">Your data is stored on secure servers with encryption at rest and in transit. We implement multi-factor authentication, regular security audits, and access controls to protect against unauthorized access. Employees can only access data necessary for their job functions.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">8. Data Retention</h3>
            <p className="text-earth-600 text-sm leading-relaxed">We retain your personal information as long as your account is active or as necessary to provide services. After account deletion, we retain transaction records for 7 years for tax and legal compliance. You can request permanent data deletion subject to legal and operational requirements.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">9. User Rights</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Under applicable data protection laws, you have the right to:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-2">
              <li>• Access a copy of the personal data we hold about you</li>
              <li>• Correct inaccurate or incomplete information</li>
              <li>• Request deletion of your data (subject to legal holds)</li>
              <li>• Opt-out of marketing communications</li>
              <li>• Request restriction of processing for specific purposes</li>
              <li>• Data portability - receive your data in a machine-readable format</li>
            </ul>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">10. Cookies and App Analytics</h3>
            <p className="text-earth-600 text-sm leading-relaxed">We use cookies and similar technologies to remember your preferences, track navigation patterns, and measure feature usage. Within the app, we use analytics to count visits, understand how features are used, and improve performance. You can control analytics preferences in your account settings.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">11. Third-Party Services</h3>
            <p className="text-earth-600 text-sm leading-relaxed">Our app integrates with third-party services for analytics (Firebase), payments (Stripe, PayU), and customer support. These services have their own privacy policies. We recommend reviewing their privacy practices as they may collect and use your information independently.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">12. Children's Privacy</h3>
            <p className="text-earth-600 text-sm leading-relaxed">Revendre is not intended for users under 18 years old. We do not knowingly collect personal information from minors. If we become aware that a minor has provided information, we will delete such information and terminate the minor's account immediately.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">13. Changes to This Privacy Policy</h3>
            <p className="text-earth-600 text-sm leading-relaxed">We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of material changes via email or in-app notification. Your continued use of Revendre after changes indicates your acceptance of the updated policy.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">14. Contact Information</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">If you have questions about this Privacy Policy or our data practices, please contact us at:</p>
            <p className="text-earth-600 text-sm leading-relaxed"><strong>Email:</strong> privacy@revendre.com</p>
            <p className="text-earth-600 text-sm leading-relaxed"><strong>Mailing Address:</strong> Revendre Marketplace Pvt Ltd., Chennai, Tamil Nadu, India</p>
            <p className="text-earth-600 text-sm leading-relaxed"><strong>Response Time:</strong> We will respond to your inquiry within 30 days</p>
          </section>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Revendre Marketplace Pvt Ltd.
        </p>
      </div>
    </div>
  );
};

// --- Terms & Conditions Detail View ---

const TermsConditionsDetailView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Terms & Conditions</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>
      <div className="flex-1 px-6 py-8 pb-20 overflow-y-auto">
        <div className="space-y-8">
          <section>
            <h2 className="font-display font-black text-2xl text-earth-900 mb-4">Terms & Conditions</h2>
            <p className="text-earth-600 text-sm leading-relaxed">Effective Date: January 1, 2026</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">1. Platform Overview</h3>
            <p className="text-earth-600 text-sm leading-relaxed">Revendre is a peer-to-peer marketplace platform that enables users to buy and sell pre-loved items. Revendre Marketplace Pvt Ltd. ("Revendre," "Company," "we," or "us") provides the technology infrastructure but does not directly buy, sell, deliver, or provide payment services. By accessing or using Revendre, you agree to be bound by these Terms & Conditions.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">2. Eligibility</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">To use Revendre, you must:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-2">
              <li>• Be at least 18 years of age or the legal age of majority in your jurisdiction</li>
              <li>• Have the legal capacity to enter into binding agreements</li>
              <li>• Not be prohibited from using the platform by law or these terms</li>
              <li>• Reside in India or an authorized jurisdiction</li>
              <li>• Agree to comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">3. Account Registration and Responsibility</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">When you create an account, you agree to provide accurate, complete, and current information. You are responsible for:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-2">
              <li>• Maintaining the confidentiality of your password and account credentials</li>
              <li>• All activity that occurs under your account</li>
              <li>• Notifying us immediately of unauthorized access</li>
              <li>• Ensuring your contact information remains up-to-date</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed mt-2">Revendre reserves the right to suspend or terminate accounts with false information or suspicious activity.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">4. Seller Responsibilities</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">As a seller, you agree to:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-2">
              <li>• Only list authentic items that you own or have the right to sell</li>
              <li>• Provide accurate descriptions, condition details, and photos of items</li>
              <li>• Disclose any defects, damage, or wear to items</li>
              <li>• Price items fairly and according to marketplace standards</li>
              <li>• Pack items securely to prevent damage during transit</li>
              <li>• Ship items via the courier partner within 48 hours of payment</li>
              <li>• Provide accurate tracking information to buyers</li>
              <li>• Not engage in fraud, counterfeit sales, or illegal activities</li>
            </ul>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">5. Buyer Responsibilities</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">As a buyer, you agree to:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-2">
              <li>• Carefully review item descriptions, photos, and seller ratings before purchasing</li>
              <li>• Contact sellers with questions before completing the purchase</li>
              <li>• Accept responsibility for the accuracy of your delivery address</li>
              <li>• Receive items within the promised delivery timeframe</li>
              <li>• Inspect items immediately upon receipt</li>
              <li>• Report issues or damaged items within 48 hours</li>
            </ul>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">6. Orders, Logistics and Delivery</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Order Process:</strong> Once you purchase an item, the seller receives a notification and has 48 hours to ship the item.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Standard Delivery:</strong> Standard delivery takes 3-5 business days for metro cities and 5-7 days for tier-2 and tier-3 cities.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Tracking:</strong> Once shipped, you will receive a tracking ID to monitor your package in real-time.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Delays:</strong> Revendre is not responsible for delays caused by external factors including weather, courier partner issues, or customs clearance.</p>
            <p className="text-earth-600 text-sm leading-relaxed">• <strong>Lost Packages:</strong> If a package is lost in transit, the buyer will receive a full refund after submitting proof to Revendre support.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">7. Returns and Refunds</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Return Window:</strong> Buyers have 7 days from delivery to initiate a return if the item does not match the description or is damaged.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Return Conditions:</strong> Items must be in the same condition as received. Returns are not available for change of mind, personal preference, or buyer's remorse.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Return Shipping:</strong> Return shipping costs are covered by Revendre. A prepaid return label will be provided.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Refund Processing:</strong> Once the return is received and inspected, refunds are processed within 5-7 business days.</p>
            <p className="text-earth-600 text-sm leading-relaxed">• <strong>Final Sale Items:</strong> Some items may be marked as "Final Sale" and are not eligible for returns.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">8. Prohibited Listings and Activities</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Sellers may NOT list:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-2">
              <li>• Counterfeit, replica, or stolen goods</li>
              <li>• Weapons, explosives, or hazardous materials</li>
              <li>• Banned substances or illegal drugs</li>
              <li>• Perishable items or items requiring special handling</li>
              <li>• Items that infringe on intellectual property rights</li>
              <li>• Adult content or explicit materials</li>
              <li>• Service offerings or non-physical items</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed mt-2">Prohibited activities include harassment, false advertising, attempts to circumvent fees, and external transaction facilitation.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">9. Payment Disputes and Chargebacks</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Payment Protection:</strong> All payments are held in escrow until the buyer confirms receipt and satisfaction with the item.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Dispute Resolution:</strong> In case of payment disputes, both parties must communicate through Revendre support within 30 days.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">• <strong>Chargebacks:</strong> If a buyer initiates a chargeback with their bank/card, Revendre will investigate. Fraudulent chargebacks may result in account termination.</p>
            <p className="text-earth-600 text-sm leading-relaxed">• <strong>Final Decision:</strong> Revendre's decision on disputes is final and binding on both parties.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">10. Intellectual Property</h3>
            <p className="text-earth-600 text-sm leading-relaxed">All content on Revendre including logos, design, text, and code is owned by Revendre or its licensors. Users grant Revendre a license to use photos and descriptions uploaded for verification and marketing purposes. You may not reproduce, distribute, or modify any content without prior written consent.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">11. Limitation of Liability</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Revendre provides the platform "as is" without warranties of any kind. To the fullest extent permitted by law:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-2">
              <li>• Revendre is not liable for indirect, incidental, special, or consequential damages</li>
              <li>• Our total liability shall not exceed the amount you have paid on the platform in the past 12 months</li>
              <li>• We are not responsible for third-party payment processor or courier partner failures</li>
              <li>• Users assume all risks associated with transactions</li>
            </ul>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">12. Data and Privacy</h3>
            <p className="text-earth-600 text-sm leading-relaxed">Your use of Revendre is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding data collection and usage.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">13. Governing Law and Dispute Resolution</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">These Terms & Conditions shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.</p>
            <p className="text-earth-600 text-sm leading-relaxed">Any disputes arising from these terms shall be subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">14. Contact Information</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">For questions, complaints, or concerns regarding these Terms & Conditions, please contact us:</p>
            <p className="text-earth-600 text-sm leading-relaxed"><strong>Email:</strong> support@revendre.com</p>
            <p className="text-earth-600 text-sm leading-relaxed"><strong>Mailing Address:</strong> Revendre Marketplace Pvt Ltd., Chennai, Tamil Nadu, India</p>
            <p className="text-earth-600 text-sm leading-relaxed"><strong>Response Time:</strong> We will respond to your inquiry within 5-7 business days</p>
          </section>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Revendre Marketplace Pvt Ltd.
        </p>
      </div>
    </div>
  );
};

const LegalView = ({ onBack, onOpenLegalDoc }: { onBack: () => void; onOpenLegalDoc: (view: SettingsView) => void }) => {
  const legalDocuments = [
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      description: 'Learn how we collect, use, and protect your personal information.',
      icon: FileText,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      id: 'terms-conditions',
      title: 'Terms & Conditions',
      description: 'Platform usage rules, buyer and seller responsibilities, and policies.',
      icon: ScrollText,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Legal Information</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>
      
      <div className="flex-1 px-6 py-8 pb-20 overflow-y-auto flex flex-col">
        <div className="space-y-4">
          {legalDocuments.map((doc) => {
            const DocIcon = doc.icon;
            return (
              <button
                key={doc.id}
                onClick={() => onOpenLegalDoc(doc.id as SettingsView)}
                className={`w-full ${doc.bgColor} p-6 rounded-[2rem] flex items-center gap-6 group hover:shadow-md transition-all active:scale-[0.98]`}
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <DocIcon className={`w-7 h-7 ${doc.iconColor}`} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-display font-black text-lg text-earth-900">
                    {doc.title}
                  </h3>
                  <p className="text-xs font-black text-earth-400 leading-snug">
                    {doc.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-earth-900 flex-shrink-0" />
              </button>
            );
          })}
        </div>
        
        {/* Footer pushes to bottom */}
        <div className="mt-auto" />
      </div>
      
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Revendre Marketplace Pvt Ltd.
        </p>
      </div>
    </div>
  );
};

const AboutView = ({ onBack, onOpenPolicy }: { onBack: () => void; onOpenPolicy: (view: SettingsView) => void }) => {
  const policies = [
    {
      id: 'refresh-hub',
      title: 'Revendre Refresh Hub',
      description: 'Learn how we verify, sanitize, and pack items before delivery.',
      icon: Sparkles,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      id: 'buying',
      title: 'Buying on Revendre',
      description: 'Safe payments, escrow protection, and buyer safety guidelines.',
      icon: ShoppingCart,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      id: 'selling',
      title: 'Selling & Payouts',
      description: 'How to list items, selling rules, and when payouts are processed.',
      icon: DollarSign,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500'
    },
    {
      id: 'shipping',
      title: 'Shipping & Returns',
      description: 'Delivery timelines, tracking, and our 7-day return policy.',
      icon: Truck,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      id: 'legal',
      title: 'Legal Information',
      description: 'Privacy Policy, Terms of Service, and Cookie Policy.',
      icon: ShieldCheck,
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-earth-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-earth-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">About Revendre</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 pb-20 overflow-y-auto flex flex-col">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-earth-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6 mx-auto">
            <span className="text-white text-6xl font-black">R</span>
          </div>
          <h2 className="text-3xl font-display font-black text-earth-900 mb-1">Revendre</h2>
          <p className="text-[11px] font-black text-earth-400 tracking-[0.2em]">RE-LOVED. RE-SOLD. RE-VENDRE.</p>
        </div>

        {/* Version Card */}
        <div className="w-full space-y-4 mb-8">
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Info className="w-7 h-7 text-pop-cyan" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span className="font-display font-black text-lg text-earth-900">Version</span>
              <span className="text-xs font-black text-earth-400">2.4.1 (Build 20260302)</span>
            </div>
          </div>
        </div>

        {/* OUR POLICIES Section */}
        <div className="w-full mb-8">
          <h3 className="font-display font-black text-lg text-earth-900 mb-4">OUR POLICIES</h3>
          <div className="space-y-4">
            {policies.map((policy) => {
              const PolicyIcon = policy.icon;
              return (
                <button
                  key={policy.id}
                  onClick={() => onOpenPolicy(policy.id as SettingsView)}
                  className={`w-full ${policy.bgColor} p-6 rounded-[2rem] flex items-center gap-6 group hover:shadow-md transition-all active:scale-[0.98]`}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <PolicyIcon className={`w-7 h-7 ${policy.iconColor}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-display font-black text-lg text-earth-900">
                      {policy.title}
                    </h3>
                    <p className="text-xs font-black text-earth-400 leading-snug">
                      {policy.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-earth-900 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-1 pb-4">
          <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
            Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
          </p>
          <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
            © 2026 Revendre Marketplace Pvt Ltd.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Settings Component ---

export const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateUser, onBack, initialView = 'menu' }) => {
  const [currentView, setCurrentView] = useState<SettingsView>(initialView);
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (currentView) {
      case 'account': 
        return <AccountView currentUser={currentUser} onUpdateUser={onUpdateUser} onBackToMenu={() => setCurrentView('menu')} />;
      case 'notifications': 
        return <NotificationsView onBack={() => setCurrentView('menu')} />;
      case 'appearance': 
        return <PlaceholderView title="Appearance" onBack={() => setCurrentView('menu')} />;
      case 'privacy': 
        return <PrivacySecurityView onBack={() => setCurrentView('menu')} />;
      case 'help': 
        return <HelpSupportView onBack={() => setCurrentView('menu')} />;
      case 'about': 
        return <AboutView onBack={() => setCurrentView('menu')} onOpenPolicy={(view) => setCurrentView(view)} />;
      case 'refresh-hub':
        return <RefreshHubView onBack={() => setCurrentView('about')} />;
      case 'buying':
        return <BuyingView onBack={() => setCurrentView('about')} />;
      case 'selling':
        return <SellingView onBack={() => setCurrentView('about')} />;
      case 'shipping':
        return <ShippingView onBack={() => setCurrentView('about')} />;
      case 'legal':
        return <LegalView onBack={() => setCurrentView('about')} onOpenLegalDoc={(view) => setCurrentView(view)} />;
      case 'privacy-policy':
        return <PrivacyPolicyDetailView onBack={() => setCurrentView('legal')} />;
      case 'terms-conditions':
        return <TermsConditionsDetailView onBack={() => setCurrentView('legal')} />;
      default: 
        return <MenuView onBack={onBack} onNavigate={setCurrentView} searchQuery={searchQuery} onSearchChange={setSearchQuery} />;
    }
  };

  return renderContent();
};


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
import { UserSearchModal } from './UserSearchModal';

interface SettingsProps {
  currentUser: User;
  allUsers: User[];
  onUpdateUser: (updatedData: Partial<User>) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
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

type SettingsView = 'menu' | 'account' | 'notifications' | 'privacy' | 'help' | 'about' | 'refresh-hub' | 'buying' | 'selling' | 'shipping' | 'legal' | 'privacy-policy' | 'terms-conditions';
type HelpSupportSubView = 'menu' | 'blocked' | 'report-user' | 'report-product' | 'contact';
type SearchResultView = SettingsView | 'help-blocked' | 'help-report-user' | 'help-report-product' | 'help-contact';

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
  onNavigate: (view: SearchResultView) => void,
  searchQuery: string,
  onSearchChange: (val: string) => void
}) => {
  type SearchItem = {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    view: SearchResultView;
    parentLabel?: string;
    searchTerms?: string[];
  };

  const menuItems = [
    { id: 'account', label: 'Account', icon: UserIcon, view: 'account' as SettingsView },
    { id: 'notifications', label: 'Notifications', icon: Bell, view: 'notifications' as SettingsView },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock, view: 'privacy' as SettingsView },
    { id: 'help', label: 'Help and Support', icon: Headphones, view: 'help' as SettingsView },
    { id: 'about', label: 'About', icon: Info, view: 'about' as SettingsView },
  ];

  const searchItems: SearchItem[] = [
    ...menuItems,
    { id: 'account-data', label: 'Account Data', icon: UserIcon, view: 'account', parentLabel: 'Account', searchTerms: ['email', 'password'] },
    { id: 'personal-data', label: 'Personal Data', icon: UserIcon, view: 'account', parentLabel: 'Account', searchTerms: ['first name', 'last name', 'phone', 'bio', 'delete account'] },
    { id: 'system-notifications', label: 'System Notifications', icon: Bell, view: 'notifications', parentLabel: 'Notifications', searchTerms: ['push', 'email', 'sms', 'updates'] },
    { id: 'marketing-notifications', label: 'Marketing Notifications', icon: Bell, view: 'notifications', parentLabel: 'Notifications', searchTerms: ['offers', 'promotions', 'push', 'email', 'sms'] },
    { id: 'reminders', label: 'Reminders', icon: Bell, view: 'notifications', parentLabel: 'Notifications' },
    { id: 'private-account', label: 'Private Account', icon: Lock, view: 'privacy', parentLabel: 'Privacy & Security' },
    { id: 'activity-status', label: 'Show Activity Status', icon: Activity, view: 'privacy', parentLabel: 'Privacy & Security' },
    { id: 'whitelisted-users', label: 'Whitelisted Users', icon: UserCheck, view: 'privacy', parentLabel: 'Privacy & Security' },
    { id: 'two-factor-auth', label: 'Two-Factor Authentication', icon: ShieldCheck, view: 'privacy', parentLabel: 'Privacy & Security', searchTerms: ['2fa'] },
    { id: 'login-activity', label: 'Login Activity', icon: History, view: 'privacy', parentLabel: 'Privacy & Security' },
    { id: 'security-checkup', label: 'Security Checkup', icon: Fingerprint, view: 'privacy', parentLabel: 'Privacy & Security' },
    { id: 'tags-mentions', label: 'Tags & Mentions', icon: UserCheck, view: 'privacy', parentLabel: 'Privacy & Security' },
    { id: 'blocked-users', label: 'Blocked Users', icon: UserX, view: 'help-blocked', parentLabel: 'Help and Support', searchTerms: ['block'] },
    { id: 'report-user', label: 'Report a User', icon: ShieldAlert, view: 'help-report-user', parentLabel: 'Help and Support' },
    { id: 'report-product', label: 'Report a Product', icon: Flag, view: 'help-report-product', parentLabel: 'Help and Support' },
    { id: 'contact-support', label: 'Contact Customer Support', icon: MessageSquare, view: 'help-contact', parentLabel: 'Help and Support', searchTerms: ['support', 'help', 'contact us', 'live chat', 'callback'] },
    { id: 'refresh-hub', label: 'Revendre Refresh Hub', icon: Sparkles, view: 'refresh-hub', parentLabel: 'About' },
    { id: 'buying-policy', label: 'Buying on Revendre', icon: ShoppingCart, view: 'buying', parentLabel: 'About', searchTerms: ['buyer protection', 'escrow'] },
    { id: 'selling-policy', label: 'Selling & Payouts', icon: DollarSign, view: 'selling', parentLabel: 'About', searchTerms: ['seller', 'commission', 'payout'] },
    { id: 'shipping-policy', label: 'Shipping & Returns', icon: Truck, view: 'shipping', parentLabel: 'About', searchTerms: ['delivery', 'returns', '7-day return'] },
    { id: 'legal-information', label: 'Legal Information', icon: ShieldCheck, view: 'legal', parentLabel: 'About' },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: FileText, view: 'privacy-policy', parentLabel: 'Legal Information', searchTerms: ['data', 'cookies', 'information'] },
    { id: 'terms-conditions', label: 'Terms & Conditions', icon: ScrollText, view: 'terms-conditions', parentLabel: 'Legal Information', searchTerms: ['terms', 'conditions', 'legal'] }
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = normalizedQuery.length === 0
    ? menuItems
    : searchItems.filter(item =>
        [item.label, item.parentLabel || '', ...(item.searchTerms || [])]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
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
                <div>
                  <span className="font-bold text-[17px] text-earth-900">{item.label}</span>
                  {normalizedQuery.length > 0 && (item as SearchItem).parentLabel && (
                    <p className="text-[11px] text-earth-400 font-medium leading-tight">
                      {(item as SearchItem).parentLabel}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-earth-900 opacity-60 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AccountView = ({ currentUser, onUpdateUser, onDeleteAccount, onBackToMenu }: { 
  currentUser: User, 
  onUpdateUser: (data: Partial<User>) => Promise<void>,
  onDeleteAccount: () => Promise<void>,
  onBackToMenu: () => void 
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'personal'>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState((currentUser.displayName || '').split(' ')[0] || '');
  const [lastName, setLastName] = useState((currentUser.displayName || '').split(' ').slice(1).join(' ') || '');
  const [bio, setBio] = useState(currentUser.bio || '');

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteAccount();
    } catch (error) {
      console.error("Delete failed", error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData: Partial<User> = {
        displayName: `${firstName} ${lastName}`.trim(),
        bio: bio
      };
      await onUpdateUser(updatedData);
      setIsSaving(false);
    } catch (error) {
      console.error("Save failed", error);
      setIsSaving(false);
    }
  };

  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  const bioWordCount = getWordCount(bio);
  const isBioValid = bioWordCount <= 1000;

  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
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
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-4 mt-2 bg-red-50 text-red-500 font-bold rounded-2xl active:scale-[0.98] transition-all"
              >
                Delete account
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-24">
            <div className="border-b border-earth-100 pb-2">
              <label className="text-xs text-earth-400 font-medium block mb-1">First name</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-base font-medium text-earth-900 outline-none bg-transparent"
                placeholder="Enter first name"
              />
            </div>
            <div className="border-b border-earth-100 pb-2">
              <label className="text-xs text-earth-400 font-medium block mb-1">Last name</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-base font-medium text-earth-900 outline-none bg-transparent"
                placeholder="Enter last name"
              />
            </div>
            <div className="border-b border-earth-100 pb-2">
              <label className="text-xs text-earth-400 font-medium block mb-1">Phone number</label>
              <input 
                type="tel" 
                defaultValue={currentUser.addresses?.[0]?.mobile || currentUser.phoneNumber || ''} 
                className="w-full text-base font-medium text-earth-900 outline-none bg-transparent"
                placeholder="Enter phone number"
                disabled
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-earth-400 font-medium block">Bio</label>
                <span className={`text-[10px] font-bold ${isBioValid ? 'text-earth-300' : 'text-red-500'}`}>
                  {bioWordCount} / 1000 words
                </span>
              </div>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                className={`w-full bg-[#F9F9F9] p-4 rounded-2xl text-sm font-medium text-earth-900 outline-none transition-all border-2 ${isBioValid ? 'border-transparent focus:border-earth-100' : 'border-red-100 focus:border-red-200'}`}
                placeholder="Tell the community about your style..."
              />
              {!isBioValid && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Bio exceeds 1000 word limit
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-scale-in">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-display font-black text-earth-900 mb-2">Delete Account?</h3>
            <p className="text-earth-500 font-medium mb-8 leading-relaxed">
              This action is permanent and cannot be undone. All your posts, orders, and profile data will be removed.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                className="flex-1 py-4 bg-earth-100 text-earth-900 font-bold rounded-2xl hover:bg-earth-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Button */}
      <div className="px-6 py-8 mt-auto pb-12 bg-white/80 backdrop-blur-md sticky bottom-0 border-t border-earth-50">
        <button 
          onClick={handleSave}
          disabled={isSaving || !isBioValid}
          className="w-full py-4 bg-black text-white font-bold rounded-full active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
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
      <div className="px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-3 hover:bg-earth-50 p-2 -ml-2 rounded-full transition-colors">
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

const PrivacySecurityView = ({ currentUser, allUsers, onUpdateUser, onBack }: { 
  currentUser: User, 
  allUsers: User[],
  onUpdateUser: (data: Partial<User>) => Promise<void>,
  onBack: () => void 
}) => {
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivate || false);
  const [showActivity, setShowActivity] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [whitelistedUsers, setWhitelistedUsers] = useState<User[]>([]);

  useEffect(() => {
    // Filter allUsers to find those who are already whitelisted (by ID)
    const whitelisted = allUsers.filter(u => (currentUser.whitelistedUserIds || []).includes(u.id));
    setWhitelistedUsers(whitelisted);
  }, [allUsers, currentUser.whitelistedUserIds]);

  const handleTogglePrivate = async () => {
    const newVal = !isPrivate;
    setIsPrivate(newVal);
    try {
      await onUpdateUser({ isPrivate: newVal });
    } catch (error) {
      setIsPrivate(!newVal);
      console.error("Failed to update privacy", error);
    }
  };

  const handleAddUser = async (userToAdd: User) => {
    if (currentUser.whitelistedUserIds?.includes(userToAdd.id)) return;
    
    const newIds = [...(currentUser.whitelistedUserIds || []), userToAdd.id];
    try {
      await onUpdateUser({ whitelistedUserIds: newIds });
      setWhitelistedUsers([...whitelistedUsers, userToAdd]);
    } catch (error) {
      console.error("Failed to whitelist user", error);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    const newIds = (currentUser.whitelistedUserIds || []).filter(id => id !== userId);
    try {
      await onUpdateUser({ whitelistedUserIds: newIds });
      setWhitelistedUsers(whitelistedUsers.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to remove user from whitelist", error);
    }
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-3 hover:bg-earth-50 p-2 -ml-2 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-earth-900" />
        </button>
        <h1 className="text-3xl font-display font-black text-earth-900">Privacy & Security</h1>
      </div>

      <div className="px-6 space-y-10 pb-24 overflow-y-auto">
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
              <Toggle active={isPrivate} onToggle={handleTogglePrivate} />
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

        {/* Whitelist Section - Only show when Private is ON */}
        {isPrivate && (
          <div className="space-y-4 animate-fade-in">
             <div className="flex items-center justify-between px-1">
               <h3 className="text-xs font-black text-earth-400 uppercase tracking-widest">Whitelisted Users</h3>
               <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-[10px] font-black text-pop-purple uppercase tracking-tighter bg-pop-purple/5 px-3 py-1 rounded-full"
               >
                 + Add User
               </button>
             </div>
             
             <div className="bg-[#F9F9F9] p-2 rounded-[2rem]">
                {whitelistedUsers.length === 0 ? (
                  <div className="p-8 text-center">
                     <p className="text-xs text-earth-400 font-bold italic">No users whitelisted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {whitelistedUsers.map(user => (
                      <div key={user.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                           <img src={user.avatarUrl} className="w-8 h-8 rounded-full object-cover" />
                           <span className="text-xs font-bold text-earth-900">@{user.username}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveUser(user.id)}
                          className="p-2 text-earth-300 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        )}

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

      <UserSearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        users={allUsers.filter(u => u.id !== currentUser.id && !currentUser.whitelistedUserIds?.includes(u.id))}
        onSelectUser={handleAddUser}
      />
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

const HelpSupportView = ({ onBack, initialActiveView = 'menu' }: { onBack: () => void; initialActiveView?: HelpSupportSubView }) => {
  const [activeHelpView, setActiveHelpView] = useState<HelpSupportSubView>(initialActiveView);

  useEffect(() => {
    setActiveHelpView(initialActiveView);
  }, [initialActiveView]);

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
            onClick={() => setActiveHelpView(item.id as HelpSupportSubView)}
            className="w-full text-left bg-[#F9F9F9] p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-earth-50 transition-all active:scale-[0.98]"
          >
            <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center shrink-0`}>
              <item.icon className={`w-8 h-8 ${item.color}`} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-[17px] text-earth-900">{item.title}</h3>
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
        {/* Centered Icon Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center shadow-lg mb-4 mx-auto">
            <ShieldCheck className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-sm font-bold text-earth-600">
            "Learn how we verify, sanitize, and pack every item for you."
          </p>
        </div>

        {/* Highlight Card */}
        <div className="bg-blue-50 p-6 rounded-[2rem] mb-8 border border-blue-100">
          <h3 className="font-display font-black text-lg text-earth-900 mb-2">Quality & Authenticity</h3>
          <p className="text-sm font-medium text-earth-600 leading-relaxed">
            Every item sold on Revendre goes through our specialized Refresh Hub. We don't just ship items; we curate them.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-4">
          {/* Step 1: Multi-Point Inspection */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">Multi-Point Inspection</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                We verify every item to ensure quality and authenticity. Our expert team checks condition, functionality, and material composition.
              </p>
            </div>
          </div>

          {/* Step 2: Professional Refresh */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Sparkles className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">Professional Refresh</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                Every item is professionally sanitized using eco-friendly methods to meet the highest hygiene standards before it reaches you.
              </p>
            </div>
          </div>

          {/* Step 3: Expert Packing */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Package className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">Expert Packing</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                We use sustainable packaging materials and professional packing techniques to ensure your items arrive in perfect condition.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Touchnova LLP
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
        <h1 className="font-display font-black text-2xl text-earth-900 absolute left-1/2 -translate-x-1/2">Buying on Revendre</h1>
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-earth-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-earth-900" />
        </button>
      </div>
      <div className="flex-1 px-6 py-8 pb-20 overflow-y-auto">
        {/* Centered Icon Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center shadow-lg mb-4 mx-auto">
            <ShoppingCart className="w-12 h-12 text-green-500" />
          </div>
          <p className="text-sm font-bold text-earth-600">
            "Safe payments, escrow system, and delivery timelines."
          </p>
        </div>

        {/* Introduction Paragraph */}
        <div className="mb-8">
          <p className="text-sm font-medium text-earth-600 leading-relaxed text-center">
            Shopping for pre-loved fashion should be as reliable as buying new. Here's how we protect your purchase:
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          {/* Card 1: Secure Escrow */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">Secure Escrow</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                Your money is held safely by Revendre and only released to the seller after you receive the item.
              </p>
            </div>
          </div>

          {/* Card 2: Buyer Protection */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <UserCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">Buyer Protection</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                Full refund if the item is counterfeit or significantly different from the description.
              </p>
            </div>
          </div>

          {/* Card 3: Eco-Packaging */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Package className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">Eco-Packaging</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                All items are delivered in our signature sustainable, plastic-free packaging.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Touchnova LLP
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
        {/* Centered Icon Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center shadow-lg mb-4 mx-auto">
            <ShoppingCart className="w-12 h-12 text-amber-500" />
          </div>
          <p className="text-sm font-bold text-earth-600">
            "How to list your fits and when you get paid."
          </p>
        </div>

        {/* Informational Cards */}
        <div className="space-y-4">
          {/* Card 1: Turn your closet into cash (highlighted) */}
          <div className="bg-amber-50 p-6 rounded-[2rem] flex items-start gap-4 border border-amber-100">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">Turn your closet into cash</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                We handle the logistics so you can focus on the style. Listing takes less than 60 seconds.
              </p>
            </div>
          </div>

          {/* Card 2: When do I get paid? */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">When do I get paid?</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                Payouts are processed 24 hours after the buyer receives and accepts the item. Funds will appear in your Revendre Wallet.
              </p>
            </div>
          </div>

          {/* Card 3: What is the commission? */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">What is the commission?</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                We charge a flat 15% fee which covers pickup, sanitization, authentication, and platform costs.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Touchnova LLP
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
        {/* Centered Icon Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-purple-50 rounded-[2rem] flex items-center justify-center shadow-lg mb-4 mx-auto">
            <Truck className="w-12 h-12 text-purple-500" />
          </div>
          <p className="text-sm font-bold text-earth-600">
            "Our 7-day return policy and tracking information."
          </p>
        </div>

        {/* Informational Cards */}
        <div className="space-y-4">
          {/* Card 1: 7-Day Return Policy */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Package className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">7-Day Return Policy</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                Items can be returned if they don't match the listing description or have undisclosed damage.
              </p>
            </div>
          </div>

          {/* Card 2: Nationwide Delivery */}
          <div className="bg-[#F9F9F9] p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <MapPin className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-black text-lg text-earth-900 mb-2">Nationwide Delivery</h3>
              <p className="text-sm font-medium text-earth-600 leading-relaxed">
                We deliver across India. Typically, items reach buyers within 5–7 business days after pickup.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Touchnova LLP
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
            <p className="text-earth-600 text-sm leading-relaxed mb-4">Effective Date: [Insert Launch Date]</p>
            <p className="text-earth-600 text-sm leading-relaxed">
              This Privacy Policy explains how Revendre, operated by Touchnova LLP, collects, uses, stores, and protects personal information when users access or use the Revendre mobile application ("Platform"). By using the Revendre platform, you consent to the collection and use of your information as described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">1. Company Information</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Revendre is operated by Touchnova LLP.</p>
            <div className="text-earth-600 text-sm leading-relaxed mb-4">
              <p className="font-bold">Registered Office:</p>
              <p>3-299, Greamspet</p>
              <p>Chittoor, Andhra Pradesh - 517002</p>
              <p>India</p>
            </div>
            <div className="text-earth-600 text-sm leading-relaxed mb-4">
              <p className="font-bold">Operational Office:</p>
              <p>Chennai, Tamil Nadu, India</p>
            </div>
            <p className="text-earth-600 text-sm leading-relaxed"><strong>Email:</strong> teamrevendre@gmail.com</p>
            <p className="text-earth-600 text-sm leading-relaxed"><strong>Phone:</strong> +91 8317696536</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">2. Information We Collect</h3>
            <div className="space-y-4 text-earth-600 text-sm leading-relaxed">
              <div>
                <p className="font-bold mb-1">Personal Information:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Delivery and pickup address</li>
                  <li>Account login credentials</li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-1">Transaction Information:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Product listings and images uploaded by users</li>
                  <li>Order history</li>
                  <li>Purchase and payment details</li>
                  <li>Seller payout details (if applicable)</li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-1">Device and Technical Information:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Device type and operating system</li>
                  <li>IP address</li>
                  <li>App usage information</li>
                  <li>Log data and crash reports</li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-1">Logistics Information:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pickup and delivery locations</li>
                  <li>Order tracking information</li>
                  <li>Courier or logistics partner updates</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">3. How We Use Your Information</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Revendre uses collected information to:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc">
              <li>Create and manage user accounts</li>
              <li>Process transactions and payments</li>
              <li>Coordinate clothing pickup and delivery</li>
              <li>Verify seller listings and product authenticity</li>
              <li>Provide customer support</li>
              <li>Prevent fraud and unauthorized activity</li>
              <li>Improve platform functionality and user experience</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">4. Listing Images and Uploaded Content</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">When sellers upload clothing images or product details:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc">
              <li>The content may be reviewed by Revendre before publication</li>
              <li>The content may be stored and displayed on the platform</li>
              <li>The content may be used to verify items during pickup inspection</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed mt-2 italic">Users remain responsible for the content they upload.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">5. Payment Processing</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Payments on Revendre are processed through third-party payment gateways. Revendre does not store sensitive payment card information such as:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc mb-2">
              <li>Credit card numbers</li>
              <li>Debit card details</li>
              <li>CVV numbers</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed">Payment gateways handle payment processing in accordance with their own privacy and security standards.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">6. Information Sharing</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-3">Revendre may share user information only in the following circumstances:</p>
            <div className="space-y-3 text-earth-600 text-sm leading-relaxed">
              <p><strong>Logistics Partners:</strong> Information such as pickup or delivery address may be shared with logistics providers to complete order fulfillment.</p>
              <p><strong>Payment Gateways:</strong> Transaction information may be shared with payment service providers to process payments securely.</p>
              <p><strong>Legal Compliance:</strong> Revendre may disclose information if required by law, court order, or government authorities.</p>
              <p className="font-bold">Revendre does not sell personal data to third parties.</p>
            </div>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">7. Data Storage and Security</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Revendre implements reasonable security measures to protect user information from unauthorized access, alteration, or disclosure.</p>
            <p className="text-earth-600 text-sm leading-relaxed mb-2 italic">However, no digital platform can guarantee absolute security.</p>
            <p className="text-earth-600 text-sm leading-relaxed">Users are responsible for maintaining the confidentiality of their account credentials.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">8. Data Retention</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Revendre retains personal information only for as long as necessary to:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc mb-2">
              <li>Provide platform services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce platform policies</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed">Users may request account deletion subject to legal and operational requirements.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">9. User Rights</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Users may have the right to:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc mb-2">
              <li>Access their personal data</li>
              <li>Update account information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request account deletion where applicable</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed">Requests may be submitted through the contact information provided below.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">10. Cookies and App Analytics</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Revendre may use analytics tools and cookies to understand how users interact with the platform. This helps improve:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc mb-2">
              <li>App performance</li>
              <li>Feature development</li>
              <li>User experience</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed">Analytics data does not identify individual users personally.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">11. Third-Party Services</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">The platform may integrate with third-party services including payment gateways, logistics providers, and analytics tools. These third parties may have their own privacy policies governing the use of information.</p>
            <p className="text-earth-600 text-sm leading-relaxed italic">Revendre is not responsible for the privacy practices of external services.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">12. Children's Privacy</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Revendre is intended for users 18 years and older.</p>
            <p className="text-earth-600 text-sm leading-relaxed">The platform does not knowingly collect personal information from individuals under the age of 18.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">13. Changes to This Privacy Policy</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Revendre may update this Privacy Policy from time to time. Users will be notified of significant updates through the platform.</p>
            <p className="text-earth-600 text-sm leading-relaxed italic">Continued use of the platform after updates constitutes acceptance of the revised policy.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">14. Contact Information</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-4">For questions or concerns regarding this Privacy Policy, contact:</p>
            <div className="text-earth-600 text-sm leading-relaxed">
              <p className="font-bold">Revendre</p>
              <p>(Operated by Touchnova LLP)</p>
              <div className="mt-2">
                <p className="font-bold">Registered Office:</p>
                <p>3-299, Greamspet</p>
                <p>Chittoor, Andhra Pradesh - 517002</p>
                <p>India</p>
              </div>
              <div className="mt-2">
                <p className="font-bold">Operational Office:</p>
                <p>Chennai, Tamil Nadu, India</p>
              </div>
              <p className="mt-2"><strong>Email:</strong> teamrevendre@gmail.com</p>
              <p><strong>Phone:</strong> +91 8317696536</p>
            </div>
          </section>
        </div>
      </div>

      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Touchnova LLP. All Rights Reserved.
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
            <h2 className="font-display font-black text-2xl text-earth-900 mb-4">Terms and Conditions</h2>
            <p className="text-earth-600 text-sm leading-relaxed mb-4">Effective Date: [Insert Launch Date]</p>
            <p className="text-earth-600 text-sm leading-relaxed">
              These Terms and Conditions ("Terms") govern your access to and use of the Revendre mobile application and related services ("Platform"). Revendre is a digital marketplace operated by Touchnova LLP. By accessing or using the Revendre platform, you agree to comply with these Terms.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">1. Platform Overview</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-4">
              Revendre is a consumer-to-consumer (C2C) resale marketplace that enables users to buy and sell pre-owned clothing items. The platform provides services including:
            </p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc mb-4">
              <li>Listing and discovery of used clothing</li>
              <li>Secure payment processing</li>
              <li>Sanitization and hygiene preparation of garments</li>
              <li>Logistics coordination for pickup and delivery</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed">
              Revendre facilitates transactions between independent buyers and sellers while coordinating sanitization, logistics, and payment processing. Revendre does not manufacture clothing items and does not guarantee product authenticity or condition beyond the verification processes conducted by the platform.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">2. Eligibility</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Users must be at least 18 years old to use the platform. By using Revendre, you confirm that:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc">
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter binding agreements</li>
              <li>All information provided during registration is accurate and truthful</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed mt-2">Revendre reserves the right to request identity verification where required.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">3. Account Registration and Responsibility</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Users may be required to create an account to access platform services. Users agree to:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc mb-2">
              <li>Provide accurate information during registration</li>
              <li>Maintain the confidentiality of their account credentials</li>
              <li>Accept responsibility for activities conducted through their account</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed">Revendre may suspend or terminate accounts involved in fraud, abuse, or policy violations.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">4. Seller Responsibilities</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Sellers using the platform agree to:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc mb-2">
              <li>List only clothing items legally owned by them</li>
              <li>Provide accurate product descriptions</li>
              <li>Upload authentic images of items</li>
              <li>Ensure items comply with platform policies</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Sellers acknowledge that misleading listings may result in listing removal, order cancellation, or account suspension. Seller payouts will be processed only after the item has been verified and successfully collected from the seller and the transaction is completed.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">5. Listing Approval and Moderation</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              All listings are subject to review and approval by the platform before publication. Listings will remain in a pending state until reviewed to ensure the product is an approved clothing item, images are accurate, and the listing complies with prohibited product rules. Revendre reserves the right to approve, reject, edit, suspend, or remove listings at its sole discretion.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">6. Buyer Responsibilities</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Buyers agree to:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc mb-2">
              <li>Review product descriptions carefully before purchasing</li>
              <li>Complete payments through the Revendre platform</li>
              <li>Provide accurate delivery information</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed">Buyers acknowledge that items sold on Revendre are pre-owned garments and may show normal signs of wear.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">7. Fees and Charges</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Revendre may charge certain service-related fees including:</p>
            <ul className="text-earth-600 text-sm leading-relaxed space-y-1 pl-5 list-disc mb-2">
              <li>Logistics fees for product transportation and delivery</li>
              <li>Sanitization fees for garment cleaning and preparation</li>
              <li>Payment gateway processing fees</li>
            </ul>
            <p className="text-earth-600 text-sm leading-relaxed">All applicable charges will be clearly displayed before payment confirmation. Revendre reserves the right to modify service fees with prior notice.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">8. Orders, Logistics and Delivery</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Orders are processed only after successful payment confirmation. Revendre coordinates logistics to collect items, perform sanitization, and deliver to buyers. Risk of loss transfers to the buyer upon successful delivery confirmation. Revendre reserves the right to cancel orders suspected of fraud or policy violations.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">9. Seller Pickup Verification</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Items may be inspected at the time of collection from the seller to verify they match the images and description, category, and condition. If the item does not match, Revendre may reject the item, cancel the order, or suspend the seller account for repeated violations.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">10. Product Condition and Sanitization</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Because products are pre-owned, they may show natural signs of usage. Revendre may perform sanitization procedures before delivery, but does not guarantee garments will be free from cosmetic imperfections or minor defects associated with second-hand clothing.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">11. Returns and Refunds</h3>
            <p className="text-earth-600 text-sm leading-relaxed mb-2">Returns are accepted only if the product is significantly different from its listing description or damaged during delivery. Return requests must be submitted within 5 days of delivery.</p>
            <p className="text-earth-600 text-sm leading-relaxed">Refunds will be processed after inspection and may be denied in cases of buyer misuse, false claims, or product tampering.</p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">12. Prohibited Listings and Activities</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Users must not list counterfeit branded clothing, stolen goods, illegal items, or non-clothing products. Prohibited activities include hacking, manipulation of ratings, or illegal financial activity.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">13. Payment Disputes and Chargebacks</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Revendre reserves the right to suspend accounts and investigate transactions for unjustified chargebacks. Seller payouts may be temporarily withheld during dispute investigations.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">14. Intellectual Property</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              All intellectual property, including software, logos, platform design, and trademarks, are owned by Touchnova LLP. Unauthorized reproduction is prohibited.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">15. Limitation of Liability</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Revendre's maximum liability shall not exceed the transaction value paid through the platform. We are not liable for indirect damages, profits loss, or logistics delays outside our control.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">16. Indemnification</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Users agree to indemnify Revendre and Touchnova LLP from any claims or losses arising from platform misuse or violation of these Terms.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">17. Force Majeure</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Revendre is not liable for delays caused by events beyond reasonable control, including natural disasters, technical failures, or logistics disruptions.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">18. Data and Privacy</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              User data is handled in accordance with Indian information technology laws and Revendre's Privacy Policy. Sensitive payment card details are not stored.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">19. Termination</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Revendre reserves the right to suspend or terminate platform access for policy violations or detected fraudulent activity without prior notice.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">20. Governing Law and Dispute Resolution</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              These Terms shall be governed by the laws of India. Disputes shall first be attempted to be resolved through negotiation; if unresolved, disputes shall be settled through arbitration in Chennai, Tamil Nadu.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">21. Modifications to Terms</h3>
            <p className="text-earth-600 text-sm leading-relaxed">
              Revendre reserves the right to update these Terms at any time. Continued use of the platform after updates constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h3 className="font-display font-black text-xl text-earth-900 mb-3">22. Contact Information</h3>
            <div className="text-earth-600 text-sm leading-relaxed">
              <p className="font-bold">Revendre</p>
              <p>(Operated by Touchnova LLP)</p>
              <div className="mt-2">
                <p className="font-bold">Registered Office:</p>
                <p>3-299, Greamspet</p>
                <p>Chittoor, Andhra Pradesh - 517002</p>
                <p>India</p>
              </div>
              <div className="mt-2">
                <p className="font-bold">Operational Office:</p>
                <p>Chennai, Tamil Nadu, India</p>
              </div>
              <p className="mt-2"><strong>Email:</strong> teamrevendre@gmail.com</p>
              <p><strong>Phone:</strong> +91 8317696536</p>
            </div>
          </section>
        </div>
      </div>

      <div className="px-6 py-6 border-t border-earth-50 text-center space-y-1">
        <p className="text-[10px] font-black text-earth-400 tracking-widest flex items-center justify-center gap-1.5 uppercase">
          Made with <span className="text-rose-500 text-xs animate-pulse">❤️</span> in Chennai
        </p>
        <p className="text-[10px] font-black text-earth-300 uppercase tracking-tighter">
          © 2026 Touchnova LLP. All Rights Reserved.
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
          © 2026 Touchnova LLP
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
            © 2026 Touchnova LLP
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Settings Component ---

export const Settings: React.FC<SettingsProps> = ({ currentUser, allUsers, onUpdateUser, onDeleteAccount, onBack, initialView = 'menu' }) => {
  const [currentView, setCurrentView] = useState<SearchResultView>(initialView);
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (currentView) {
      case 'account': 
        return <AccountView currentUser={currentUser} onUpdateUser={onUpdateUser} onDeleteAccount={onDeleteAccount} onBackToMenu={() => setCurrentView('menu')} />;
      case 'notifications': 
        return <NotificationsView onBack={() => setCurrentView('menu')} />;
      case 'privacy': 
        return <PrivacySecurityView currentUser={currentUser} allUsers={allUsers} onUpdateUser={onUpdateUser} onBack={() => setCurrentView('menu')} />;
      case 'help': 
        return <HelpSupportView onBack={() => setCurrentView('menu')} initialActiveView="menu" />;
      case 'help-blocked':
        return <HelpSupportView onBack={() => setCurrentView('menu')} initialActiveView="blocked" />;
      case 'help-report-user':
        return <HelpSupportView onBack={() => setCurrentView('menu')} initialActiveView="report-user" />;
      case 'help-report-product':
        return <HelpSupportView onBack={() => setCurrentView('menu')} initialActiveView="report-product" />;
      case 'help-contact':
        return <HelpSupportView onBack={() => setCurrentView('menu')} initialActiveView="contact" />;
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

import React, { useState } from 'react';
import { User } from '../types';
import { ChevronLeft, Zap } from 'lucide-react';
import { NeoSparkles } from './NeoIcons';

interface WithdrawScreenProps {
  user: User;
  totalEarned: number;
  onBack: () => void;
}

export const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ user, totalEarned, onBack }) => {
  const [withdrawnAmount, setWithdrawnAmount] = useState(1500);
  const [withdrawalInput, setWithdrawalInput] = useState('');
  const [remainingBalance, setRemainingBalance] = useState(totalEarned - withdrawnAmount);
  const [success, setSuccess] = useState(false);

  const handleConfirmWithdraw = () => {
    const amount = parseFloat(withdrawalInput);
    if (amount > 0 && amount <= remainingBalance) {
      setWithdrawnAmount(withdrawnAmount + amount);
      setRemainingBalance(remainingBalance - amount);
      setWithdrawalInput('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

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
        <h2 className="font-display font-black text-2xl text-earth-900">Withdraw Funds</h2>
      </div>

      <div className="px-6 space-y-6">
        {/* Success Message */}
        {success && (
          <div className="bg-pop-lime/20 border border-pop-lime text-earth-900 p-4 rounded-2xl font-bold animate-pulse">
            ✓ Withdrawal request submitted successfully!
          </div>
        )}

        {/* Financial Overview Cards */}
        <div className="space-y-4">
          {/* Total Earned */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-earth-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-earth-500 text-xs font-bold uppercase">
              <NeoSparkles className="w-4 h-4 text-pop-yellow" /> Total Earned
            </div>
            <h3 className="font-display font-black text-4xl text-earth-900">₹{totalEarned}</h3>
          </div>

          {/* Total Withdrawn */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-earth-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-earth-500 text-xs font-bold uppercase">
              <Zap className="w-4 h-4 text-pop-cyan" /> Total Withdrawn
            </div>
            <h3 className="font-display font-black text-4xl text-earth-900">₹{withdrawnAmount}</h3>
          </div>

          {/* Remaining Balance */}
          <div className="bg-gradient-to-br from-brand-500 to-pop-purple text-white p-6 rounded-[2.5rem] shadow-lg">
            <div className="flex items-center gap-2 mb-2 text-white/80 text-xs font-bold uppercase mb-3">
              <span>💰</span> Available Balance
            </div>
            <h3 className="font-display font-black text-4xl mb-1">₹{remainingBalance}</h3>
            <p className="text-white/70 text-sm font-medium">Ready to withdraw</p>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-earth-100 shadow-sm">
          <h3 className="font-display font-bold text-lg mb-4 text-earth-900">Initiate Withdrawal</h3>

          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-bold text-earth-600 mb-2">
                Withdrawal Amount
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-earth-900">₹</span>
                <input
                  type="number"
                  value={withdrawalInput}
                  onChange={(e) => setWithdrawalInput(e.target.value)}
                  placeholder="Enter amount"
                  max={remainingBalance}
                  className="flex-1 bg-earth-50 border-2 border-earth-200 rounded-xl px-4 py-3 font-black text-earth-900 placeholder-earth-400 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <p className="text-xs text-earth-500 font-medium mt-2">
                Max available: ₹{remainingBalance}
              </p>
            </div>

            {/* Quick Amount Buttons */}
            {remainingBalance > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  Math.round(remainingBalance * 0.25),
                  Math.round(remainingBalance * 0.5),
                  remainingBalance
                ].map((amt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setWithdrawalInput(amt.toString())}
                    className="bg-earth-50 border border-earth-200 rounded-xl py-2 font-bold text-sm text-earth-900 hover:bg-earth-100 transition-colors"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleConfirmWithdraw}
              disabled={!withdrawalInput || parseFloat(withdrawalInput) <= 0 || parseFloat(withdrawalInput) > remainingBalance}
              className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              Confirm Withdrawal
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-earth-50 border border-earth-200 rounded-[2rem] p-4">
          <p className="text-xs text-earth-600 font-medium">
            💡 Withdrawals are processed within 2-3 business days. The amount will be transferred to your registered bank account.
          </p>
        </div>
      </div>
    </div>
  );
};

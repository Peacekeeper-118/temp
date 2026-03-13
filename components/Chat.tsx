
import React, { useState, useEffect } from 'react';
import { User, ChatThread, Message, Post } from '../types';
import { Send, ShieldAlert, ChevronLeft, ShoppingBag } from 'lucide-react';
import { Button } from './Button';

interface ChatProps {
  currentUser: User;
  onBack: () => void;
}

export const Chat: React.FC<ChatProps> = ({ currentUser, onBack }) => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [safetyWarning, setSafetyWarning] = useState('');

  // Regex to block phone numbers and emails
  const SAFETY_REGEX = /(\b\d{10}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b)|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Safety Check
    if (SAFETY_REGEX.test(inputText)) {
      setSafetyWarning("⚠️ For your safety, sharing phone numbers or emails is not allowed. Please keep communication on Revendre.");
      return;
    }

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setSafetyWarning('');
  };

  const ActiveThreadView = () => {
    return (
      <div className="flex flex-col h-full bg-white animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b border-earth-100 flex items-center gap-3 bg-white/95 backdrop-blur z-10 sticky top-0">
          <button onClick={() => setActiveThreadId(null)} className="p-2 hover:bg-earth-50 rounded-full text-earth-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h3 className="font-bold text-earth-900">Chat</h3>
          </div>
          <button className="text-earth-400 hover:text-red-500">
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-earth-50/50">
             <div className="text-center text-xs text-earth-400 mt-4">
                 No messages yet.
             </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-earth-100">
            {safetyWarning && (
                <div className="mb-3 text-xs text-pop-rose bg-pop-rose/10 p-2 rounded-lg font-bold flex items-center gap-2 animate-pop">
                    <ShieldAlert className="w-4 h-4" /> {safetyWarning}
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => {
                      setInputText(e.target.value);
                      setSafetyWarning('');
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-earth-50 border border-earth-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
                />
                <button type="submit" className="bg-brand-600 text-white p-2.5 rounded-full hover:bg-brand-700 active:scale-90 transition-all shadow-lg shadow-brand-500/30">
                    <Send className="w-5 h-5 ml-0.5" />
                </button>
            </form>
        </div>
      </div>
    );
  };

  if (activeThreadId) {
    return <ActiveThreadView />;
  }

  return (
    <div className="bg-white min-h-full flex flex-col">
       <div className="p-4 border-b border-earth-100 flex items-center gap-3 sticky top-0 bg-white/95 backdrop-blur z-10">
          <button onClick={onBack} className="p-2 hover:bg-earth-50 rounded-full text-earth-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="font-display font-bold text-xl text-earth-900">Messages</h2>
       </div>

       <div className="flex-1 overflow-y-auto flex items-center justify-center text-earth-400 text-sm">
           No conversations.
       </div>
    </div>
  );
};
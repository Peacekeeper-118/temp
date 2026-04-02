//Auth 
import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Check, ArrowRight, Phone, ArrowLeft, AlertCircle } from 'lucide-react';
import { NeoSparkles, NeoSneaker } from './NeoIcons';
import { auth, signInWithPhoneNumber, RecaptchaVerifier } from '../services/firebase';
import type { ConfirmationResult } from '../services/firebase';

interface AuthProps {
    onLoginSuccess: (method: string, ageEligibleForPayouts: boolean, data?: { phoneNumber?: string, isSignup?: boolean }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
    const [is18Plus, setIs18Plus] = useState(false);

    const [view, setView] = useState<'main' | 'mobile_phone' | 'mobile_otp'>('main');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const recaptchaVerifierRef = useRef<InstanceType<typeof RecaptchaVerifier> | null>(null);
    const confirmationResultRef = useRef<ConfirmationResult | null>(null);

    const clearRecaptcha = () => {
        if (recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current.clear();
            recaptchaVerifierRef.current = null;
        }
    };

    const handleGoogleLogin = () => {
        if (authMode === 'signup' && !is18Plus) return;
        onLoginSuccess('google', is18Plus, { isSignup: authMode === 'signup' });
    };

    const handleMobileStart = () => {
        if (authMode === 'signup' && !is18Plus) return;
        setError('');
        setView('mobile_phone');
    };

    const handleSendOtp = async () => {
        if (phoneNumber.length < 10) return;
        setIsLoading(true);
        setError('');
        clearRecaptcha();

        try {
            const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => { },
            });
            recaptchaVerifierRef.current = verifier;

            const result = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, verifier);
            confirmationResultRef.current = result;
            setView('mobile_otp');
        } catch (err: any) {
            console.error('OTP send error:', err);
            clearRecaptcha();
            if (err.code === 'auth/invalid-phone-number') {
                setError('Invalid phone number. Please check and try again.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many attempts. Please try again later.');
            } else {
                setError('Failed to send OTP. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 6 || !confirmationResultRef.current) return;
        setIsLoading(true);
        setError('');

        try {
            await confirmationResultRef.current.confirm(otp);
            // onAuthStateChanged in App.tsx fires automatically — signal loading
            onLoginSuccess('mobile', is18Plus, {
                phoneNumber: `+91${phoneNumber}`,
                isSignup: authMode === 'signup'
            });
        } catch (err: any) {
            console.error('OTP verify error:', err);
            if (err.code === 'auth/invalid-verification-code') {
                setError('Incorrect OTP. Please try again.');
            } else if (err.code === 'auth/code-expired') {
                setError('OTP expired. Please go back and request a new one.');
            } else {
                setError('Verification failed. Please try again.');
            }
            setIsLoading(false);
        }
    };

    const isMainActionEnabled = authMode === 'login' || is18Plus;

    return (
        <div className="min-h-screen bg-[#F8F8F7] flex flex-col relative overflow-hidden font-sans">
            {/* Invisible reCAPTCHA container — must be in the DOM */}
            <div id="recaptcha-container"></div>

            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pop-purple/10 rounded-full blur-[120px] animate-blob mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pop-cyan/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply pointer-events-none" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-pop-yellow/10 rounded-full blur-[80px] animate-blob animation-delay-4000 mix-blend-multiply pointer-events-none" style={{ animationDelay: '4s' }}></div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-md mx-auto">
                <div className="mb-8 text-center animate-bounce-in w-full">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="bg-white/80 backdrop-blur border border-earth-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-earth-900 shadow-sm flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-pop-lime animate-pulse"></span> India's #1 Thrift Community App
                        </span>
                    </div>

                    <div className="relative inline-block">
                        <h1 className="font-logo font-black text-[4.5rem] leading-[0.9] tracking-tight text-earth-900 mb-2 relative z-10 drop-shadow-sm">
                            Revendre<span className="text-pop-cyan">.</span>
                        </h1>
                        <div className="absolute -top-6 -right-8 animate-float">
                            <NeoSparkles className="w-10 h-10" />
                        </div>
                        <div className="absolute -bottom-2 -left-6 animate-float" style={{ animationDelay: '1.5s' }}>
                            <NeoSneaker className="w-10 h-10" />
                        </div>
                    </div>
                    <p className="text-earth-500 font-medium text-lg tracking-tight mt-4 max-w-[280px] mx-auto leading-relaxed">
                        Buy & Sell pre-loved fashion. <br />
                        <span className="text-earth-900 font-bold bg-pop-yellow/30 px-1 rounded">No fast fashion.</span> Just vibez.
                    </p>
                </div>

                <div className="w-full bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl shadow-earth-900/5 border border-white animate-slide-up relative overflow-hidden transition-all duration-300">
                    {view === 'main' && (
                        <div className="flex p-1 bg-earth-100 rounded-xl mb-6">
                            <button
                                onClick={() => setAuthMode('signup')}
                                className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-wide transition-all duration-200 ${authMode === 'signup' ? 'bg-white text-earth-900 shadow-sm scale-100' : 'text-earth-400 hover:text-earth-600'}`}
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={() => setAuthMode('login')}
                                className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-wide transition-all duration-200 ${authMode === 'login' ? 'bg-white text-earth-900 shadow-sm scale-100' : 'text-earth-400 hover:text-earth-600'}`}
                            >
                                Sign In
                            </button>
                        </div>
                    )}

                    {view === 'main' ? (
                        <div className="animate-fade-in-up">
                            <div className="flex items-center justify-between mb-6 pl-2">
                                <h2 className="font-display font-bold text-xl text-earth-900">
                                    {authMode === 'signup' ? "Create account" : "Welcome back"}
                                </h2>
                            </div>

                            {authMode === 'signup' && (
                                <div className="space-y-3 mb-6">
                                    <div
                                        onClick={() => setIs18Plus(v => !v)}
                                        className={`group flex items-center gap-4 cursor-pointer p-4 rounded-2xl transition-all border-2 select-none ${is18Plus ? 'bg-white border-earth-900 shadow-lg transform scale-[1.02]' : 'bg-transparent border-earth-200 hover:bg-white/50 hover:border-earth-300'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${is18Plus ? 'bg-earth-900 border-earth-900' : 'border-earth-300 group-hover:border-earth-400 bg-white'}`}>
                                            {is18Plus && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                                        </div>
                                        <div className="flex-1">
                                            <span className={`block text-sm font-bold transition-colors ${is18Plus ? 'text-earth-900' : 'text-earth-600'}`}>I am 18+ years old</span>
                                            <span className="block text-[10px] text-earth-400 font-bold uppercase tracking-wide">Required</span>
                                        </div>
                                    </div>
                                    {!is18Plus && (
                                        <div className="flex items-center gap-2 px-2 animate-pulse mt-2">
                                            <AlertCircle className="w-3 h-3 text-pop-orange" />
                                            <p className="text-[10px] font-bold text-pop-orange">You must confirm this to continue</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                <Button
                                    className="w-full py-3 text-base bg-earth-900 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 active:translate-y-0 flex items-center justify-center gap-3"
                                    disabled={!isMainActionEnabled}
                                    onClick={handleGoogleLogin}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.52 12.29C23.52 11.43 23.45 10.71 23.3 10H12V14.51H18.5C18.23 15.99 17.36 17.26 16.09 18.1V21.09H19.95C22.22 19.01 23.52 15.93 23.52 12.29Z" fill="#4285F4" />
                                        <path d="M12 24C15.24 24 17.96 22.92 19.95 21.09L16.09 18.1C15.01 18.82 13.63 19.25 12 19.25C8.87 19.25 6.22 17.14 5.27 14.29H1.28V17.38C3.25 21.3 7.31 24 12 24Z" fill="#34A853" />
                                        <path d="M5.27 14.29C5.03 13.57 4.9 12.8 4.9 12C4.9 11.2 5.03 10.43 5.27 9.71V6.62H1.28C0.46 8.24 0 10.06 0 12C0 13.94 0.46 15.76 1.28 17.38L5.27 14.29Z" fill="#FBBC05" />
                                        <path d="M12 4.75C13.77 4.75 15.35 5.36 16.6 6.55L20.03 3.12C17.96 1.19 15.24 0 12 0C7.31 0 3.25 2.7 1.28 6.62L5.27 9.71C6.22 6.86 8.87 4.75 12 4.75Z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full py-3 text-base font-bold border-2 border-earth-200 hover:bg-earth-50 bg-white text-earth-900 flex items-center justify-center gap-3 shadow-md"
                                    disabled={!isMainActionEnabled}
                                    onClick={handleMobileStart}
                                >
                                    <Phone className="w-5 h-5 text-earth-900" />
                                    Mobile Number
                                </Button>
                            </div>

                            <p className="mt-6 text-center text-[10px] text-earth-400 font-bold uppercase tracking-wider px-4 leading-relaxed">
                                By continuing, you agree to our <span className="underline cursor-pointer hover:text-earth-600 transition-colors">Terms</span>.
                            </p>
                        </div>
                    ) : view === 'mobile_phone' ? (
                        <div className="animate-slide-in-right">
                            <button onClick={() => { setView('main'); setError(''); clearRecaptcha(); }} className="mb-6 flex items-center gap-2 text-earth-500 text-xs font-bold uppercase hover:text-earth-900 bg-earth-50 px-3 py-2 rounded-lg w-fit transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <h2 className="font-display font-bold text-2xl mb-2 text-earth-900">What's your number?</h2>
                            <p className="text-earth-500 text-sm mb-6 font-medium">We'll send you a 6-digit OTP to verify.</p>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-earth-100 px-4 py-4 rounded-2xl font-bold text-earth-900 text-lg border-2 border-transparent">+91</div>
                                <input
                                    autoFocus
                                    type="tel"
                                    id="auth-phone"
                                    name="phone"
                                    autoComplete="tel"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                                        setError('');
                                    }}
                                    maxLength={10}
                                    placeholder="00000 00000"
                                    className="flex-1 bg-earth-50 border-2 border-transparent focus:border-earth-900 focus:bg-white px-4 py-4 rounded-2xl font-bold text-lg outline-none transition-all placeholder:text-earth-300"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 mb-4 p-3 bg-pop-rose/5 rounded-xl border border-pop-rose/20">
                                    <AlertCircle className="w-4 h-4 text-pop-rose shrink-0" />
                                    <p className="text-xs font-bold text-pop-rose">{error}</p>
                                </div>
                            )}

                            <Button
                                className="w-full py-3 text-base shadow-lg"
                                disabled={phoneNumber.length < 10 || isLoading}
                                onClick={handleSendOtp}
                                isLoading={isLoading}
                            >
                                Get OTP <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    ) : (
                        <div className="animate-slide-in-right">
                            <button onClick={() => { setView('mobile_phone'); setOtp(''); setError(''); }} className="mb-6 flex items-center gap-2 text-earth-500 text-xs font-bold uppercase hover:text-earth-900 bg-earth-50 px-3 py-2 rounded-lg w-fit transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Edit Number
                            </button>
                            <h2 className="font-display font-bold text-2xl mb-2 text-earth-900">Enter OTP</h2>
                            <p className="text-earth-500 text-sm mb-6 font-medium">Sent to +91 {phoneNumber}</p>

                            <input
                                autoFocus
                                type="text"
                                id="auth-otp"
                                name="otp"
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                    setError('');
                                }}
                                placeholder="000000"
                                className="w-full bg-earth-50 border-2 border-transparent focus:border-earth-900 focus:bg-white px-4 py-4 rounded-2xl font-display font-black text-3xl text-center outline-none transition-all tracking-[0.5em] mb-4 placeholder:text-earth-200 text-earth-900"
                            />

                            {error && (
                                <div className="flex items-center gap-2 mb-4 p-3 bg-pop-rose/5 rounded-xl border border-pop-rose/20">
                                    <AlertCircle className="w-4 h-4 text-pop-rose shrink-0" />
                                    <p className="text-xs font-bold text-pop-rose">{error}</p>
                                </div>
                            )}

                            <Button
                                className="w-full py-3 text-base shadow-lg"
                                disabled={otp.length < 6 || isLoading}
                                onClick={handleVerifyOtp}
                                isLoading={isLoading}
                            >
                                Verify & Continue
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};






import React from 'react';

interface NeoIconProps {
  className?: string;
}

export const NeoSkateboard: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="24" rx="10" ry="2" fill="#1C1917" opacity="0.2"/>
    <path d="M6 16C6 14.8954 6.89543 14 8 14H24C25.1046 14 26 14.8954 26 16V18C26 19.1046 25.1046 20 24 20H8C6.89543 20 6 19.1046 6 18V16Z" fill="#FF9F1C" stroke="#1C1917" strokeWidth="2"/>
    <path d="M9 16H23" stroke="#FFE66D" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="20" r="3" fill="#4ECDC4" stroke="#1C1917" strokeWidth="2"/>
    <circle cx="23" cy="20" r="3" fill="#4ECDC4" stroke="#1C1917" strokeWidth="2"/>
    <circle cx="9" cy="20" r="1" fill="white"/>
    <circle cx="23" cy="20" r="1" fill="white"/>
  </svg>
);

export const NeoButterfly: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 12C16 12 12 6 8 8C4 10 6 16 16 18C26 16 28 10 24 8C20 6 16 12 16 12Z" fill="#9D4EDD" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 18C16 18 10 26 8 24C6 22 10 18 16 18Z" fill="#FF8787" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 18C16 18 22 26 24 24C26 22 18 16 18Z" fill="#FF8787" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <ellipse cx="16" cy="16" rx="1.5" ry="8" fill="#1C1917"/>
    <path d="M14 8L12 4" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M18 8L20 4" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const NeoSparkles: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L18.5 11.5L28 14L18.5 16.5L16 26L13.5 16.5L4 14L13.5 11.5L16 2Z" fill="#FFE66D" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M24 21L25 24L28 25L25 26L24 29L23 26L20 25L23 24L24 21Z" fill="#4ECDC4" stroke="#1C1917" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="10" cy="8" r="2" fill="#FF6B6B" stroke="#1C1917" strokeWidth="1.5"/>
  </svg>
);

export const NeoSneaker: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 24H26C27.1 24 28 23.1 28 22V20C28 18.9 27.1 18 26 18H24L22 10H14L10 18H6C4.9 18 4 18.9 4 20V22C4 23.1 4.9 24 6 24Z" fill="#4ECDC4" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M14 10V18" stroke="#1C1917" strokeWidth="1.5"/>
    <path d="M18 10V18" stroke="#1C1917" strokeWidth="1.5"/>
    <rect x="10" y="10" width="12" height="4" fill="#FF6B6B" stroke="#1C1917" strokeWidth="1.5"/>
    <path d="M4 22H28" stroke="#1C1917" strokeWidth="2"/>
    <path d="M8 24V26" stroke="#1C1917" strokeWidth="2"/>
    <path d="M24 24V26" stroke="#1C1917" strokeWidth="2"/>
  </svg>
);

export const NeoCassette: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="24" height="16" rx="2" fill="#FF9F1C" stroke="#1C1917" strokeWidth="2"/>
    <rect x="6" y="10" width="20" height="4" rx="1" fill="#1C1917"/>
    <circle cx="10" cy="18" r="2" fill="white" stroke="#1C1917" strokeWidth="1.5"/>
    <circle cx="22" cy="18" r="2" fill="white" stroke="#1C1917" strokeWidth="1.5"/>
    <path d="M14 18H18" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const NeoFire: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2C16 2 10 8 10 14C10 18.5 13 21 16 21C19 21 22 18.5 22 14C22 10 19 8 19 8" fill="#FF6B6B" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 21C16 21 12 24 12 28C12 30.2 13.8 32 16 32C18.2 32 20 30.2 20 28C20 25 18 24 18 24" fill="#FF9F1C" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 25V29" stroke="#FFE66D" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const NeoCamera: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="24" height="18" rx="3" fill="#0EA5E9" stroke="#1C1917" strokeWidth="2"/>
    <rect x="10" y="4" width="12" height="4" rx="1" fill="#0EA5E9" stroke="#1C1917" strokeWidth="2"/>
    <circle cx="16" cy="17" r="5" fill="white" stroke="#1C1917" strokeWidth="2"/>
    <circle cx="16" cy="17" r="2" fill="#1C1917"/>
    <circle cx="24" cy="12" r="1.5" fill="#FF6B6B" stroke="#1C1917" strokeWidth="1"/>
  </svg>
);

export const NeoRocket: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4C16 4 10 14 10 20H22C22 14 16 4 16 4Z" fill="#FF6B6B" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 20V24" stroke="#1C1917" strokeWidth="2"/>
    <path d="M10 20L6 26" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 20L26 26" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="14" r="2" fill="#FFE66D" stroke="#1C1917" strokeWidth="1.5"/>
    <path d="M16 26C16 26 14 28 14 30C14 31.1 14.9 32 16 32C17.1 32 18 31.1 18 30C18 28 16 26 16 26Z" fill="#FF9F1C"/>
  </svg>
);

export const NeoLightning: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2L6 18H16L14 30L26 14H16L18 2Z" fill="#FFE66D" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

export const NeoCheck: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="12" fill="#C7F464" stroke="#1C1917" strokeWidth="2"/>
    <path d="M10 16L14 20L22 12" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const NeoStar: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L20 12H30L22 18L25 28L16 22L7 28L10 18L2 12H12L16 2Z" fill="#FFE66D" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

export const NeoGhost: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 16C6 10.5 10.5 6 16 6C21.5 6 26 10.5 26 16V26L22 24L18 26L14 24L10 26L6 24V16Z" fill="#E7E5E4" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="2" fill="#1C1917"/>
    <circle cx="20" cy="14" r="2" fill="#1C1917"/>
    <path d="M14 20C14 20 15 21 16 21C17 21 18 20 18 20" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const NeoBag: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10V6C10 6 10 4 16 4C22 4 22 6 22 6V10" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
    <rect x="6" y="10" width="20" height="18" rx="2" fill="#FF8787" stroke="#1C1917" strokeWidth="2"/>
    <circle cx="16" cy="18" r="2" fill="#FFE66D" stroke="#1C1917" strokeWidth="1.5"/>
  </svg>
);

export const NeoFilter: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="20" height="4" rx="2" fill="#E7E5E4" stroke="#1C1917" strokeWidth="2"/>
    <rect x="6" y="14" width="20" height="4" rx="2" fill="#E7E5E4" stroke="#1C1917" strokeWidth="2"/>
    <rect x="6" y="22" width="20" height="4" rx="2" fill="#E7E5E4" stroke="#1C1917" strokeWidth="2"/>
    <circle cx="12" cy="8" r="3" fill="#FF9F1C" stroke="#1C1917" strokeWidth="2"/>
    <circle cx="20" cy="16" r="3" fill="#4ECDC4" stroke="#1C1917" strokeWidth="2"/>
    <circle cx="10" cy="24" r="3" fill="#FF6B6B" stroke="#1C1917" strokeWidth="2"/>
  </svg>
);

export const NeoSort: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6V26" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 12L16 6L22 12" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 18H12" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 22H10" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 26H8" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const NeoBookmark: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6C8 4.89543 8.89543 4 10 4H22C23.1046 4 24 4.89543 24 6V28L16 22L8 28V6Z" fill="#F0F9FF" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 10H20" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const NeoTag: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16L12 6H26C27.1 6 28 6.9 28 8V24C28 25.1 27.1 26 26 26H12L4 16Z" fill="#C7F464" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="10" cy="16" r="2" fill="white" stroke="#1C1917" strokeWidth="2"/>
    <path d="M18 13L21 19" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 14L17 18" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const NeoBot: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="20" height="16" rx="4" fill="#4ECDC4" stroke="#1C1917" strokeWidth="2"/>
    <path d="M10 8V4H12L12.5 8" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 8V4H20L19.5 8" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="2" fill="white" stroke="#1C1917" strokeWidth="1.5"/>
    <circle cx="20" cy="16" r="2" fill="white" stroke="#1C1917" strokeWidth="1.5"/>
    <path d="M13 20C13 20 15 21 17 21C19 21 19 20 19 20" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const NeoHeart: React.FC<NeoIconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28C16 28 4 20 4 12C4 8 7 5 11 5C13.5 5 15.5 6.5 16 8.5C16.5 6.5 18.5 5 21 5C25 5 28 8 28 12C28 20 16 28 16 28Z" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

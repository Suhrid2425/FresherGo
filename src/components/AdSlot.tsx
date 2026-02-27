import React, { useEffect } from 'react';

interface AdSlotProps {
  className?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
}

/**
 * AdSlot component for Google AdSense / AdX integration.
 * In a real environment, you would replace 'YOUR_CLIENT_ID' with your actual AdSense Publisher ID.
 */
export default function AdSlot({ className, slot, format = 'auto', responsive = true }: AdSlotProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container my-8 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Advertisement</span>
      <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center min-h-[100px] relative">
        {/* AdSense Tag */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with real Publisher ID
          data-ad-slot={slot || "XXXXXXXXXX"}      // Replace with real Slot ID
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
        
        {/* Placeholder for development visibility */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400">Google AdSense / AdX</p>
            <p className="text-[10px] text-slate-300">Slot: {slot || 'Auto'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

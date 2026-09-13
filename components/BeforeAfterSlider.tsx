"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function BeforeAfterSlider() {
  const { language } = useApp();
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseDown={() => { isDragging.current = true; }}
      onTouchStart={() => { isDragging.current = true; }}
      onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
      onTouchMove={(e) => isDragging.current && handleMove(e.touches[0].clientX)}
      className="relative w-full h-[280px] bg-slate-900 border border-slate-700 rounded-xl overflow-hidden cursor-ew-resize select-none shadow-inner"
    >
      
      {/* 1. BEFORE LAYER: Shows red transgression (Default Background) */}
      <div className="absolute inset-0 bg-slate-900 p-6 flex flex-col justify-between">
        {/* Draw a mock blueprint schematic */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20"></div>
        
        {/* Grid outline lines */}
        <div className="relative border border-slate-700 w-full h-full rounded flex items-center justify-center">
          {/* Gold setback line */}
          <div className="absolute bottom-12 left-6 right-6 border-b border-dashed border-accent-gold text-[8px] text-accent-gold text-right pb-1">
            SETBACK LIMIT (6.0m)
          </div>
          
          {/* Building boundary: crossing the setback line */}
          <div className="absolute bottom-6 left-12 right-12 top-12 bg-slate-800/80 border border-slate-600 rounded flex flex-col justify-between p-3">
            <span className="text-[9px] text-slate-500 font-mono">BUILDING BODY</span>
            
            {/* Red flashing violation band */}
            <div className="bg-red-500/20 border-t border-red-500 py-1.5 text-center text-[8px] text-red-400 font-black animate-pulse">
              ENCOACHMENT ERROR (-2.5m)
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-red-600 text-white font-bold text-[8px] px-2 py-0.5 rounded shadow z-10">
          {language === "ar" ? "قبل التعديل" : "BEFORE"}
        </div>
      </div>

      {/* 2. AFTER LAYER: Cut-out layer showing modified green layout */}
      <div 
        className="absolute inset-y-0 right-0 left-0 bg-slate-950 p-6 flex flex-col justify-between overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-35"></div>
        
        {/* Grid outline lines */}
        <div className="relative border border-slate-800 w-[calc(100vw-3rem)] h-full rounded flex items-center justify-center max-w-[700px]">
          {/* Gold setback line */}
          <div className="absolute bottom-12 left-6 right-6 border-b border-dashed border-accent-gold text-[8px] text-accent-gold text-right pb-1">
            SETBACK LIMIT (6.0m)
          </div>
          
          {/* Shrunk Building boundary: does not cross the setback line */}
          <div className="absolute bottom-12 left-12 right-12 top-12 bg-slate-800/90 border border-slate-600 rounded flex flex-col justify-between p-3">
            <span className="text-[9px] text-slate-500 font-mono">BUILDING BODY (SHIFTED BACK)</span>
            
            {/* Green safe spacing */}
            <div className="bg-green-500/10 border-t border-green-500 text-center py-1.5 text-[8px] text-green-400 font-bold">
              COMPLIANT (6.0m REACHED)
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-compliance-green text-white font-bold text-[8px] px-2 py-0.5 rounded shadow z-10">
          {language === "ar" ? "بعد التعديل" : "AFTER"}
        </div>
      </div>

      {/* 3. SLIDER CENTRAL BAR HANDLE */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-2xl"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white border border-slate-350 shadow-xl flex items-center justify-center font-mono text-[9px] font-black text-slate-600 select-none">
          ↔
        </div>
      </div>

    </div>
  );
}

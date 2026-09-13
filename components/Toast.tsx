"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export default function Toast() {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const { message, type } = toast;

  const bgColors = {
    success: "bg-emerald-50 border-emerald-500 text-emerald-800",
    error: "bg-red-50 border-red-500 text-red-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  };

  const Icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    error: <AlertTriangle className="h-5 w-5 text-red-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce shadow-2xl max-w-sm w-full rounded-lg border-l-4 p-4 bg-white bg-opacity-95 backdrop-blur-sm shadow-slate-300 transition-all duration-300">
      <div className={`flex items-start gap-3 p-1 rounded-md ${bgColors[type]}`}>
        <div className="flex-shrink-0">{Icons[type]}</div>
        <div className="flex-1 text-xs font-semibold leading-relaxed">
          {message}
        </div>
        <button
          onClick={hideToast}
          className="flex-shrink-0 ml-auto p-1 rounded hover:bg-slate-200 transition-colors"
        >
          <X className="h-3.5 w-3.5 text-slate-500" />
        </button>
      </div>
    </div>
  );
}

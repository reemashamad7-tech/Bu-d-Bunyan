"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  Sparkles, Layers, Minimize2, AlertTriangle, 
  Box, CheckCircle2, FileBarChart, Wrench, ShieldAlert 
} from "lucide-react";

export default function Services() {
  const { language, t } = useApp();

  const serviceIcons = [
    Sparkles,
    Layers,
    Minimize2,
    AlertTriangle,
    Box,
    Wrench,
    FileBarChart,
    CheckCircle2
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Title Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-black text-main-text">{t.servicesPage.title}</h1>
        <p className="text-sm text-muted-text max-w-2xl mx-auto">{t.servicesPage.subtitle}</p>
        <div className="h-1.5 w-16 bg-compliance-green mx-auto rounded"></div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {t.servicesPage.list.map((srv, idx) => {
          const Icon = serviceIcons[idx] || CheckCircle2;
          return (
            <div key={idx} className="bg-white-card p-6 border border-border-gray rounded-xl shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start">
              
              {/* Icon Container */}
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-compliance-green flex items-center justify-center flex-shrink-0">
                <Icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="space-y-3 flex-grow">
                <h3 className="text-base font-bold text-main-text">{srv.title}</h3>
                <p className="text-xs text-muted-text leading-relaxed">{srv.desc}</p>
                
                {/* Example Use Case Box */}
                <div className="p-3 bg-slate-50 rounded-lg border-l-2 border-compliance-green text-[10px] text-slate-600 font-semibold space-y-1">
                  <span className="text-compliance-green block font-bold uppercase tracking-wider text-[9px]">
                    {t.servicesPage.useCase}
                  </span>
                  <p>{srv.example}</p>
                </div>

                {/* Learn More Link */}
                <button className="text-xs font-bold text-compliance-green hover:underline pt-2 inline-flex items-center gap-1">
                  <span>{t.servicesPage.learnMore}</span>
                  <span className="text-[10px] font-normal text-muted-text">(MOCK)</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* bottom advisory disclaimer */}
      <div className="p-4 rounded-lg bg-amber-50 border border-accent-gold/20 flex gap-3 max-w-4xl mx-auto items-center">
        <ShieldAlert className="h-5 w-5 text-accent-gold flex-shrink-0" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {language === "ar" 
            ? "تنبيه: جميع خدمات التحليل والتحقق والتدقيق البرمجي المقدمة في هذه الصفحة هي خدمات محاكاة تهدف لمطابقة المخططات الهندسية مع الكود السعودي بشكل أولي، ولا تمثل إجازة بلدية أو اعتماداً إنشائياً رسمياً."
            : "Notice: All checks, CAD analysis, and validation services listed are preliminary simulation parameters designed to align plans with building codes. They do not constitute official construction permits."}
        </p>
      </div>

    </div>
  );
}

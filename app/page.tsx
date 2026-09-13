"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { 
  ArrowRight, ShieldCheck, AlertCircle, FileText, CheckCircle2,
  Sparkles, Layers, Box, RotateCcw, TrendingUp, HelpCircle
} from "lucide-react";

export default function Home() {
  const { language, t } = useApp();

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-primary-gray py-20 px-4 sm:px-6 lg:px-8 text-white overflow-hidden select-none">
        
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{language === "ar" ? "مدعوم بالذكاء الاصطناعي والتوأم الرقمي" : "Powered by AI & Digital Twin"}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/projects/new"
                className="flex items-center justify-center gap-2 bg-compliance-green text-white hover:bg-emerald-800 px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <span>{t.hero.startCheck}</span>
                <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
              <Link
                href="/services"
                className="flex items-center justify-center gap-2 border border-slate-600 hover:border-white hover:bg-slate-800/50 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                <span>{t.hero.watchDemo}</span>
              </Link>
            </div>
          </div>

          {/* Interactive Engineering Mock Visual */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-2xl bg-dark-viewer border border-slate-700 shadow-2xl p-6 overflow-hidden">
              
              {/* Engineering Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#3a3d40_1px,transparent_1px),linear-gradient(to_bottom,#3a3d40_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30"></div>
              
              {/* Land Boundary (Gold Offset Line) */}
              <div className="absolute inset-8 border-2 border-dashed border-accent-gold/40 rounded-xl flex items-center justify-center">
                <span className="absolute top-1 right-2 text-[9px] text-accent-gold/80 font-mono">SETBACK LIMIT</span>
              </div>
              
              {/* Main Building Block */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-slate-700/60 border-2 border-slate-500 rounded-lg flex flex-col justify-between p-3 z-10 shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] text-slate-300 font-mono">BUILDING HEIGHT: 15m</span>
                  <span className="h-2 w-2 rounded-full bg-compliance-green animate-ping"></span>
                </div>
                <div className="flex items-center justify-center gap-1.5 bg-slate-800/80 rounded px-2 py-1">
                  <Box className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[10px] text-white font-bold font-mono">COMMERCIAL 3D MODEL</span>
                </div>
              </div>

              {/* Front Violation Area (Red shade overlapping front setback limit) */}
              <div className="absolute bottom-8 left-12 right-12 h-10 bg-alert-red/20 border-t-2 border-alert-red rounded-b-lg flex items-center justify-center z-20">
                <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded text-[8px] border border-alert-red text-alert-red font-bold">
                  <AlertCircle className="h-3 w-3" />
                  <span>{language === "ar" ? "تعدي ارتداد أمامي" : "Front Setback Violation"}</span>
                </div>
              </div>

              {/* Floating Compliance widget */}
              <div className="absolute top-6 left-6 bg-slate-900/90 border border-slate-700 p-2.5 rounded-lg flex items-center gap-2.5 shadow-xl z-30 animate-pulse">
                <div className="h-9 w-9 rounded-full border-2 border-accent-gold flex items-center justify-center text-xs font-bold text-accent-gold">
                  78%
                </div>
                <div>
                  <h6 className="text-[9px] text-slate-400 font-semibold">{language === "ar" ? "نسبة الامتثال الحالية" : "Compliance Score"}</h6>
                  <p className="text-[10px] text-white font-bold">{language === "ar" ? "تحت المراجعة" : "Under Review"}</p>
                </div>
              </div>

              {/* Floating Success Check widget */}
              <div className="absolute bottom-6 right-6 bg-slate-900/90 border border-slate-700 p-2.5 rounded-lg flex items-center gap-2.5 shadow-xl z-30">
                <div className="h-6 w-6 rounded-full bg-compliance-green flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <span className="text-[10px] text-slate-300 font-bold">{language === "ar" ? "مطابقة الارتفاع" : "Height Compliant"}</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl bg-main-bg">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-main-text">{t.features.title}</h2>
          <div className="h-1.5 w-16 bg-compliance-green mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Smart Legislative Advisor */}
          <div className="bg-white-card p-6 rounded-xl border border-border-gray shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-compliance-green flex items-center justify-center transition-colors group-hover:bg-compliance-green group-hover:text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-main-text">{t.features.smartAdvisor.title}</h3>
              <p className="text-xs text-muted-text leading-relaxed">{t.features.smartAdvisor.desc}</p>
            </div>
            <Link href="/advisor" className="mt-6 flex items-center gap-1 text-xs font-bold text-compliance-green hover:underline">
              <span>{language === "ar" ? "اطرح سؤالاً" : "Ask a question"}</span>
              <ArrowRight className="h-3 w-3 rtl-flip" />
            </Link>
          </div>

          {/* Plan Analysis */}
          <div className="bg-white-card p-6 rounded-xl border border-border-gray shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-compliance-green flex items-center justify-center transition-colors group-hover:bg-compliance-green group-hover:text-white">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-main-text">{t.features.planAnalysis.title}</h3>
              <p className="text-xs text-muted-text leading-relaxed">{t.features.planAnalysis.desc}</p>
            </div>
            <Link href="/projects" className="mt-6 flex items-center gap-1 text-xs font-bold text-compliance-green hover:underline">
              <span>{language === "ar" ? "تصفح المشاريع" : "Browse projects"}</span>
              <ArrowRight className="h-3 w-3 rtl-flip" />
            </Link>
          </div>

          {/* 3D Simulation */}
          <div className="bg-white-card p-6 rounded-xl border border-border-gray shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-compliance-green flex items-center justify-center transition-colors group-hover:bg-compliance-green group-hover:text-white">
                <Box className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-main-text">{t.features.threeD.title}</h3>
              <p className="text-xs text-muted-text leading-relaxed">{t.features.threeD.desc}</p>
            </div>
            <Link href="/results" className="mt-6 flex items-center gap-1 text-xs font-bold text-compliance-green hover:underline">
              <span>{language === "ar" ? "افتح العارض" : "Open 3D Viewer"}</span>
              <ArrowRight className="h-3 w-3 rtl-flip" />
            </Link>
          </div>

          {/* Solutions & Reports */}
          <div className="bg-white-card p-6 rounded-xl border border-border-gray shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-compliance-green flex items-center justify-center transition-colors group-hover:bg-compliance-green group-hover:text-white">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-main-text">{t.features.reports.title}</h3>
              <p className="text-xs text-muted-text leading-relaxed">{t.features.reports.desc}</p>
            </div>
            <Link href="/solutions" className="mt-6 flex items-center gap-1 text-xs font-bold text-compliance-green hover:underline">
              <span>{language === "ar" ? "عرض الحلول" : "View solutions"}</span>
              <ArrowRight className="h-3 w-3 rtl-flip" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-16 bg-white border-y border-border-gray px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-main-text">{t.howItWorks.title}</h2>
            <div className="h-1.5 w-16 bg-compliance-green mx-auto rounded"></div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {t.howItWorks.steps.map((step, idx) => (
              <div key={idx} className="relative text-center space-y-3 p-4">
                {/* Number Badge */}
                <div className="h-10 w-10 rounded-full bg-slate-900 border-2 border-compliance-green text-white font-bold flex items-center justify-center mx-auto text-sm shadow-md">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-bold text-main-text">{step.title}</h4>
                <p className="text-[11px] text-muted-text leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-main-text">{t.trust.title}</h2>
          <div className="h-1.5 w-16 bg-compliance-green mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.trust.items.map((item, idx) => {
            const icons = [TrendingUp, HelpCircle, Box, Layers, RotateCcw];
            const Icon = icons[idx] || CheckCircle2;
            return (
              <div key={idx} className="bg-white-card p-6 border border-border-gray rounded-xl flex gap-4 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-emerald-50 text-compliance-green flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-main-text">{item.title}</h4>
                  <p className="text-[11px] text-muted-text leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Sticky Disclaimer / General Footer-level Disclaimer */}
      <section className="w-full py-8 bg-slate-50 border-t border-border-gray px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-4xl w-full text-center p-5 rounded-lg border border-accent-gold/30 bg-amber-50/50 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-accent-gold">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="text-right">
            <h4 className="text-xs font-bold text-slate-800 mb-1">{t.disclaimer.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === "ar" 
                ? "إن مخرجات منصة «بُعد بنيان» هي مؤشرات محاكاة استرشادية لتسهيل مراجعة وتجهيز المخططات، وليست رخصة بناء رسمية ولا تمنح أي اعتماد قانوني يغني عن التقديم المباشر على بوابة بلدي."
                : "The output of the «بُعد بنيان» platform consists of preliminary simulation checks for advisory assistance, and is not an official permit nor does it replace submitting direct permit requests on the Balady portal."}
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}

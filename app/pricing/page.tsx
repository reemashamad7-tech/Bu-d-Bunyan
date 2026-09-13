"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Check, X, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";

export default function Pricing() {
  const { language, t } = useApp();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Title Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-black text-main-text">{t.pricingPage.title}</h1>
        <p className="text-sm text-muted-text max-w-2xl mx-auto">{t.pricingPage.subtitle}</p>
        <div className="h-1.5 w-16 bg-compliance-green mx-auto rounded"></div>
      </div>

      {/* Monthly / Yearly Toggle */}
      <div className="flex justify-center items-center gap-4">
        <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-compliance-green" : "text-muted-text"}`}>
          {t.pricingPage.monthly}
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-300 transition-colors duration-200 ease-in-out focus:outline-none"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              billingCycle === "yearly" ? (language === "ar" ? "-translate-x-5" : "translate-x-5") : "translate-x-0"
            }`}
          />
        </button>
        <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-compliance-green" : "text-muted-text"}`}>
          <span>{t.pricingPage.yearly}</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {t.pricingPage.packages.map((pkg, idx) => {
          const isPopular = idx === 1; // Professional is popular
          const priceVal = parseInt(pkg.price);
          const finalPrice = billingCycle === "yearly" ? Math.round(priceVal * 0.8) : priceVal;

          return (
            <div
              key={idx}
              className={`bg-white-card rounded-xl border p-6 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow ${
                isPopular ? "border-2 border-compliance-green scale-105 z-10" : "border-border-gray"
              }`}
            >
              {isPopular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-compliance-green text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full">
                  {t.pricingPage.popular}
                </span>
              )}

              <div className="space-y-6">
                {/* Title and price */}
                <div className="text-center space-y-2 border-b border-border-gray pb-4">
                  <h3 className="text-base font-bold text-main-text">{pkg.name}</h3>
                  <p className="text-[10px] text-muted-text max-w-[200px] mx-auto leading-relaxed">{pkg.desc}</p>
                  <div className="pt-2">
                    <span className="text-3xl font-black text-main-text font-mono">{finalPrice}</span>
                    <span className="text-xs text-muted-text font-semibold">
                      {language === "ar" ? " ر.س / شهرياً" : " SAR / month"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <span className="text-[9px] text-compliance-green font-bold block">
                      {language === "ar" ? "مفوترة سنوياً (حسم 20%)" : "Billed annually (20% off)"}
                    </span>
                  )}
                </div>

                {/* Features list */}
                <ul className="space-y-3 text-xs">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-compliance-green flex-shrink-0" />
                    <span><strong>{pkg.features.projects}</strong> {t.pricingPage.featuresList.projects}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-compliance-green flex-shrink-0" />
                    <span><strong>{pkg.features.plans}</strong> {t.pricingPage.featuresList.plans}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-compliance-green flex-shrink-0" />
                    <span>{t.pricingPage.featuresList.reports}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-compliance-green flex-shrink-0" />
                    <span><strong>{pkg.features.storage}</strong> {t.pricingPage.featuresList.storage}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {pkg.features.collaboration ? (
                      <Check className="h-4 w-4 text-compliance-green flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-alert-red flex-shrink-0" />
                    )}
                    <span className={pkg.features.collaboration ? "" : "text-slate-400 line-through"}>
                      {t.pricingPage.featuresList.collaboration}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-compliance-green flex-shrink-0" />
                    <span><strong>{pkg.features.teamMembers}</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-compliance-green flex-shrink-0" />
                    <span>{pkg.features.support}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-compliance-green flex-shrink-0" />
                    <span>{t.pricingPage.featuresList.priority}: <strong>{pkg.features.priority}</strong></span>
                  </li>
                </ul>
              </div>

              {/* Subscribe button */}
              <button
                className={`mt-8 w-full py-2.5 rounded-lg text-xs font-bold transition-transform hover:-translate-y-0.5 shadow-sm ${
                  isPopular 
                    ? "bg-compliance-green text-white hover:bg-emerald-800" 
                    : "bg-slate-100 hover:bg-slate-200 text-main-text"
                }`}
              >
                {t.pricingPage.buttons.subscribe}
              </button>

            </div>
          );
        })}
      </div>

      {/* Trial Note Alert */}
      <div className="p-4 rounded-lg bg-amber-50 border border-accent-gold/20 flex gap-3 max-w-4xl mx-auto items-center">
        <ShieldAlert className="h-5 w-5 text-accent-gold flex-shrink-0" />
        <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
          {t.pricingPage.disclaimer}
        </p>
      </div>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-4 pt-8">
        <h3 className="text-xl font-black text-main-text text-center mb-6">
          {t.pricingPage.faq.title}
        </h3>
        <div className="space-y-3">
          {t.pricingPage.faq.list.map((item, idx) => (
            <div key={idx} className="border border-border-gray bg-white-card rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-right text-xs font-bold text-main-text hover:bg-slate-50 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-slate-50 border-t border-border-gray text-xs text-muted-text leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

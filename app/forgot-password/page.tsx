"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../../context/AppContext";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const { language, t, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      showToast(t.auth.toastSuccessReset, "success");
    }, 1500);
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-main-bg select-none">
      <div className="max-w-md w-full bg-white-card border border-border-gray p-8 rounded-xl shadow-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="بُعد بنيان" className="h-10 mx-auto object-contain" />
          <h2 className="text-lg font-black text-main-text">{t.auth.forgotTitle}</h2>
          <div className="h-1 w-12 bg-compliance-green mx-auto rounded"></div>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-compliance-green flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              {t.auth.toastSuccessReset}
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-bold text-compliance-green hover:underline"
              >
                <ArrowLeft className="h-4 w-4 rtl-flip" />
                <span>{t.auth.backToLogin}</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed text-center">
              {language === "ar" 
                ? "أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك."
                : "Enter your registered email address and we'll send you a password reset link."}
            </p>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-main-text">{t.auth.email}</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eng.khalid@example.com"
                  className="w-full px-3 py-2 pr-9 rounded-lg border border-border-gray text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
                />
                <Mail className={`absolute top-1/2 -translate-y-1/2 ${language === "ar" ? "left-3" : "right-3"} h-4 w-4 text-slate-400`} />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-compliance-green text-white hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed py-2.5 rounded-lg text-xs font-bold shadow-md transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>{t.common.loading}</span>
                </span>
              ) : (
                <span>{t.auth.sendResetLink}</span>
              )}
            </button>

            {/* Back Link */}
            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-bold text-compliance-green hover:underline"
              >
                <span>{t.auth.backToLogin}</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

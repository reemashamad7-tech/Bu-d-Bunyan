"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, HelpCircle } from "lucide-react";

export default function Login() {
  const { language, t, showToast } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("engineer");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    // Simulate API Auth Request
    setTimeout(() => {
      setLoading(false);
      showToast(t.auth.toastSuccessLogin, "success");
      router.push("/projects");
    }, 1500);
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-main-bg select-none">
      <div className="max-w-md w-full bg-white-card border border-border-gray p-8 rounded-xl shadow-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="بُعد بنيان" className="h-10 mx-auto object-contain" />
          <h2 className="text-lg font-black text-main-text">{t.auth.loginTitle}</h2>
          <div className="h-1 w-12 bg-compliance-green mx-auto rounded"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
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

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-main-text">{t.auth.password}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-9 rounded-lg border border-border-gray text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
              />
              <Lock className={`absolute top-1/2 -translate-y-1/2 ${language === "ar" ? "left-3" : "right-3"} h-4 w-4 text-slate-400`} />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 ${language === "ar" ? "right-3" : "left-3"} p-1 rounded hover:bg-slate-100 transition-colors`}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-main-text">{t.auth.userType}</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border-gray bg-white text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
            >
              <option value="owner">{t.auth.userTypes.owner}</option>
              <option value="engineer">{t.auth.userTypes.engineer}</option>
              <option value="firm">{t.auth.userTypes.firm}</option>
              <option value="advisor">{t.auth.userTypes.advisor}</option>
            </select>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1 select-none">
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border-gray text-compliance-green focus:ring-compliance-green"
              />
              <span>{t.auth.rememberMe}</span>
            </label>
            
            <Link href="/forgot-password" className="text-compliance-green font-bold hover:underline">
              {t.auth.forgotTitle}
            </Link>
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
              <span>{t.auth.loginBtn}</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="border-t border-border-gray pt-4 text-center text-xs text-slate-500">
          <span>{t.auth.noAccount} </span>
          <Link href="/register" className="text-compliance-green font-bold hover:underline">
            {t.auth.registerBtn}
          </Link>
        </div>

        {/* Sandbox details disclaimer */}
        <div className="p-3 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-400 text-center leading-relaxed">
          {language === "ar"
            ? "التسجيل والدخول تجريبي ومحفوظ محلياً، اكتب أي بريد إلكتروني وكلمة مرور للعبور."
            : "Login is simulated and persisted locally. Enter any dummy email and password to log in."}
        </div>

      </div>
    </div>
  );
}

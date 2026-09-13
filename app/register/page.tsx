"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { Mail, Lock, Eye, EyeOff, User, Phone, ShieldCheck } from "lucide-react";

export default function Register() {
  const { language, t, showToast } = useApp();
  const router = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("engineer");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!agreeTerms) {
      setValidationError(language === "ar" ? "يجب الموافقة على الشروط والأحكام" : "You must agree to the Terms");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError(language === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }

    setLoading(true);
    // Simulate Registration Request
    setTimeout(() => {
      setLoading(false);
      showToast(t.auth.toastSuccessRegister, "success");
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-main-bg select-none">
      <div className="max-w-md w-full bg-white-card border border-border-gray p-8 rounded-xl shadow-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="بُعد بنيان" className="h-10 mx-auto object-contain" />
          <h2 className="text-lg font-black text-main-text">{t.auth.registerTitle}</h2>
          <div className="h-1 w-12 bg-compliance-green mx-auto rounded"></div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="p-3 bg-red-50 border-l-4 border-alert-red rounded text-red-800 text-[11px] font-bold">
            {validationError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-main-text">{t.auth.fullName}</label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === "ar" ? "خالد الحربي" : "Khalid Al-Harbi"}
                className="w-full px-3 py-2 pr-9 rounded-lg border border-border-gray text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
              />
              <User className={`absolute top-1/2 -translate-y-1/2 ${language === "ar" ? "left-3" : "right-3"} h-4 w-4 text-slate-400`} />
            </div>
          </div>

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

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-main-text">{t.auth.phone}</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0505554321"
                className="w-full px-3 py-2 pr-9 rounded-lg border border-border-gray text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
              />
              <Phone className={`absolute top-1/2 -translate-y-1/2 ${language === "ar" ? "left-3" : "right-3"} h-4 w-4 text-slate-400`} />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-main-text">{t.auth.confirmPassword}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-9 rounded-lg border border-border-gray text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
                />
                <Lock className={`absolute top-1/2 -translate-y-1/2 ${language === "ar" ? "left-3" : "right-3"} h-4 w-4 text-slate-400`} />
              </div>
            </div>
          </div>

          <div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[10px] text-muted-text hover:text-compliance-green font-semibold"
            >
              {showPassword ? (language === "ar" ? "إخفاء كلمة المرور" : "Hide Password") : (language === "ar" ? "إظهار كلمة المرور" : "Show Password")}
            </button>
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

          {/* Agree to terms */}
          <label className="flex items-start gap-1.5 cursor-pointer text-xs pt-1 select-none font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-border-gray text-compliance-green focus:ring-compliance-green mt-0.5"
            />
            <span className="leading-tight">{t.auth.agreeTerms}</span>
          </label>

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
              <span>{t.auth.registerBtn}</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="border-t border-border-gray pt-4 text-center text-xs text-slate-500">
          <span>{t.auth.hasAccount} </span>
          <Link href="/login" className="text-compliance-green font-bold hover:underline">
            {t.auth.loginBtn}
          </Link>
        </div>

      </div>
    </div>
  );
}

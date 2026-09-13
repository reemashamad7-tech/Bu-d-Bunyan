"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import { Globe, Menu, X, Bell, User, ArrowRight, ClipboardList } from "lucide-react";

export default function Header() {
  const { language, setLanguage, t, activeProject } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      titleAr: "اكتمل تحليل مشروع الرياض",
      titleEn: "Analysis completed for Riyadh project",
      timeAr: "قبل 10 دقائق",
      timeEn: "10m ago",
      unread: true,
    },
    {
      id: 2,
      titleAr: "مخالفة ارتداد حرجة تم تحديدها",
      titleEn: "Critical setback violation identified",
      timeAr: "قبل ساعة",
      timeEn: "1h ago",
      unread: true,
    },
    {
      id: 3,
      titleAr: "تم إصدار تقرير فحص استرشادي",
      titleEn: "Advisory report generated successfully",
      timeAr: "قبل يوم",
      timeEn: "1 day ago",
      unread: false,
    },
  ];

  const handleLanguageToggle = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/services", label: t.nav.services },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/support", label: t.nav.support },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-gray bg-white-card shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 select-none" onClick={() => setMobileMenuOpen(false)}>
            {/* The official logo from public/logo.png */}
            <img 
              src="/logo.png" 
              alt="بُعد بنيان" 
              className="h-10 w-auto object-contain max-w-[150px] md:max-w-[180px] p-0.5" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-compliance-green border-b-2 border-compliance-green py-5 px-1 -mb-0.5"
                    : "text-main-text hover:text-compliance-green py-5 px-1"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/projects"
              className={`text-sm font-medium transition-colors ${
                isActive("/projects")
                  ? "text-compliance-green border-b-2 border-compliance-green py-5 px-1 -mb-0.5"
                  : "text-main-text hover:text-compliance-green py-5 px-1"
              }`}
            >
              {t.nav.myProjects}
            </Link>
            <Link
              href="/advisor"
              className={`text-sm font-medium transition-colors ${
                isActive("/advisor")
                  ? "text-compliance-green border-b-2 border-compliance-green py-5 px-1 -mb-0.5"
                  : "text-main-text hover:text-compliance-green py-5 px-1"
              }`}
            >
              {t.nav.legislativeAdvisor}
            </Link>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher */}
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 rounded-lg border border-border-gray px-3 py-1.5 text-xs font-semibold text-main-text hover:bg-main-bg transition-colors"
            title="Toggle Language / تبديل اللغة"
          >
            <Globe className="h-4 w-4 text-muted-text" />
            <span>{language === "ar" ? "English" : "العربية"}</span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
              }}
              className="relative p-2 rounded-lg border border-border-gray text-main-text hover:bg-main-bg transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-alert-red ring-2 ring-white"></span>
            </button>

            {notificationsOpen && (
              <div className={`absolute top-12 ${language === "ar" ? "left-0" : "right-0"} w-80 rounded-xl border border-border-gray bg-white-card p-3 shadow-xl z-50`}>
                <div className="flex items-center justify-between border-b border-border-gray pb-2 mb-2">
                  <h4 className="text-sm font-bold text-main-text">
                    {language === "ar" ? "الإشعارات التنبيهية" : "Notifications"}
                  </h4>
                  <span className="text-[10px] bg-light-blue-msg text-compliance-green px-2 py-0.5 rounded-full font-bold">
                    {language === "ar" ? "3 جديدة" : "3 new"}
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2 rounded-lg text-xs transition-colors hover:bg-main-bg cursor-pointer ${
                        notif.unread ? "bg-slate-50 font-medium" : ""
                      }`}
                    >
                      <p className="text-main-text">
                        {language === "ar" ? notif.titleAr : notif.titleEn}
                      </p>
                      <span className="text-[10px] text-muted-text">
                        {language === "ar" ? notif.timeAr : notif.timeEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg border border-border-gray px-3 py-1.5 hover:bg-main-bg transition-colors text-sm font-medium text-main-text"
            >
              <div className="h-6 w-6 rounded-full bg-primary-gray flex items-center justify-center text-white text-[10px] font-bold">
                {language === "ar" ? "م.خ" : "EK"}
              </div>
              <span className="text-xs truncate max-w-[80px]">
                {language === "ar" ? "م. خالد" : "Eng. Khalid"}
              </span>
            </button>

            {userMenuOpen && (
              <div className={`absolute top-12 ${language === "ar" ? "left-0" : "right-0"} w-48 rounded-xl border border-border-gray bg-white-card p-2 shadow-xl z-50`}>
                <div className="px-3 py-2 border-b border-border-gray text-xs text-muted-text">
                  <p className="font-semibold text-main-text">
                    {language === "ar" ? "مكتب الإتقان الهندسي" : "Al-Itqan Engineering"}
                  </p>
                  <p className="truncate mt-0.5">khalid@itqan.sa.mock</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/projects"
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-main-text hover:bg-main-bg rounded-lg"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <ClipboardList className="h-4 w-4 text-muted-text" />
                    <span>{t.nav.myProjects}</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-alert-red hover:bg-red-50 rounded-lg font-medium"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>{t.nav.logout}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main CTA Button: Start Check */}
          <Link
            href="/projects/new"
            className="hidden sm:flex items-center gap-1 bg-compliance-green text-white hover:bg-emerald-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-colors"
          >
            <span>{t.nav.startCheck}</span>
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-border-gray text-main-text hover:bg-main-bg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-gray bg-white-card p-4 space-y-4 shadow-inner">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-emerald-50 text-compliance-green"
                    : "text-main-text hover:bg-main-bg"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/projects"
              className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                isActive("/projects")
                  ? "bg-emerald-50 text-compliance-green"
                  : "text-main-text hover:bg-main-bg"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.myProjects}
            </Link>
            <Link
              href="/advisor"
              className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                isActive("/advisor")
                  ? "bg-emerald-50 text-compliance-green"
                  : "text-main-text hover:bg-main-bg"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.legislativeAdvisor}
            </Link>
          </nav>

          <div className="border-t border-border-gray pt-4 space-y-3">
            {/* User credentials for mobile */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-primary-gray flex items-center justify-center text-white text-xs font-bold">
                {language === "ar" ? "م.خ" : "EK"}
              </div>
              <div>
                <p className="text-xs font-bold text-main-text">
                  {language === "ar" ? "م. خالد" : "Eng. Khalid"}
                </p>
                <p className="text-[10px] text-muted-text">khalid@itqan.sa.mock</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/projects/new"
                className="flex items-center justify-center gap-2 bg-compliance-green text-white hover:bg-emerald-800 py-2.5 rounded-lg text-sm font-bold shadow-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{t.nav.startCheck}</span>
                <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
              
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 border border-border-gray hover:bg-slate-50 py-2.5 rounded-lg text-sm font-semibold text-alert-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{t.nav.logout}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

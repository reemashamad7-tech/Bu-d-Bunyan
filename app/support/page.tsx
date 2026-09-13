"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Search, ShieldCheck, HelpCircle, Mail, Phone, MapPin, 
  Send, Paperclip, AlertCircle, CheckCircle2 
} from "lucide-react";

export default function Support() {
  const { language, t } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    category: "technical",
    projectRef: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      setSubmitStatus("error");
      return;
    }
    // Simulate successful form submission
    setSubmitStatus("success");
    setFormData({
      subject: "",
      category: "technical",
      projectRef: "",
      message: "",
    });
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Title Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-black text-main-text">{t.supportPage.title}</h1>
        <p className="text-sm text-muted-text max-w-2xl mx-auto">{t.supportPage.subtitle}</p>
        <div className="h-1.5 w-16 bg-compliance-green mx-auto rounded"></div>
      </div>

      {/* Help Search bar */}
      <div className="max-w-xl mx-auto relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.supportPage.searchPlaceholder}
          className="w-full px-4 py-3 pr-10 rounded-xl border border-border-gray bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-compliance-green text-xs font-semibold"
        />
        <Search className={`absolute top-1/2 -translate-y-1/2 ${language === "ar" ? "left-3" : "right-3"} text-muted-text h-4 w-4`} />
      </div>

      {/* Support Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {t.supportPage.categories.map((cat, idx) => {
          const icons = [ShieldCheck, HelpCircle, Mail];
          const Icon = icons[idx] || HelpCircle;
          return (
            <div key={idx} className="bg-white-card border border-border-gray rounded-xl p-5 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-full bg-emerald-50 text-compliance-green flex items-center justify-center mx-auto">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-main-text">{cat.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{cat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Contact Form and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto pt-4">
        
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white-card border border-border-gray rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-main-text border-b border-border-gray pb-2 mb-2">
            {t.supportPage.formTitle}
          </h3>

          {submitStatus === "success" && (
            <div className="p-3.5 bg-emerald-50 border-l-4 border-compliance-green rounded text-emerald-800 text-[11px] flex gap-2 items-center">
              <CheckCircle2 className="h-4.5 w-4.5 text-compliance-green flex-shrink-0" />
              <span>{t.supportPage.formStatus.success}</span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-3.5 bg-red-50 border-l-4 border-alert-red rounded text-red-800 text-[11px] flex gap-2 items-center">
              <AlertCircle className="h-4.5 w-4.5 text-alert-red flex-shrink-0" />
              <span>{t.supportPage.formStatus.error}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Subject */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-main-text">{t.supportPage.formFields.subject}</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-gray text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
              />
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.supportPage.formFields.category}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border-gray bg-white text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
                >
                  <option value="technical">{t.supportPage.formFields.categories.technical}</option>
                  <option value="regulatory">{t.supportPage.formFields.categories.regulatory}</option>
                  <option value="billing">{t.supportPage.formFields.categories.billing}</option>
                  <option value="other">{t.supportPage.formFields.categories.other}</option>
                </select>
              </div>

              {/* Project ID */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.supportPage.formFields.projectRef}</label>
                <input
                  type="text"
                  placeholder="P-01"
                  value={formData.projectRef}
                  onChange={(e) => setFormData({ ...formData, projectRef: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border-gray text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
                />
              </div>
            </div>

            {/* Message Details */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-main-text">{t.supportPage.formFields.message}</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-gray text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none resize-none"
              />
            </div>

            {/* Attachment upload */}
            <div className="border border-dashed border-border-gray p-3 rounded-lg flex items-center justify-between text-[11px] text-muted-text hover:bg-slate-50 transition-colors cursor-pointer select-none">
              <div className="flex items-center gap-1.5">
                <Paperclip className="h-4 w-4 text-slate-400" />
                <span>{t.supportPage.formFields.attachment}</span>
              </div>
              <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded border border-border-gray font-mono">CHOOSE FILE</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 bg-compliance-green text-white hover:bg-emerald-800 py-2.5 rounded-lg text-xs font-bold shadow-md transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>{t.advisorPage.send}</span>
          </button>
        </form>

        {/* Details Container */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm text-slate-400 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 mb-2">
              {t.supportPage.contactInfo.title}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-compliance-green flex-shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-bold text-white mb-0.5">{language === "ar" ? "البريد الإلكتروني" : "Email Address"}</h6>
                  <p>{t.supportPage.contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-compliance-green flex-shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-bold text-white mb-0.5">{language === "ar" ? "الهاتف والدعم الهاتفي" : "Phone Number"}</h6>
                  <p className="font-mono">{t.supportPage.contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-compliance-green flex-shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-bold text-white mb-0.5">{language === "ar" ? "العنوان البريدي" : "Office Address"}</h6>
                  <p className="leading-relaxed">{t.supportPage.contactInfo.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border-l-2 border-accent-gold rounded text-[10px] text-slate-400 leading-relaxed font-semibold mt-6">
            {language === "ar"
              ? "ملاحظة: وسائل الاتصال والهاتف المعروضة هي محاكاة تجريبية للدعم ولا تقدم اتصالا حكوميا."
              : "Notice: Listed email and phone contacts are simulated support parameters for preview purposes."}
          </div>
        </div>

      </div>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, Project } from "../../../context/AppContext";
import { ChevronRight, ChevronLeft, Save, AlertTriangle, FileText } from "lucide-react";

export default function NewProject() {
  const { language, t, addProject } = useApp();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  // Form Fields
  const [form, setForm] = useState({
    name: "",
    type: "commercial",
    buildingUse: "",
    engineeringFirm: "",
    city: "",
    municipality: "",
    district: "",
    plotNumber: "",
    landArea: "",
    licenseType: "new",
    projectStage: "preliminary",
    floorsCount: "",
    planNumber: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Capture unsaved changes (beforeunload standard browser check)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = t.newProjectForm.warningUnsaved;
        return t.newProjectForm.warningUnsaved;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (field: string, val: string) => {
    setIsDirty(true);
    setForm({ ...form, [field]: val });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateStep = (currentStep: number) => {
    const stepErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.name.trim()) stepErrors.name = t.newProjectForm.validation.required;
      if (!form.buildingUse.trim()) stepErrors.buildingUse = t.newProjectForm.validation.required;
      if (!form.engineeringFirm.trim()) stepErrors.engineeringFirm = t.newProjectForm.validation.required;
    } else if (currentStep === 2) {
      if (!form.city.trim()) stepErrors.city = t.newProjectForm.validation.required;
      if (!form.municipality.trim()) stepErrors.municipality = t.newProjectForm.validation.required;
      if (!form.district.trim()) stepErrors.district = t.newProjectForm.validation.required;
      if (!form.plotNumber.trim()) stepErrors.plotNumber = t.newProjectForm.validation.required;
      
      const areaVal = parseFloat(form.landArea);
      if (!form.landArea.trim()) {
        stepErrors.landArea = t.newProjectForm.validation.required;
      } else if (isNaN(areaVal)) {
        stepErrors.landArea = t.newProjectForm.validation.number;
      } else if (areaVal <= 0) {
        stepErrors.landArea = t.newProjectForm.validation.positive;
      }
    } else if (currentStep === 3) {
      if (!form.planNumber.trim()) stepErrors.planNumber = t.newProjectForm.validation.required;
      
      const floorsVal = parseInt(form.floorsCount);
      if (!form.floorsCount.trim()) {
        stepErrors.floorsCount = t.newProjectForm.validation.required;
      } else if (isNaN(floorsVal)) {
        stepErrors.floorsCount = t.newProjectForm.validation.number;
      } else if (floorsVal <= 0) {
        stepErrors.floorsCount = t.newProjectForm.validation.positive;
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSaveDraft = () => {
    if (!form.name.trim()) {
      setErrors({ name: t.newProjectForm.validation.required });
      return;
    }
    // Save draft
    const newProj: Project = createProjectObject("draft");
    addProject(newProj);
    setIsDirty(false);
    router.push("/projects");
  };

  const handleConfirmSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }
    // Save and submit (status waiting for file uploads)
    const newProj: Project = createProjectObject("waiting");
    addProject(newProj);
    setIsDirty(false);
    router.push("/upload"); // Route to upload blueprints directly!
  };

  const createProjectObject = (status: Project["status"]): Project => {
    const isCommercial = form.type === "commercial";
    return {
      id: "P-" + Math.floor(Math.random() * 900 + 100),
      name: form.name,
      nameEn: isCommercial ? `Commercial Building - ${form.city}` : `Residential Building - ${form.city}`,
      city: form.city,
      cityEn: form.city,
      type: isCommercial ? "مبنى تجاري" : "مبنى سكني",
      typeEn: isCommercial ? "Commercial Building" : "Residential Building",
      landArea: parseFloat(form.landArea) || 0,
      floorsCount: parseInt(form.floorsCount) || 0,
      complianceScore: 0,
      totalViolations: 0,
      highSeverity: 0,
      mediumSeverity: 0,
      lowSeverity: 0,
      compliantCount: 0,
      needReviewCount: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      status,
      violations: [],
      metadata: {
        district: form.district,
        districtEn: form.district,
        plotNumber: form.plotNumber,
        licenseType: form.licenseType === "new" ? "رخصة بناء جديدة" : "تعديل رخصة بناء قائمة",
        licenseTypeEn: form.licenseType === "new" ? "New Building Permit" : "Modification Permit",
        projectStage: form.projectStage === "preliminary" ? "مرحلة مراجعة أولية" : "مخططات نهائية",
        projectStageEn: form.projectStage === "preliminary" ? "Preliminary Stage" : "Final Stage",
        buildingUse: form.buildingUse,
        buildingUseEn: form.buildingUse,
        engineeringFirm: form.engineeringFirm,
        planNumber: form.planNumber,
        description: form.description || "مشروع جديد للمراجعة",
        descriptionEn: form.description || "New project review request",
      },
    };
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowExitWarning(true);
    } else {
      router.push("/projects");
    }
  };

  const stepsLabels = [
    t.newProjectForm.steps.info,
    t.newProjectForm.steps.location,
    t.newProjectForm.steps.specs,
    t.newProjectForm.steps.summary,
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 select-none relative">
      
      {/* Header bar */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-main-text">{t.newProjectForm.title}</h1>
        <div className="h-1.5 w-16 bg-compliance-green mx-auto rounded"></div>
      </div>

      {/* Stepper indicators */}
      <div className="flex justify-between items-center relative py-4">
        {/* Connection bar */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10"></div>
        {stepsLabels.map((lbl, idx) => {
          const stepNum = idx + 1;
          const isDone = step > stepNum;
          const isActive = step === stepNum;

          return (
            <div key={stepNum} className="flex flex-col items-center gap-1.5 bg-main-bg px-2 z-10">
              <div
                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone
                    ? "bg-compliance-green border-compliance-green text-white"
                    : isActive
                    ? "border-compliance-green text-compliance-green bg-white"
                    : "border-slate-300 text-slate-400 bg-white"
                }`}
              >
                {stepNum}
              </div>
              <span className={`text-[9px] font-bold ${isActive ? "text-compliance-green" : "text-muted-text"}`}>
                {lbl}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Content container */}
      <div className="bg-white-card border border-border-gray rounded-xl p-6 shadow-sm min-h-[300px]">
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-compliance-green uppercase tracking-wider">{t.newProjectForm.steps.info}</h3>
            
            {/* Project Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.name} *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="مثال: مشروع مبنى تجاري — الرياض"
                className={`w-full px-3 py-2 border rounded-lg text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none ${
                  errors.name ? "border-alert-red bg-red-50" : "border-border-gray"
                }`}
              />
              {errors.name && <span className="text-[9px] text-alert-red font-bold">{errors.name}</span>}
            </div>

            {/* Grid properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.type}</label>
                <select
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-gray bg-white text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none"
                >
                  <option value="commercial">{t.newProjectForm.mockTypes.commercial}</option>
                  <option value="residential">{t.newProjectForm.mockTypes.residential}</option>
                </select>
              </div>

              {/* Building Use */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.buildingUse} *</label>
                <input
                  type="text"
                  value={form.buildingUse}
                  onChange={(e) => handleChange("buildingUse", e.target.value)}
                  placeholder="معارض ومكاتب تجارية"
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none ${
                    errors.buildingUse ? "border-alert-red bg-red-50" : "border-border-gray"
                  }`}
                />
                {errors.buildingUse && <span className="text-[9px] text-alert-red font-bold">{errors.buildingUse}</span>}
              </div>
            </div>

            {/* Engineering Firm */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.engineeringFirm} *</label>
              <input
                type="text"
                value={form.engineeringFirm}
                onChange={(e) => handleChange("engineeringFirm", e.target.value)}
                placeholder="مكتب الإتقان الهندسي"
                className={`w-full px-3 py-2 border rounded-lg text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none ${
                  errors.engineeringFirm ? "border-alert-red bg-red-50" : "border-border-gray"
                }`}
              />
              {errors.engineeringFirm && <span className="text-[9px] text-alert-red font-bold">{errors.engineeringFirm}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Location and Municipality */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-compliance-green uppercase tracking-wider">{t.newProjectForm.steps.location}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.city} *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="الرياض"
                  className={`w-full px-3 py-2 border rounded-lg text-xs ${errors.city ? "border-alert-red bg-red-50" : "border-border-gray"}`}
                />
                {errors.city && <span className="text-[9px] text-alert-red font-bold">{errors.city}</span>}
              </div>

              {/* Municipality */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.municipality} *</label>
                <input
                  type="text"
                  value={form.municipality}
                  onChange={(e) => handleChange("municipality", e.target.value)}
                  placeholder="أمانة منطقة الرياض"
                  className={`w-full px-3 py-2 border rounded-lg text-xs ${errors.municipality ? "border-alert-red bg-red-50" : "border-border-gray"}`}
                />
                {errors.municipality && <span className="text-[9px] text-alert-red font-bold">{errors.municipality}</span>}
              </div>

              {/* District */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.district} *</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  placeholder="حي الياسمين"
                  className={`w-full px-3 py-2 border rounded-lg text-xs ${errors.district ? "border-alert-red bg-red-50" : "border-border-gray"}`}
                />
                {errors.district && <span className="text-[9px] text-alert-red font-bold">{errors.district}</span>}
              </div>

              {/* Plot Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.plotNumber} *</label>
                <input
                  type="text"
                  value={form.plotNumber}
                  onChange={(e) => handleChange("plotNumber", e.target.value)}
                  placeholder="قطعة 145/ب"
                  className={`w-full px-3 py-2 border rounded-lg text-xs ${errors.plotNumber ? "border-alert-red bg-red-50" : "border-border-gray"}`}
                />
                {errors.plotNumber && <span className="text-[9px] text-alert-red font-bold">{errors.plotNumber}</span>}
              </div>
            </div>

            {/* Land Area */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.landArea} *</label>
              <input
                type="text"
                value={form.landArea}
                onChange={(e) => handleChange("landArea", e.target.value)}
                placeholder="1200"
                className={`w-full px-3 py-2 border rounded-lg text-xs ${errors.landArea ? "border-alert-red bg-red-50" : "border-border-gray"}`}
              />
              {errors.landArea && <span className="text-[9px] text-alert-red font-bold">{errors.landArea}</span>}
            </div>
          </div>
        )}

        {/* Step 3: Technical Specs */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-compliance-green uppercase tracking-wider">{t.newProjectForm.steps.specs}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* License Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.licenseType}</label>
                <select
                  value={form.licenseType}
                  onChange={(e) => handleChange("licenseType", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-gray bg-white text-xs focus:outline-none"
                >
                  <option value="new">رخصة بناء جديدة</option>
                  <option value="modify">تعديل رخصة بناء قائمة</option>
                </select>
              </div>

              {/* Floors Count */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.floorsCount} *</label>
                <input
                  type="text"
                  value={form.floorsCount}
                  onChange={(e) => handleChange("floorsCount", e.target.value)}
                  placeholder="4"
                  className={`w-full px-3 py-2 border rounded-lg text-xs ${errors.floorsCount ? "border-alert-red bg-red-50" : "border-border-gray"}`}
                />
                {errors.floorsCount && <span className="text-[9px] text-alert-red font-bold">{errors.floorsCount}</span>}
              </div>

              {/* Plan Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.planNumber} *</label>
                <input
                  type="text"
                  value={form.planNumber}
                  onChange={(e) => handleChange("planNumber", e.target.value)}
                  placeholder="BUNYAN-PLAN-2026"
                  className={`w-full px-3 py-2 border rounded-lg text-xs ${errors.planNumber ? "border-alert-red bg-red-50" : "border-border-gray"}`}
                />
                {errors.planNumber && <span className="text-[9px] text-alert-red font-bold">{errors.planNumber}</span>}
              </div>

              {/* Project Stage */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.projectStage}</label>
                <select
                  value={form.projectStage}
                  onChange={(e) => handleChange("projectStage", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-gray bg-white text-xs focus:outline-none"
                >
                  <option value="preliminary">مراجعة أولية</option>
                  <option value="final">مخططات نهائية للتنفيذ</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-main-text">{t.newProjectForm.fields.description}</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                placeholder="اكتب وصفاً مختصراً لأهداف مراجعة المشروع..."
                className="w-full px-3 py-2 border border-border-gray rounded-lg text-xs focus:ring-1 focus:ring-compliance-green focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Summary & Confirm */}
        {step === 4 && (
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-compliance-green uppercase tracking-wider">{t.newProjectForm.steps.summary}</h3>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-border-gray divide-y divide-slate-200 space-y-3 text-xs leading-relaxed">
              <div className="grid grid-cols-2 gap-4 pb-2">
                <div>
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">{t.newProjectForm.fields.name}</span>
                  <span className="text-main-text font-bold">{form.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">{t.newProjectForm.fields.type}</span>
                  <span className="text-main-text font-bold">
                    {form.type === "commercial" ? t.newProjectForm.mockTypes.commercial : t.newProjectForm.mockTypes.residential}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">{t.newProjectForm.fields.city}</span>
                  <span className="text-main-text font-bold">{form.city} - {form.district}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">{t.newProjectForm.fields.landArea}</span>
                  <span className="text-main-text font-bold font-mono">{form.landArea} م²</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">{t.newProjectForm.fields.floorsCount}</span>
                  <span className="text-main-text font-bold font-mono">{form.floorsCount} {language === "ar" ? "طوابق" : "floors"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">{t.newProjectForm.fields.planNumber}</span>
                  <span className="text-main-text font-bold font-mono">{form.planNumber}</span>
                </div>
              </div>

              <div className="py-2">
                <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">{t.newProjectForm.fields.engineeringFirm}</span>
                <span className="text-main-text font-bold">{form.engineeringFirm}</span>
              </div>
            </div>

            {/* Note alert */}
            <div className="p-3 bg-blue-50 border-l-2 border-compliance-green text-[10px] text-slate-600 rounded flex gap-2 items-center">
              <FileText className="h-4.5 w-4.5 text-compliance-green flex-shrink-0" />
              <p>
                {language === "ar"
                  ? "تأكيدك للمشروع سينقلك مباشرة لشاشة رفع المخططات الهندسية للبدء في تحليل امتثال الكود العمراني."
                  : "Confirming this form will redirect you to the plan uploader screen to check compliance with code guidelines."}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Buttons actions */}
      <div className="flex justify-between items-center text-xs font-bold pt-2">
        <button
          type="button"
          onClick={handleCancelClick}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg"
        >
          {t.common.buttons.cancel}
        </button>

        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1 px-4 py-2 border border-border-gray hover:bg-slate-50 rounded-lg text-slate-700"
            >
              <ChevronLeft className="h-4 w-4 rtl-flip" />
              <span>{t.newProjectForm.buttons.prev}</span>
            </button>
          )}

          {step < 4 ? (
            <>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                <Save className="h-4 w-4" />
                <span>{t.newProjectForm.buttons.saveDraft}</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-compliance-green text-white hover:bg-emerald-800 rounded-lg"
              >
                <span>{t.newProjectForm.buttons.next}</span>
                <ChevronRight className="h-4 w-4 rtl-flip" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleConfirmSubmit}
              className="px-6 py-2 bg-compliance-green text-white hover:bg-emerald-800 rounded-lg shadow-md"
            >
              {t.newProjectForm.buttons.confirm}
            </button>
          )}
        </div>
      </div>

      {/* Exit Warning Modal */}
      {showExitWarning && (
        <div className="fixed inset-0 z-50 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white-card rounded-xl border border-border-gray max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 text-accent-gold flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-right">
              <h3 className="text-xs font-black text-main-text">{language === "ar" ? "تعديلات غير محفوظة" : "Unsaved Changes"}</h3>
              <p className="text-[11px] text-muted-text leading-relaxed">{t.newProjectForm.warningUnsaved}</p>
            </div>
            <div className="flex gap-3 justify-end pt-2 text-xs font-bold">
              <button
                onClick={() => setShowExitWarning(false)}
                className="px-4 py-2 border border-border-gray hover:bg-slate-50 rounded-lg text-slate-700"
              >
                {language === "ar" ? "البقاء" : "Stay"}
              </button>
              <button
                onClick={() => {
                  setIsDirty(false);
                  setShowExitWarning(false);
                  router.push("/projects");
                }}
                className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg"
              >
                {language === "ar" ? "الخروج وإلغاء التعديل" : "Leave & Discard"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

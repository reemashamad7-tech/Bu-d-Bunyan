"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, Violation } from "../../context/AppContext";
import BeforeAfterSlider from "../../components/BeforeAfterSlider";
import { 
  Wrench, ChevronDown, ChevronUp, AlertCircle, 
  CheckCircle2, Sparkles, RotateCcw, ArrowRight, ShieldCheck 
} from "lucide-react";

export default function Solutions() {
  const { language, t, activeProject, simulateSolution, undoSolution } = useApp();
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!activeProject) {
    return (
      <div className="w-full py-16 text-center text-xs font-bold text-slate-500">
        {language === "ar" ? "لم يتم تحديد أي مشروع نشط." : "No active project found."}
      </div>
    );
  }

  const { complianceScore, violations } = activeProject;

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const getSeverityColor = (sev: Violation["severity"]) => {
    const colors = {
      high: "text-red-700 bg-red-50 border-red-200",
      medium: "text-amber-700 bg-amber-50 border-amber-200",
      low: "text-yellow-750 bg-yellow-50 border-yellow-200",
    };
    return colors[sev] || "text-slate-700 bg-slate-50 border-slate-200";
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 select-none">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-gray pb-4">
        <div>
          <h1 className="text-2xl font-black text-main-text">{t.solutionsPage.title}</h1>
          <p className="text-xs text-muted-text mt-1">{t.solutionsPage.subtitle}</p>
        </div>

        <button
          onClick={() => router.push("/report")}
          className="flex items-center gap-1 bg-compliance-green text-white hover:bg-emerald-800 px-4 py-2.5 rounded-lg text-xs font-bold shadow-md transition-colors"
        >
          <span>{language === "ar" ? "معاينة التقرير النهائي" : "View Final Report"}</span>
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </button>
      </div>

      {/* Before / After Slider section */}
      <div className="bg-white-card border border-border-gray rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-main-text uppercase tracking-wider flex items-center gap-1.5">
          <Wrench className="h-4 w-4 text-compliance-green" />
          <span>{t.solutionsPage.sliderLabel}</span>
        </h3>
        
        <BeforeAfterSlider />
      </div>

      {/* Compliance indicators stats */}
      <div className="bg-white-card border border-border-gray rounded-xl p-4 shadow-sm flex items-center justify-between text-xs font-bold bg-slate-50">
        <span>{language === "ar" ? "نسبة الامتثال بعد تعديلات المحاكاة الحالية:" : "Compliance score with active modifications:"}</span>
        <span className="font-mono text-compliance-green text-sm">{complianceScore}%</span>
      </div>

      {/* Accordion Solutions List */}
      <div className="space-y-4">
        {violations.map((v, idx) => {
          const isOpen = openIndex === idx;
          const typeLabel = language === "ar" ? v.type : v.typeEn;
          const probLabel = language === "ar" ? v.effect : v.effectEn;
          const solLabel = language === "ar" ? v.proposedSolution : v.proposedSolutionEn;
          const regLabel = language === "ar" ? v.regSource : v.regSourceEn;
          const isResolved = v.status === "resolved";

          return (
            <div 
              key={v.id} 
              className={`border rounded-xl bg-white shadow-sm overflow-hidden transition-all ${
                isOpen ? "border-compliance-green" : "border-border-gray"
              }`}
            >
              
              {/* Accordion Header bar */}
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between p-4 text-right text-xs hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono border ${getSeverityColor(v.severity)}`}>
                    {v.id}
                  </span>
                  
                  <span className="font-bold text-main-text truncate">{typeLabel}</span>
                  
                  {isResolved && (
                    <span className="px-2 py-0.5 rounded bg-green-50 text-green-800 border border-green-200 text-[8px] font-bold">
                      {t.resultsPage.status.resolved}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {/* Accordion Content body */}
              {isOpen && (
                <div className="p-5 bg-slate-50 border-t border-border-gray space-y-4 text-xs">
                  
                  {/* Grid details comparisons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">{t.violationDetails.currentVal}</span>
                      <span className="text-slate-800 font-bold font-mono">
                        {language === "ar" ? v.currentVal : v.currentValEn}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">{t.violationDetails.requiredVal}</span>
                      <span className="text-compliance-green font-bold font-mono">
                        {language === "ar" ? v.requiredVal : v.requiredValEn}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">{t.solutionsPage.improvementRate}</span>
                      <span className="text-compliance-green font-bold font-mono">
                        +{v.severity === "high" ? "7%" : v.severity === "medium" ? "2.5%" : "0.5%"}
                      </span>
                    </div>
                  </div>

                  {/* Problem details */}
                  <div className="space-y-1.5">
                    <span className="text-alert-red font-bold block text-[9px] uppercase tracking-wider">
                      {t.solutionsPage.problemDesc}
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{probLabel}</p>
                  </div>

                  {/* Resolution steps details */}
                  <div className="space-y-1.5">
                    <span className="text-compliance-green font-bold block text-[9px] uppercase tracking-wider">
                      {t.solutionsPage.solutionSteps}
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{solLabel}</p>
                  </div>

                  {/* Regulatory codes reference */}
                  <div className="p-3 bg-white border border-border-gray rounded-lg text-xs flex gap-2 items-center">
                    <ShieldCheck className="h-4.5 w-4.5 text-compliance-green flex-shrink-0" />
                    <span>{t.violationDetails.regSource}: <strong>{regLabel}</strong></span>
                  </div>

                  {/* Simulation triggers button */}
                  <div className="flex justify-end pt-2 border-t border-slate-200">
                    {isResolved ? (
                      <button
                        onClick={() => undoSolution(v.id)}
                        className="flex items-center gap-1.5 border border-border-gray hover:bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>{language === "ar" ? "التراجع عن التعديل" : "Undo Modification"}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => simulateSolution(v.id)}
                        className="flex items-center gap-1.5 bg-compliance-green text-white hover:bg-emerald-800 px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{t.solutionsPage.buttons.simulate}</span>
                      </button>
                    )}
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";
import { 
  Printer, FileText, CheckCircle2, AlertTriangle, 
  ArrowLeft, Download, Share2, ClipboardList, ShieldAlert, X 
} from "lucide-react";

export default function ComplianceReport() {
  const { language, t, activeProject, showToast } = useApp();
  const router = useRouter();
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  if (!activeProject) {
    return (
      <div className="w-full py-16 text-center text-xs font-bold text-slate-500">
        {language === "ar" ? "لم يتم تحديد أي مشروع نشط." : "No active project found."}
      </div>
    );
  }

  const { name, nameEn, complianceScore, totalViolations, highSeverity, mediumSeverity, lowSeverity, lastUpdated, violations, metadata } = activeProject;

  const titleLabel = language === "ar" ? name : nameEn;

  const handlePrint = () => {
    window.print();
  };

  const handlePdfExport = () => {
    showToast(language === "ar" ? "جاري تصدير التقرير بصيغة PDF..." : "Exporting report as PDF...", "info");
    setTimeout(() => {
      showToast(t.common.exportSuccess, "success");
    }, 2000);
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 select-none relative print:py-0 print:px-0">
      
      {/* Top action bar (hidden during print) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-gray pb-4 print:hidden">
        <button
          onClick={() => router.push("/results")}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-compliance-green transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rtl-flip" />
          <span>{language === "ar" ? "العودة للوحة النتائج" : "Back to Dashboard"}</span>
        </button>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 border border-border-gray hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 transition-colors shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>{t.reportPage.buttons.print}</span>
          </button>
          
          <button
            onClick={handlePdfExport}
            className="flex items-center gap-1.5 border border-border-gray hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>{t.reportPage.buttons.pdf}</span>
          </button>

          <button
            onClick={() => setSubmissionModalOpen(true)}
            className="flex items-center gap-1.5 bg-compliance-green text-white hover:bg-emerald-800 px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-colors"
          >
            <ClipboardList className="h-4 w-4" />
            <span>{t.reportPage.buttons.prepareSubmission}</span>
          </button>
        </div>
      </div>

      {/* Main Advisory Report Document Container */}
      <div className="bg-white rounded-2xl border border-border-gray p-8 sm:p-12 shadow-md space-y-8 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* Letterhead Header row */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-6">
          <div className="space-y-1.5">
            {/* Arabic branding text always */}
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-compliance-green"></span>
              <span>«بُعد بنيان»</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {language === "ar" ? "نظام مراجعة وتدقيق الكود العمراني" : "ZONING CODE AUDIT SYSTEM"}
            </p>
          </div>

          {/* Official Arabic Logo (never translated) */}
          <img 
            src="/logo.png" 
            alt="بُعد بنيان" 
            className="h-12 w-auto object-contain" 
          />
        </div>

        {/* Report metadata block */}
        <div className="text-center space-y-3 py-4 bg-slate-50/50 rounded-xl border border-slate-200">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">{t.reportPage.title}</h1>
          <div className="flex flex-wrap gap-4 justify-center text-[10px] font-bold text-slate-500 font-mono">
            <span>{t.reportPage.reportNumber} <strong className="text-slate-800">REP-2026-10492</strong></span>
            <span>•</span>
            <span>{t.reportPage.reportDate} <strong className="text-slate-800">{lastUpdated}</strong></span>
          </div>
        </div>

        {/* Detailed specifications table */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 border-b pb-1.5 uppercase tracking-wider">
            {t.reportPage.projectDetails}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
            <table className="w-full">
              <tbody className="divide-y divide-slate-100 font-semibold">
                <tr>
                  <td className="py-2 text-slate-400">{t.newProjectForm.fields.name}</td>
                  <td className="py-2 text-slate-800 text-right">{titleLabel}</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">{t.newProjectForm.fields.type}</td>
                  <td className="py-2 text-slate-800 text-right">
                    {language === "ar" ? metadata.licenseType : metadata.licenseTypeEn}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">{t.newProjectForm.fields.city}</td>
                  <td className="py-2 text-slate-800 text-right">{metadata.district} - {metadata.districtEn}</td>
                </tr>
              </tbody>
            </table>

            <table className="w-full">
              <tbody className="divide-y divide-slate-100 font-semibold">
                <tr>
                  <td className="py-2 text-slate-400">{t.newProjectForm.fields.landArea}</td>
                  <td className="py-2 text-slate-800 text-right font-mono">{activeProject.landArea} م²</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">{t.newProjectForm.fields.floorsCount}</td>
                  <td className="py-2 text-slate-800 text-right font-mono">{activeProject.floorsCount}</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">{t.newProjectForm.fields.engineeringFirm}</td>
                  <td className="py-2 text-slate-800 text-right">{metadata.engineeringFirm}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive summary block */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 border-b pb-1.5 uppercase tracking-wider">
            {t.reportPage.executiveSummary}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
            
            {/* Score circle */}
            <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full border-4 border-compliance-green flex items-center justify-center text-sm font-mono font-black text-slate-900 shadow">
                {complianceScore}%
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{t.resultsPage.complianceScore}</span>
            </div>

            {/* summary text description */}
            <div className="md:col-span-9 text-xs leading-relaxed font-semibold text-slate-650 space-y-1.5">
              <p>
                {language === "ar"
                  ? `أجرى نظام المحاكاة تدقيقًا آليًا على المخططات المعروضة للتحقق من امتثالها. تم فحص عدد 20 بندًا من بنود الكود العمراني التجاري لأمانة الرياض.`
                  : `Our simulation engine performed automated zoning audit checks on 20 distinct design rules for Riyadh municipality commercial building codes.`}
              </p>
              
              <div className="flex gap-4 flex-wrap text-[10px] text-slate-500">
                <span>{language === "ar" ? "المخالفات النشطة:" : "Active Violations:"} <strong className="text-alert-red font-mono font-black">{totalViolations}</strong></span>
                <span>•</span>
                <span>{language === "ar" ? "المطابقات:" : "Compliant items:"} <strong className="text-compliance-green font-mono font-black">{complianceScore === 100 ? "20" : "14"}</strong></span>
              </div>
            </div>

          </div>
        </div>

        {/* Violations checklist detailed list */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-900 border-b pb-1.5 uppercase tracking-wider">
            {language === "ar" ? "تفاصيل المخالفات غير المطابقة" : "Detailed Non-Compliant Items"}
          </h3>
          
          {totalViolations === 0 ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 flex gap-2 items-center">
              <CheckCircle2 className="h-4.5 w-4.5 text-compliance-green" />
              <span>{t.common.noViolations}</span>
            </div>
          ) : (
            <div className="space-y-4">
              {violations.filter(v => v.status === "active").map((v) => (
                <div key={v.id} className="border border-slate-200 rounded-xl p-4 flex gap-4 items-start text-xs bg-slate-50/20">
                  <div className="h-6 w-6 rounded bg-red-100 text-alert-red flex items-center justify-center flex-shrink-0 font-mono text-[9px] font-black">
                    {v.id}
                  </div>
                  <div className="space-y-2 flex-grow min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="font-bold text-slate-900 truncate">
                        {language === "ar" ? v.type : v.typeEn}
                      </h4>
                      <span className="text-[9px] text-red-600 font-bold bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                        {v.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[10px] leading-relaxed">
                      <div>
                        <span className="text-slate-400 font-bold block text-[8px] uppercase">{t.violationDetails.currentVal}</span>
                        <span className="text-slate-800 font-bold font-mono">{language === "ar" ? v.currentVal : v.currentValEn}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[8px] uppercase">{t.violationDetails.requiredVal}</span>
                        <span className="text-compliance-green font-bold font-mono">{language === "ar" ? v.requiredVal : v.requiredValEn}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed pt-1.5 border-t border-slate-100">
                      {language === "ar" ? v.proposedSolution : v.proposedSolutionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Engineer recommendations */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black text-slate-900 border-b pb-1.5 uppercase tracking-wider">
            {t.reportPage.recommendations}
          </h3>
          <ul className="list-disc list-inside text-xs leading-relaxed text-slate-650 space-y-2 font-semibold">
            {language === "ar" ? (
              <>
                <li>يجب تعديل مخطط الارتداد الأمامي وتفادي التجاوز بمقدار 2.5م لتجنب غرامات أمانة منطقة الرياض.</li>
                <li>ينصح بإضافة منور داخلي أو تقليص جناح المبنى الخلفي بمقدار 96 م² للوفاء بنسبة البناء القصوى 60%.</li>
                <li>مراجعة مقاييس ممرات الهروب للدفاع المدني وتوسيعها لتبلغ 1.20م كحد أدنى.</li>
                <li>تنزيل سترة السطح المعمارية لارتفاع 1.8م لتجنب مخالفة الارتفاع البصري.</li>
              </>
            ) : (
              <>
                <li>Shift the front building facade back by 2.5m to eliminate front setback violations.</li>
                <li>Shrink the rear wing footprint by 96 sqm or add an open courtyard to satisfy the 60% building ratio limits.</li>
                <li>Widen all emergency egress corridors to 1.20m clear width for Civil Defense safety standards.</li>
                <li>Lower roof parapets from 2.1m to 1.8m to align with visual height restrictions.</li>
              </>
            )}
          </ul>
        </div>

        {/* Strict legal disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50 border border-accent-gold/20 text-slate-600 text-xs flex gap-3 items-start select-none">
          <AlertTriangle className="h-5 w-5 text-accent-gold flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-slate-800">{t.disclaimer.title}</h5>
            <p className="text-[10px] leading-relaxed">
              {language === "ar" 
                ? "هذا التقرير هو فحص محاكاة استرشادي فني تم إنشاؤه آليًا لأغراض المساعدة والمراجعة الذاتية للتأكد المبدئي فقط. لا يمنح هذا المستند رخصة بناء رسمية ولا يعتبر تصريحًا رسميًا من الجهات البلدية أو الحكومية."
                : "This report consists of preliminary simulation parameters generated for self-assistance review. It is not an official construction permit nor does it grant municipal validation."}
            </p>
          </div>
        </div>

        {/* Sign-off footer */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-200 text-[10px] text-slate-400 font-semibold">
          <span>{language === "ar" ? "جهة إصدار التقرير: منصة بُعد بنيان" : "Issuing Authority: بُعد بنيان platform"}</span>
          <span>{language === "ar" ? "رقم المخطط المراجع:" : "Plan reference:"} <strong className="font-mono text-slate-700">{metadata.planNumber}</strong></span>
        </div>

      </div>

      {/* Prepare Submission Modal */}
      {submissionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white-card border border-border-gray rounded-xl p-6 shadow-2xl max-w-md w-full space-y-4">
            
            <div className="flex justify-between items-start border-b border-border-gray pb-2 mb-2">
              <h3 className="text-xs font-black text-main-text flex items-center gap-1.5 uppercase">
                <ClipboardList className="h-5 w-5 text-compliance-green" />
                <span>{t.reportPage.submissionModal.title}</span>
              </h3>
              <button 
                onClick={() => setSubmissionModalOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[11px] text-muted-text leading-relaxed">
              {t.reportPage.submissionModal.desc}
            </p>

            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-main-text uppercase tracking-wider">
                {t.reportPage.submissionModal.checklist}
              </h4>
              <div className="space-y-2">
                {t.reportPage.submissionModal.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center text-[10px] font-semibold text-slate-700 bg-slate-50 p-2 rounded border border-border-gray">
                    <CheckCircle2 className="h-4 w-4 text-compliance-green flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning reminder */}
            <div className="p-3 bg-amber-50 border border-accent-gold/25 text-[9px] text-amber-800 rounded leading-relaxed flex gap-2">
              <ShieldAlert className="h-5 w-5 text-accent-gold flex-shrink-0 mt-0.5" />
              <p>{t.reportPage.submissionModal.warning}</p>
            </div>

            <div className="flex gap-3 justify-end pt-2 text-xs font-bold">
              <button
                onClick={() => setSubmissionModalOpen(false)}
                className="px-4 py-2 border border-border-gray hover:bg-slate-50 rounded-lg text-slate-700 w-full sm:w-auto"
              >
                {t.common.buttons.ok}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

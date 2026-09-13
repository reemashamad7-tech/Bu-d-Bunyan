"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, Violation } from "../../context/AppContext";
import ThreeViewer from "../../components/ThreeViewer";
import { 
  AlertCircle, ShieldCheck, HelpCircle, FileText, 
  ArrowRight, Search, Filter, ShieldAlert, Sparkles, 
  RotateCcw, Check, Download, Share2, PanelRightClose, Play 
} from "lucide-react";

export default function Results() {
  const { 
    language, t, activeProject, 
    simulateSolution, undoSolution, 
    simulateAllSolutions, undoAllSolutions 
  } = useApp();
  const router = useRouter();

  const [selectedViolationId, setSelectedViolationId] = useState<string | null>("V-01");
  const [showRegulations, setShowRegulations] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resolved">("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all");

  if (!activeProject) {
    return (
      <div className="w-full py-16 text-center text-xs font-bold text-slate-500">
        {language === "ar" ? "لم يتم تحديد أي مشروع نشط." : "No active project found."}
      </div>
    );
  }

  const { name, nameEn, complianceScore, totalViolations, highSeverity, mediumSeverity, lowSeverity, compliantCount, needReviewCount, violations } = activeProject;

  const titleLabel = language === "ar" ? name : nameEn;

  // Filtered violations
  const filteredViolations = violations.filter((v) => {
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    const matchSeverity = severityFilter === "all" || v.severity === severityFilter;
    return matchStatus && matchSeverity;
  });

  const selectedViolation = violations.find((v) => v.id === selectedViolationId) || null;

  const getSeverityBadge = (sev: Violation["severity"]) => {
    const badges = {
      high: "bg-red-50 text-red-800 border-red-200",
      medium: "bg-amber-50 text-amber-800 border-amber-200",
      low: "bg-yellow-50 text-yellow-800 border-yellow-200",
    };
    return badges[sev] || "bg-slate-50 text-slate-800 border-slate-200";
  };

  const getSeverityLabel = (sev: Violation["severity"]) => {
    const labels = {
      high: t.resultsPage.severity.high,
      medium: t.resultsPage.severity.medium,
      low: t.resultsPage.severity.low,
    };
    return labels[sev] || sev;
  };

  const handleRowClick = (id: string) => {
    setSelectedViolationId(id);
  };

  const handleSimulate = (violationId: string) => {
    simulateSolution(violationId);
  };

  const handleUndo = (violationId: string) => {
    undoSolution(violationId);
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none relative">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-gray pb-4">
        <div>
          <span className="text-[9px] bg-slate-100 text-slate-500 font-bold border px-2 py-0.5 rounded uppercase tracking-wider">
            {language === "ar" ? "لوحة تدقيق الامتثال" : "Compliance Audit Board"}
          </span>
          <h1 className="text-xl font-black text-main-text mt-1">{titleLabel}</h1>
        </div>

        <div className="flex gap-3">
          {complianceScore === 100 ? (
            <button
              onClick={undoAllSolutions}
              className="flex items-center gap-1.5 border border-border-gray hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{language === "ar" ? "إعادة تعيين المحاكاة" : "Reset Simulation"}</span>
            </button>
          ) : (
            <button
              onClick={simulateAllSolutions}
              className="flex items-center gap-1.5 bg-emerald-50 text-compliance-green border border-compliance-green/30 hover:bg-emerald-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>{language === "ar" ? "محاكاة حل الجميع" : "Simulate All Solutions"}</span>
            </button>
          )}

          <button
            onClick={() => router.push("/solutions")}
            className="flex items-center gap-1.5 bg-compliance-green text-white hover:bg-emerald-800 px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-colors"
          >
            <span>{t.resultsPage.table.action}</span>
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        
        {/* Compliance Radial Gauge */}
        <div className="bg-white-card border border-border-gray rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center col-span-2 relative overflow-hidden">
          <div className="absolute top-1 right-2 text-[8px] text-slate-400 font-black uppercase">COMPLIANCE INDEX</div>
          
          <div className="flex items-center gap-4 mt-2">
            {/* SVG Radial Progress */}
            <div className="relative h-16 w-16">
              <svg className="h-full w-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  strokeWidth="5"
                  stroke="#f1f5f9"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  strokeWidth="5"
                  stroke={complianceScore === 100 ? "#2e7d32" : "#e5a93b"}
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - complianceScore / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono font-black text-main-text text-sm">
                {complianceScore}%
              </span>
            </div>
            
            <div className="text-right">
              <h5 className="text-[10px] text-muted-text font-bold uppercase tracking-wider">{t.resultsPage.complianceScore}</h5>
              <p className="text-[9px] text-slate-400 max-w-[140px] mt-0.5 leading-tight">{t.resultsPage.complianceDesc}</p>
            </div>
          </div>
        </div>

        {/* Violations Count Card */}
        <div className="bg-white-card border border-border-gray rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h5 className="text-[10px] text-slate-400 font-bold uppercase">{t.resultsPage.totalViolations}</h5>
          <span className="text-2xl font-mono font-black text-alert-red mt-2">{totalViolations}</span>
          <span className="text-[9px] text-slate-400 font-semibold">{t.resultsPage.lastAnalysisDate} <strong className="font-mono text-slate-500">2026-07-13</strong></span>
        </div>

        {/* High Severity Count */}
        <div className="bg-white-card border border-border-gray rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h5 className="text-[10px] text-slate-400 font-bold uppercase">{t.resultsPage.highSeverity}</h5>
          <span className="text-2xl font-mono font-black text-red-700 mt-2">{highSeverity}</span>
          <span className="text-[9px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100 self-start">CRITICAL</span>
        </div>

        {/* Medium Severity Count */}
        <div className="bg-white-card border border-border-gray rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h5 className="text-[10px] text-slate-400 font-bold uppercase">{t.resultsPage.mediumSeverity}</h5>
          <span className="text-2xl font-mono font-black text-amber-700 mt-2">{mediumSeverity}</span>
          <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 self-start">WARNING</span>
        </div>

        {/* Low Severity Count */}
        <div className="bg-white-card border border-border-gray rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h5 className="text-[10px] text-slate-400 font-bold uppercase">{t.resultsPage.lowSeverity}</h5>
          <span className="text-2xl font-mono font-black text-yellow-700 mt-2">{lowSeverity}</span>
          <span className="text-[9px] text-yellow-650 font-bold bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100 self-start">LOW</span>
        </div>

      </div>

      {/* Main viewport & details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* 3D Viewport Column */}
        <div className="lg:col-span-8 flex flex-col h-[500px]">
          
          {/* Top viewport mini toolbar */}
          <div className="bg-slate-900 border-b border-slate-800 p-2.5 rounded-t-xl flex justify-between items-center text-xs text-white z-10 select-none flex-shrink-0">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-compliance-green animate-ping"></span>
              <span>{language === "ar" ? "عارض التوأم الرقمي ثلاثي الأبعاد" : "3D Digital Twin Viewport"}</span>
            </span>

            {/* Setbacks toggler */}
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-[10px] text-slate-350">
              <input
                type="checkbox"
                checked={showRegulations}
                onChange={(e) => setShowRegulations(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-compliance-green focus:ring-compliance-green"
              />
              <span>{t.resultsPage.viewerControls.showRegs}</span>
            </label>
          </div>

          {/* ThreeJS Container */}
          <div className="flex-grow">
            <ThreeViewer 
              onViolationSelect={setSelectedViolationId} 
              selectedViolationId={selectedViolationId}
              showRegulations={showRegulations}
            />
          </div>
        </div>

        {/* Violation details Side Column */}
        <div className="lg:col-span-4 bg-white-card border border-border-gray rounded-xl p-5 shadow-sm flex flex-col justify-between max-h-[500px] overflow-y-auto relative">
          {selectedViolation ? (
            <div className="space-y-5">
              
              {/* Header row */}
              <div className="flex justify-between items-start border-b border-border-gray pb-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">{selectedViolation.id}</span>
                  <h3 className="text-xs font-bold text-main-text mt-0.5">
                    {language === "ar" ? selectedViolation.type : selectedViolation.typeEn}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${getSeverityBadge(selectedViolation.severity)}`}>
                  {getSeverityLabel(selectedViolation.severity)}
                </span>
              </div>

              {/* Specs Values comparison */}
              <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold bg-slate-50 p-3 rounded-lg border border-border-gray leading-relaxed">
                <div>
                  <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">{t.violationDetails.currentVal}</span>
                  <span className="text-slate-800 font-bold font-mono">
                    {language === "ar" ? selectedViolation.currentVal : selectedViolation.currentValEn}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">{t.violationDetails.requiredVal}</span>
                  <span className="text-compliance-green font-bold font-mono">
                    {language === "ar" ? selectedViolation.requiredVal : selectedViolation.requiredValEn}
                  </span>
                </div>
                <div className="col-span-2 border-t border-slate-200 pt-1.5 mt-1.5 flex justify-between items-center text-[10px]">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{t.violationDetails.difference}</span>
                  <span className="text-alert-red font-mono font-black">
                    {language === "ar" ? selectedViolation.difference : selectedViolation.differenceEn}
                  </span>
                </div>
              </div>

              {/* Technical Description info */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-slate-400 text-[9px] uppercase tracking-wider">{t.violationDetails.description}</h4>
                <p className="text-main-text leading-relaxed text-[11px]">
                  {language === "ar" ? selectedViolation.effect : selectedViolation.effectEn}
                </p>
              </div>

              {/* Code Source Reference */}
              <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-border-gray text-xs leading-relaxed">
                <span className="text-compliance-green font-bold block text-[8px] uppercase tracking-wider">{t.violationDetails.regSource}</span>
                <p className="text-[10px] text-slate-600 font-bold">
                  {language === "ar" ? selectedViolation.regSource : selectedViolation.regSourceEn}
                </p>
              </div>

              {/* Recommended engineering solution */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-compliance-green text-[9px] uppercase tracking-wider">{t.violationDetails.proposedSolution}</h4>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {language === "ar" ? selectedViolation.proposedSolution : selectedViolation.proposedSolutionEn}
                </p>
              </div>

              {/* Simulation triggers button */}
              <div className="pt-2 border-t border-border-gray">
                {selectedViolation.status === "resolved" ? (
                  <button
                    onClick={() => handleUndo(selectedViolation.id)}
                    className="w-full flex items-center justify-center gap-1.5 border border-border-gray hover:bg-slate-50 py-2 rounded-lg text-xs font-bold text-slate-700 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>{language === "ar" ? "التراجع عن التعديل" : "Undo Modification"}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSimulate(selectedViolation.id)}
                    className="w-full flex items-center justify-center gap-1.5 bg-compliance-green text-white hover:bg-emerald-800 py-2 rounded-lg text-xs font-bold shadow-md transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{language === "ar" ? "محاكاة التعديل الفوري" : "Simulate Modification"}</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 text-center font-bold">
              {language === "ar" ? "حدد مخالفة من الجدول أو عارض 3D لاستعراض تفاصيلها الفنية." : "Select a violation from the list or digital twin to inspect details."}
            </div>
          )}
        </div>

      </div>

      {/* Compliance violations list table */}
      <div className="bg-white-card border border-border-gray rounded-xl p-5 shadow-sm space-y-4">
        
        {/* Table Filters header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border-gray pb-4">
          <h3 className="text-xs font-black text-main-text flex items-center gap-1.5 uppercase">
            <Filter className="h-4 w-4 text-muted-text" />
            <span>{t.resultsPage.violationsSummary}</span>
          </h3>

          <div className="flex gap-3 flex-wrap text-xs">
            {/* Filter by severity */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-border-gray bg-white text-[10px] font-bold focus:outline-none"
            >
              <option value="all">{language === "ar" ? "كل مستويات الخطورة" : "All severities"}</option>
              <option value="high">{t.resultsPage.severity.high}</option>
              <option value="medium">{t.resultsPage.severity.medium}</option>
              <option value="low">{t.resultsPage.severity.low}</option>
            </select>

            {/* Filter by status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-border-gray bg-white text-[10px] font-bold focus:outline-none"
            >
              <option value="all">{language === "ar" ? "كل الحالات" : "All statuses"}</option>
              <option value="active">{t.resultsPage.status.active}</option>
              <option value="resolved">{t.resultsPage.status.resolved}</option>
            </select>
          </div>
        </div>

        {/* Violations Table grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-border-gray text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">{t.resultsPage.table.id}</th>
                <th className="px-6 py-3.5">{t.resultsPage.table.type}</th>
                <th className="px-6 py-3.5">{t.resultsPage.table.location}</th>
                <th className="px-6 py-3.5">{t.resultsPage.table.severity}</th>
                <th className="px-6 py-3.5">{t.resultsPage.table.status}</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {filteredViolations.map((v) => {
                const typeLabel = language === "ar" ? v.type : v.typeEn;
                const locLabel = language === "ar" ? v.location : v.locationEn;
                const isSelected = selectedViolationId === v.id;

                return (
                  <tr
                    key={v.id}
                    onClick={() => handleRowClick(v.id)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      isSelected ? "bg-emerald-50/10 font-bold border-l-2 border-l-compliance-green" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-mono font-bold text-main-text">{v.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{typeLabel}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{locLabel}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${getSeverityBadge(v.severity)}`}>
                        {getSeverityLabel(v.severity)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${
                        v.status === "resolved" 
                          ? "bg-green-50 text-green-800 border-green-200" 
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}>
                        {v.status === "resolved" ? t.resultsPage.status.resolved : t.resultsPage.status.active}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRowClick(v.id); }}
                        className="text-xs font-bold text-compliance-green hover:underline"
                      >
                        {t.resultsPage.table.details}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

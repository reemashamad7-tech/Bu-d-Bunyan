"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { 
  Play, Pause, ArrowRight, ShieldAlert, CheckCircle2, 
  RefreshCw, CircleDot, AlertTriangle, Terminal 
} from "lucide-react";

interface LogLine {
  time: string;
  message: string;
  type: "info" | "success" | "warning";
}

export default function AnalysisProgress() {
  const { language, t, showToast, updateProjectStatus } = useApp();
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [steps, setSteps] = useState(
    t.analysisPage.steps.map((st) => ({ ...st, status: "pending" as "pending" | "loading" | "success" | "warning" | "error", time: "" }))
  );

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll Logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Mock Analysis Loop
  useEffect(() => {
    if (isPaused || analysisComplete) return;

    const totalSteps = steps.length;
    const durationPerStep = 1800; // ms per step

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = Math.min(100, prev + Math.ceil(100 / totalSteps));
        
        // Finalize
        if (nextProgress >= 100) {
          clearInterval(interval);
          setAnalysisComplete(true);
          updateProjectStatus("P-01", "reviewNeeded"); // Set project to ready for review!
          
          // Complete all steps
          setSteps((prevSteps) =>
            prevSteps.map((st) => ({ ...st, status: "success", time: "0.2s" }))
          );
          
          addLog("تم إكمال محاكاة التحليل الفني بنجاح! تم إنشاء التوأم الرقمي ولوحة النتائج.", "success");
          showToast(
            language === "ar" ? "اكتمل تحليل المخططات بنجاح!" : "Plan analysis completed successfully!",
            "success"
          );
          return 100;
        }

        return nextProgress;
      });

      setCurrentStepIndex((prevIdx) => {
        const nextIdx = Math.min(totalSteps - 1, prevIdx + 1);

        // Update step status
        setSteps((prevSteps) =>
          prevSteps.map((st, i) => {
            if (i === prevIdx) return { ...st, status: "success", time: "0.4s" };
            if (i === nextIdx) return { ...st, status: "loading", time: "جاري..." };
            return st;
          })
        );

        // Add Log details
        generateLogForStep(nextIdx);

        return nextIdx;
      });

    }, durationPerStep);

    // Initial Loading State for first step
    if (progress === 0) {
      setSteps((prev) =>
        prev.map((st, i) => (i === 0 ? { ...st, status: "loading", time: "جاري..." } : st))
      );
      generateLogForStep(0);
    }

    return () => clearInterval(interval);
  }, [isPaused, currentStepIndex, analysisComplete]);

  const addLog = (message: string, type: LogLine["type"] = "info") => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs((prev) => [...prev, { time, message, type }]);
  };

  const generateLogForStep = (stepIdx: number) => {
    const logDetailsAr = [
      "فحص جودة مخططات الرسم وملفات DWG المدخلة... جودة الدقة الفنية ممتازة.",
      "تفكيك المخطط وقراءة طبقات الأوتوكاد (CAD Layers)... تم التعرف على طبقة الحوائط والارتدادات والأثاث.",
      "قراءة وحساب مقاييس الرسم وحساب الأطوال والأبعاد الهندسية التلقائية...",
      "حساب مساحة الأرض الإجمالية ومطابقتها بمساحة البناء القائمة... العثور على زيادة في نسبة مسطح البناء.",
      "التعرف الذكي على حدود الغرف ومسارات الحركة والفراغات العمرانية.",
      "فحص الأعمدة الإنشائية والجدران الحاملة لمطابقة المعماري مع المخطط الإنشائي...",
      "تحميل الكود العمراني لأمانة منطقة الرياض - حي الياسمين (سكني/تجاري)... تم بنجاح.",
      "مقارنة مقاييس الارتداد مع الاشتراطات... تم رصد مخالفة ارتداد أمامي (3.5م بدلاً من 6.0م).",
      "بناء نموذج التوأم الرقمي ثلاثي الأبعاد (3D Digital Twin Model)... تم رفع المجسم بنجاح.",
      "تحليل وتحديد المخالفات الإنشائية وتصنيفها حسب الخطورة (عالية، متوسطة، منخفضة)... تم رصد 6 مخالفات.",
      "اقتراح حلول هندسية وبدائل مطابقة لاشتراطات كود البناء السعودي ومعالجة التجاوزات...",
      "إعداد وتجميع مسودة تقرير الفحص البلدي الاسترشادي والتصدير للـ PDF..."
    ];

    const logDetailsEn = [
      "Verifying DWG layout lines and plan visual resolution... Excellent clarity.",
      "Processing DWG vector lines and identifying layer names (Walls, Setbacks, Annotations)... Done.",
      "Extracting scale parameters and measuring geometric distance and heights...",
      "Calculating gross built footprint area and matching to land deeds... Footprint deviation identified.",
      "Recognizing internal rooms, partition zones, and structural corridor loops.",
      "Auditing columns and load-bearing concrete frames to detect architectural clashes...",
      "Fetching Riyadh Municipality building code rules for Al-Yasmin district... Completed.",
      "Comparing plan measurements to setback regulations... Front setback conflict identified (3.5m instead of 6m).",
      "Generating 3D digital twin mesh mockup of the commercial project... Mesh generated.",
      "Classifying municipal infractions by severity level (Critical, Warning, Low)... 6 items flagged.",
      "Compiling engineering correction alternatives matching Saudi Building Code...",
      "Assembling mock PDF file attachments for the Advisory Compliance report..."
    ];

    const msg = language === "ar" ? logDetailsAr[stepIdx] : logDetailsEn[stepIdx];
    
    // Add warning level logs for issues found
    if (stepIdx === 3) {
      addLog(msg, "info");
      addLog(language === "ar" ? "تنبيه: مساحة البناء تتجاوز النسبة المقررة (68% بدلاً من 60%)." : "Warning: Built area coverage exceeds allowed limit (68% instead of 60%).", "warning");
    } else if (stepIdx === 7) {
      addLog(msg, "info");
      addLog(language === "ar" ? "مخالفة حرجة: الارتداد الأمامي غير كافٍ للوفاء باشتراطات أمانة الرياض." : "Critical: Inadequate front setback offset for Riyadh municipality codes.", "warning");
    } else {
      addLog(msg, stepIdx > 8 ? "success" : "info");
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleCancel = () => {
    setProgress(0);
    setCurrentStepIndex(0);
    setIsPaused(false);
    setAnalysisComplete(false);
    setLogs([]);
    setSteps(
      t.analysisPage.steps.map((st) => ({ ...st, status: "pending" as const, time: "" }))
    );
    showToast(
      language === "ar" ? "تم إلغاء التحليل الفني" : "Analysis cancelled",
      "info"
    );
    router.push("/upload");
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 select-none relative">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-main-text">{t.analysisPage.title}</h1>
        <div className="h-1.5 w-16 bg-compliance-green mx-auto rounded"></div>
      </div>

      {/* Progress Card */}
      <div className="bg-white-card border border-border-gray rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>{t.analysisPage.progress}</span>
          <span className="font-mono text-compliance-green text-sm">{progress}%</span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-compliance-green h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-muted-text font-bold">
          <span>{t.analysisPage.timeLeft} <strong className="font-mono text-main-text">{analysisComplete ? "0s" : "8s"}</strong></span>
          <span>{analysisComplete ? (language === "ar" ? "تم اكتمال الفحص" : "Complete") : (language === "ar" ? "جاري التدقيق..." : "Running...")}</span>
        </div>
      </div>

      {/* Pipeline Grid & Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Step pipeline list (12 steps) */}
        <div className="lg:col-span-6 bg-white-card border border-border-gray rounded-xl p-5 shadow-sm space-y-3 max-h-[480px] overflow-y-auto">
          {steps.map((st, i) => {
            const isPending = st.status === "pending";
            const isLoading = st.status === "loading";
            const isSuccess = st.status === "success";

            return (
              <div 
                key={st.id} 
                className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                  isLoading 
                    ? "border-compliance-green bg-emerald-50/10 font-bold" 
                    : isSuccess 
                    ? "border-border-gray bg-white-card" 
                    : "border-slate-100 bg-slate-50/30 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Step status icon */}
                  {isPending && <CircleDot className="h-4 w-4 text-slate-300" />}
                  {isLoading && <RefreshCw className="h-4 w-4 text-compliance-green animate-spin flex-shrink-0" />}
                  {isSuccess && <CheckCircle2 className="h-4 w-4 text-compliance-green flex-shrink-0" />}
                  
                  <span className="truncate">{st.name}</span>
                </div>
                <span className="font-mono text-[9px] text-slate-400 flex-shrink-0">{st.time}</span>
              </div>
            );
          })}
        </div>

        {/* Live Terminal Log */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[480px] text-slate-300 shadow-2xl relative">
          
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-2 flex-shrink-0">
            <Terminal className="h-4 w-4 text-compliance-green" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t.analysisPage.eventLog}
            </h3>
          </div>

          {/* Log Lines Container */}
          <div className="flex-grow overflow-y-auto space-y-2 text-[10px] font-mono leading-relaxed p-1">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-slate-500 font-semibold flex-shrink-0">[{log.time}]</span>
                <span className={
                  log.type === "success" 
                    ? "text-compliance-green" 
                    : log.type === "warning" 
                    ? "text-accent-gold font-bold" 
                    : "text-slate-300"
                }>
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 rounded text-[9px] text-slate-500 leading-relaxed mt-4 flex-shrink-0 select-none">
            {language === "ar"
              ? "ملاحظة: هذا لوج محاكاة لتدقيق الكود والمخططات ولا يمثل سير عملية على خادم حقيقي."
              : "Notice: This terminal displays simulated check logs of code verification parameters."}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-border-gray">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-border-gray hover:bg-slate-50 rounded-lg text-slate-700"
        >
          {t.analysisPage.buttons.cancel}
        </button>

        <div className="flex gap-3">
          {!analysisComplete ? (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
            >
              <Pause className="h-4 w-4" />
              <span>{isPaused ? (language === "ar" ? "استئناف" : "Resume") : t.analysisPage.buttons.stop}</span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/results")}
              className="flex items-center gap-1.5 bg-compliance-green text-white hover:bg-emerald-800 px-6 py-2.5 rounded-lg shadow-lg transition-colors"
            >
              <span>{t.analysisPage.buttons.results}</span>
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

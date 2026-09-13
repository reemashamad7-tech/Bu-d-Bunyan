"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { 
  UploadCloud, FileText, CheckCircle2, AlertTriangle, 
  Trash2, RefreshCw, Eye, EyeOff, Play, ShieldCheck 
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  time: string;
  progress: number;
  status: "uploading" | "uploaded" | "processing" | "completed" | "failed" | "unsupported" | "tooLarge" | "blurry";
}

export default function UploadPlans() {
  const { language, t, showToast } = useApp();
  const router = useRouter();
  
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: "f-1",
      name: "المخطط المعماري للدور الأرضي - الرياض.dwg",
      type: "DWG",
      size: "8.4 MB",
      time: "10:14",
      progress: 100,
      status: "completed",
    },
    {
      id: "f-2",
      name: "مخطط السلامة ومكافحة الحريق.pdf",
      type: "PDF",
      size: "4.2 MB",
      time: "10:15",
      progress: 100,
      status: "completed",
    }
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Simulate new file upload progress
  const simulateUpload = (fileName: string, type: string, size: string) => {
    const fileId = "f-" + Date.now();
    const newFile: UploadedFile = {
      id: fileId,
      name: fileName,
      type,
      size,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      progress: 0,
      status: "uploading",
    };

    setFiles((prev) => [...prev, newFile]);

    // Tick progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId) {
            if (prog >= 100) {
              clearInterval(interval);
              // Start processing simulation
              setTimeout(() => simulateProcessing(fileId), 1000);
              return { ...f, progress: 100, status: "uploaded" };
            }
            return { ...f, progress: prog };
          }
          return f;
        })
      );
    }, 400);
  };

  const simulateProcessing = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "processing" } : f))
    );

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "completed" } : f))
      );
      showToast(
        language === "ar" ? "اكتملت معالجة الملف بنجاح!" : "File processing complete!",
        "success"
      );
    }, 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const name = droppedFile.name;
      const sizeMB = (droppedFile.size / (1024 * 1024)).toFixed(1) + " MB";
      const ext = name.split(".").pop()?.toUpperCase() || "PDF";
      
      const allowed = ["PDF", "DWG", "DXF", "JPG", "PNG"];
      if (!allowed.includes(ext)) {
        showToast(
          language === "ar" ? "صيغة الملف غير مدعومة" : "File extension not supported",
          "error"
        );
        return;
      }
      simulateUpload(name, ext, sizeMB);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const chosenFile = e.target.files[0];
      const name = chosenFile.name;
      const sizeMB = (chosenFile.size / (1024 * 1024)).toFixed(1) + " MB";
      const ext = name.split(".").pop()?.toUpperCase() || "PDF";
      simulateUpload(name, ext, sizeMB);
    }
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    showToast(
      language === "ar" ? "تم حذف المخطط المعني" : "File deleted",
      "info"
    );
  };

  const handleRetry = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0 } : f))
    );
    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === id) {
            if (prog >= 100) {
              clearInterval(interval);
              setTimeout(() => simulateProcessing(id), 1000);
              return { ...f, progress: 100, status: "uploaded" };
            }
            return { ...f, progress: prog };
          }
          return f;
        })
      );
    }, 500);
  };

  const handleStartAnalysis = () => {
    const activeFiles = files.filter((f) => f.status === "completed");
    if (activeFiles.length === 0) {
      showToast(
        language === "ar" ? "يرجى رفع مخطط هندسي واحد مكتمل على الأقل للتحليل" : "Please upload at least one completed layout plan",
        "error"
      );
      return;
    }
    router.push("/analysis"); // Launch code compliance analysis screen!
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 select-none relative">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-main-text">{t.uploadPage.title}</h1>
        <div className="h-1.5 w-16 bg-compliance-green mx-auto rounded"></div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center space-y-4 hover:bg-slate-50/50 transition-all cursor-pointer relative ${
          dragActive 
            ? "border-compliance-green bg-emerald-50/20" 
            : "border-border-gray"
        }`}
      >
        <input
          type="file"
          id="manual-file-input"
          onChange={handleManualUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
        />

        <div className="h-14 w-14 rounded-full bg-emerald-50 text-compliance-green flex items-center justify-center mx-auto shadow-sm">
          <UploadCloud className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-main-text">{t.uploadPage.dragDropText}</p>
          <p className="text-[10px] text-muted-text">{t.uploadPage.formatsText}</p>
        </div>

        <span className="text-[9px] bg-slate-100 text-slate-500 font-bold border px-3 py-1 rounded-full uppercase tracking-wider">
          {language === "ar" ? "تصفح جهازك" : "Browse files"}
        </span>
      </div>

      {/* CAD Processing Notice */}
      <div className="p-3 bg-blue-50 border-l-2 border-compliance-green rounded text-[10px] text-slate-600 leading-relaxed font-semibold flex gap-2 items-center">
        <ShieldCheck className="h-4.5 w-4.5 text-compliance-green flex-shrink-0" />
        <p>{t.uploadPage.note}</p>
      </div>

      {/* File List section */}
      {files.length > 0 && (
        <div className="bg-white-card border border-border-gray rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-main-text border-b border-border-gray pb-2">
            {t.uploadPage.fileList}
          </h3>

          <div className="space-y-3">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="border border-border-gray rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                {/* File Meta */}
                <div className="flex gap-3 items-center flex-1 min-w-0">
                  <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 font-mono border">
                    {file.type}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-main-text truncate">{file.name}</p>
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">
                      {file.size} • {file.time}
                    </span>
                  </div>
                </div>

                {/* Progress bar (if uploading) */}
                {file.status === "uploading" && (
                  <div className="w-full md:w-32 space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-1">
                      <div 
                        className="bg-compliance-green h-1 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] text-muted-text font-bold block text-right font-mono">
                      {file.progress}%
                    </span>
                  </div>
                )}

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5 font-bold">
                  {file.status === "completed" && (
                    <span className="text-compliance-green flex items-center gap-1 text-[10px]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t.uploadPage.statusText.completed}</span>
                    </span>
                  )}
                  {file.status === "processing" && (
                    <span className="text-yellow-600 flex items-center gap-1 text-[10px] animate-pulse">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>{t.uploadPage.statusText.processing}</span>
                    </span>
                  )}
                  {file.status === "uploading" && (
                    <span className="text-blue-600 text-[10px]">{t.uploadPage.statusText.uploading}</span>
                  )}
                  {file.status === "uploaded" && (
                    <span className="text-blue-600 text-[10px]">{t.uploadPage.statusText.uploaded}</span>
                  )}
                  {file.status === "failed" && (
                    <span className="text-alert-red flex items-center gap-1 text-[10px]">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{t.uploadPage.statusText.failed}</span>
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 justify-end">
                  {file.status === "failed" && (
                    <button
                      onClick={() => handleRetry(file.id)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title={t.uploadPage.buttons.retry}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setConfirmDeleteId(file.id)}
                    className="p-1.5 text-alert-red hover:bg-red-50 rounded"
                    title={t.uploadPage.buttons.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start analysis button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleStartAnalysis}
          className="flex items-center gap-2 bg-compliance-green text-white hover:bg-emerald-800 px-6 py-3 rounded-lg text-xs font-bold shadow-lg transition-colors"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>{t.uploadPage.buttons.startAnalysis}</span>
        </button>
      </div>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white-card rounded-xl border border-border-gray max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="h-10 w-10 rounded-full bg-red-100 text-alert-red flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-right">
              <h3 className="text-xs font-black text-main-text">{language === "ar" ? "حذف المخطط" : "Delete blueprint"}</h3>
              <p className="text-[11px] text-muted-text leading-relaxed">{t.uploadPage.deleteConfirm}</p>
            </div>
            <div className="flex gap-3 justify-end pt-2 text-xs font-bold">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-border-gray hover:bg-slate-50 rounded-lg text-slate-700"
              >
                {t.common.buttons.cancel}
              </button>
              <button
                onClick={() => {
                  handleDeleteFile(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 bg-alert-red text-white hover:bg-red-700 rounded-lg"
              >
                {t.common.buttons.delete}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

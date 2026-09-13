"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ar } from "../translations/ar";
import { en } from "../translations/en";

type Language = "ar" | "en";

export interface Violation {
  id: string;
  type: string;
  typeEn: string;
  location: string;
  locationEn: string;
  severity: "high" | "medium" | "low";
  currentVal: string;
  currentValEn: string;
  requiredVal: string;
  requiredValEn: string;
  difference: string;
  differenceEn: string;
  effect: string;
  effectEn: string;
  regSource: string;
  regSourceEn: string;
  proposedSolution: string;
  proposedSolutionEn: string;
  priority: string;
  priorityEn: string;
  notes: string;
  notesEn: string;
  status: "active" | "resolved";
  coordinates: { x: number; y: number; z: number }; // For 3D Raycasting reference
}

export interface Project {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  cityEn: string;
  type: string;
  typeEn: string;
  landArea: number;
  floorsCount: number;
  complianceScore: number;
  totalViolations: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  compliantCount: number;
  needReviewCount: number;
  lastUpdated: string;
  status: "draft" | "waiting" | "analyzing" | "reviewNeeded" | "completed" | "archived";
  violations: Violation[];
  metadata: {
    district: string;
    districtEn: string;
    plotNumber: string;
    licenseType: string;
    licenseTypeEn: string;
    projectStage: string;
    projectStageEn: string;
    buildingUse: string;
    buildingUseEn: string;
    engineeringFirm: string;
    planNumber: string;
    description: string;
    descriptionEn: string;
  };
}

interface AppContextProps {
  language: Language;
  t: typeof ar;
  setLanguage: (lang: Language) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  activeProject: Project | null;
  simulateSolution: (violationId: string) => void;
  undoSolution: (violationId: string) => void;
  simulateAllSolutions: () => void;
  undoAllSolutions: () => void;
  addProject: (proj: Project) => void;
  updateProjectStatus: (id: string, status: Project["status"]) => void;
  deleteProject: (id: string) => void;
  archiveProject: (id: string) => void;
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const initialViolations: Violation[] = [
  {
    id: "V-01",
    type: "عدم كفاية الارتداد الأمامي",
    typeEn: "Inadequate Front Setback",
    location: "محيط الارتداد الأمامي للشارع",
    locationEn: "Front Boundary Buffer Zone",
    severity: "high",
    currentVal: "3.5 متر",
    currentValEn: "3.5 meters",
    requiredVal: "6.0 متر (خُمس عرض الشارع)",
    requiredValEn: "6.0 meters (1/5 of street width)",
    difference: "-2.5 متر (تجاوز على الارتداد)",
    differenceEn: "-2.5 meters (setback encroachment)",
    effect: "مخالفة الارتداد النظامي للشارع التجاري (شارع عرض 30م)، مما يؤدي لغرامات مالية ورفض رخصة البناء.",
    effectEn: "Zoning offset infraction for commercial streets (30m wide), resulting in financial penalties and permit rejection.",
    regSource: "اشتراطات المكاتب الهندسية - المادة 4.2.1 للارتدادات والارتفاعات",
    regSourceEn: "Engineering Codes - Article 4.2.1 on Offsets and Heights",
    proposedSolution: "إزاحة كتلة المبنى الأمامية للداخل بمقدار 2.5 متر للوفاء بالارتداد النظامي الكامل.",
    proposedSolutionEn: "Shift the front building block back by 2.5m to achieve the full regulatory setback.",
    priority: "عالية جداً (حرجة)",
    priorityEn: "Very High (Critical)",
    notes: "يجب تعديل الواجهة الأمامية بالكامل في المخططات المعمارية وإزاحتها لتفادي الرفض.",
    notesEn: "Front facade must be shifted back in the architectural plans to avoid immediate rejection.",
    status: "active",
    coordinates: { x: 0, y: 1.5, z: 6 }
  },
  {
    id: "V-02",
    type: "تجاوز نسبة البناء المسموحة بالأرض",
    typeEn: "Exceeding Allowed Building Coverage",
    location: "المخطط الأفقي للدور الأرضي",
    locationEn: "Ground Floor Plan Layout",
    severity: "high",
    currentVal: "68% (816 م²)",
    currentValEn: "68% (816 sqm)",
    requiredVal: "حد أقصى 60% (720 م²)",
    requiredValEn: "Max 60% (720 sqm)",
    difference: "+8% (تجاوز بمساحة 96 م²)",
    differenceEn: "+8% (excess of 96 sqm)",
    effect: "زيادة رقعة البناء الخرساني وتقلص المساحة المفتوحة بالأرض مما يخالف اشتراطات الكثافة البنائية للمنطقة.",
    effectEn: "Increased concrete footprint and reduced open space, violating zoning density limits for the district.",
    regSource: "دليل اشتراطات البناء التجاري - قسم معامل مساحة الأرض الفعلي 3.1",
    regSourceEn: "Commercial Building Standards Guide - Section 3.1 Floor Area Coefficients",
    proposedSolution: "إدراج منور داخلي مفتوح بمساحة 96 م² أو اقتطاع جزء من المبنى الخلفي.",
    proposedSolutionEn: "Introduce an open internal lightwell/courtyard of 96 sqm or chop off a portion of the rear wing.",
    priority: "عالية (حرجة)",
    priorityEn: "High (Critical)",
    notes: "يمكن تصميم فناء مفتوح لرفع القيمة الجمالية وحل المخالفة في وقت واحد.",
    notesEn: "An open courtyard can be designed to improve aesthetics and solve the violation simultaneously.",
    status: "active",
    coordinates: { x: 3, y: 1, z: 0 }
  },
  {
    id: "V-03",
    type: "عدم مطابقة الارتداد الجانبي الأيسر",
    typeEn: "Left Side Setback Violation",
    location: "الارتداد الجانبي من الجهة الشمالية",
    locationEn: "Northern Boundary Offset",
    severity: "medium",
    currentVal: "1.8 متر",
    currentValEn: "1.8 meters",
    requiredVal: "2.0 متر كحد أدنى",
    requiredValEn: "Min 2.0 meters",
    difference: "-0.2 متر",
    differenceEn: "-0.2 meters",
    effect: "عدم كفاية المسافة الآمنة لفصل الحريق وتقليل التهوية الطبيعية بين الجيران.",
    effectEn: "Insufficient fire separation distance and reduced natural ventilation between adjacent properties.",
    regSource: "كود البناء السعودي (SBC 201) - متطلبات الفصل والارتدادات الجانبية",
    regSourceEn: "Saudi Building Code (SBC 201) - Section Fire Separation & Setbacks",
    proposedSolution: "إزاحة الجدار الجانبي الأيسر بمقدار 20 سم للداخل.",
    proposedSolutionEn: "Shift the left side wall 20 cm inwards.",
    priority: "متوسطة (مهمة)",
    priorityEn: "Medium (Important)",
    notes: "التعديل بسيط ولا يؤثر بشكل كبير على التصميم الداخلي للغرف.",
    notesEn: "Modification is simple and won't heavily impact interior room layouts.",
    status: "active",
    coordinates: { x: -6, y: 1.5, z: -2 }
  },
  {
    id: "V-04",
    type: "نقص عدد مواقف السيارات المخصصة",
    typeEn: "Deficit in Required Parking Spaces",
    location: "منطقة المواقف الخارجية والقبو",
    locationEn: "Basement and Outdoor Parking Lot",
    severity: "medium",
    currentVal: "8 مواقف",
    currentValEn: "8 spaces",
    requiredVal: "12 موقف (موقف لكل 100 م² بنائي)",
    requiredValEn: "12 spaces (1 space per 100 sqm built area)",
    difference: "-4 مواقف",
    differenceEn: "-4 spaces",
    effect: "عدم تلبية الطلب المتوقع للمركبات مما يسبب ازدحاماً مرورياً حول المنشأة التجارية.",
    effectEn: "Failure to accommodate expected vehicle parking, leading to traffic congestion around the property.",
    regSource: "اشتراطات مواقف السيارات بالأمانة - البند 6.3 لمباني الأنشطة التجارية",
    regSourceEn: "Municipal Parking Regulations - Item 6.3 for Commercial Activities",
    proposedSolution: "إعادة تخطيط منطقة الارتداد الأمامي وتخصيص مساحات إضافية، أو توسيع قبو المواقف.",
    proposedSolutionEn: "Reconfigure the front offset landscaping to accommodate more spaces or expand basement layout.",
    priority: "متوسطة",
    priorityEn: "Medium",
    notes: "يمكن استبدال الحديقة التجميلية الأمامية بـ 4 مواقف إضافية سطحية.",
    notesEn: "Front landscape garden can be partly converted to 4 surface parking spaces.",
    status: "active",
    coordinates: { x: -4, y: 0.1, z: 6 }
  },
  {
    id: "V-05",
    type: "عرض ممر الهروب ومسار الإخلاء غير مطابق",
    typeEn: "Non-compliant Egress Exit Corridor Width",
    location: "الممر الموصل لمخرج الطوارئ الرئيسي",
    locationEn: "Corridor Leading to Emergency Exit",
    severity: "medium",
    currentVal: "1.05 متر",
    currentValEn: "1.05 meters",
    requiredVal: "1.20 متر كحد أدنى",
    requiredValEn: "Min 1.20 meters",
    difference: "-0.15 متر",
    differenceEn: "-0.15 meters",
    effect: "يشكل خطراً على سلامة مرتادي المبنى أثناء حالات الطوارئ ويعيق عملية الإخلاء السريع.",
    effectEn: "Presents a safety hazard to building occupants during emergencies and delays rapid evacuation.",
    regSource: "كود الحريق السعودي (SBC 801) - الفصل 10 (وسائل الخروج)",
    regSourceEn: "Saudi Fire Code (SBC 801) - Chapter 10 (Means of Egress)",
    proposedSolution: "إزاحة جدران الممر بمقدار 15 سم لزيادة العرض الصافي المفتوح.",
    proposedSolutionEn: "Shift the corridor drywalls by 15 cm to expand net clear width.",
    priority: "متوسطة (متعلقة بالسلامة)",
    priorityEn: "Medium (Safety Critical)",
    notes: "تعديل ضروري لموافقة الدفاع المدني.",
    notesEn: "Crucial adjustment needed for Civil Defense approval.",
    status: "active",
    coordinates: { x: 2, y: 1.2, z: -4 }
  },
  {
    id: "V-06",
    type: "ارتفاع سترة السطح المعمارية مخالف",
    typeEn: "Excessive Roof Parapet Height",
    location: "واجهة السطح العلوي",
    locationEn: "Roof Parapet Facade Top",
    severity: "low",
    currentVal: "2.1 متر",
    currentValEn: "2.1 meters",
    requiredVal: "حد أقصى 1.8 متر للسترة",
    requiredValEn: "Max 1.8 meters for parapet",
    difference: "+0.3 متر (زيادة عن الكود)",
    differenceEn: "+0.3 meters (over maximum)",
    effect: "زيادة الارتفاع البصري الخارجي وارتفاع نسبة الأحمال الرياح على السترة بدون حاجة إنشائية.",
    effectEn: "Increased external visual height and unnecessary wind load on the parapet without structural need.",
    regSource: "الاشتراطات المعمارية العامة للمباني السكنية والتجارية - الفقرة 8.4",
    regSourceEn: "General Architectural Guidelines - Paragraph 8.4",
    proposedSolution: "تخفيض ارتفاع البناء في السترة بمقدار 30 سم لتصبح 1.8 متر.",
    proposedSolutionEn: "Reduce the height of the parapet block by 30 cm to meet the 1.8m maximum.",
    priority: "منخفضة (تجميلية)",
    priorityEn: "Low (Aesthetic/Wind load)",
    notes: "تعديل بسيط وسريع في جداول الكميات والرسومات المعمارية.",
    notesEn: "Simple and quick edit to architectural details and bills of quantities.",
    status: "active",
    coordinates: { x: 0, y: 3.5, z: 0 }
  }
];

const mockProjectData: Project = {
  id: "P-01",
  name: "مشروع مبنى تجاري — الرياض",
  nameEn: "Commercial Building Project — Riyadh",
  city: "الرياض",
  cityEn: "Riyadh",
  type: "مبنى تجاري",
  typeEn: "Commercial Building",
  landArea: 1200,
  floorsCount: 4,
  complianceScore: 78,
  totalViolations: 6,
  highSeverity: 2,
  mediumSeverity: 3,
  lowSeverity: 1,
  compliantCount: 14,
  needReviewCount: 2,
  lastUpdated: "2026-07-13",
  status: "reviewNeeded",
  violations: initialViolations,
  metadata: {
    district: "حي الياسمين",
    districtEn: "Al-Yasmin District",
    plotNumber: "قطعة رقم 145/ب",
    licenseType: "رخصة بناء جديدة لمبنى تجاري",
    licenseTypeEn: "New Commercial Building Construction Permit",
    projectStage: "مرحلة مراجعة المخططات الهولستية الأولوية",
    projectStageEn: "Preliminary Holistic Plan Review Stage",
    buildingUse: "مكاتب تجارية ومعارض وصالة عرض",
    buildingUseEn: "Commercial Offices, Showrooms and Galleries",
    engineeringFirm: "مكتب الإتقان للاستشارات الهندسية",
    planNumber: "BUNYAN-PLAN-2026-09",
    description: "مراجعة المخططات المعمارية والإنشائية لمشروع مبنى إداري وتجاري متكامل قبل تقديم المعاملة الرسمية على منصة بلدي.",
    descriptionEn: "Review architectural and structural plans for an integrated administrative/commercial building before official submission on Balady."
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("ar");
  const [projects, setProjects] = useState<Project[]>([mockProjectData]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>("P-01");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Load language and projects from local storage
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    } else {
      setLanguageState("ar");
    }

    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Failed to parse saved projects from local storage", e);
      }
    }
  }, []);

  // Update HTML tag dir & lang when language shifts
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language === "ar" ? "ar" : "en";
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Toast Auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  // Persist projects to localStorage
  const saveProjectsToStorage = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const addProject = (proj: Project) => {
    const updated = [proj, ...projects];
    saveProjectsToStorage(updated);
    showToast(language === "ar" ? "تم إنشاء المشروع بنجاح" : "Project created successfully", "success");
  };

  const updateProjectStatus = (id: string, status: Project["status"]) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, status } : p));
    saveProjectsToStorage(updated);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjectsToStorage(updated);
    if (activeProjectId === id) {
      setActiveProjectId(updated.length > 0 ? updated[0].id : null);
    }
    showToast(language === "ar" ? "تم حذف المشروع بنجاح" : "Project deleted successfully", "success");
  };

  const archiveProject = (id: string) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, status: "archived" as const } : p
    );
    saveProjectsToStorage(updated);
    showToast(language === "ar" ? "تم أرشفة المشروع بنجاح" : "Project archived successfully", "success");
  };

  // Recalculate compliance properties based on violations state
  const recalculateCompliance = (proj: Project, violations: Violation[]): Project => {
    const total = violations.length;
    const active = violations.filter((v) => v.status === "active");
    
    const high = active.filter((v) => v.severity === "high").length;
    const medium = active.filter((v) => v.severity === "medium").length;
    const low = active.filter((v) => v.severity === "low").length;

    // Original: 78% (6 active violations). If 0 active, 100%.
    // We can distribute the weights:
    // High counts as 8% each, Medium 4% each, Low 2% each. Total deduction: 2*8 + 3*4 + 1*2 = 30%.
    // Let's adjust to match initial 78% score:
    // Deductions: High = 8%, Medium = 3.5%, Low = 1.5%. Total deduction: 16 + 10.5 + 1.5 = 28% -> score 72%.
    // Let's define deduction per active severity: High = 7%, Medium = 2.5%, Low = 0.5%.
    // Deduction: 14 + 7.5 + 0.5 = 22% -> score 78%! That matches exactly!
    // So: Compliance = 100 - (active_high * 7 + active_med * 2.5 + active_low * 0.5)
    // Bound it between 0 and 100.
    const deduction = active.reduce((sum, v) => {
      if (v.severity === "high") return sum + 7;
      if (v.severity === "medium") return sum + 2.5;
      return sum + 0.5;
    }, 0);
    const score = Math.max(0, Math.min(100, Math.round(100 - deduction)));

    const isCompleted = active.length === 0;

    return {
      ...proj,
      complianceScore: score,
      totalViolations: active.length,
      highSeverity: high,
      mediumSeverity: medium,
      lowSeverity: low,
      violations,
      status: isCompleted ? "completed" : "reviewNeeded"
    };
  };

  const simulateSolution = (violationId: string) => {
    if (!activeProjectId) return;
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        const violations = p.violations.map((v) =>
          v.id === violationId ? { ...v, status: "resolved" as const } : v
        );
        return recalculateCompliance(p, violations);
      }
      return p;
    });
    saveProjectsToStorage(updated);
    showToast(
      language === "ar" ? "تم محاكاة تعديل المخطط بنجاح! ارتفعت نسبة الامتثال." : "Modification simulated successfully! Compliance score updated.",
      "success"
    );
  };

  const undoSolution = (violationId: string) => {
    if (!activeProjectId) return;
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        const violations = p.violations.map((v) =>
          v.id === violationId ? { ...v, status: "active" as const } : v
        );
        return recalculateCompliance(p, violations);
      }
      return p;
    });
    saveProjectsToStorage(updated);
    showToast(
      language === "ar" ? "تم التراجع عن التعديل وإعادة المخطط لحالته الأصلية." : "Modification reverted. Plan restored to original state.",
      "info"
    );
  };

  const simulateAllSolutions = () => {
    if (!activeProjectId) return;
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        const violations = p.violations.map((v) => ({ ...v, status: "resolved" as const }));
        return recalculateCompliance(p, violations);
      }
      return p;
    });
    saveProjectsToStorage(updated);
    showToast(
      language === "ar" ? "تم محاكاة معالجة جميع المخالفات! نسبة الامتثال الآن 100%." : "All violations resolved! Compliance score is now 100%.",
      "success"
    );
  };

  const undoAllSolutions = () => {
    if (!activeProjectId) return;
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        const violations = p.violations.map((v) => ({ ...v, status: "active" as const }));
        return recalculateCompliance(p, violations);
      }
      return p;
    });
    saveProjectsToStorage(updated);
    showToast(
      language === "ar" ? "تم التراجع عن جميع التعديلات." : "All modifications reverted.",
      "info"
    );
  };

  const t = language === "ar" ? ar : en;

  return (
    <AppContext.Provider
      value={{
        language,
        t,
        setLanguage,
        projects,
        setProjects,
        activeProjectId,
        setActiveProjectId,
        activeProject,
        simulateSolution,
        undoSolution,
        simulateAllSolutions,
        undoAllSolutions,
        addProject,
        updateProjectStatus,
        deleteProject,
        archiveProject,
        toast,
        showToast,
        hideToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

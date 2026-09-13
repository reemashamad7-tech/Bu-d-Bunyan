"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, Project } from "../../context/AppContext";
import { 
  Plus, Search, LayoutGrid, List, MapPin, Building2, 
  Calendar, Layers, FileWarning, MoreVertical, Trash2, 
  Archive, Copy, ExternalLink, ShieldAlert 
} from "lucide-react";

export default function Projects() {
  const { language, t, projects, setActiveProjectId, deleteProject, archiveProject, addProject } = useApp();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    const name = language === "ar" ? p.name : p.nameEn;
    return name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
  });

  const getStatusColor = (status: Project["status"]) => {
    const colors = {
      draft: "bg-slate-100 text-slate-800 border-slate-300",
      waiting: "bg-blue-50 text-blue-800 border-blue-200",
      analyzing: "bg-yellow-50 text-yellow-800 border-yellow-200 animate-pulse",
      reviewNeeded: "bg-red-50 text-red-800 border-red-200",
      completed: "bg-green-50 text-green-800 border-green-200",
      archived: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return colors[status] || "bg-slate-100 text-slate-800 border-slate-300";
  };

  const handleOpenProject = (id: string) => {
    setActiveProjectId(id);
    const proj = projects.find((p) => p.id === id);
    if (proj?.status === "waiting") {
      router.push("/upload");
    } else {
      router.push("/results");
    }
  };

  const handleDuplicate = (proj: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const duplicated: Project = {
      ...proj,
      id: "P-" + Math.floor(Math.random() * 1000),
      name: proj.name + " (نسخة)",
      nameEn: proj.nameEn + " (Copy)",
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    addProject(duplicated);
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none relative">
      
      {/* Upper header action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-gray pb-6">
        <div>
          <h1 className="text-2xl font-black text-main-text">{t.projectsPage.title}</h1>
          <p className="text-xs text-muted-text mt-1">
            {language === "ar" ? "إدارة وتدقيق مخططات المشاريع الإنشائية" : "Manage and audit construction project blueprints"}
          </p>
        </div>
        
        <Link
          href="/projects/new"
          className="flex items-center gap-1.5 bg-compliance-green text-white hover:bg-emerald-800 px-4 py-2.5 rounded-lg text-xs font-bold shadow-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t.projectsPage.newProject}</span>
        </Link>
      </div>

      {/* Filter and toggle controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white-card p-4 rounded-xl border border-border-gray shadow-sm">
        
        {/* Search */}
        <div className="w-full sm:max-w-xs relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.projectsPage.searchPlaceholder}
            className="w-full px-3 py-2 pr-9 border border-border-gray rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-compliance-green bg-slate-50 focus:bg-white"
          />
          <Search className={`absolute top-1/2 -translate-y-1/2 ${language === "ar" ? "left-3" : "right-3"} h-4 w-4 text-muted-text`} />
        </div>

        {/* View togglers */}
        <div className="flex items-center gap-2 border border-border-gray p-1 rounded-lg bg-slate-50">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-compliance-green shadow" : "text-muted-text hover:bg-slate-100"}`}
            title={t.projectsPage.viewGrid}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-compliance-green shadow" : "text-muted-text hover:bg-slate-100"}`}
            title={t.projectsPage.viewList}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white-card border border-border-gray rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="h-14 w-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileWarning className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-main-text">{t.projectsPage.emptyState.title}</h3>
            <p className="text-xs text-muted-text leading-relaxed">{t.projectsPage.emptyState.desc}</p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center bg-compliance-green text-white hover:bg-emerald-800 px-6 py-2.5 rounded-lg text-xs font-bold shadow-md transition-colors"
          >
            {t.projectsPage.emptyState.button}
          </Link>
        </div>
      ) : (
        /* Project Container */
        viewMode === "grid" ? (
          /* Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => {
              const nameLabel = language === "ar" ? p.name : p.nameEn;
              const cityLabel = language === "ar" ? p.city : p.cityEn;
              const typeLabel = language === "ar" ? p.type : p.typeEn;

              return (
                <div
                  key={p.id}
                  onClick={() => handleOpenProject(p.id)}
                  className="bg-white-card border border-border-gray rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 relative"
                >
                  
                  {/* Upper Row */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getStatusColor(p.status)}`}>
                        {t.projectsPage.status[p.status]}
                      </span>
                      
                      {/* Menu controls */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                          className="p-1 rounded hover:bg-slate-100 text-muted-text"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {activeMenuId === p.id && (
                          <div className={`absolute top-7 ${language === "ar" ? "left-0" : "right-0"} w-36 rounded-lg border border-border-gray bg-white-card p-1 shadow-lg z-20 text-xs`}>
                            <button
                              onClick={(e) => handleDuplicate(p, e)}
                              className="flex w-full items-center gap-1.5 px-2 py-1.5 hover:bg-slate-50 text-slate-700 rounded-md"
                            >
                              <Copy className="h-3.5 w-3.5 text-slate-400" />
                              <span>{t.projectsPage.actions.duplicate}</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); archiveProject(p.id); setActiveMenuId(null); }}
                              className="flex w-full items-center gap-1.5 px-2 py-1.5 hover:bg-slate-50 text-slate-700 rounded-md"
                            >
                              <Archive className="h-3.5 w-3.5 text-slate-400" />
                              <span>{t.projectsPage.actions.archive}</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(p.id); setActiveMenuId(null); }}
                              className="flex w-full items-center gap-1.5 px-2 py-1.5 hover:bg-red-50 text-alert-red rounded-md font-semibold"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>{t.projectsPage.actions.delete}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-main-text group-hover:text-compliance-green transition-colors flex items-center gap-1.5">
                        <span>{nameLabel}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-compliance-green" />
                      </h3>
                      <p className="text-[10px] text-muted-text truncate max-w-full">
                        {language === "ar" ? p.metadata.description : p.metadata.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Tech details Row */}
                  <div className="border-t border-border-gray mt-5 pt-4 grid grid-cols-2 gap-4 text-[10px] font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{cityLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      <span>{typeLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      <span>{p.floorsCount} {language === "ar" ? "طوابق" : "floors"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-mono">{p.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Compliance Score Row */}
                  {p.status !== "waiting" && p.status !== "analyzing" && (
                    <div className="border-t border-border-gray mt-4 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-muted-text font-bold">{t.projectsPage.complianceScore}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-main-text">{p.complianceScore}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-compliance-green h-1.5 rounded-full" 
                            style={{ width: `${p.complianceScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          /* Table Layout */
          <div className="bg-white-card border border-border-gray rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-border-gray text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-3.5">{language === "ar" ? "اسم المشروع" : "Project Name"}</th>
                    <th className="px-6 py-3.5">{language === "ar" ? "المدينة" : "City"}</th>
                    <th className="px-6 py-3.5">{language === "ar" ? "النوع" : "Type"}</th>
                    <th className="px-6 py-3.5">{t.projectsPage.complianceScore}</th>
                    <th className="px-6 py-3.5">{t.projectsPage.violationsCount}</th>
                    <th className="px-6 py-3.5">{t.projectsPage.lastUpdated}</th>
                    <th className="px-6 py-3.5">{language === "ar" ? "الحالة" : "Status"}</th>
                    <th className="px-6 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-gray">
                  {filteredProjects.map((p) => {
                    const nameLabel = language === "ar" ? p.name : p.nameEn;
                    const cityLabel = language === "ar" ? p.city : p.cityEn;
                    const typeLabel = language === "ar" ? p.type : p.typeEn;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => handleOpenProject(p.id)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4 font-bold text-main-text group-hover:text-compliance-green transition-colors">
                          {nameLabel}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-semibold">{cityLabel}</td>
                        <td className="px-6 py-4 text-slate-500 font-semibold">{typeLabel}</td>
                        <td className="px-6 py-4 font-mono font-black">
                          {p.status === "waiting" || p.status === "analyzing" ? "-" : `${p.complianceScore}%`}
                        </td>
                        <td className="px-6 py-4 font-mono font-black text-alert-red">
                          {p.status === "waiting" || p.status === "analyzing" ? "-" : p.totalViolations}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">{p.lastUpdated}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getStatusColor(p.status)}`}>
                            {t.projectsPage.status[p.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setConfirmDeleteId(p.id)}
                              className="p-1.5 rounded hover:bg-red-50 text-alert-red"
                              title={t.projectsPage.actions.delete}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white-card rounded-xl border border-border-gray max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="h-10 w-10 rounded-full bg-red-100 text-alert-red flex items-center justify-center">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-right">
              <h3 className="text-xs font-black text-main-text">{language === "ar" ? "تأكيد حذف المشروع" : "Confirm Delete"}</h3>
              <p className="text-[11px] text-muted-text leading-relaxed">{t.projectsPage.actions.confirmDelete}</p>
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
                  deleteProject(confirmDeleteId);
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

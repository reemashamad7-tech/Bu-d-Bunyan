"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { language, t } = useApp();

  if (pathname === "/") return null;

  const paths = pathname.split("/").filter((p) => p !== "");

  const getBreadcrumbLabel = (path: string) => {
    const keys: Record<string, string> = {
      projects: t.common.breadcrumbs.projects,
      new: t.common.breadcrumbs.newProject,
      advisor: t.common.breadcrumbs.advisor,
      upload: t.common.breadcrumbs.upload,
      analysis: t.common.breadcrumbs.analysis,
      results: t.common.breadcrumbs.results,
      solutions: t.common.breadcrumbs.solutions,
      report: t.common.breadcrumbs.report,
    };
    return keys[path] || path;
  };

  const ArrowIcon = language === "ar" ? ChevronLeft : ChevronRight;

  return (
    <nav className="bg-slate-50 border-b border-border-gray py-2.5 px-4 sm:px-6 lg:px-8 w-full select-none text-[11px] font-semibold text-muted-text">
      <div className="mx-auto max-w-7xl flex items-center gap-1.5 flex-wrap">
        
        <Link href="/" className="flex items-center gap-1 hover:text-compliance-green transition-colors">
          <Home className="h-3.5 w-3.5" />
          <span>{t.common.breadcrumbs.home}</span>
        </Link>

        {paths.map((path, idx) => {
          const href = "/" + paths.slice(0, idx + 1).join("/");
          const isLast = idx === paths.length - 1;

          return (
            <React.Fragment key={href}>
              <ArrowIcon className="h-3 w-3 text-slate-400" />
              {isLast ? (
                <span className="text-main-text font-bold max-w-[150px] truncate">
                  {getBreadcrumbLabel(path)}
                </span>
              ) : (
                <Link href={href} className="hover:text-compliance-green transition-colors max-w-[150px] truncate">
                  {getBreadcrumbLabel(path)}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}

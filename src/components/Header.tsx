/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Activity, 
  FlaskConical, 
  ClipboardList, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Users, 
  Plus, 
  Settings2,
  PhoneCall
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'registration'
  | 'worklist'
  | 'results'
  | 'verification'
  | 'reports'
  | 'critical'
  | 'queue'
  | 'qc_reagents';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenNewOrder: () => void;
  pendingCount: number;
  criticalCount: number;
  totalToday: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewOrder,
  pendingCount,
  criticalCount,
  totalToday
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Primary Top Bar (Strict 3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Zone 1: Brand Wordmark with Hospital Emblem */}
          <div 
            onClick={() => onSelectTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <img 
              src="/public/assets/aistudio/020_5f9f8721.jpg" 
              alt="Seth N.L General Hospital Civil Patan Laboratory Official Emblem"
              className="h-10 w-10 rounded-full border border-slate-200 object-contain shadow-2xs"
              onError={(e) => {
                // Fallback if path mapping differs
                (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/020_5f9f8721.jpg';
              }}
            />
            <div className="leading-tight">
              <span className="text-base font-bold text-slate-900 tracking-tight block whitespace-nowrap">
                SETH N.L. GENERAL HOSPITAL
              </span>
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide block">
                Civil Patan · Central Laboratory
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line text links) */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'dashboard' ? 'border-blue-800 text-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('worklist')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'worklist' ? 'border-blue-800 text-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              Worklist
              {pendingCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-mono font-medium">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectTab('results')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'results' ? 'border-blue-800 text-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              Result Entry
            </button>
            <button
              onClick={() => onSelectTab('verification')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'verification' ? 'border-blue-800 text-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              Verification
            </button>
            <button
              onClick={() => onSelectTab('reports')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'reports' ? 'border-blue-800 text-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => onSelectTab('critical')}
              className={`hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1 ${
                currentTab === 'critical' ? 'border-rose-700 text-rose-700 font-semibold' : 'border-transparent'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              Panic Log
              {criticalCount > 0 && (
                <span className="text-[10px] bg-rose-100 text-rose-900 px-1 py-0.2 rounded font-mono font-bold">
                  {criticalCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectTab('queue')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'queue' ? 'border-blue-800 text-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              Phlebotomy Queue
            </button>
            <button
              onClick={() => onSelectTab('qc_reagents')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'qc_reagents' ? 'border-blue-800 text-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              QC & Reagents
            </button>
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewOrder}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors whitespace-nowrap shadow-xs"
            >
              <Plus className="w-4 h-4" />
              New Requisition
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar / Telemetry Metadata Banner */}
      <div className="bg-slate-100/90 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-slate-800">Govt. of Gujarat · Dept. of Health</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>NABL Accredited Lab (ISO 15189:2022)</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono">Patan - 384265</span>
          </div>
          
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Today's Accessions: <strong className="text-slate-900">{totalToday}</strong></span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>Pending Validation: <strong className="text-amber-800">{pendingCount}</strong></span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>Critical Panic Values: <strong className={criticalCount > 0 ? "text-rose-700 font-bold" : "text-slate-700"}>{criticalCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Scroll */}
      <div className="xl:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-200 bg-white text-xs">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'worklist', label: 'Worklist' },
          { id: 'results', label: 'Result Entry' },
          { id: 'verification', label: 'Verification' },
          { id: 'reports', label: 'Reports' },
          { id: 'critical', label: `Panic Log (${criticalCount})` },
          { id: 'queue', label: 'Queue' },
          { id: 'qc_reagents', label: 'QC/Reagents' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as NavTab)}
            className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              currentTab === item.id
                ? 'bg-blue-800 text-white font-medium'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

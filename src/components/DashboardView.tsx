/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  FlaskConical, 
  FileCheck, 
  ArrowRight, 
  PhoneCall, 
  Plus, 
  ShieldAlert,
  Printer,
  ChevronRight
} from 'lucide-react';
import { LabOrder } from '../types/laboratory';
import { NavTab } from './Header';

interface DashboardViewProps {
  orders: LabOrder[];
  onSelectTab: (tab: NavTab) => void;
  onOpenOrder: (accessionNo: string) => void;
  onOpenNewOrder: () => void;
  onViewReport: (order: LabOrder) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  onSelectTab,
  onOpenOrder,
  onOpenNewOrder,
  onViewReport
}) => {
  const totalCount = orders.length;
  const statCount = orders.filter(o => o.urgency === 'STAT_EMERGENCY').length;
  const inProcessingCount = orders.filter(o => o.status === 'PROCESSING' || o.status === 'RECEIVED_IN_LAB').length;
  const pendingVerificationCount = orders.filter(o => o.status === 'RESULT_ENTERED').length;
  const verifiedCount = orders.filter(o => o.status === 'VERIFIED' || o.status === 'DISPATCHED').length;
  const criticalOrders = orders.filter(o => {
    return Object.values(o.results).some(r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW');
  });

  const statOrders = orders.filter(o => o.urgency === 'STAT_EMERGENCY' || o.urgency === 'URGENT');

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome context */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>District Civil Hospital</span>
            <span aria-hidden="true">·</span>
            <span>Civil Hospital Campus, Patan</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-800 font-semibold">Live System Active</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Central Diagnostic Laboratory Services
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Seth N.L. General Hospital & GMC Patan · High-throughput automated diagnostic division
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewOrder}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Patient Requisition
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Batch Print Reports
          </button>
        </div>
      </div>

      {/* Critical Panic Value Immediate Alert Banner */}
      {criticalOrders.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-rose-900">
                    CRITICAL / PANIC LAB VALUES DETECTED ({criticalOrders.length})
                  </h3>
                  <span className="text-[11px] font-mono bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-semibold">
                    Immediate Ward Notification Protocol
                  </span>
                </div>
                <p className="text-xs text-rose-700 mt-1">
                  NABL & Hospital Safety mandate: The treating doctor or on-duty nurse must be notified by phone with read-back verification.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {criticalOrders.map((o) => (
                    <div 
                      key={o.accessionNo}
                      onClick={() => onOpenOrder(o.accessionNo)}
                      className="cursor-pointer bg-white border border-rose-300 hover:border-rose-500 rounded-md px-3 py-1.5 text-xs flex items-center gap-2 shadow-2xs transition-colors"
                    >
                      <span className="font-mono font-bold text-rose-900">{o.accessionNo}</span>
                      <span className="text-slate-800 font-medium">{o.patient.name}</span>
                      <span className="text-slate-500 text-[11px]">({o.patient.ward})</span>
                      <span className="text-rose-700 font-semibold text-[11px]">
                        {o.criticalNotified ? '✓ Ward Phoned' : '⚠ Action Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('critical')}
              className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 shrink-0 bg-rose-100/80 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Open Panic Log
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5-Column Precision KPI Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Today */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Total Accessions
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>OPD: {orders.filter(o => o.patient.patientType === 'OPD').length}</span>
            <span aria-hidden="true">·</span>
            <span>IPD/ICU: {orders.filter(o => o.patient.patientType !== 'OPD').length}</span>
          </div>
        </div>

        {/* STAT & Urgent */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-rose-700 uppercase tracking-wide flex items-center justify-between">
            <span>Emergency / STAT</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700 tabular-nums mt-1">
            {statCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            TAT target &lt; 30 minutes
          </div>
        </div>

        {/* In Processing */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center justify-between">
            <span>On Analyzers</span>
            <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {inProcessingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Specimens running
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide flex items-center justify-between">
            <span>Pending Sign-off</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-800 tabular-nums mt-1">
            {pendingVerificationCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Awaiting Pathologist review
          </div>
        </div>

        {/* Reports Ready */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide flex items-center justify-between">
            <span>Verified & Ready</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums mt-1">
            {verifiedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ready to print / dispatch
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Attention Worklist & Department Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Worklist */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active Specimens & Processing Stream
              </h2>
              <p className="text-xs text-slate-500">
                Click any specimen to enter values, review, or print official report
              </p>
            </div>
            <button
              onClick={() => onSelectTab('worklist')}
              className="text-xs font-semibold text-blue-800 hover:text-blue-950 flex items-center gap-1"
            >
              View Full Worklist ({orders.length})
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map((order) => {
              const isStat = order.urgency === 'STAT_EMERGENCY';
              const isUrgent = order.urgency === 'URGENT';
              const hasCritical = Object.values(order.results).some(
                r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW'
              );

              return (
                <div 
                  key={order.accessionNo}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded block text-center">
                        {order.accessionNo}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block text-center mt-0.5">
                        {order.patient.uhid}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {order.patient.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {order.patient.age}y / {order.patient.gender}
                        </span>
                        {isStat && (
                          <span className="text-[10px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded uppercase">
                            STAT
                          </span>
                        )}
                        {isUrgent && (
                          <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded uppercase">
                            Urgent
                          </span>
                        )}
                        {hasCritical && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                            Critical Value
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="font-medium text-slate-700">{order.patient.ward || order.patient.patientType}</span>
                        {order.patient.bedNo && (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span>{order.patient.bedNo}</span>
                          </>
                        )}
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500 font-mono">Tests: {order.testCodes.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      order.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'RESULT_ENTERED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>

                    {order.status === 'VERIFIED' ? (
                      <button
                        onClick={() => onViewReport(order)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                        Report
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenOrder(order.accessionNo)}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-md transition-colors"
                      >
                        {order.status === 'RESULT_ENTERED' ? 'Verify' : 'Enter Results'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Departmental Workloads & Lab Analyzers Status */}
        <div className="space-y-6">
          
          {/* Diagnostic Divisions */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Divisional Workload
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Clinical Biochemistry', tests: 'LFT, KFT, Blood Sugar, Electrolytes', count: 18, pending: 3, color: 'bg-blue-600' },
                { name: 'Hematology & Smears', tests: 'CBC, ESR, Retic, Blood Grouping', count: 24, pending: 2, color: 'bg-purple-600' },
                { name: 'Serology & Microbiology', tests: 'Widal, Dengue NS1, Malaria, HIV', count: 12, pending: 1, color: 'bg-amber-600' },
                { name: 'Clinical Pathology', tests: 'Urine Routine & Microscopic, Fluids', count: 15, pending: 0, color: 'bg-emerald-600' },
                { name: 'Hormones & Cardiac', tests: 'Troponin-I, CK-MB, Thyroid (TSH)', count: 6, pending: 1, color: 'bg-rose-600' },
              ].map((div) => (
                <div key={div.name} className="border-b border-slate-100 pb-2.5 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{div.name}</span>
                    <span className="font-mono text-slate-600">{div.count} active</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{div.tests}</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`${div.color} h-full rounded-full`} 
                      style={{ width: `${Math.min(100, (div.count / 25) * 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Analyzers & QC Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Automated Analyzers
              </h2>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                All Systems Normal
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Sysmex XN-350</div>
                  <div className="text-[11px] text-slate-500">5-Part Automated Hematology</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-semibold font-mono text-[11px]">QC PASSED</span>
                  <div className="text-[10px] text-slate-400">Run: 06:30 AM</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Erba EM-200 Chemistry</div>
                  <div className="text-[11px] text-slate-500">Fully Automated Clinical Chemistry</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-semibold font-mono text-[11px]">QC PASSED</span>
                  <div className="text-[10px] text-slate-400">Run: 06:40 AM</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Beckman Access 2</div>
                  <div className="text-[11px] text-slate-500">Chemiluminescence Immunoassay</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-semibold font-mono text-[11px]">ONLINE</span>
                  <div className="text-[10px] text-slate-400">Calibrated</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('qc_reagents')}
              className="w-full mt-3 text-center text-xs text-blue-800 font-semibold hover:text-blue-900 py-1"
            >
              View Quality Control Logs & Reagents →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

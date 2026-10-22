/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FlaskConical, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Layers, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  Clock
} from 'lucide-react';
import { ReagentInventory, QualityControlRun } from '../types/laboratory';
import { INITIAL_REAGENTS, INITIAL_QC_LOGS } from '../data/mockPatients';

export const ReagentQcView: React.FC = () => {
  const [reagents, setReagents] = useState<ReagentInventory[]>(INITIAL_REAGENTS);
  const [qcLogs, setQcLogs] = useState<QualityControlRun[]>(INITIAL_QC_LOGS);
  const [activeTab, setActiveTab] = useState<'reagents' | 'qc'>('reagents');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Quality Control & Diagnostic Inventory Division</span>
            <span aria-hidden="true">·</span>
            <span>NABL ISO 15189 Quality System</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Analyzer Quality Control (QC) & Reagent Management
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Daily Levey-Jennings calibration runs, analyzer health, and automated reagent pack replenishment
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('reagents')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'reagents'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reagents Inventory ({reagents.length})
          </button>
          <button
            onClick={() => setActiveTab('qc')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'qc'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily QC Runs ({qcLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'reagents' ? (
        /* Reagents Inventory Table */
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Diagnostic Reagent Lots & On-Board Analyzer Volumes
            </span>
            <span className="text-xs font-mono text-slate-500">
              Auto-calculated test consumption
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-4">Reagent / Kit Name</th>
                  <th className="py-2.5 px-4">Assigned Analyzer</th>
                  <th className="py-2.5 px-4">Lot Number</th>
                  <th className="py-2.5 px-4">Expiry Date</th>
                  <th className="py-2.5 px-4">Remaining Volume / Tests</th>
                  <th className="py-2.5 px-4">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reagents.map(reagent => {
                  const pct = Math.round((reagent.currentTestsRemaining / reagent.maxCapacity) * 100);
                  const isLow = reagent.status === 'LOW' || reagent.status === 'CRITICAL';

                  return (
                    <tr key={reagent.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900 text-sm">
                        {reagent.reagentName}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {reagent.analyzer}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {reagent.lotNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {reagent.expiryDate}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-between font-mono text-xs mb-1">
                          <strong>{reagent.currentTestsRemaining} {reagent.unit}</strong>
                          <span className="text-slate-400">/ {reagent.maxCapacity}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              pct < 20 ? 'bg-rose-600' : pct < 40 ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          reagent.status === 'OPTIMAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : reagent.status === 'LOW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {reagent.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Quality Control Runs */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {qcLogs.map(qc => (
              <div 
                key={qc.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-xs text-slate-900">{qc.analyzer}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {qc.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-2">
                    {qc.testName}
                  </h3>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Run Timestamp: {qc.date}
                  </div>

                  {/* Levey-Jennings Visual Preview */}
                  <div className="my-4 bg-slate-50 p-3 rounded-lg space-y-2 border border-slate-200">
                    <div className="text-[11px] flex justify-between font-mono">
                      <span>Level 1 (Normal):</span>
                      <strong>{qc.level1Value} (Target: {qc.level1Target} ± {qc.level1SD})</strong>
                    </div>
                    <div className="text-[11px] flex justify-between font-mono">
                      <span>Level 2 (High/Abnormal):</span>
                      <strong>{qc.level2Value} (Target: {qc.level2Target} ± {qc.level2SD})</strong>
                    </div>
                  </div>

                  {/* Visual Levey Jennings Axis */}
                  <div className="border border-slate-200 rounded p-2 bg-white">
                    <div className="text-[9px] font-mono text-slate-400 mb-1">
                      Levey-Jennings Chart (Westgard Rule Evaluation)
                    </div>
                    <div className="relative h-12 w-full flex items-center justify-center">
                      <div className="absolute w-full h-[1px] bg-slate-300 top-1/2" />
                      <div className="absolute w-full h-[1px] border-t border-dashed border-slate-200 top-1/4" />
                      <div className="absolute w-full h-[1px] border-t border-dashed border-slate-200 bottom-1/4" />
                      <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full z-10 shadow-2xs" />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-slate-400">
                      <span>-2 SD</span>
                      <span>Mean (Target)</span>
                      <span>+2 SD</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Within 2SD threshold · Analyzer authorized for patient testing
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

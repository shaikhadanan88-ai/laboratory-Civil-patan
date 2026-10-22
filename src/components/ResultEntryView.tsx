/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Save, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  History, 
  Info,
  Calculator,
  UserCheck
} from 'lucide-react';
import { LabOrder, ParameterResult, TestCatalogItem, ParameterDef } from '../types/laboratory';
import { MASTER_TEST_CATALOG } from '../data/labCatalog';

interface ResultEntryViewProps {
  order: LabOrder;
  onSaveResults: (accessionNo: string, results: Record<string, ParameterResult>, techNotes: string, pathologistRemarks: string, markVerified?: boolean) => void;
  onBack: () => void;
  onViewReport: (order: LabOrder) => void;
}

export const ResultEntryView: React.FC<ResultEntryViewProps> = ({
  order,
  onSaveResults,
  onBack,
  onViewReport
}) => {
  // Local state for editable results
  const [resultsState, setResultsState] = useState<Record<string, ParameterResult>>({ ...order.results });
  const [techNotes, setTechNotes] = useState(order.technicianNotes || '');
  const [pathologistRemarks, setPathologistRemarks] = useState(order.pathologistRemarks || '');
  const [activeTestCode, setActiveTestCode] = useState<string>(order.testCodes[0] || '');

  // Get active test item
  const orderedTestItems = MASTER_TEST_CATALOG.filter(t => order.testCodes.includes(t.code));

  // Determine abnormal flag
  const evaluateFlag = (param: ParameterDef, val: string | number) => {
    if (param.isQualitative) {
      if (val === param.normalQualitative) return 'NORMAL_NEGATIVE';
      return 'ABNORMAL_POSITIVE';
    }

    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return 'NORMAL';

    if (param.criticalLow !== undefined && num <= param.criticalLow) return 'CRITICAL_LOW';
    if (param.criticalHigh !== undefined && num >= param.criticalHigh) return 'CRITICAL_HIGH';
    if (param.refMin !== undefined && num < param.refMin) return 'LOW';
    if (param.refMax !== undefined && num > param.refMax) return 'HIGH';

    return 'NORMAL';
  };

  // Handle value change with auto-calculations
  const handleValueChange = (param: ParameterDef, newValue: string) => {
    const updated = { ...resultsState };
    const num = parseFloat(newValue);

    const flag = evaluateFlag(param, newValue);

    updated[param.id] = {
      parameterId: param.id,
      value: newValue,
      numericValue: isNaN(num) ? undefined : num,
      flag,
      refRange: param.refRangeText,
      previousValue: resultsState[param.id]?.previousValue,
      deltaAlert: resultsState[param.id]?.deltaAlert
    };

    // Auto calculate LFT indirect bilirubin
    if (param.id === 'lft_tbili' || param.id === 'lft_dbili') {
      const tb = parseFloat(param.id === 'lft_tbili' ? newValue : updated['lft_tbili']?.value || '0');
      const db = parseFloat(param.id === 'lft_dbili' ? newValue : updated['lft_dbili']?.value || '0');
      if (!isNaN(tb) && !isNaN(db) && tb >= db) {
        const ib = (tb - db).toFixed(2);
        const ibParam = MASTER_TEST_CATALOG.find(t => t.code === 'LFT')?.parameters.find(p => p.id === 'lft_ibili');
        if (ibParam) {
          updated['lft_ibili'] = {
            parameterId: 'lft_ibili',
            value: ib,
            numericValue: parseFloat(ib),
            flag: evaluateFlag(ibParam, ib),
            refRange: ibParam.refRangeText
          };
        }
      }
    }

    // Auto calculate LFT Globulin & A:G ratio
    if (param.id === 'lft_tp' || param.id === 'lft_alb') {
      const tp = parseFloat(param.id === 'lft_tp' ? newValue : updated['lft_tp']?.value || '0');
      const alb = parseFloat(param.id === 'lft_alb' ? newValue : updated['lft_alb']?.value || '0');
      if (!isNaN(tp) && !isNaN(alb) && tp >= alb) {
        const glob = (tp - alb).toFixed(2);
        const globParam = MASTER_TEST_CATALOG.find(t => t.code === 'LFT')?.parameters.find(p => p.id === 'lft_glob');
        if (globParam) {
          updated['lft_glob'] = {
            parameterId: 'lft_glob',
            value: glob,
            numericValue: parseFloat(glob),
            flag: evaluateFlag(globParam, glob),
            refRange: globParam.refRangeText
          };
        }
        if (parseFloat(glob) > 0) {
          const agRatio = (alb / parseFloat(glob)).toFixed(2);
          const agParam = MASTER_TEST_CATALOG.find(t => t.code === 'LFT')?.parameters.find(p => p.id === 'lft_ag_ratio');
          if (agParam) {
            updated['lft_ag_ratio'] = {
              parameterId: 'lft_ag_ratio',
              value: agRatio,
              numericValue: parseFloat(agRatio),
              flag: evaluateFlag(agParam, agRatio),
              refRange: agParam.refRangeText
            };
          }
        }
      }
    }

    // Auto calculate eAG from HbA1c
    if (param.id === 'hba1c_val') {
      const a1c = parseFloat(newValue);
      if (!isNaN(a1c)) {
        const eag = Math.round(28.7 * a1c - 46.7);
        const eagParam = MASTER_TEST_CATALOG.find(t => t.code === 'HBA1C')?.parameters.find(p => p.id === 'hba1c_eag');
        if (eagParam) {
          updated['hba1c_eag'] = {
            parameterId: 'hba1c_eag',
            value: eag.toString(),
            numericValue: eag,
            flag: evaluateFlag(eagParam, eag),
            refRange: eagParam.refRangeText
          };
        }
      }
    }

    // Auto calculate eGFR from Creatinine
    if (param.id === 'kft_creat') {
      const cr = parseFloat(newValue);
      if (!isNaN(cr) && cr > 0) {
        const isFemale = order.patient.gender === 'FEMALE';
        const age = order.patient.age || 40;
        // Simplified CKD-EPI equation
        let egfr = Math.round(141 * Math.pow(Math.min(cr / (isFemale ? 0.7 : 0.9), 1), isFemale ? -0.329 : -0.411) * Math.pow(Math.max(cr / (isFemale ? 0.7 : 0.9), 1), -1.209) * Math.pow(0.993, age) * (isFemale ? 1.018 : 1.0));
        const egfrParam = MASTER_TEST_CATALOG.find(t => t.code === 'KFT')?.parameters.find(p => p.id === 'kft_egfr');
        if (egfrParam) {
          updated['kft_egfr'] = {
            parameterId: 'kft_egfr',
            value: egfr.toString(),
            numericValue: egfr,
            flag: evaluateFlag(egfrParam, egfr),
            refRange: egfrParam.refRangeText
          };
        }
      }
    }

    setResultsState(updated);
  };

  // Normal Fast-Filler for a test
  const handleQuickFillNormals = (test: TestCatalogItem) => {
    const updated = { ...resultsState };
    test.parameters.forEach(p => {
      if (updated[p.id]?.value) return; // don't overwrite existing
      if (p.isQualitative) {
        const normalVal = p.normalQualitative || p.qualitativeOptions?.[0] || 'Negative';
        updated[p.id] = {
          parameterId: p.id,
          value: normalVal,
          flag: 'NORMAL_NEGATIVE',
          refRange: p.refRangeText
        };
      } else if (p.refMin !== undefined && p.refMax !== undefined) {
        const midVal = ((p.refMin + p.refMax) / 2).toFixed(p.unit === 'g/dL' || p.unit === 'mg/dL' ? 1 : 0);
        updated[p.id] = {
          parameterId: p.id,
          value: midVal,
          numericValue: parseFloat(midVal),
          flag: 'NORMAL',
          refRange: p.refRangeText
        };
      }
    });
    setResultsState(updated);
  };

  // Critical Panic count
  const criticalCount = Object.values(resultsState).filter(
    r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW'
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Back to worklist"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-bold text-slate-800">{order.accessionNo}</span>
              <span aria-hidden="true">·</span>
              <span>UHID: {order.patient.uhid}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-blue-900">{order.patient.ward || order.patient.patientType}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              Clinical Result Entry: {order.patient.name}
            </h1>
            <p className="text-xs text-slate-500">
              {order.patient.age}y / {order.patient.gender} · Ref: {order.patient.consultantDoctor}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {order.status === 'VERIFIED' && (
            <button
              onClick={() => onViewReport(order)}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              View Official Report
            </button>
          )}

          <button
            onClick={() => onSaveResults(order.accessionNo, resultsState, techNotes, pathologistRemarks, false)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-500" />
            Save Draft
          </button>

          <button
            onClick={() => onSaveResults(order.accessionNo, resultsState, techNotes, pathologistRemarks, true)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            Submit for Pathologist Sign-Off
          </button>
        </div>
      </div>

      {/* Critical Panic Value Alert Warning */}
      {criticalCount > 0 && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 shadow-xs flex items-start gap-3">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900">
              {criticalCount} CRITICAL (PANIC) VALUE(S) ENTERED
            </h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Values exceed life-threatening physiological thresholds. Immediately telephone the treating physician/ward nurse and document in the Panic Log.
            </p>
          </div>
        </div>
      )}

      {/* Test Panels Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {orderedTestItems.map(test => {
          const isActive = (activeTestCode || orderedTestItems[0]?.code) === test.code;
          const enteredCount = test.parameters.filter(p => resultsState[p.id]?.value).length;
          const totalParam = test.parameters.length;

          return (
            <button
              key={test.code}
              onClick={() => setActiveTestCode(test.code)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'border-blue-700 bg-blue-800 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{test.code} - {test.name.split('(')[0].trim()}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isActive ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {enteredCount}/{totalParam}
              </span>
            </button>
          );
        })}
      </div>

      {/* Parameters Entry Card */}
      {orderedTestItems.filter(t => (activeTestCode || orderedTestItems[0]?.code) === t.code).map(test => (
        <div key={test.code} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {test.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specimen: {test.specimenName} · Turnaround target: ~{test.tatMinutes} mins
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleQuickFillNormals(test)}
              className="px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Quick Fill Normal Baseline
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-4 w-1/4">Parameter Name</th>
                  <th className="py-2.5 px-4 w-1/4">Observed Value & Input</th>
                  <th className="py-2.5 px-4 w-16">Unit</th>
                  <th className="py-2.5 px-4">Biological Reference Range</th>
                  <th className="py-2.5 px-4">Evaluation / Flag</th>
                  <th className="py-2.5 px-4">Delta Check (Prev)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {test.parameters.map((param) => {
                  const curr = resultsState[param.id];
                  const val = curr?.value || '';
                  const flag = curr?.flag || 'NORMAL';
                  const isCritical = flag === 'CRITICAL_HIGH' || flag === 'CRITICAL_LOW';
                  const isHigh = flag === 'HIGH';
                  const isLow = flag === 'LOW';
                  const isAbnormalPositive = flag === 'ABNORMAL_POSITIVE';

                  return (
                    <tr 
                      key={param.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isCritical ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block text-sm">
                          {param.name}
                        </span>
                        {param.method && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {param.method}
                          </span>
                        )}
                        {param.formula && (
                          <span className="text-[10px] text-blue-700 font-mono flex items-center gap-1 mt-0.5">
                            <Calculator className="w-3 h-3" /> Auto-calculated
                          </span>
                        )}
                      </td>

                      {/* Observed Value Input */}
                      <td className="py-3 px-4">
                        {param.isQualitative ? (
                          <select
                            value={val}
                            onChange={e => handleValueChange(param, e.target.value)}
                            className={`w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none ${
                              isAbnormalPositive
                                ? 'border-amber-400 bg-amber-50 text-amber-900 font-semibold'
                                : 'border-slate-300 focus:border-blue-600'
                            }`}
                          >
                            <option value="">-- Select Result --</option>
                            {param.qualitativeOptions?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="relative">
                            <input
                              type="text"
                              value={val}
                              readOnly={!!param.formula && param.id.includes('auto')}
                              onChange={e => handleValueChange(param, e.target.value)}
                              placeholder={param.formula ? 'Auto-calculated' : 'Enter value'}
                              className={`w-full px-3 py-1.5 text-sm font-mono tabular-nums border rounded-lg focus:outline-none transition-colors ${
                                isCritical 
                                  ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold ring-1 ring-rose-500' 
                                  : isHigh || isLow
                                  ? 'border-amber-400 bg-amber-50 text-amber-900 font-semibold'
                                  : 'border-slate-300 focus:border-blue-600'
                              }`}
                            />
                          </div>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {param.unit || '—'}
                      </td>

                      {/* Reference Interval */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        <div>{param.refRangeText}</div>
                        {(param.criticalLow !== undefined || param.criticalHigh !== undefined) && (
                          <div className="text-[10px] text-rose-700 mt-0.5">
                            Critical Limits: {param.criticalLow ? `< ${param.criticalLow}` : ''} {param.criticalHigh ? `> ${param.criticalHigh}` : ''}
                          </div>
                        )}
                      </td>

                      {/* Flag Badge */}
                      <td className="py-3 px-4">
                        {isCritical ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            CRITICAL {flag === 'CRITICAL_HIGH' ? 'HIGH ↑↑' : 'LOW ↓↓'}
                          </span>
                        ) : isHigh ? (
                          <span className="inline-flex items-center text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                            HIGH ↑
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                            LOW ↓
                          </span>
                        ) : isAbnormalPositive ? (
                          <span className="inline-flex items-center text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                            POSITIVE
                          </span>
                        ) : val ? (
                          <span className="inline-flex items-center text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            Normal
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Pending</span>
                        )}
                      </td>

                      {/* Delta Check */}
                      <td className="py-3 px-4 text-[11px] font-mono text-slate-500">
                        {curr?.previousValue ? (
                          <div>
                            <span>Prev: <strong>{curr.previousValue}</strong></span>
                            {curr.deltaAlert && (
                              <div className="text-[10px] text-rose-700 font-sans mt-0.5 font-medium">
                                ⚠ {curr.deltaAlert}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      ))}

      {/* Clinical Notes & Pathologist Impression */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            Technologist Bench Notes / Specimen Remarks
          </label>
          <textarea
            rows={3}
            value={techNotes}
            onChange={e => setTechNotes(e.target.value)}
            placeholder="e.g. Specimen clear, run repeated twice on analyzer, dilution 1:2 applied..."
            className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            Consultant Pathologist Impression / Smear Report
          </label>
          <textarea
            rows={3}
            value={pathologistRemarks}
            onChange={e => setPathologistRemarks(e.target.value)}
            placeholder="e.g. Normocytic normochromic smear with marked thrombocytopenia. Clinical correlation with platelet kinetics suggested."
            className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

    </div>
  );
};

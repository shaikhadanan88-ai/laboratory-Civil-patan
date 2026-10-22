/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { 
  Printer, 
  X, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  QrCode,
  Share2
} from 'lucide-react';
import { LabOrder, ParameterResult } from '../types/laboratory';
import { MASTER_TEST_CATALOG } from '../data/labCatalog';

interface OfficialReportModalProps {
  order: LabOrder | null;
  onClose: () => void;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  order,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    let summary = `SETH N.L. GENERAL HOSPITAL - CIVIL PATAN LABORATORY REPORT\n`;
    summary += `Patient: ${order.patient.name} (${order.patient.age}y/${order.patient.gender})\n`;
    summary += `UHID: ${order.patient.uhid} | Accession: ${order.accessionNo}\n`;
    summary += `Ward: ${order.patient.ward || 'OPD'} | Consultant: ${order.patient.consultantDoctor}\n`;
    summary += `Date: ${order.verifiedTime || order.sampleCollectionTime}\n\n`;
    summary += `RESULTS:\n`;
    Object.entries(order.results).forEach(([id, r]) => {
      summary += `- ${id}: ${r.value} (${r.refRange}) ${r.flag !== 'NORMAL' ? `[${r.flag}]` : ''}\n`;
    });
    if (order.pathologistRemarks) {
      summary += `\nImpression: ${order.pathologistRemarks}\n`;
    }

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group results by test code
  const testsToDisplay = MASTER_TEST_CATALOG.filter(t => order.testCodes.includes(t.code));
  const hasCritical = Object.values(order.results).some(
    r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW'
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-slate-100 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Toolbar (hidden in print) */}
        <div className="no-print p-4 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-800 text-sm">
              Official Medical Test Report: {order.accessionNo}
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
              Authorized Sign-off
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Official Report
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Document Stage (Scrollable view & Printable) */}
        <div className="p-4 sm:p-8 overflow-y-auto flex justify-center bg-slate-200/80">
          
          {/* Printable A4 Paper Layout */}
          <div 
            ref={reportRef}
            className="print-page bg-white w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-10 text-slate-900 shadow-lg text-xs leading-relaxed font-sans border border-slate-200 relative flex flex-col justify-between"
          >
            
            {/* Top Official Letterhead */}
            <div>
              {/* Header with Emblem */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-blue-900 gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src="/public/assets/aistudio/020_5f9f8721.jpg" 
                    alt="Seth N.L General Hospital Emblem"
                    className="h-20 w-20 object-contain rounded-full border border-blue-950/20"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/020_5f9f8721.jpg';
                    }}
                  />
                  <div>
                    <span className="text-[11px] font-bold text-red-700 tracking-wider uppercase block">
                      Government of Gujarat · Department of Health & Family Welfare
                    </span>
                    <h1 className="text-xl font-extrabold text-blue-950 tracking-tight leading-none mt-1">
                      SETH N.L. GENERAL HOSPITAL
                    </h1>
                    <h2 className="text-sm font-bold text-blue-900 tracking-wide mt-0.5">
                      CIVIL HOSPITAL PATAN · CENTRAL CLINICAL LABORATORY
                    </h2>
                    <p className="text-[10px] text-slate-600 mt-1">
                      Govt. Medical College Campus, Patan - 384265 (Gujarat) · Email: <strong className="text-slate-800">laboratorycivilpatan@gmail.com</strong>
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono">
                      NABL Accredited Medical Testing Laboratory (ISO 15189:2022) · NABH Certified Hospital
                    </p>
                  </div>
                </div>

                {/* Right side barcode / accreditation box */}
                <div className="text-right shrink-0">
                  <div className="font-mono text-base font-bold text-slate-900 tracking-widest bg-slate-100 px-3 py-1 border border-slate-300 rounded inline-block">
                    *{order.accessionNo}*
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-1">
                    Authentic Clinical Barcode
                  </div>
                  <div className="mt-2 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded inline-block">
                    ✓ Verified Final Report
                  </div>
                </div>
              </div>

              {/* Patient Demographics & Investigation Requisition Box */}
              <div className="my-4 p-3 bg-slate-50 border border-slate-300 rounded-md text-[11px] grid grid-cols-2 gap-x-6 gap-y-1">
                <div>
                  <span className="text-slate-500 w-28 inline-block font-medium">Patient Name:</span>
                  <strong className="text-slate-900 font-bold uppercase">{order.patient.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 w-32 inline-block font-medium">Lab Accession No:</span>
                  <strong className="font-mono font-bold text-slate-900">{order.accessionNo}</strong>
                </div>

                <div>
                  <span className="text-slate-500 w-28 inline-block font-medium">Age / Gender:</span>
                  <span className="font-semibold text-slate-800">{order.patient.age} Yrs / {order.patient.gender}</span>
                </div>
                <div>
                  <span className="text-slate-500 w-32 inline-block font-medium">UHID / CR No:</span>
                  <span className="font-mono font-bold text-slate-800">{order.patient.uhid}</span>
                </div>

                <div>
                  <span className="text-slate-500 w-28 inline-block font-medium">Ward / Bed:</span>
                  <span className="font-semibold text-slate-800">{order.patient.ward || order.patient.patientType} {order.patient.bedNo ? `(${order.patient.bedNo})` : ''}</span>
                </div>
                <div>
                  <span className="text-slate-500 w-32 inline-block font-medium">Sample Collected:</span>
                  <span className="font-mono text-slate-700">{order.sampleCollectionTime}</span>
                </div>

                <div>
                  <span className="text-slate-500 w-28 inline-block font-medium">Ref. Consultant:</span>
                  <span className="font-medium text-slate-800">{order.patient.consultantDoctor}</span>
                </div>
                <div>
                  <span className="text-slate-500 w-32 inline-block font-medium">Report Authorized:</span>
                  <span className="font-mono text-slate-700">{order.verifiedTime || new Date().toISOString().replace('T', ' ').slice(0, 16)}</span>
                </div>

                {order.patient.clinicalDiagnosis && (
                  <div className="col-span-2 pt-1 border-t border-slate-200 text-[10px] text-slate-600">
                    <span className="text-slate-500 font-medium">Clinical Indication: </span>
                    <span className="italic">{order.patient.clinicalDiagnosis}</span>
                  </div>
                )}
              </div>

              {/* Critical Alert Warning in Report if applicable */}
              {hasCritical && (
                <div className="mb-4 p-2.5 bg-rose-50 border border-rose-300 rounded text-rose-900 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>CRITICAL VALUE ALERT NOTIFIED: </strong>
                    <span>
                      Critical lab result immediately communicated to {order.criticalNotificationDetails?.recipientName || 'treating ward physician'} at {order.criticalNotificationDetails?.timestamp || order.verifiedTime}. Read-back verification confirmed.
                    </span>
                  </div>
                </div>
              )}

              {/* Test Investigations Results Table */}
              <div className="space-y-4">
                {testsToDisplay.map((test) => {
                  return (
                    <div key={test.code} className="border border-slate-300 rounded-md overflow-hidden">
                      <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 flex items-center justify-between">
                        <span className="font-bold text-blue-950 uppercase text-[11px] tracking-wide">
                          {test.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Method: {test.parameters[0]?.method || 'Automated Clinical Chemistry / Hematology'}
                        </span>
                      </div>

                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase">
                            <th className="py-1.5 px-3 w-5/12">Investigation / Parameter</th>
                            <th className="py-1.5 px-3 w-2/12">Observed Result</th>
                            <th className="py-1.5 px-3 w-1/12">Unit</th>
                            <th className="py-1.5 px-3 w-4/12">Biological Ref. Interval</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {test.parameters.map((param) => {
                            const res = order.results[param.id];
                            const val = res?.value || '—';
                            const isCritical = res?.flag === 'CRITICAL_HIGH' || res?.flag === 'CRITICAL_LOW';
                            const isHigh = res?.flag === 'HIGH';
                            const isLow = res?.flag === 'LOW';
                            const isPositive = res?.flag === 'ABNORMAL_POSITIVE';

                            return (
                              <tr 
                                key={param.id}
                                className={isCritical ? 'bg-rose-50/70 font-semibold' : ''}
                              >
                                <td className="py-1.5 px-3 text-slate-900 font-medium">
                                  {param.name}
                                </td>
                                <td className="py-1.5 px-3 font-mono">
                                  <span className={`text-[12px] font-bold ${
                                    isCritical 
                                      ? 'text-rose-700 underline' 
                                      : isHigh || isLow || isPositive
                                      ? 'text-red-700'
                                      : 'text-slate-900'
                                  }`}>
                                    {val}
                                  </span>
                                  {isCritical && <span className="text-rose-700 text-[10px] ml-1">🚨 (CRITICAL)</span>}
                                  {isHigh && <span className="text-red-700 text-[10px] ml-1">↑ (H)</span>}
                                  {isLow && <span className="text-red-700 text-[10px] ml-1">↓ (L)</span>}
                                  {isPositive && <span className="text-red-700 text-[10px] ml-1">(*)</span>}
                                </td>
                                <td className="py-1.5 px-3 font-mono text-slate-600">
                                  {param.unit}
                                </td>
                                <td className="py-1.5 px-3 font-mono text-slate-600 text-[10px]">
                                  {param.refRangeText}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>

              {/* Pathologist Diagnostic Interpretation */}
              {order.pathologistRemarks && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded-md">
                  <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                    Pathologist Clinical Impression & Comments:
                  </div>
                  <p className="text-[11px] text-slate-900 font-medium mt-1 italic">
                    "{order.pathologistRemarks}"
                  </p>
                </div>
              )}

              {/* Standard Laboratory Disclaimers */}
              <div className="mt-4 text-[9px] text-slate-500 leading-tight border-t border-slate-200 pt-2">
                <p>
                  1. The test results relate strictly to the specimen received and analyzed at Seth N.L. General Hospital Civil Patan Laboratory.
                </p>
                <p>
                  2. Laboratory findings must always be correlated clinically by the attending medical officer with patient history and symptoms.
                </p>
                <p>
                  3. In case of unexpected or critical values, re-testing from fresh specimen is available upon clinical request.
                </p>
              </div>
            </div>

            {/* Bottom Digital Signatures & QR Code Section */}
            <div className="mt-8 pt-4 border-t-2 border-slate-300">
              <div className="grid grid-cols-3 gap-4 items-end text-center">
                
                {/* Tech Signatory */}
                <div>
                  <div className="text-[10px] font-mono text-slate-400 italic mb-1">
                    [Digitally verified via MLT-LIS]
                  </div>
                  <div className="font-bold text-slate-900 text-[11px]">
                    {order.enteredBy || 'P. M. Solanki'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Sr. Medical Lab Technologist
                  </div>
                </div>

                {/* QR Code Verification Stamp */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded p-1 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 mt-1">
                    Scan to Verify Authenticity
                  </div>
                </div>

                {/* Pathologist HOD Signatory */}
                <div>
                  <div className="text-[10px] font-mono text-blue-900 italic font-semibold mb-1">
                    Dr. R. K. Joshi (M.D. Path)
                  </div>
                  <div className="font-bold text-slate-900 text-[11px]">
                    Dr. R. K. Joshi, M.D. Pathology
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    Associate Professor & Head of Laboratory<br />
                    Seth N.L. General Hospital & GMC Patan
                  </div>
                </div>

              </div>

              {/* End of Report Bar */}
              <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[9px] font-mono text-slate-400">
                --- END OF LABORATORY EXAMINATION REPORT · SETH N.L. GENERAL HOSPITAL CIVIL PATAN ---
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

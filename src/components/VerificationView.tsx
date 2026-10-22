/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  FileCheck, 
  AlertCircle, 
  ShieldAlert, 
  XCircle, 
  Check, 
  Eye, 
  Printer, 
  ArrowRight,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { LabOrder } from '../types/laboratory';
import { MASTER_TEST_CATALOG } from '../data/labCatalog';

interface VerificationViewProps {
  orders: LabOrder[];
  onVerifyOrder: (accessionNo: string, pathologistRemarks?: string) => void;
  onRejectOrder: (accessionNo: string, reason: string) => void;
  onOpenOrder: (accessionNo: string) => void;
  onViewReport: (order: LabOrder) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  orders,
  onVerifyOrder,
  onRejectOrder,
  onOpenOrder,
  onViewReport
}) => {
  const [selectedAccession, setSelectedAccession] = useState<string | null>(null);
  const [remarksInput, setRemarksInput] = useState('');
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Specimen clotted / hemolyzed');

  // Filter orders that need verification
  const pendingVerificationOrders = orders.filter(o => o.status === 'RESULT_ENTERED');
  const alreadyVerifiedOrders = orders.filter(o => o.status === 'VERIFIED');

  const activeOrder = orders.find(o => o.accessionNo === selectedAccession) || pendingVerificationOrders[0];

  const handleAuthorize = (accessionNo: string) => {
    onVerifyOrder(accessionNo, remarksInput || activeOrder?.pathologistRemarks);
    setRemarksInput('');
  };

  const handleBatchVerifyAllNormals = () => {
    const normalPending = pendingVerificationOrders.filter(o => {
      const hasCriticalOrAbnormal = Object.values(o.results).some(
        r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW' || r.flag === 'HIGH' || r.flag === 'LOW'
      );
      return !hasCriticalOrAbnormal;
    });

    if (normalPending.length === 0) {
      alert('No purely normal pending orders to batch verify.');
      return;
    }

    if (window.confirm(`Batch authorize ${normalPending.length} normal routine lab orders?`)) {
      normalPending.forEach(o => onVerifyOrder(o.accessionNo, 'All parameters within biological reference intervals.'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Quality Assurance & Clinical Verification</span>
            <span aria-hidden="true">·</span>
            <span>Head of Department Sign-off</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pathologist Validation & Digital Authorization
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Authorized Signatory: <strong>Dr. R. K. Joshi (M.D. Pathology)</strong> & Senior Resident Biochemist
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBatchVerifyAllNormals}
            className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Batch Authorize Normal Orders
          </button>
        </div>
      </div>

      {pendingVerificationOrders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            All Laboratory Requisitions Verified!
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            There are no pending results waiting for pathologist sign-off right now. All completed reports have been authorized and released for clinical care.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: List of Orders Awaiting Signature */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Pending Verification ({pendingVerificationOrders.length})
              </span>
              <span className="text-[11px] font-mono text-slate-500">Select to inspect</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {pendingVerificationOrders.map(order => {
                const isSelected = (activeOrder?.accessionNo === order.accessionNo);
                const hasCritical = Object.values(order.results).some(
                  r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW'
                );

                return (
                  <div
                    key={order.accessionNo}
                    onClick={() => setSelectedAccession(order.accessionNo)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-blue-50/70 border-l-4 border-blue-800' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {order.accessionNo}
                      </span>
                      {hasCritical && (
                        <span className="text-[10px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-xs text-slate-900 mt-1">
                      {order.patient.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>{order.patient.age}y / {order.patient.gender}</span>
                      <span aria-hidden="true">·</span>
                      <span>{order.patient.ward}</span>
                    </div>
                    <div className="text-[10px] text-blue-900 font-mono mt-1 font-medium">
                      {order.testCodes.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Inspection & Clinical Sign-off Console */}
          {activeOrder && (
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{activeOrder.patient.name}</span>
                      <span className="text-xs text-slate-500 font-mono">({activeOrder.patient.uhid})</span>
                      <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {activeOrder.accessionNo}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {activeOrder.patient.ward || activeOrder.patient.patientType} · Consultant: {activeOrder.patient.consultantDoctor}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenOrder(activeOrder.accessionNo)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
                    >
                      Edit Raw Values
                    </button>
                    <button
                      onClick={() => setRejectionModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject Specimen
                    </button>
                  </div>
                </div>

                {/* Parameters Preview Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                        <th className="py-2 px-3">Test Parameter</th>
                        <th className="py-2 px-3">Observed Result</th>
                        <th className="py-2 px-3">Unit</th>
                        <th className="py-2 px-3">Reference Range</th>
                        <th className="py-2 px-3">Flag Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Object.values(activeOrder.results).map(r => {
                        const isCritical = r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW';
                        const isAbnormal = r.flag === 'HIGH' || r.flag === 'LOW' || r.flag === 'ABNORMAL_POSITIVE';

                        return (
                          <tr key={r.parameterId} className={isCritical ? 'bg-rose-50/50' : ''}>
                            <td className="py-2.5 px-3 font-medium text-slate-900">
                              {r.parameterId.replace(/^(cbc|lft|kft|glu|card|sero|urm|thy)_/, '').toUpperCase()}
                            </td>
                            <td className={`py-2.5 px-3 font-mono text-sm font-bold ${
                              isCritical ? 'text-rose-700' : isAbnormal ? 'text-amber-800' : 'text-slate-900'
                            }`}>
                              {r.value}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono">
                              —
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                              {r.refRange}
                            </td>
                            <td className="py-2.5 px-3">
                              {isCritical ? (
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                                  CRITICAL
                                </span>
                              ) : isAbnormal ? (
                                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                                  {r.flag}
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                  Normal
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pathologist Clinical Opinion / Sign-off Form */}
                <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      Pathologist Clinical Interpretation / Microscopic Remarks
                    </label>
                    <textarea
                      rows={2}
                      value={remarksInput || activeOrder.pathologistRemarks || ''}
                      onChange={e => setRemarksInput(e.target.value)}
                      placeholder="Add diagnostic remarks to appear on the official government report..."
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      Digital Signature ready: Dr. R. K. Joshi (M.D. Path, Head of Lab)
                    </div>

                    <button
                      onClick={() => handleAuthorize(activeOrder.accessionNo)}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-xs flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      Authorize & Digitally Sign Report
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* Specimen Rejection Dialog Modal */}
      {rejectionModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              Reject Specimen: {activeOrder.accessionNo}
            </h3>
            <p className="text-xs text-slate-600">
              Please specify the laboratory rejection criterion according to NABL quality manual. Ward will be notified for urgent re-collection.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Rejection Reason
              </label>
              <select
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                className="w-full p-2 text-xs border border-slate-300 rounded-lg"
              >
                <option value="Specimen clotted in EDTA vial">Specimen clotted in EDTA vial</option>
                <option value="Grossly hemolyzed serum sample">Grossly hemolyzed serum sample</option>
                <option value="Insufficient specimen volume (QNS)">Insufficient specimen volume (QNS)</option>
                <option value="Inappropriate collection vial used">Inappropriate collection vial used</option>
                <option value="Mislabeled or unlabeled specimen tube">Mislabeled or unlabeled specimen tube</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRejectOrder(activeOrder.accessionNo, rejectionReason);
                  setRejectionModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg"
              >
                Confirm Rejection & Request Recollection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

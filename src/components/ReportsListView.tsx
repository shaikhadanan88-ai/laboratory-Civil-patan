/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Printer, 
  FileCheck, 
  CheckCircle2, 
  Share2, 
  Download, 
  Calendar,
  Building2,
  FileText
} from 'lucide-react';
import { LabOrder } from '../types/laboratory';

interface ReportsListViewProps {
  orders: LabOrder[];
  onViewReport: (order: LabOrder) => void;
}

export const ReportsListView: React.FC<ReportsListViewProps> = ({
  orders,
  onViewReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');

  const verifiedOrders = orders.filter(o => o.status === 'VERIFIED' || o.status === 'DISPATCHED');

  const filteredOrders = verifiedOrders.filter(o => {
    const s = searchTerm.toLowerCase();
    return (
      o.accessionNo.toLowerCase().includes(s) ||
      o.patient.name.toLowerCase().includes(s) ||
      o.patient.uhid.toLowerCase().includes(s) ||
      (o.patient.ward && o.patient.ward.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Official Records & Archives</span>
            <span aria-hidden="true">·</span>
            <span>Seth N.L. General Hospital Civil Patan</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Authorized Laboratory Reports & Dispatch
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Access, print, and export NABL compliant diagnostic reports with authentic digital signatures
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Accession, UHID, Patient..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            No authorized reports found. Completed tests that are verified by the Pathologist will appear here.
          </div>
        ) : (
          filteredOrders.map(order => {
            const hasCritical = Object.values(order.results).some(
              r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW'
            );

            return (
              <div
                key={order.accessionNo}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {order.accessionNo}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      UHID: {order.patient.uhid}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-sm text-slate-900">
                      {order.patient.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {order.patient.age} Yrs / {order.patient.gender} · {order.patient.ward || order.patient.patientType}
                    </div>
                  </div>

                  <div className="mt-3 bg-slate-50 p-2 rounded-lg text-xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Investigations Authorized:
                    </div>
                    <div className="font-mono text-slate-800 font-semibold mt-0.5">
                      {order.testCodes.join(' · ')}
                    </div>
                  </div>

                  {order.pathologistRemarks && (
                    <div className="mt-2 text-[11px] text-slate-600 line-clamp-2 italic">
                      "{order.pathologistRemarks}"
                    </div>
                  )}

                  {hasCritical && (
                    <div className="mt-2 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded">
                      🚨 Critical Value Alert Notified to Ward
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Signed: {order.verifiedTime?.split(' ')[0] || 'Today'}
                  </div>

                  <button
                    onClick={() => onViewReport(order)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Open Report
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

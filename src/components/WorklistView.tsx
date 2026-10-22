/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Barcode, 
  FlaskConical, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  AlertCircle,
  ShieldAlert,
  Printer,
  ChevronDown
} from 'lucide-react';
import { LabOrder, SampleStatus, UrgencyLevel } from '../types/laboratory';
import { MASTER_TEST_CATALOG, TUBE_METADATA } from '../data/labCatalog';

interface WorklistViewProps {
  orders: LabOrder[];
  onOpenOrder: (accessionNo: string) => void;
  onUpdateStatus: (accessionNo: string, newStatus: SampleStatus) => void;
  onViewReport: (order: LabOrder) => void;
  onShowBarcode: (order: LabOrder) => void;
}

export const WorklistView: React.FC<WorklistViewProps> = ({
  orders,
  onOpenOrder,
  onUpdateStatus,
  onViewReport,
  onShowBarcode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchSearch = 
        order.accessionNo.toLowerCase().includes(search) ||
        order.patient.name.toLowerCase().includes(search) ||
        order.patient.uhid.toLowerCase().includes(search) ||
        (order.patient.ward && order.patient.ward.toLowerCase().includes(search)) ||
        order.testCodes.some(c => c.toLowerCase().includes(search));

      // Status
      const matchStatus = statusFilter === 'ALL' || order.status === statusFilter;

      // Urgency
      const matchUrgency = urgencyFilter === 'ALL' || order.urgency === urgencyFilter;

      return matchSearch && matchStatus && matchUrgency;
    });
  }, [orders, searchTerm, statusFilter, urgencyFilter]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Accession, UHID, Patient name, Ward..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        {/* Filter Tabs / Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {['ALL', 'COLLECTED', 'RECEIVED_IN_LAB', 'RESULT_ENTERED', 'VERIFIED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'ALL' ? 'All Status' : status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Priority selector */}
          <select
            value={urgencyFilter}
            onChange={e => setUrgencyFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Urgencies</option>
            <option value="STAT_EMERGENCY">STAT Emergency Only</option>
            <option value="URGENT">Urgent Only</option>
            <option value="ROUTINE">Routine Only</option>
          </select>
        </div>

      </div>

      {/* Main Worklist Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Accession / Barcode</th>
                <th className="py-3 px-4">Patient Demographics</th>
                <th className="py-3 px-4">Ward / Location</th>
                <th className="py-3 px-4">Requested Tests</th>
                <th className="py-3 px-4">Collection Time</th>
                <th className="py-3 px-4">Status & Clinical Flags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No laboratory specimens match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isStat = order.urgency === 'STAT_EMERGENCY';
                  const isUrgent = order.urgency === 'URGENT';
                  const hasCritical = Object.values(order.results).some(
                    r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW'
                  );
                  const isVerified = order.status === 'VERIFIED';
                  const isResultEntered = order.status === 'RESULT_ENTERED';

                  return (
                    <tr 
                      key={order.accessionNo}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Accession No */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{order.accessionNo}</span>
                          <button
                            title="Generate Specimen Vial Barcode"
                            onClick={() => onShowBarcode(order)}
                            className="p-1 text-slate-400 hover:text-blue-800 rounded transition-colors"
                          >
                            <Barcode className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 block">
                          UHID: {order.patient.uhid}
                        </span>
                      </td>

                      {/* Patient Demographics */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-sm">
                          {order.patient.name}
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <span>{order.patient.age} Yrs</span>
                          <span aria-hidden="true">·</span>
                          <span>{order.patient.gender}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{order.patient.patientType}</span>
                        </div>
                      </td>

                      {/* Ward & Bed */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium truncate max-w-[160px]">
                          {order.patient.ward || 'OPD'}
                        </div>
                        {order.patient.bedNo && (
                          <div className="text-[11px] font-mono text-slate-500">
                            Bed: {order.patient.bedNo}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {order.patient.consultantDoctor}
                        </div>
                      </td>

                      {/* Tests */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {order.testCodes.map(code => (
                            <span 
                              key={code}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {code}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {order.testCodes.length} panel(s)
                        </span>
                      </td>

                      {/* Collection Time */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        <div>{order.sampleCollectionTime.split(' ')[1]}</div>
                        <div className="text-[10px] text-slate-400">{order.sampleCollectionTime.split(' ')[0]}</div>
                      </td>

                      {/* Status & Flags */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isVerified 
                              ? 'bg-emerald-100 text-emerald-800'
                              : isResultEntered
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>

                          {isStat && (
                            <span className="text-[10px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded">
                              STAT
                            </span>
                          )}
                        </div>

                        {hasCritical && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded mt-1">
                            <ShieldAlert className="w-3 h-3" />
                            CRITICAL VALUE
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isVerified ? (
                            <button
                              onClick={() => onViewReport(order)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-800 hover:text-blue-900 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                              View Report
                            </button>
                          ) : isResultEntered ? (
                            <button
                              onClick={() => onOpenOrder(order.accessionNo)}
                              className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors"
                            >
                              Verify & Sign
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenOrder(order.accessionNo)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-md transition-colors"
                            >
                              Enter Results
                            </button>
                          )}

                          {/* Quick Workflow Advance for Lab Tech */}
                          {order.status === 'COLLECTED' && (
                            <button
                              title="Mark Received in Central Lab"
                              onClick={() => onUpdateStatus(order.accessionNo, 'RECEIVED_IN_LAB')}
                              className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing <strong>{filteredOrders.length}</strong> of {orders.length} total laboratory requisitions</span>
          <span className="font-mono">Patan District Central Diagnostic System</span>
        </div>
      </div>
    </div>
  );
};

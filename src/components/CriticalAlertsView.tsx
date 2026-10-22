/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  Plus, 
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { LabOrder } from '../types/laboratory';

interface CriticalAlertsViewProps {
  orders: LabOrder[];
  onLogPhoneCall: (accessionNo: string, recipientName: string, wardOrIntercom: string, readBackConfirmed: boolean, callerStaff: string) => void;
  onOpenOrder: (accessionNo: string) => void;
}

export const CriticalAlertsView: React.FC<CriticalAlertsViewProps> = ({
  orders,
  onLogPhoneCall,
  onOpenOrder
}) => {
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [wardOrIntercom, setWardOrIntercom] = useState('');
  const [readBackConfirmed, setReadBackConfirmed] = useState(true);
  const [callerStaff, setCallerStaff] = useState('P. M. Solanki (Sr. Lab Technician)');

  // Collect all critical orders
  const criticalOrders = orders.filter(o => {
    return Object.values(o.results).some(
      r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW'
    );
  });

  const handleSaveNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    if (!recipientName.trim() || !wardOrIntercom.trim()) {
      alert('Please fill recipient name and intercom/ward');
      return;
    }

    onLogPhoneCall(
      selectedOrder.accessionNo,
      recipientName.trim(),
      wardOrIntercom.trim(),
      readBackConfirmed,
      callerStaff.trim()
    );

    setSelectedOrder(null);
    setRecipientName('');
    setWardOrIntercom('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-700 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>NABL Mandate · Critical Result Notification Registry</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Panic / Critical Laboratory Values Log
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Document urgent telephone communications to wards, ICUs, and treating medical officers with mandatory read-back verification
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 font-mono block">Registered Today</span>
          <span className="text-xl font-mono font-bold text-rose-700">
            {criticalOrders.length} Incidents
          </span>
        </div>
      </div>

      {/* Critical Orders Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Accession / Patient</th>
                <th className="py-3 px-4">Ward & Bed</th>
                <th className="py-3 px-4">Critical Parameter & Value</th>
                <th className="py-3 px-4">Phone Notification Status</th>
                <th className="py-3 px-4">Recipient & Read-Back</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criticalOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No critical panic values recorded today. All results are within safe physiological limits.
                  </td>
                </tr>
              ) : (
                criticalOrders.map(order => {
                  const criticalResults = Object.values(order.results).filter(
                    r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW'
                  );
                  const isNotified = !!order.criticalNotified;

                  return (
                    <tr key={order.accessionNo} className="hover:bg-slate-50/70">
                      
                      {/* Patient */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">
                          {order.accessionNo}
                        </span>
                        <span className="font-semibold text-slate-800 text-sm">
                          {order.patient.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {order.patient.age}y / {order.patient.gender} · UHID: {order.patient.uhid}
                        </span>
                      </td>

                      {/* Ward */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-900 block">
                          {order.patient.ward}
                        </span>
                        {order.patient.bedNo && (
                          <span className="text-[11px] font-mono text-slate-500 block">
                            Bed: {order.patient.bedNo}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                          Ref: {order.patient.consultantDoctor}
                        </span>
                      </td>

                      {/* Critical Parameter */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {criticalResults.map(r => (
                            <div key={r.parameterId} className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                                {r.value}
                              </span>
                              <span className="text-slate-800 font-semibold text-[11px]">
                                {r.parameterId.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-rose-700 font-bold">
                                ({r.flag.replace('_', ' ')})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Notification Status */}
                      <td className="py-3 px-4">
                        {isNotified ? (
                          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-semibold w-fit">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Phoned & Read-Back Done
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-md text-[11px] font-bold w-fit animate-pulse">
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                            URGENT CALL PENDING
                          </div>
                        )}
                      </td>

                      {/* Recipient & Read-back Details */}
                      <td className="py-3 px-4 text-[11px]">
                        {isNotified && order.criticalNotificationDetails ? (
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {order.criticalNotificationDetails.recipientName}
                            </span>
                            <span className="text-slate-500 block">
                              {order.criticalNotificationDetails.wardOrIntercom} · {order.criticalNotificationDetails.timestamp}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium">
                              Caller: {order.criticalNotificationDetails.callerStaff}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not yet phoned</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setWardOrIntercom(order.patient.ward || '');
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ml-auto ${
                            isNotified 
                              ? 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200' 
                              : 'text-white bg-rose-700 hover:bg-rose-800 shadow-2xs'
                          }`}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          {isNotified ? 'Update Call Log' : 'Log Ward Phone Call'}
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phone Call Log Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <PhoneCall className="w-5 h-5 text-rose-700" />
              <h3 className="text-base font-bold text-slate-900">
                Log Critical Result Telephone Notification
              </h3>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
              <div>
                <span className="text-slate-500">Patient: </span>
                <strong className="text-slate-900">{selectedOrder.patient.name}</strong> ({selectedOrder.patient.uhid})
              </div>
              <div>
                <span className="text-slate-500">Accession No: </span>
                <strong className="font-mono text-slate-900">{selectedOrder.accessionNo}</strong>
              </div>
              <div>
                <span className="text-slate-500">Ward / Bed: </span>
                <span className="font-semibold text-slate-800">{selectedOrder.patient.ward} {selectedOrder.patient.bedNo ? `(${selectedOrder.patient.bedNo})` : ''}</span>
              </div>
            </div>

            <form onSubmit={handleSaveNotification} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Recipient Name (Treating Doctor or On-duty Sister) *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="e.g. Dr. V. K. Mehta / Staff Nurse Jyoti"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ward / Intercom Extension Phoned *
                </label>
                <input
                  type="text"
                  required
                  value={wardOrIntercom}
                  onChange={e => setWardOrIntercom(e.target.value)}
                  placeholder="e.g. ICU Intercom Ext. 402 / Mobile 98251..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Lab Caller (Staff Technologist)
                </label>
                <input
                  type="text"
                  value={callerStaff}
                  onChange={e => setCallerStaff(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="readback"
                  checked={readBackConfirmed}
                  onChange={e => setReadBackConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-700 focus:ring-blue-600 border-slate-300"
                />
                <label htmlFor="readback" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Recipient read back the patient name, UHID, and test value accurately (Read-Back Confirmed)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Save to NABL Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

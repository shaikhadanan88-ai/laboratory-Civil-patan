/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, NavTab } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { RegistrationView } from './components/RegistrationView';
import { WorklistView } from './components/WorklistView';
import { ResultEntryView } from './components/ResultEntryView';
import { VerificationView } from './components/VerificationView';
import { ReportsListView } from './components/ReportsListView';
import { CriticalAlertsView } from './components/CriticalAlertsView';
import { QueueCounterView } from './components/QueueCounterView';
import { ReagentQcView } from './components/ReagentQcView';
import { OfficialReportModal } from './components/OfficialReportModal';
import { BarcodeModal } from './components/BarcodeModal';
import { LabOrder, ParameterResult, SampleStatus } from './types/laboratory';
import { INITIAL_LAB_ORDERS } from './data/mockPatients';

export default function App() {
  const [orders, setOrders] = useState<LabOrder[]>(INITIAL_LAB_ORDERS);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [activeAccessionNo, setActiveAccessionNo] = useState<string | null>(null);
  
  // Modals
  const [viewingReportOrder, setViewingReportOrder] = useState<LabOrder | null>(null);
  const [barcodeOrder, setBarcodeOrder] = useState<LabOrder | null>(null);

  // Counters
  const pendingCount = orders.filter(o => o.status === 'RESULT_ENTERED').length;
  const criticalCount = orders.filter(o => {
    return Object.values(o.results).some(r => r.flag === 'CRITICAL_HIGH' || r.flag === 'CRITICAL_LOW');
  }).length;
  const totalToday = orders.length;

  // Add new order from registration
  const handleAddOrder = (newOrder: LabOrder) => {
    setOrders([newOrder, ...orders]);
    setBarcodeOrder(newOrder); // Offer immediate tube barcode printing
    setCurrentTab('worklist');
  };

  // Open specific order for result entry
  const handleOpenOrder = (accessionNo: string) => {
    setActiveAccessionNo(accessionNo);
    setCurrentTab('results');
  };

  // Save entered results
  const handleSaveResults = (
    accessionNo: string,
    results: Record<string, ParameterResult>,
    techNotes: string,
    pathologistRemarks: string,
    submitForVerification: boolean = false
  ) => {
    setOrders(prev => prev.map(o => {
      if (o.accessionNo !== accessionNo) return o;
      
      const newStatus: SampleStatus = submitForVerification ? 'RESULT_ENTERED' : 'PROCESSING';
      return {
        ...o,
        results,
        technicianNotes: techNotes,
        pathologistRemarks: pathologistRemarks,
        status: newStatus,
        resultEnteredTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
        enteredBy: o.enteredBy || 'P. M. Solanki (Sr. Lab Technician)'
      };
    }));

    if (submitForVerification) {
      setCurrentTab('verification');
    }
  };

  // Authorize and sign by Pathologist
  const handleVerifyOrder = (accessionNo: string, pathologistRemarks?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.accessionNo !== accessionNo) return o;
      return {
        ...o,
        status: 'VERIFIED',
        verifiedTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
        verifiedBy: 'Dr. R. K. Joshi (M.D. Path, Head of Lab)',
        pathologistRemarks: pathologistRemarks !== undefined ? pathologistRemarks : o.pathologistRemarks
      };
    }));
  };

  // Reject specimen with reason
  const handleRejectOrder = (accessionNo: string, reason: string) => {
    setOrders(prev => prev.map(o => {
      if (o.accessionNo !== accessionNo) return o;
      return {
        ...o,
        status: 'COLLECTED',
        technicianNotes: `[SPECIMEN REJECTED]: ${reason}. Recollection requested from ward.`
      };
    }));
  };

  // Update order status in worklist
  const handleUpdateStatus = (accessionNo: string, newStatus: SampleStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.accessionNo !== accessionNo) return o;
      return {
        ...o,
        status: newStatus,
        labReceivedTime: newStatus === 'RECEIVED_IN_LAB' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : o.labReceivedTime
      };
    }));
  };

  // Log Critical Result telephone notification to ward
  const handleLogPhoneCall = (
    accessionNo: string,
    recipientName: string,
    wardOrIntercom: string,
    readBackConfirmed: boolean,
    callerStaff: string
  ) => {
    setOrders(prev => prev.map(o => {
      if (o.accessionNo !== accessionNo) return o;
      return {
        ...o,
        criticalNotified: true,
        criticalNotificationDetails: {
          recipientName,
          wardOrIntercom,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          readBackConfirmed,
          callerStaff
        }
      };
    }));
  };

  // Active order object for result entry
  const currentResultOrder = orders.find(o => o.accessionNo === activeAccessionNo) || orders[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Application Header */}
      <div className="no-print">
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenNewOrder={() => setCurrentTab('registration')}
          pendingCount={pendingCount}
          criticalCount={criticalCount}
          totalToday={totalToday}
        />
      </div>

      {/* Main Clinical Operations Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentTab === 'dashboard' && (
          <DashboardView
            orders={orders}
            onSelectTab={setCurrentTab}
            onOpenOrder={handleOpenOrder}
            onOpenNewOrder={() => setCurrentTab('registration')}
            onViewReport={setViewingReportOrder}
          />
        )}

        {currentTab === 'registration' && (
          <RegistrationView
            onAddOrder={handleAddOrder}
            onCancel={() => setCurrentTab('dashboard')}
            onShowBarcode={setBarcodeOrder}
          />
        )}

        {currentTab === 'worklist' && (
          <WorklistView
            orders={orders}
            onOpenOrder={handleOpenOrder}
            onUpdateStatus={handleUpdateStatus}
            onViewReport={setViewingReportOrder}
            onShowBarcode={setBarcodeOrder}
          />
        )}

        {currentTab === 'results' && currentResultOrder && (
          <ResultEntryView
            order={currentResultOrder}
            onSaveResults={handleSaveResults}
            onBack={() => setCurrentTab('worklist')}
            onViewReport={setViewingReportOrder}
          />
        )}

        {currentTab === 'verification' && (
          <VerificationView
            orders={orders}
            onVerifyOrder={handleVerifyOrder}
            onRejectOrder={handleRejectOrder}
            onOpenOrder={handleOpenOrder}
            onViewReport={setViewingReportOrder}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsListView
            orders={orders}
            onViewReport={setViewingReportOrder}
          />
        )}

        {currentTab === 'critical' && (
          <CriticalAlertsView
            orders={orders}
            onLogPhoneCall={handleLogPhoneCall}
            onOpenOrder={handleOpenOrder}
          />
        )}

        {currentTab === 'queue' && (
          <QueueCounterView />
        )}

        {currentTab === 'qc_reagents' && (
          <ReagentQcView />
        )}

      </main>

      {/* Official Government Hospital Laboratory Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/public/assets/aistudio/020_5f9f8721.jpg" 
              alt="Hospital Seal"
              className="h-8 w-8 rounded-full border border-slate-200 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/020_5f9f8721.jpg';
              }}
            />
            <div>
              <span className="font-bold text-slate-900 block leading-tight">
                SETH N.L. GENERAL HOSPITAL · CIVIL PATAN LABORATORY
              </span>
              <span className="text-[11px] text-slate-500">
                Government Medical College & Civil Hospital Campus, Patan - 384265 (Gujarat)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Official Email: <strong className="text-slate-700">laboratorycivilpatan@gmail.com</strong></span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>NABL Accredited (ISO 15189:2022)</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>NABH Certified Govt Hospital</span>
          </div>
        </div>
      </footer>

      {/* Official Report Modal */}
      {viewingReportOrder && (
        <OfficialReportModal
          order={viewingReportOrder}
          onClose={() => setViewingReportOrder(null)}
        />
      )}

      {/* Tube Barcode Sticker Modal */}
      {barcodeOrder && (
        <BarcodeModal
          order={barcodeOrder}
          onClose={() => setBarcodeOrder(null)}
        />
      )}

    </div>
  );
}

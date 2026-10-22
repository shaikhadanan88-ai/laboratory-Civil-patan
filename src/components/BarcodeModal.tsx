/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Printer, Barcode as BarcodeIcon, Check } from 'lucide-react';
import { LabOrder, SpecimenTubeType } from '../types/laboratory';
import { MASTER_TEST_CATALOG, TUBE_METADATA } from '../data/labCatalog';

interface BarcodeModalProps {
  order: LabOrder | null;
  onClose: () => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  // Determine required tubes for this order
  const tubes = new Set<SpecimenTubeType>();
  order.testCodes.forEach(code => {
    const test = MASTER_TEST_CATALOG.find(t => t.code === code);
    if (test) tubes.add(test.specimenTube);
  });
  const requiredTubes = Array.from(tubes);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BarcodeIcon className="w-5 h-5 text-blue-900" />
            <h3 className="text-base font-bold text-slate-900">
              Phlebotomy Specimen Vial Barcodes: {order.accessionNo}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Print standard 50mm × 25mm barcode labels for specimen tubes. Affix vertically along tube label zone with barcode clear of centrifuge cap.
        </p>

        {/* Barcode Stickers Preview */}
        <div className="space-y-3 max-h-[360px] overflow-y-auto p-1">
          {requiredTubes.map(tubeKey => {
            const meta = TUBE_METADATA[tubeKey];

            return (
              <div 
                key={tubeKey}
                className="border-2 border-dashed border-slate-300 rounded-lg p-3 bg-slate-50 flex items-center justify-between gap-4 font-mono text-xs"
              >
                {/* Left Tube Color Stripe */}
                <div 
                  className="w-3 self-stretch rounded-sm shrink-0" 
                  style={{ backgroundColor: meta.color }}
                  title={meta.name}
                />

                {/* Barcode Label Body */}
                <div className="flex-1 leading-tight">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{order.accessionNo}</span>
                    <span className="text-[10px] font-sans font-bold text-blue-900">CIVIL PATAN LAB</span>
                  </div>

                  <div className="text-slate-800 font-sans font-semibold text-xs mt-0.5 truncate">
                    {order.patient.name}
                  </div>

                  <div className="text-[10px] text-slate-600 font-sans flex items-center gap-2 mt-0.5">
                    <span>{order.patient.age}y/{order.patient.gender}</span>
                    <span>UHID: {order.patient.uhid}</span>
                    <span>{order.patient.ward || 'OPD'}</span>
                  </div>

                  {/* Simulated Code 128 Barcode graphic */}
                  <div className="my-1.5 flex items-center gap-[2px] h-7 bg-white px-2 py-1 rounded border border-slate-200">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-full ${i % 3 === 0 ? 'w-1 bg-black' : i % 5 === 0 ? 'w-1.5 bg-black' : 'w-0.5 bg-black'}`}
                      />
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-500 flex items-center justify-between">
                    <span>{meta.name.split('(')[0].trim()}</span>
                    <span>{order.sampleCollectionTime}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-1 rounded font-bold block">
                    LABEL 1/1
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {requiredTubes.length} tube label(s) generated
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Barcode Labels
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

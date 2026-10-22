/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  FlaskConical, 
  Check, 
  Barcode, 
  UserPlus, 
  Clock, 
  AlertCircle, 
  FileText,
  Info
} from 'lucide-react';
import { LabOrder, Patient, UrgencyLevel, SpecimenTubeType } from '../types/laboratory';
import { MASTER_TEST_CATALOG, PRESET_TEST_PANELS, TUBE_METADATA } from '../data/labCatalog';

interface RegistrationViewProps {
  onAddOrder: (newOrder: LabOrder) => void;
  onCancel?: () => void;
  onShowBarcode: (order: LabOrder) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  onAddOrder,
  onCancel,
  onShowBarcode
}) => {
  // Form State
  const [patientType, setPatientType] = useState<'OPD' | 'IPD' | 'EMERGENCY' | 'ICU'>('OPD');
  const [uhid, setUhid] = useState(`CR-${Math.floor(892150 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('General Medicine OPD');
  const [bedNo, setBedNo] = useState('');
  const [consultantDoctor, setConsultantDoctor] = useState('Dr. S. N. Trivedi (M.D. Medicine)');
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('ROUTINE');
  const [selectedTests, setSelectedTests] = useState<string[]>(['CBC']);
  const [phlebotomist, setPhlebotomist] = useState('Sister Anita V. (Staff Phlebotomist)');

  // Auto Accession Number
  const currentAccessionNo = `CP-2026-${Math.floor(10497 + Math.random() * 50)}`;

  // Handle panel select
  const handleApplyPanel = (testCodes: string[]) => {
    setSelectedTests(prev => Array.from(new Set([...prev, ...testCodes])));
  };

  const handleToggleTest = (code: string) => {
    if (selectedTests.includes(code)) {
      setSelectedTests(selectedTests.filter(c => c !== code));
    } else {
      setSelectedTests([...selectedTests, code]);
    }
  };

  // Compute required collection tubes
  const requiredTubes = React.useMemo(() => {
    const tubes = new Set<SpecimenTubeType>();
    selectedTests.forEach(code => {
      const test = MASTER_TEST_CATALOG.find(t => t.code === code);
      if (test) tubes.add(test.specimenTube);
    });
    return Array.from(tubes);
  }, [selectedTests]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter patient full name');
      return;
    }
    if (!age) {
      alert('Please enter patient age');
      return;
    }
    if (selectedTests.length === 0) {
      alert('Please select at least one laboratory test');
      return;
    }

    const newPatient: Patient = {
      uhid: uhid.trim() || `CR-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      age: Number(age),
      gender,
      phone: phone.trim() || '+91 98000 00000',
      patientType,
      ward: ward.trim(),
      bedNo: bedNo.trim() || undefined,
      consultantDoctor: consultantDoctor.trim(),
      clinicalDiagnosis: clinicalDiagnosis.trim() || undefined
    };

    const newOrder: LabOrder = {
      accessionNo: currentAccessionNo,
      patient: newPatient,
      urgency,
      testCodes: selectedTests,
      status: 'COLLECTED',
      sampleCollectionTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      phlebotomist,
      results: {}
    };

    onAddOrder(newOrder);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Accessioning Division</span>
            <span aria-hidden="true">·</span>
            <span>Seth N.L. General Hospital & Civil Patan</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Patient Registration & Specimen Accessioning
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Create lab requisition slip, barcode stickers, and route samples to testing worklists
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Generated Accession No</span>
            <span className="text-sm font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded inline-block">
              {currentAccessionNo}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Patient Classification & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Patient Admission Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'OPD', label: 'OPD Outpatient' },
                { id: 'IPD', label: 'IPD Ward' },
                { id: 'EMERGENCY', label: 'Casualty / STAT' },
                { id: 'ICU', label: 'ICU / CCU' }
              ].map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setPatientType(cat.id as any);
                    if (cat.id === 'EMERGENCY' || cat.id === 'ICU') {
                      setUrgency('STAT_EMERGENCY');
                    }
                  }}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                    patientType === cat.id
                      ? 'border-blue-700 bg-blue-50 text-blue-900 font-semibold shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Processing Urgency (Priority)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ROUTINE', label: 'Routine (Standard TAT)', color: 'text-slate-700' },
                { id: 'URGENT', label: 'Urgent (TAT 1 hr)', color: 'text-amber-800' },
                { id: 'STAT_EMERGENCY', label: 'STAT / Emergency (TAT 30 min)', color: 'text-rose-700' }
              ].map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setUrgency(p.id as UrgencyLevel)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                    urgency === p.id
                      ? p.id === 'STAT_EMERGENCY'
                        ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold'
                        : 'border-blue-700 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Core Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Civil Hospital Reg / UHID No *
            </label>
            <input
              type="text"
              value={uhid}
              onChange={e => setUhid(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
              placeholder="e.g. CR-892144"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Patient Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
              placeholder="e.g. Bharatbhai K. Patel"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Age (Yrs) *
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location & Treating Physician */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Department / Ward
            </label>
            <input
              type="text"
              value={ward}
              onChange={e => setWard(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="e.g. Male Medical Ward 2"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Bed No (if IPD)
            </label>
            <input
              type="text"
              value={bedNo}
              onChange={e => setBedNo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="e.g. Bed-14"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Referring Consultant Doctor
            </label>
            <input
              type="text"
              value={consultantDoctor}
              onChange={e => setConsultantDoctor(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="e.g. Dr. B. C. Shah (M.S. General Surgery)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Phlebotomist / Collector
            </label>
            <input
              type="text"
              value={phlebotomist}
              onChange={e => setPhlebotomist(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Clinical Notes / Indication */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Clinical Diagnosis / Investigation Reason (for reference & delta checks)
          </label>
          <input
            type="text"
            value={clinicalDiagnosis}
            onChange={e => setClinicalDiagnosis(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            placeholder="e.g. Fever with chills 4 days, suspect Dengue / Malaria, acute chest tightness"
          />
        </div>

        {/* Test Profiles / Fast Order Buttons */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 flex items-center justify-between">
            <span>Standard Hospital Laboratory Profiles</span>
            <span className="text-[11px] font-normal text-slate-500">Click to auto-populate tests</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {PRESET_TEST_PANELS.map(panel => (
              <button
                type="button"
                key={panel.id}
                onClick={() => handleApplyPanel(panel.testCodes)}
                className="p-2.5 bg-white border border-slate-200 hover:border-blue-400 rounded-lg text-left transition-all group"
              >
                <div className="font-semibold text-xs text-slate-900 group-hover:text-blue-900">
                  {panel.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  {panel.testCodes.join(' + ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Individual Test Requisition Catalog Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Select Tests to Perform ({selectedTests.length} Selected)
            </label>
            <div className="text-xs text-slate-500">
              <button
                type="button"
                onClick={() => setSelectedTests(MASTER_TEST_CATALOG.map(t => t.code))}
                className="text-blue-800 hover:underline mr-3"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setSelectedTests([])}
                className="text-slate-500 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MASTER_TEST_CATALOG.map(test => {
              const isSelected = selectedTests.includes(test.code);
              const tubeMeta = TUBE_METADATA[test.specimenTube];

              return (
                <div
                  key={test.id}
                  onClick={() => handleToggleTest(test.code)}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-600/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center ${
                      isSelected ? 'bg-blue-800 border-blue-800 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-900">{test.code}</span>
                        <span className="text-xs text-slate-800 font-medium">{test.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {test.parameters.length} parameters · TAT ~{test.tatMinutes}m
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                        <span className={`px-1.5 py-0.2 rounded border font-mono ${tubeMeta.border} ${tubeMeta.bg}`}>
                          {tubeMeta.name.split('(')[0].trim()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phlebotomy Specimen Tube Requirements Box */}
        {requiredTubes.length > 0 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-slate-600" />
              Required Phlebotomy Collection Tubes for this Requisition ({requiredTubes.length} Tubes)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {requiredTubes.map(tubeKey => {
                const meta = TUBE_METADATA[tubeKey];
                return (
                  <div 
                    key={tubeKey} 
                    className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 text-xs shadow-2xs"
                  >
                    <div 
                      className="w-3.5 h-7 rounded-sm shrink-0 border"
                      style={{ backgroundColor: meta.color, borderColor: meta.color }} 
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block leading-tight">{meta.name}</span>
                      <span className="text-[10px] text-slate-500 block">{meta.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Info className="w-4 h-4 text-slate-400" />
            Requisition will be placed on central analyzer worklist immediately
          </div>

          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-xs flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Register Patient & Generate Accession
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

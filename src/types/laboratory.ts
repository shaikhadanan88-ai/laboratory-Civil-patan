/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UrgencyLevel = 'ROUTINE' | 'URGENT' | 'STAT_EMERGENCY';

export type SampleStatus = 
  | 'COLLECTED'
  | 'RECEIVED_IN_LAB'
  | 'PROCESSING'
  | 'RESULT_ENTERED'
  | 'VERIFIED'
  | 'DISPATCHED';

export type DepartmentCategory = 
  | 'HEMATOLOGY'
  | 'BIOCHEMISTRY'
  | 'CLINICAL_PATHOLOGY'
  | 'MICROBIOLOGY_SEROLOGY'
  | 'HORMONES_CARDIAC';

export type SpecimenTubeType = 
  | 'EDTA_PURPLE'
  | 'SERUM_RED_YELLOW'
  | 'FLUORIDE_GREY'
  | 'CITRATE_BLUE'
  | 'URINE_CONTAINER'
  | 'STERILE_SWAB';

export interface ParameterDef {
  id: string;
  name: string;
  unit: string;
  method?: string;
  refRangeText: string;
  refMin?: number;
  refMax?: number;
  criticalLow?: number;
  criticalHigh?: number;
  isQualitative?: boolean;
  qualitativeOptions?: string[];
  normalQualitative?: string;
  formula?: string; // auto-calc indicator
  notes?: string;
}

export interface TestCatalogItem {
  id: string;
  code: string;
  name: string;
  category: DepartmentCategory;
  specimenTube: SpecimenTubeType;
  specimenName: string;
  tatMinutes: number;
  parameters: ParameterDef[];
  description?: string;
}

export interface Patient {
  uhid: string; // Universal Hospital ID e.g. CR-883921
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  patientType: 'OPD' | 'IPD' | 'EMERGENCY' | 'ICU';
  ward?: string;
  bedNo?: string;
  consultantDoctor: string;
  clinicalDiagnosis?: string;
  address?: string;
}

export interface ParameterResult {
  parameterId: string;
  value: string;
  numericValue?: number;
  flag: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL_LOW' | 'CRITICAL_HIGH' | 'ABNORMAL_POSITIVE' | 'NORMAL_NEGATIVE';
  refRange: string;
  previousValue?: string;
  deltaAlert?: string;
}

export interface LabOrder {
  accessionNo: string; // e.g. CP-2026-10492
  patient: Patient;
  urgency: UrgencyLevel;
  testCodes: string[];
  status: SampleStatus;
  sampleCollectionTime: string;
  labReceivedTime?: string;
  resultEnteredTime?: string;
  verifiedTime?: string;
  results: Record<string, ParameterResult>; // parameterId -> result
  phlebotomist?: string;
  enteredBy?: string;
  verifiedBy?: string;
  technicianNotes?: string;
  pathologistRemarks?: string;
  criticalNotified?: boolean;
  criticalNotificationDetails?: {
    recipientName: string;
    wardOrIntercom: string;
    timestamp: string;
    readBackConfirmed: boolean;
    callerStaff: string;
  };
}

export interface ReagentInventory {
  id: string;
  reagentName: string;
  analyzer: string;
  lotNumber: string;
  expiryDate: string;
  currentTestsRemaining: number;
  maxCapacity: number;
  unit: string;
  status: 'OPTIMAL' | 'LOW' | 'CRITICAL' | 'EXPIRED';
}

export interface QualityControlRun {
  id: string;
  date: string;
  analyzer: string;
  testName: string;
  level1Value: number;
  level1Target: number;
  level1SD: number;
  level2Value: number;
  level2Target: number;
  level2SD: number;
  status: 'IN_CONTROL' | 'WARNING_1_2S' | 'OUT_OF_CONTROL';
}

export interface PhlebotomyToken {
  tokenNo: number;
  uhid: string;
  patientName: string;
  testCount: number;
  priority: UrgencyLevel;
  status: 'WAITING' | 'SERVING' | 'COLLECTED';
  counterNo?: number;
  timeIssued: string;
}

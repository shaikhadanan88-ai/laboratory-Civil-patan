/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LabOrder, ReagentInventory, QualityControlRun, PhlebotomyToken } from '../types/laboratory';

export const INITIAL_LAB_ORDERS: LabOrder[] = [
  {
    accessionNo: 'CP-2026-10492',
    patient: {
      uhid: 'CR-892104',
      name: 'Rameshchandra B. Prajapati',
      age: 48,
      gender: 'MALE',
      phone: '+91 98251 40912',
      patientType: 'EMERGENCY',
      ward: 'ICU / Acute Cardiac Care Unit',
      bedNo: 'ICU-Bed 04',
      consultantDoctor: 'Dr. V. K. Mehta (M.D. Medicine / Cardiologist)',
      clinicalDiagnosis: 'Acute Coronary Syndrome / Anteroseptal STEMI, chest pain 2 hrs',
      address: 'Near Siddhpur Crossroad, Patan'
    },
    urgency: 'STAT_EMERGENCY',
    testCodes: ['CARDIAC', 'KFT', 'GLUCOSE'],
    status: 'VERIFIED',
    sampleCollectionTime: '2026-10-21 07:15',
    labReceivedTime: '2026-10-21 07:22',
    resultEnteredTime: '2026-10-21 07:44',
    verifiedTime: '2026-10-21 07:50',
    enteredBy: 'P. M. Solanki (Sr. Lab Technician)',
    verifiedBy: 'Dr. R. K. Joshi (M.D. Path, Head of Lab)',
    phlebotomist: 'Sister Anita V. (Staff Nurse)',
    criticalNotified: true,
    criticalNotificationDetails: {
      recipientName: 'Dr. V. K. Mehta / Sister Jyoti (ICU In-charge)',
      wardOrIntercom: 'ICU Intercom Ext 402',
      timestamp: '2026-10-21 07:46',
      readBackConfirmed: true,
      callerStaff: 'P. M. Solanki (Sr. Lab Technician)'
    },
    technicianNotes: 'STAT processing run on Beckman Access 2 analyzer. Sample clear, non-icteric.',
    pathologistRemarks: 'High-sensitivity Troponin-I markedly elevated (0.84 ng/mL). Findings strongly indicative of acute myocardial injury. Immediate clinical correlation and cardiological intervention advised.',
    results: {
      card_trop_i: {
        parameterId: 'card_trop_i',
        value: '0.84',
        numericValue: 0.84,
        flag: 'CRITICAL_HIGH',
        refRange: '< 0.04 ng/mL (Negative)',
        previousValue: '0.02'
      },
      card_ckmb: {
        parameterId: 'card_ckmb',
        value: '48.2',
        numericValue: 48.2,
        flag: 'HIGH',
        refRange: '0 - 24 U/L',
        previousValue: '18.0'
      },
      kft_urea: {
        parameterId: 'kft_urea',
        value: '38.0',
        numericValue: 38.0,
        flag: 'NORMAL',
        refRange: '15.0 - 45.0 mg/dL'
      },
      kft_creat: {
        parameterId: 'kft_creat',
        value: '1.1',
        numericValue: 1.1,
        flag: 'NORMAL',
        refRange: '0.6 - 1.2 mg/dL'
      },
      kft_na: {
        parameterId: 'kft_na',
        value: '138',
        numericValue: 138,
        flag: 'NORMAL',
        refRange: '135 - 145 mEq/L'
      },
      kft_k: {
        parameterId: 'kft_k',
        value: '5.4',
        numericValue: 5.4,
        flag: 'HIGH',
        refRange: '3.5 - 5.1 mEq/L',
        deltaAlert: 'Borderline hyperkalemia noted in acute MI context'
      },
      kft_cl: {
        parameterId: 'kft_cl',
        value: '101',
        numericValue: 101,
        flag: 'NORMAL',
        refRange: '96 - 106 mEq/L'
      },
      glu_rbs: {
        parameterId: 'glu_rbs',
        value: '184',
        numericValue: 184,
        flag: 'HIGH',
        refRange: '70 - 140 mg/dL',
        previousValue: '142'
      }
    }
  },
  {
    accessionNo: 'CP-2026-10493',
    patient: {
      uhid: 'CR-892110',
      name: 'Sunita Ben K. Patel',
      age: 32,
      gender: 'FEMALE',
      phone: '+91 97234 11209',
      patientType: 'IPD',
      ward: 'Female Medical Ward 3',
      bedNo: 'FMW-Bed 12',
      consultantDoctor: 'Dr. S. N. Trivedi (M.D. Medicine)',
      clinicalDiagnosis: 'High grade intermittent fever with chills 5 days, petechiae, suspected Dengue',
      address: 'Ganeshpura, Patan District'
    },
    urgency: 'URGENT',
    testCodes: ['CBC', 'SEROLOGY_FEVER'],
    status: 'VERIFIED',
    sampleCollectionTime: '2026-10-21 08:30',
    labReceivedTime: '2026-10-21 08:40',
    resultEnteredTime: '2026-10-21 09:15',
    verifiedTime: '2026-10-21 09:25',
    enteredBy: 'J. D. Chaudhary (Technologist)',
    verifiedBy: 'Dr. R. K. Joshi (M.D. Path, Head of Lab)',
    phlebotomist: 'Bhavna Barot (Lab Technician)',
    criticalNotified: true,
    criticalNotificationDetails: {
      recipientName: 'Dr. S. N. Trivedi / Nurse Chhaya',
      wardOrIntercom: 'Female Medical Ward Ext 303',
      timestamp: '2026-10-21 09:18',
      readBackConfirmed: true,
      callerStaff: 'J. D. Chaudhary'
    },
    technicianNotes: 'Platelets cross-checked by manual peripheral smear counting under oil immersion lens.',
    pathologistRemarks: 'Significant thrombocytopenia (32,000 /cu.mm) with Dengue NS1 Antigen reactivity. Leishman stained smear demonstrates true thrombocytopenia with giant platelets and reactive atypical lymphocytes. Platelet monitoring every 12 hours recommended.',
    results: {
      cbc_hb: {
        parameterId: 'cbc_hb',
        value: '12.4',
        numericValue: 12.4,
        flag: 'NORMAL',
        refRange: '12.0 - 15.0 g/dL'
      },
      cbc_pcv: {
        parameterId: 'cbc_pcv',
        value: '42.0',
        numericValue: 42.0,
        flag: 'NORMAL',
        refRange: '36.0 - 46.0 %'
      },
      cbc_tlc: {
        parameterId: 'cbc_tlc',
        value: '3200',
        numericValue: 3200,
        flag: 'LOW',
        refRange: '4,000 - 11,000 cells/cu.mm',
        deltaAlert: 'Leukopenia consistent with viral acute phase'
      },
      cbc_neutro: {
        parameterId: 'cbc_neutro',
        value: '46',
        numericValue: 46,
        flag: 'NORMAL',
        refRange: '40 - 75 %'
      },
      cbc_lympho: {
        parameterId: 'cbc_lympho',
        value: '48',
        numericValue: 48,
        flag: 'HIGH',
        refRange: '20 - 45 %'
      },
      cbc_platelet: {
        parameterId: 'cbc_platelet',
        value: '32000',
        numericValue: 32000,
        flag: 'CRITICAL_LOW',
        refRange: '1,50,000 - 4,50,000 cells/cu.mm',
        previousValue: '78000',
        deltaAlert: 'Platelet drop from 78,000 to 32,000 within 24h!'
      },
      cbc_esr: {
        parameterId: 'cbc_esr',
        value: '18',
        numericValue: 18,
        flag: 'NORMAL',
        refRange: '0 - 20 mm at 1st Hr'
      },
      cbc_ps_smear: {
        parameterId: 'cbc_ps_smear',
        value: 'Thrombocytopenia confirmed on smear, no hemoparasites seen',
        flag: 'ABNORMAL_POSITIVE',
        refRange: 'Normocytic Normochromic RBCs, adequate platelets'
      },
      sero_dengue_ns1: {
        parameterId: 'sero_dengue_ns1',
        value: 'Positive (Reactive)',
        flag: 'ABNORMAL_POSITIVE',
        refRange: 'Negative (Non-Reactive)'
      },
      sero_dengue_ab: {
        parameterId: 'sero_dengue_ab',
        value: 'IgM: Positive / IgG: Negative (Primary Infection)',
        flag: 'ABNORMAL_POSITIVE',
        refRange: 'IgM: Negative / IgG: Negative'
      },
      sero_malaria: {
        parameterId: 'sero_malaria',
        value: 'Negative for P. vivax & P. falciparum',
        flag: 'NORMAL_NEGATIVE',
        refRange: 'Negative (No Parasite seen)'
      },
      sero_widal_o: {
        parameterId: 'sero_widal_o',
        value: '< 1:80 (Non-significant)',
        flag: 'NORMAL_NEGATIVE',
        refRange: '< 1:80 (Non-significant)'
      },
      sero_widal_h: {
        parameterId: 'sero_widal_h',
        value: '< 1:80 (Non-significant)',
        flag: 'NORMAL_NEGATIVE',
        refRange: '< 1:160 (Non-significant)'
      }
    }
  },
  {
    accessionNo: 'CP-2026-10494',
    patient: {
      uhid: 'CR-892115',
      name: 'Mohammad Farooq A. Qureshi',
      age: 56,
      gender: 'MALE',
      phone: '+91 94280 55198',
      patientType: 'OPD',
      ward: 'OPD Medicine Counter 4',
      consultantDoctor: 'Dr. M. G. Desai (M.D. Physician)',
      clinicalDiagnosis: 'Longstanding Type 2 Diabetes Mellitus, uncontrolled, Diabetic Nephropathy evaluation',
      address: 'Kalupur Darwaja, Patan'
    },
    urgency: 'ROUTINE',
    testCodes: ['GLUCOSE', 'HBA1C', 'KFT', 'URINE_RM'],
    status: 'RESULT_ENTERED',
    sampleCollectionTime: '2026-10-21 08:45',
    labReceivedTime: '2026-10-21 09:00',
    resultEnteredTime: '2026-10-21 09:50',
    enteredBy: 'K. R. Parmar (Lab Tech)',
    phlebotomist: 'Bhavna Barot (Lab Tech)',
    technicianNotes: 'Fasting 10 hours verified with patient.',
    results: {
      glu_fbs: {
        parameterId: 'glu_fbs',
        value: '214',
        numericValue: 214,
        flag: 'HIGH',
        refRange: '70 - 99 Normal / 100-125 Impaired / ≥126 Diabetic'
      },
      hba1c_val: {
        parameterId: 'hba1c_val',
        value: '9.6',
        numericValue: 9.6,
        flag: 'HIGH',
        refRange: '< 5.7 Normal / 5.7-6.4 Pre-diabetes / ≥ 6.5 Diabetes'
      },
      hba1c_eag: {
        parameterId: 'hba1c_eag',
        value: '228',
        numericValue: 228,
        flag: 'HIGH',
        refRange: '< 117 Normal'
      },
      kft_urea: {
        parameterId: 'kft_urea',
        value: '54.0',
        numericValue: 54.0,
        flag: 'HIGH',
        refRange: '15.0 - 45.0 mg/dL'
      },
      kft_creat: {
        parameterId: 'kft_creat',
        value: '2.4',
        numericValue: 2.4,
        flag: 'HIGH',
        refRange: '0.6 - 1.2 mg/dL'
      },
      kft_uric: {
        parameterId: 'kft_uric',
        value: '7.8',
        numericValue: 7.8,
        flag: 'HIGH',
        refRange: '3.5 - 7.2 mg/dL'
      },
      kft_na: {
        parameterId: 'kft_na',
        value: '139',
        numericValue: 139,
        flag: 'NORMAL',
        refRange: '135 - 145 mEq/L'
      },
      kft_k: {
        parameterId: 'kft_k',
        value: '4.6',
        numericValue: 4.6,
        flag: 'NORMAL',
        refRange: '3.5 - 5.1 mEq/L'
      },
      kft_egfr: {
        parameterId: 'kft_egfr',
        value: '28',
        numericValue: 28,
        flag: 'LOW',
        refRange: '> 90 Normal / 60-89 Mild / < 15 Kidney Failure'
      },
      urm_color: {
        parameterId: 'urm_color',
        value: 'Pale Yellow / Clear',
        flag: 'NORMAL_NEGATIVE',
        refRange: 'Pale Yellow / Clear'
      },
      urm_ph: {
        parameterId: 'urm_ph',
        value: '6.0',
        numericValue: 6.0,
        flag: 'NORMAL',
        refRange: '5.0 - 7.5'
      },
      urm_protein: {
        parameterId: 'urm_protein',
        value: '2+ (100 mg/dL)',
        flag: 'ABNORMAL_POSITIVE',
        refRange: 'Nil (Negative)'
      },
      urm_sugar: {
        parameterId: 'urm_sugar',
        value: '3+ (1.5%)',
        flag: 'ABNORMAL_POSITIVE',
        refRange: 'Nil (Negative)'
      },
      urm_pus: {
        parameterId: 'urm_pus',
        value: '2',
        numericValue: 2,
        flag: 'NORMAL',
        refRange: '1 - 4 / HPF'
      }
    }
  },
  {
    accessionNo: 'CP-2026-10495',
    patient: {
      uhid: 'CR-892119',
      name: 'Jayeshbhai M. Vaghela',
      age: 41,
      gender: 'MALE',
      phone: '+91 99042 88471',
      patientType: 'IPD',
      ward: 'Surgical Male Ward 2',
      bedNo: 'SMW-Bed 09',
      consultantDoctor: 'Dr. B. C. Shah (M.S. General Surgery)',
      clinicalDiagnosis: 'Pre-operative fitness for elective Inguinal Hernioplasty',
      address: 'Village Ranuj, Patan'
    },
    urgency: 'ROUTINE',
    testCodes: ['CBC', 'LFT', 'KFT', 'SEROLOGY_FEVER'],
    status: 'RECEIVED_IN_LAB',
    sampleCollectionTime: '2026-10-21 09:10',
    labReceivedTime: '2026-10-21 09:20',
    phlebotomist: 'Bhavna Barot (Lab Tech)',
    results: {}
  },
  {
    accessionNo: 'CP-2026-10496',
    patient: {
      uhid: 'CR-892124',
      name: 'Pooja Ben A. Thakor',
      age: 24,
      gender: 'FEMALE',
      phone: '+91 96011 34902',
      patientType: 'OPD',
      ward: 'ANC Clinic (Obs & Gynae)',
      consultantDoctor: 'Dr. H. P. Dave (M.D. DGO)',
      clinicalDiagnosis: 'Primigravida 22 weeks gestation, routine ANC screening & pallor',
      address: 'Subhash Chowk, Patan'
    },
    urgency: 'ROUTINE',
    testCodes: ['CBC', 'SEROLOGY_FEVER', 'URINE_RM', 'THYROID'],
    status: 'COLLECTED',
    sampleCollectionTime: '2026-10-21 09:40',
    phlebotomist: 'P. M. Solanki (Sr. Tech)',
    results: {}
  }
];

export const INITIAL_REAGENTS: ReagentInventory[] = [
  {
    id: 'reag_1',
    reagentName: 'Cellpack DCL CBC Diluent',
    analyzer: 'Sysmex XN-350 / 5-Part Hematology',
    lotNumber: 'SYX-26D-998',
    expiryDate: '2027-04-15',
    currentTestsRemaining: 410,
    maxCapacity: 1000,
    unit: 'Tests',
    status: 'OPTIMAL'
  },
  {
    id: 'reag_2',
    reagentName: 'Stromatolyser 4DL WBC Lyse',
    analyzer: 'Sysmex XN-350 / 5-Part Hematology',
    lotNumber: '4DL-2026A',
    expiryDate: '2026-12-30',
    currentTestsRemaining: 88,
    maxCapacity: 600,
    unit: 'Tests',
    status: 'LOW'
  },
  {
    id: 'reag_3',
    reagentName: 'BioSystem ALT / SGPT Liquid Stable Kit',
    analyzer: 'Erba EM-200 Fully Auto Chemistry',
    lotNumber: 'ALT-8832',
    expiryDate: '2027-08-20',
    currentTestsRemaining: 320,
    maxCapacity: 500,
    unit: 'Tests',
    status: 'OPTIMAL'
  },
  {
    id: 'reag_4',
    reagentName: 'Access High Sensitivity Troponin-I Kit',
    analyzer: 'Beckman Coulter Access 2 Immunoassay',
    lotNumber: 'TNI-2026-9',
    expiryDate: '2026-11-28',
    currentTestsRemaining: 34,
    maxCapacity: 200,
    unit: 'Cartridges',
    status: 'LOW'
  },
  {
    id: 'reag_5',
    reagentName: 'Direct ISE Potassium (K+) Electrode Solution',
    analyzer: 'Roche 9180 Electrolyte Analyzer',
    lotNumber: 'K-ISE-441',
    expiryDate: '2027-02-10',
    currentTestsRemaining: 180,
    maxCapacity: 400,
    unit: 'Injections',
    status: 'OPTIMAL'
  },
  {
    id: 'reag_6',
    reagentName: 'Dengue NS1 Antigen Rapid Card Pack (50 Tests)',
    analyzer: 'Manual Rapid Serology Bench',
    lotNumber: 'DNG-9941',
    expiryDate: '2027-01-31',
    currentTestsRemaining: 14,
    maxCapacity: 100,
    unit: 'Cassettes',
    status: 'CRITICAL'
  }
];

export const INITIAL_QC_LOGS: QualityControlRun[] = [
  {
    id: 'qc_1',
    date: '2026-10-21 06:30',
    analyzer: 'Sysmex XN-350 (Hematology)',
    testName: 'Hemoglobin Level 1 Normal Control',
    level1Value: 13.8,
    level1Target: 13.6,
    level1SD: 0.3,
    level2Value: 7.2,
    level2Target: 7.1,
    level2SD: 0.25,
    status: 'IN_CONTROL'
  },
  {
    id: 'qc_2',
    date: '2026-10-21 06:40',
    analyzer: 'Erba EM-200 (Biochemistry)',
    testName: 'Serum Glucose Calibrator & Normal Control',
    level1Value: 98.4,
    level1Target: 97.0,
    level1SD: 2.1,
    level2Value: 242.0,
    level2Target: 240.0,
    level2SD: 4.0,
    status: 'IN_CONTROL'
  },
  {
    id: 'qc_3',
    date: '2026-10-21 06:50',
    analyzer: 'Roche 9180 ISE (Electrolytes)',
    testName: 'Potassium (K+) Standard Control',
    level1Value: 4.08,
    level1Target: 4.0,
    level1SD: 0.08,
    level2Value: 6.45,
    level2Target: 6.4,
    level2SD: 0.12,
    status: 'IN_CONTROL'
  }
];

export const INITIAL_TOKENS: PhlebotomyToken[] = [
  {
    tokenNo: 14,
    uhid: 'CR-892124',
    patientName: 'Pooja Ben A. Thakor',
    testCount: 4,
    priority: 'ROUTINE',
    status: 'SERVING',
    counterNo: 2,
    timeIssued: '09:35 AM'
  },
  {
    tokenNo: 15,
    uhid: 'CR-892131',
    patientName: 'Kishorebhai L. Joshi',
    testCount: 2,
    priority: 'ROUTINE',
    status: 'WAITING',
    timeIssued: '09:42 AM'
  },
  {
    tokenNo: 16,
    uhid: 'CR-892136',
    patientName: 'Manjulaben S. Chaudhari',
    testCount: 3,
    priority: 'ROUTINE',
    status: 'WAITING',
    timeIssued: '09:48 AM'
  },
  {
    tokenNo: 17,
    uhid: 'CR-892140',
    patientName: 'Bhikhabhai N. Raval',
    testCount: 1,
    priority: 'URGENT',
    status: 'WAITING',
    timeIssued: '09:52 AM'
  }
];

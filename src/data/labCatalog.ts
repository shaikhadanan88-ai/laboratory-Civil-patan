/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestCatalogItem, SpecimenTubeType } from '../types/laboratory';

export const TUBE_METADATA: Record<SpecimenTubeType, { name: string; color: string; border: string; bg: string; description: string }> = {
  EDTA_PURPLE: {
    name: 'K2/K3 EDTA (Purple/Lavender)',
    color: '#7C3AED',
    border: 'border-purple-500',
    bg: 'bg-purple-50 text-purple-900',
    description: 'Whole Blood for Hematology & HbA1c'
  },
  SERUM_RED_YELLOW: {
    name: 'SST / Clot Activator (Yellow/Red)',
    color: '#DC2626',
    border: 'border-red-500',
    bg: 'bg-amber-50 text-amber-900',
    description: 'Serum for Biochemistry, Serology & Hormones'
  },
  FLUORIDE_GREY: {
    name: 'Sodium Fluoride (Grey)',
    color: '#4B5563',
    border: 'border-slate-500',
    bg: 'bg-slate-100 text-slate-800',
    description: 'Fluoride Plasma for Glycolysis inhibition (Blood Sugars)'
  },
  CITRATE_BLUE: {
    name: 'Sodium Citrate 3.2% (Light Blue)',
    color: '#0284C7',
    border: 'border-sky-500',
    bg: 'bg-sky-50 text-sky-900',
    description: 'Plasma for Coagulation (PT/INR, APTT)'
  },
  URINE_CONTAINER: {
    name: 'Sterile Urine Container',
    color: '#D97706',
    border: 'border-amber-500',
    bg: 'bg-yellow-50 text-yellow-900',
    description: 'Clean Catch Midstream Urine for R/M'
  },
  STERILE_SWAB: {
    name: 'Sterile Swab / Transport Medium',
    color: '#059669',
    border: 'border-emerald-500',
    bg: 'bg-emerald-50 text-emerald-900',
    description: 'Specimen for Microbiology & Culture'
  }
};

export const MASTER_TEST_CATALOG: TestCatalogItem[] = [
  {
    id: 'test_cbc',
    code: 'CBC',
    name: 'Complete Blood Count (CBC with 5-Part Diff)',
    category: 'HEMATOLOGY',
    specimenTube: 'EDTA_PURPLE',
    specimenName: '2 ml Whole Blood EDTA',
    tatMinutes: 45,
    description: 'Automated 5-part hematology analyzer + manual peripheral smear verification',
    parameters: [
      {
        id: 'cbc_hb',
        name: 'Hemoglobin (Hb)',
        unit: 'g/dL',
        method: 'Cyanmethemoglobin / Photometric',
        refRangeText: '13.0 - 17.0 (M) / 12.0 - 15.0 (F)',
        refMin: 12.0,
        refMax: 17.0,
        criticalLow: 7.0,
        criticalHigh: 20.0
      },
      {
        id: 'cbc_rbc',
        name: 'Total RBC Count',
        unit: 'mill/cu.mm',
        method: 'Electrical Impedance',
        refRangeText: '4.5 - 5.5',
        refMin: 4.5,
        refMax: 5.5,
        criticalLow: 2.0
      },
      {
        id: 'cbc_pcv',
        name: 'PCV / Packed Cell Volume (Hematocrit)',
        unit: '%',
        method: 'Calculated / Centrifugation',
        refRangeText: '40.0 - 50.0 (M) / 36.0 - 46.0 (F)',
        refMin: 36.0,
        refMax: 50.0,
        criticalLow: 20.0
      },
      {
        id: 'cbc_mcv',
        name: 'MCV (Mean Corpuscular Volume)',
        unit: 'fL',
        method: 'Calculated',
        refRangeText: '80.0 - 100.0',
        refMin: 80.0,
        refMax: 100.0
      },
      {
        id: 'cbc_mch',
        name: 'MCH (Mean Corpuscular Hb)',
        unit: 'pg',
        method: 'Calculated',
        refRangeText: '27.0 - 32.0',
        refMin: 27.0,
        refMax: 32.0
      },
      {
        id: 'cbc_mchc',
        name: 'MCHC',
        unit: 'g/dL',
        method: 'Calculated',
        refRangeText: '32.0 - 36.0',
        refMin: 32.0,
        refMax: 36.0
      },
      {
        id: 'cbc_rdw',
        name: 'RDW - CV',
        unit: '%',
        method: 'Calculated',
        refRangeText: '11.5 - 14.5',
        refMin: 11.5,
        refMax: 14.5
      },
      {
        id: 'cbc_tlc',
        name: 'Total Leukocyte Count (TLC/WBC)',
        unit: 'cells/cu.mm',
        method: 'Flow Cytometry / Impedance',
        refRangeText: '4,000 - 11,000',
        refMin: 4000,
        refMax: 11000,
        criticalLow: 2000,
        criticalHigh: 30000
      },
      {
        id: 'cbc_neutro',
        name: 'Neutrophils',
        unit: '%',
        method: 'Automated 5-Part Diff',
        refRangeText: '40 - 75',
        refMin: 40,
        refMax: 75
      },
      {
        id: 'cbc_lympho',
        name: 'Lymphocytes',
        unit: '%',
        method: 'Automated 5-Part Diff',
        refRangeText: '20 - 45',
        refMin: 20,
        refMax: 45
      },
      {
        id: 'cbc_eosino',
        name: 'Eosinophils',
        unit: '%',
        method: 'Automated 5-Part Diff',
        refRangeText: '1 - 6',
        refMin: 1,
        refMax: 6
      },
      {
        id: 'cbc_mono',
        name: 'Monocytes',
        unit: '%',
        method: 'Automated 5-Part Diff',
        refRangeText: '2 - 10',
        refMin: 2,
        refMax: 10
      },
      {
        id: 'cbc_baso',
        name: 'Basophils',
        unit: '%',
        method: 'Automated 5-Part Diff',
        refRangeText: '0 - 1',
        refMin: 0,
        refMax: 1
      },
      {
        id: 'cbc_platelet',
        name: 'Platelet Count',
        unit: 'cells/cu.mm',
        method: 'Optical / Impedance Counting',
        refRangeText: '1,50,000 - 4,50,000',
        refMin: 150000,
        refMax: 450000,
        criticalLow: 25000,
        criticalHigh: 1000000
      },
      {
        id: 'cbc_esr',
        name: 'ESR (Erythrocyte Sedimentation Rate)',
        unit: 'mm at 1st Hr',
        method: 'Westergren Method',
        refRangeText: '0 - 15 (M) / 0 - 20 (F)',
        refMin: 0,
        refMax: 20
      },
      {
        id: 'cbc_ps_smear',
        name: 'Peripheral Smear Examination',
        unit: '',
        method: 'Leishman Stain Microscopy',
        refRangeText: 'Normocytic Normochromic RBCs, adequate platelets',
        isQualitative: true,
        qualitativeOptions: [
          'Normocytic Normochromic RBCs, normal WBC morphology, adequate platelets',
          'Microcytic Hypochromic with Anisopoikilocytosis (Iron deficiency picture)',
          'Macrocytic anemia with hypersegmented neutrophils',
          'Thrombocytopenia confirmed on smear, no hemoparasites seen',
          'Toxic granulations present in neutrophils with leukocytosis',
          'Dimorphic red cell picture'
        ],
        normalQualitative: 'Normocytic Normochromic RBCs, normal WBC morphology, adequate platelets'
      }
    ]
  },
  {
    id: 'test_lft',
    code: 'LFT',
    name: 'Liver Function Test (Comprehensive)',
    category: 'BIOCHEMISTRY',
    specimenTube: 'SERUM_RED_YELLOW',
    specimenName: '3 ml Clotted Blood / Serum',
    tatMinutes: 60,
    parameters: [
      {
        id: 'lft_tbili',
        name: 'Bilirubin Total',
        unit: 'mg/dL',
        method: 'Diazo Method (Malloy-Evelyn)',
        refRangeText: '0.2 - 1.2',
        refMin: 0.2,
        refMax: 1.2,
        criticalHigh: 15.0
      },
      {
        id: 'lft_dbili',
        name: 'Bilirubin Direct (Conjugated)',
        unit: 'mg/dL',
        method: 'Diazo without accelerator',
        refRangeText: '0.0 - 0.3',
        refMin: 0.0,
        refMax: 0.3
      },
      {
        id: 'lft_ibili',
        name: 'Bilirubin Indirect (Unconjugated)',
        unit: 'mg/dL',
        method: 'Calculated: Total - Direct',
        formula: 'auto_indirect_bilirubin',
        refRangeText: '0.1 - 0.9',
        refMin: 0.1,
        refMax: 0.9
      },
      {
        id: 'lft_sgot',
        name: 'SGOT / AST',
        unit: 'U/L',
        method: 'UV Kinetic (IFCC without Pyridoxal)',
        refRangeText: '5 - 40',
        refMin: 5,
        refMax: 40,
        criticalHigh: 500
      },
      {
        id: 'lft_sgpt',
        name: 'SGPT / ALT',
        unit: 'U/L',
        method: 'UV Kinetic (IFCC)',
        refRangeText: '5 - 45',
        refMin: 5,
        refMax: 45,
        criticalHigh: 500
      },
      {
        id: 'lft_alp',
        name: 'Alkaline Phosphatase (ALP)',
        unit: 'U/L',
        method: 'p-NPP Kinetic (IFCC)',
        refRangeText: '30 - 120',
        refMin: 30,
        refMax: 120
      },
      {
        id: 'lft_tp',
        name: 'Total Protein',
        unit: 'g/dL',
        method: 'Biuret Method',
        refRangeText: '6.4 - 8.3',
        refMin: 6.4,
        refMax: 8.3
      },
      {
        id: 'lft_alb',
        name: 'Serum Albumin',
        unit: 'g/dL',
        method: 'BCG (Bromocresol Green)',
        refRangeText: '3.5 - 5.2',
        refMin: 3.5,
        refMax: 5.2,
        criticalLow: 2.0
      },
      {
        id: 'lft_glob',
        name: 'Serum Globulin',
        unit: 'g/dL',
        method: 'Calculated: Total Protein - Albumin',
        formula: 'auto_globulin',
        refRangeText: '2.0 - 3.5',
        refMin: 2.0,
        refMax: 3.5
      },
      {
        id: 'lft_ag_ratio',
        name: 'A / G Ratio',
        unit: 'ratio',
        method: 'Calculated',
        formula: 'auto_ag_ratio',
        refRangeText: '1.2 - 2.2',
        refMin: 1.2,
        refMax: 2.2
      }
    ]
  },
  {
    id: 'test_kft',
    code: 'KFT',
    name: 'Kidney Function Test & Electrolytes (RFT)',
    category: 'BIOCHEMISTRY',
    specimenTube: 'SERUM_RED_YELLOW',
    specimenName: '3 ml Clotted Blood / Serum',
    tatMinutes: 60,
    parameters: [
      {
        id: 'kft_urea',
        name: 'Blood Urea',
        unit: 'mg/dL',
        method: 'GLDH Kinetic Enzymatic',
        refRangeText: '15.0 - 45.0',
        refMin: 15.0,
        refMax: 45.0,
        criticalHigh: 150.0
      },
      {
        id: 'kft_creat',
        name: 'Serum Creatinine',
        unit: 'mg/dL',
        method: 'Modified Jaffe Kinetic / Enzymatic',
        refRangeText: '0.6 - 1.2 (M) / 0.5 - 1.0 (F)',
        refMin: 0.5,
        refMax: 1.2,
        criticalHigh: 5.0
      },
      {
        id: 'kft_uric',
        name: 'Serum Uric Acid',
        unit: 'mg/dL',
        method: 'Uricase Enzymatic',
        refRangeText: '3.5 - 7.2 (M) / 2.6 - 6.0 (F)',
        refMin: 2.6,
        refMax: 7.2
      },
      {
        id: 'kft_na',
        name: 'Serum Sodium (Na+)',
        unit: 'mEq/L',
        method: 'Direct Ion Selective Electrode (ISE)',
        refRangeText: '135 - 145',
        refMin: 135,
        refMax: 145,
        criticalLow: 120,
        criticalHigh: 160
      },
      {
        id: 'kft_k',
        name: 'Serum Potassium (K+)',
        unit: 'mEq/L',
        method: 'Direct Ion Selective Electrode (ISE)',
        refRangeText: '3.5 - 5.1',
        refMin: 3.5,
        refMax: 5.1,
        criticalLow: 2.8,
        criticalHigh: 6.2
      },
      {
        id: 'kft_cl',
        name: 'Serum Chloride (Cl-)',
        unit: 'mEq/L',
        method: 'Direct ISE',
        refRangeText: '96 - 106',
        refMin: 96,
        refMax: 106
      },
      {
        id: 'kft_egfr',
        name: 'Estimated GFR (CKD-EPI)',
        unit: 'mL/min/1.73m²',
        method: 'CKD-EPI Formula',
        formula: 'auto_egfr',
        refRangeText: '> 90 Normal / 60-89 Mild / < 15 Kidney Failure',
        refMin: 60,
        refMax: 130
      }
    ]
  },
  {
    id: 'test_glucose',
    code: 'GLUCOSE',
    name: 'Blood Glucose (Fasting / PP / Random)',
    category: 'BIOCHEMISTRY',
    specimenTube: 'FLUORIDE_GREY',
    specimenName: '2 ml Fluoride Plasma',
    tatMinutes: 30,
    parameters: [
      {
        id: 'glu_fbs',
        name: 'Fasting Blood Sugar (FBS)',
        unit: 'mg/dL',
        method: 'GOD-POD Enzymatic',
        refRangeText: '70 - 99 Normal / 100-125 Impaired / ≥126 Diabetic',
        refMin: 70,
        refMax: 99,
        criticalLow: 50,
        criticalHigh: 400
      },
      {
        id: 'glu_ppbs',
        name: 'Post-Prandial Blood Sugar (PPBS)',
        unit: 'mg/dL',
        method: 'GOD-POD Enzymatic (2h post meal)',
        refRangeText: '< 140 Normal / 140-199 Impaired / ≥200 Diabetic',
        refMin: 70,
        refMax: 140,
        criticalLow: 50,
        criticalHigh: 450
      },
      {
        id: 'glu_rbs',
        name: 'Random Blood Sugar (RBS)',
        unit: 'mg/dL',
        method: 'GOD-POD Enzymatic',
        refRangeText: '70 - 140',
        refMin: 70,
        refMax: 140,
        criticalLow: 50,
        criticalHigh: 400
      }
    ]
  },
  {
    id: 'test_hba1c',
    code: 'HBA1C',
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'BIOCHEMISTRY',
    specimenTube: 'EDTA_PURPLE',
    specimenName: '2 ml Whole Blood EDTA',
    tatMinutes: 60,
    parameters: [
      {
        id: 'hba1c_val',
        name: 'HbA1c (Glycosylated Hemoglobin)',
        unit: '%',
        method: 'HPLC (NGSP Certified)',
        refRangeText: '< 5.7 Normal / 5.7-6.4 Pre-diabetes / ≥ 6.5 Diabetes',
        refMin: 4.0,
        refMax: 5.6
      },
      {
        id: 'hba1c_eag',
        name: 'Estimated Average Glucose (eAG)',
        unit: 'mg/dL',
        method: 'Formula: 28.7 x HbA1c - 46.7',
        formula: 'auto_eag',
        refRangeText: '< 117 Normal',
        refMin: 70,
        refMax: 117
      }
    ]
  },
  {
    id: 'test_cardiac',
    code: 'CARDIAC',
    name: 'Emergency Cardiac Biomarkers',
    category: 'HORMONES_CARDIAC',
    specimenTube: 'SERUM_RED_YELLOW',
    specimenName: '2 ml Serum (STAT Emergency)',
    tatMinutes: 30,
    parameters: [
      {
        id: 'card_trop_i',
        name: 'Troponin - I (High Sensitivity)',
        unit: 'ng/mL',
        method: 'Chemiluminescence Immunoassay (CLIA)',
        refRangeText: '< 0.04 (Negative for Myocardial Necrosis)',
        refMin: 0.0,
        refMax: 0.04,
        criticalHigh: 0.04
      },
      {
        id: 'card_ckmb',
        name: 'CK-MB (Mass/Activity)',
        unit: 'U/L',
        method: 'Immunoinhibition',
        refRangeText: '0 - 24',
        refMin: 0,
        refMax: 24,
        criticalHigh: 50
      }
    ]
  },
  {
    id: 'test_serology',
    code: 'SEROLOGY_FEVER',
    name: 'Infectious & Fever Serology Panel',
    category: 'MICROBIOLOGY_SEROLOGY',
    specimenTube: 'SERUM_RED_YELLOW',
    specimenName: '3 ml Plain Serum',
    tatMinutes: 45,
    parameters: [
      {
        id: 'sero_dengue_ns1',
        name: 'Dengue NS1 Antigen (Rapid)',
        unit: '',
        method: 'Immunochromatography',
        refRangeText: 'Negative (Non-Reactive)',
        isQualitative: true,
        qualitativeOptions: ['Negative (Non-Reactive)', 'Positive (Reactive)'],
        normalQualitative: 'Negative (Non-Reactive)'
      },
      {
        id: 'sero_dengue_ab',
        name: 'Dengue IgM & IgG Antibodies',
        unit: '',
        method: 'Immunochromatography',
        refRangeText: 'IgM: Negative / IgG: Negative',
        isQualitative: true,
        qualitativeOptions: [
          'IgM: Negative / IgG: Negative',
          'IgM: Positive / IgG: Negative (Primary Infection)',
          'IgM: Positive / IgG: Positive (Secondary/Recent)',
          'IgM: Negative / IgG: Positive (Past Infection)'
        ],
        normalQualitative: 'IgM: Negative / IgG: Negative'
      },
      {
        id: 'sero_widal_o',
        name: 'Widal Test - S. Typhi "O" Titer',
        unit: 'titer',
        method: 'Tube / Slide Agglutination',
        refRangeText: '< 1:80 (Non-significant)',
        isQualitative: true,
        qualitativeOptions: ['< 1:80 (Non-significant)', '1:80', '1:160 (Significant Positive)', '1:320 (Strong Positive)'],
        normalQualitative: '< 1:80 (Non-significant)'
      },
      {
        id: 'sero_widal_h',
        name: 'Widal Test - S. Typhi "H" Titer',
        unit: 'titer',
        method: 'Tube / Slide Agglutination',
        refRangeText: '< 1:160 (Non-significant)',
        isQualitative: true,
        qualitativeOptions: ['< 1:80 (Non-significant)', '1:80', '1:160', '1:320 (Significant Positive)'],
        normalQualitative: '< 1:80 (Non-significant)'
      },
      {
        id: 'sero_malaria',
        name: 'Malaria Rapid Card & Smear (MP)',
        unit: '',
        method: 'Dual Antigen (Pv / Pf) & Microscopy',
        refRangeText: 'Negative (No Parasite seen)',
        isQualitative: true,
        qualitativeOptions: [
          'Negative for P. vivax & P. falciparum',
          'Positive for Plasmodium vivax (Pv)',
          'Positive for Plasmodium falciparum (Pf)',
          'Mixed Infection (Pv + Pf Positive)'
        ],
        normalQualitative: 'Negative for P. vivax & P. falciparum'
      },
      {
        id: 'sero_hiv',
        name: 'HIV 1 & 2 Antibody Screen (NACO)',
        unit: '',
        method: 'Rapid 3rd Gen Tri-line Immunodot',
        refRangeText: 'Non-Reactive',
        isQualitative: true,
        qualitativeOptions: ['Non-Reactive', 'Reactive (Requires Confirmation)'],
        normalQualitative: 'Non-Reactive'
      },
      {
        id: 'sero_hbsag',
        name: 'HBsAg (Hepatitis B Surface Antigen)',
        unit: '',
        method: 'Rapid Immunochromatography',
        refRangeText: 'Non-Reactive',
        isQualitative: true,
        qualitativeOptions: ['Non-Reactive', 'Reactive'],
        normalQualitative: 'Non-Reactive'
      },
      {
        id: 'sero_blood_group',
        name: 'Blood Grouping & Rh Factor',
        unit: '',
        method: 'Slide & Tube Agglutination (Forward & Reverse)',
        refRangeText: 'ABO & Rh Antigen typing',
        isQualitative: true,
        qualitativeOptions: [
          'A Positive (A +ve)',
          'B Positive (B +ve)',
          'O Positive (O +ve)',
          'AB Positive (AB +ve)',
          'A Negative (A -ve)',
          'B Negative (B -ve)',
          'O Negative (O -ve)',
          'AB Negative (AB -ve)'
        ],
        normalQualitative: 'B Positive (B +ve)'
      }
    ]
  },
  {
    id: 'test_urine_rm',
    code: 'URINE_RM',
    name: 'Urine Routine & Microscopic Examination',
    category: 'CLINICAL_PATHOLOGY',
    specimenTube: 'URINE_CONTAINER',
    specimenName: '15 ml Fresh Mid-stream Urine',
    tatMinutes: 45,
    parameters: [
      {
        id: 'urm_color',
        name: 'Color & Appearance',
        unit: '',
        method: 'Physical Inspection',
        refRangeText: 'Pale Yellow / Clear',
        isQualitative: true,
        qualitativeOptions: ['Pale Yellow / Clear', 'Amber / Slightly Turbid', 'Dark Yellow / Hazy', 'Smoky Red / Turbid'],
        normalQualitative: 'Pale Yellow / Clear'
      },
      {
        id: 'urm_ph',
        name: 'Reaction / pH',
        unit: '',
        method: 'Dry Reagent Strip',
        refRangeText: '5.0 - 7.5',
        refMin: 5.0,
        refMax: 7.5
      },
      {
        id: 'urm_protein',
        name: 'Albumin / Protein',
        unit: '',
        method: 'Sulfosalicylic Acid / Strip',
        refRangeText: 'Nil (Negative)',
        isQualitative: true,
        qualitativeOptions: ['Nil (Negative)', 'Trace', '1+ (30 mg/dL)', '2+ (100 mg/dL)', '3+ (300 mg/dL)', '4+ (1000 mg/dL)'],
        normalQualitative: 'Nil (Negative)'
      },
      {
        id: 'urm_sugar',
        name: 'Urine Sugar (Glucose)',
        unit: '',
        method: 'Benedict / Glucose Oxidase',
        refRangeText: 'Nil (Negative)',
        isQualitative: true,
        qualitativeOptions: ['Nil (Negative)', 'Trace', '1+ (0.5%)', '2+ (1.0%)', '3+ (1.5%)', '4+ (≥2.0%)'],
        normalQualitative: 'Nil (Negative)'
      },
      {
        id: 'urm_ketones',
        name: 'Ketone Bodies (Acetone)',
        unit: '',
        method: 'Rotheras Nitroprusside Test',
        refRangeText: 'Negative',
        isQualitative: true,
        qualitativeOptions: ['Negative', 'Trace', 'Positive (1+)', 'Moderate (2+)', 'Large (3+)'],
        normalQualitative: 'Negative'
      },
      {
        id: 'urm_pus',
        name: 'Pus Cells (Leukocytes)',
        unit: '/ HPF',
        method: 'Centrifuged Deposit Microscopy 40X',
        refRangeText: '1 - 4 / HPF',
        refMin: 0,
        refMax: 5
      },
      {
        id: 'urm_rbc',
        name: 'Red Blood Cells (RBCs)',
        unit: '/ HPF',
        method: 'Centrifuged Deposit Microscopy 40X',
        refRangeText: '0 - 2 / HPF',
        refMin: 0,
        refMax: 2
      },
      {
        id: 'urm_epi',
        name: 'Epithelial Cells',
        unit: '/ HPF',
        method: 'Microscopy 40X',
        refRangeText: '2 - 4 / HPF (Few)',
        refMin: 0,
        refMax: 6
      },
      {
        id: 'urm_casts',
        name: 'Casts & Crystals',
        unit: '',
        method: 'Microscopy',
        refRangeText: 'Nil / Occasional Calcium Oxalate',
        isQualitative: true,
        qualitativeOptions: [
          'Nil Seen',
          'Few Calcium Oxalate Crystals',
          'Hyaline Casts (1-2/LPF)',
          'Granular Casts Present (Abnormal)',
          'Triple Phosphate Crystals'
        ],
        normalQualitative: 'Nil Seen'
      }
    ]
  },
  {
    id: 'test_thyroid',
    code: 'THYROID',
    name: 'Thyroid Profile (Free T3, Free T4, TSH)',
    category: 'HORMONES_CARDIAC',
    specimenTube: 'SERUM_RED_YELLOW',
    specimenName: '2 ml Plain Serum',
    tatMinutes: 90,
    parameters: [
      {
        id: 'thy_tsh',
        name: 'Thyroid Stimulating Hormone (TSH)',
        unit: 'µIU/mL',
        method: 'Chemiluminescence (CLIA 3rd Gen)',
        refRangeText: '0.35 - 4.94',
        refMin: 0.35,
        refMax: 4.94,
        criticalLow: 0.05,
        criticalHigh: 20.0
      },
      {
        id: 'thy_ft3',
        name: 'Free T3 (FT3)',
        unit: 'pg/mL',
        method: 'CLIA',
        refRangeText: '1.71 - 3.71',
        refMin: 1.71,
        refMax: 3.71
      },
      {
        id: 'thy_ft4',
        name: 'Free T4 (FT4)',
        unit: 'ng/dL',
        method: 'CLIA',
        refRangeText: '0.70 - 1.48',
        refMin: 0.70,
        refMax: 1.48
      }
    ]
  }
];

export const PRESET_TEST_PANELS = [
  {
    id: 'panel_fever',
    name: 'Govt Hospital Acute Fever Panel',
    testCodes: ['CBC', 'SEROLOGY_FEVER', 'URINE_RM'],
    description: 'Rapid investigation for pyrexia of unknown origin (Malaria, Dengue, Typhoid, UTI, Leukocytosis)'
  },
  {
    id: 'panel_rft_kft',
    name: 'Renal & Electrolyte Screen',
    testCodes: ['KFT', 'URINE_RM'],
    description: 'Urea, Creatinine, Electrolytes (Na+, K+, Cl-), eGFR & Urine Protein'
  },
  {
    id: 'panel_preop',
    name: 'Pre-Operative / Surgical Safety Profile',
    testCodes: ['CBC', 'KFT', 'LFT', 'SEROLOGY_FEVER', 'URINE_RM'],
    description: 'Mandatory standard pre-anesthesia & surgical fitness laboratory profile'
  },
  {
    id: 'panel_cardiac_stat',
    name: 'STAT Cardiac & Chest Pain Emergency',
    testCodes: ['CARDIAC', 'KFT', 'GLUCOSE'],
    description: 'High-sensitivity Troponin-I, CK-MB, Serum Potassium & Random Glucose'
  },
  {
    id: 'panel_diabetic',
    name: 'Diabetic Health Monitoring',
    testCodes: ['GLUCOSE', 'HBA1C', 'KFT', 'URINE_RM'],
    description: 'FBS, PPBS, HbA1c, eAG, Serum Creatinine & Microscopic Urine'
  }
];

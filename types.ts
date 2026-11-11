import type { ComponentType } from 'react';

export type View = string;

export type ReceptionistView = 
    'appointments' | 
    'walkin' | 
    'assessment' | 
    'history' |
    'activity_log';

export type DoctorView =
    'dashboard' |
    'icu_early_warning' |
    'departments' |
    'neurology' |
    'dermatology' |
    'surgery_medicine' |
    'emergency' |
    'cardiology' |
    'orthopedics' |
    'general_medicine' |
    'pediatrics' |
    'gynecology' |
    'patient_list' |
    'patient_detail' |
    'patient_reports' |
    'ventilator_monitor' |
    'prescriptions' |
    'case_history' |
    'tests_results' |
    'diagnostic_tools' |
    'current_status' |
    'treatment_module' |
    // New Views
    'appointments_schedule' |
    'messaging' |
    'notifications' |
    'inventory_equipment' |
    'billing_insurance' |
    'analytics_reports' |
    'settings_profile' |
    'help_documentation';

export type InternView = 
    'patient_queue' | 
    'vitals_assessment' | 
    'assign_doctor' | 
    'prescription_entry' | 
    'record_viewer';

export type TriageRisk = 'High' | 'Medium' | 'Low';

export type PatientStatus = 'REGISTERED' | 'WAITING_FOR_INTERN' | 'WAITING_FOR_DOCTOR' | 'IN_CONSULTATION' | 'DISCHARGED';

export interface PatientPrescription {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  date: string;
  doctor: string;
  reason: string;
  patientType?: 'inpatient' | 'outpatient'; // Add this field
}

export interface PatientReferral {
  id: string;
  date: string;
  specialty: string;
  doctor: string;
  reason: string;
  referredTo: string;
  status?: 'Pending' | 'Accepted' | 'Completed' | 'Declined';
}

export interface PastCondition {
  id: string;
  condition: string;
  diagnosedDate: string;
}

export interface Surgery {
  id: string;
  procedure: string;
  date: string;
}

export interface MedicalHistory {
  pastConditions: PastCondition[];
  surgeries: Surgery[];
}

export interface VitalSignEntry {
  timestamp: string;
  temperature: number;
  heartRate: number;
  respirationRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  height?: number;
  weight?: number;
  symptomsSummary?: string;
}

export interface Patient {
  id: string; // This is the PID
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dob: string;
  bloodType: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  guardianName: string;
  phoneNumber: string;
  email?: string;
  password?: string;
  assignedDoctorId?: string;
  department?: string;
  status?: PatientStatus;
  isPregnant?: boolean; // Added pregnancy status field
  triageInfo: {
    chiefComplaint: string;
    risk: TriageRisk;
    riskScore: number;
    triageDate: string;
  };
  clinicalNotes: string;
  medicalHistory: MedicalHistory;
  prescriptions: PatientPrescription[];
  referrals: PatientReferral[];
  vitals?: VitalSignEntry[];
  // New fields for symptoms and surgeries
  symptoms?: string[];
  surgeries?: string[];
  // Snapshot vitals for the new VitalsChart
  temperature_F?: number;
  heart_rate_bpm?: number;
  respiration_rate?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
}

export interface Doctor {
    id: string;
    name: string;
    department: string;
    email: string;
    passwordHash: string; // In a real app
    bookedSlots?: { date: string; time: string }[];
    availability?: string[];
}

export interface VitalSign {
  time: string;
  hr: number; // Heart Rate
  bp: number; // Blood Pressure (Systolic)
  spo2: number; // Oxygen Saturation
  temp: number; // Temperature (C)
}

export interface HospitalStat {
  label: string;
  value: string;
  change: number;
  icon: ComponentType<{ className?: string }>;
}

export interface NavItemType {
    id: View;
    label: string;
    icon: ComponentType<{ className?: string }>;
}

export interface NavCategoryType {
    category: string;
    icon: ComponentType<{ className?: string }>;
    items: NavItemType[];
}

export interface TriageAnalysis {
  score: number;
  justification: string;
}

// Module-specific types
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  symptoms: string;
  status: 'Confirmed' | 'PendingApproval' | 'PendingDoctorAssignment' | 'Cancelled' | 'Rejected';
}

export interface Notification {
  id: string;
  patientId: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  patientId: string;
  patientName: string;
  action: string;
  timestamp: string;
}

export interface ComplaintTicket {
  id: string;
  patientName: string;
  submitted: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface Prescription {
    id: string;
    patientName: string;
    medication: string;
    dosage: string;
    date: string;
    status: 'Pending' | 'Filled';
}

export interface LabOrder {
    id: string;
    patientName: string;
    testName: string;
    ordered: string;
    status: 'Pending' | 'In Progress' | 'Complete';
}

export interface BillItem {
    id: string;
    description: string;
    department: string;
    amount: number;
}

export interface EmergencyCase {
    id: string;
    patientName: string;
    complaint: string;
    eta: string;
    status: 'Incoming' | 'In ER' | 'Admitted';
}

export interface MLCase {
    id: string;
    patientName: string;
    incidentDate: string;
    type: 'Accident' | 'Assault' | 'Other';
    status: 'Active' | 'Closed';
}

export interface WardBed {
    id: string;
    ward: string;
    bedNumber: string;
    patientName: string | null;
    status: 'Occupied' | 'Available' | 'Cleaning';
}

export interface Equipment {
    id: string;
    name: string;
    location: string;
    status: 'Operational' | 'Maintenance' | 'Offline';
    nextMaint: string;
}

export interface ITTicket {
    id: string;
    user: string;
    department: string;
    issue: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'New' | 'In Progress' | 'Resolved';
}

export interface PurchaseOrder {
    id: string;
    supplier: string;
    item: string;
    quantity: number;
    status: 'Pending' | 'Shipped' | 'Received';
}

export interface QualityMetric {
    id: string;
    name: string;
    value: string;
    target: string;
    trend: 'up' | 'down' | 'stable';
}

// ==========================================
// Clinical Intelligence & ICU Early Warning
// ==========================================

export type ICUAlertSeverity = 'MONITOR' | 'HIGH' | 'CRITICAL';
export type ICUAlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED' | 'SUPPRESSED';

export interface ContributingSignal {
  signal: string;
  value: string;
  trend: string;
  category: 'Hemodynamic' | 'Respiratory' | 'Neurological' | 'Metabolic' | 'Renal' | 'General';
}

export interface ICUDataQuality {
  overall_score: number;
  status: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'LOW_QUALITY' | 'INSUFFICIENT_DATA';
  active_signals_count: number;
  freshness_score: number;
  coverage_score: number;
  signal_freshness: Record<string, string>;
}

export interface ICUTrajectoryPoint {
  time_hours: number;
  risk_score: number;
  risk_percentage: number;
  severity: 'LOW' | 'MONITOR' | 'HIGH' | 'CRITICAL';
  data_quality: number;
  contributing_signals: string[];
}

export interface RawObservation {
  time_hours: number;
  parameter: string;
  value: number;
  is_valid?: boolean;
}

export interface ICUPatientRecord {
  record_id: string;
  bed_id: string;
  age: number;
  gender: string;
  icu_type: string;
  outcome: string;
  is_death: number;
  total_observations: number;
  telemetry_duration_hours: number;
  observations: RawObservation[];
  trajectory: ICUTrajectoryPoint[];
  final_risk_score: number;
  final_severity: 'LOW' | 'MONITOR' | 'HIGH' | 'CRITICAL';
}

export interface ICUAlert {
  id: string;
  patientId: string;
  bedId: string;
  timestamp: string;
  simulationTimeHours?: number;
  severity: 'HIGH' | 'CRITICAL';
  riskScore: number;
  confidence: number;
  status: ICUAlertStatus;
  contributingSignals: ContributingSignal[];
  explanation: string;
  dataQuality: number;
  modelVersion: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface ICUAuditLog {
  id: string;
  userId: string;
  action: 'ALERT_VIEWED' | 'ALERT_ACKNOWLEDGED' | 'ALERT_RESOLVED' | 'PATIENT_OPENED' | 'PREDICTION_GENERATED' | 'REPLAY_STARTED' | 'REPLAY_RESET';
  patientId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
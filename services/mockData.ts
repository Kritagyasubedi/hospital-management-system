import type { Patient, VitalSign, HospitalStat, Appointment, ComplaintTicket, Prescription, LabOrder, BillItem, EmergencyCase, MLCase, WardBed, Equipment, ITTicket, PurchaseOrder, QualityMetric, PatientPrescription, PatientReferral, MedicalHistory, Doctor } from '../types';
import { BedIcon, OutpatientIcon, SurgeryIcon, AlertIcon } from '../components/icons';
import { departmentPatients } from './departmentPatients';

export const generatePID = (): string => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    return `PID${randomNumber}`;
};

export const mockDoctors: Doctor[] = [
    { 
        id: 'DOC001', 
        name: 'Dr. Evelyn Reed', 
        department: 'Cardiology', 
        email: 'evelyn.reed@srm.hosp', 
        passwordHash: 'hashed_pw',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        bookedSlots: [
            { date: '2024-09-10', time: '10:00 AM' },
            { date: '2024-09-10', time: '11:30 AM' },
            { date: '2024-09-11', time: '02:30 PM' },
            { date: '2025-10-27', time: '09:00 AM' },
            { date: '2025-10-27', time: '11:00 AM' },
            { date: '2025-10-28', time: '02:00 PM' },
            { date: '2025-10-28', time: '02:30 PM' },
            { date: '2025-10-29', time: '09:00 AM' },
            { date: '2025-10-29', time: '10:30 AM' },
            { date: '2025-10-29', time: '02:00 PM' },
            { date: '2025-10-29', time: '04:00 PM' },
            { date: '2025-10-30', time: '10:00 AM' },
            { date: '2025-10-30', time: '10:30 AM' },
            { date: '2025-10-31', time: '11:00 AM' },
            { date: '2025-10-31', time: '03:30 PM' },
            { date: '2025-10-25', time: '09:30 AM' },
            { date: '2025-10-25', time: '11:00 AM' },
        ] 
    },
    { 
        id: 'DOC002', 
        name: 'Dr. Ben Carter', 
        department: 'Orthopedics', 
        email: 'ben.carter@srm.hosp', 
        passwordHash: 'hashed_pw',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        bookedSlots: [
            { date: '2025-10-27', time: '09:30 AM' },
            { date: '2025-10-27', time: '11:00 AM' },
            { date: '2025-10-27', time: '02:30 PM' },
            { date: '2025-10-28', time: '10:00 AM' },
            { date: '2025-10-30', time: '10:00 AM' },
            { date: '2025-10-31', time: '09:00 AM' },
            { date: '2025-10-25', time: '10:00 AM' },
            { date: '2025-10-25', time: '12:00 PM' },
        ] 
    },
    { 
        id: 'DOC003', 
        name: 'Dr. Alice Johnson', 
        department: 'Neurology', 
        email: 'alice.johnson@srm.hosp', 
        passwordHash: 'hashed_pw', 
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        bookedSlots: [
            { date: '2025-10-28', time: '04:00 PM' },
            { date: '2025-10-27', time: '09:00 AM' },
            { date: '2025-10-27', time: '09:30 AM' },
            { date: '2025-10-27', time: '11:30 AM' },
            { date: '2025-10-29', time: '11:00 AM' },
            { date: '2025-10-29', time: '11:30 AM' },
            { date: '2025-10-29', time: '02:30 PM' },
            { date: '2025-10-30', time: '02:00 PM' },
            { date: '2025-10-30', time: '03:00 PM' },
        ] 
    },
    {
        id: 'DOC004',
        name: 'Dr. Marcus Lee',
        department: 'Neurology',
        email: 'marcus.lee@srm.hosp',
        passwordHash: 'hashed_pw',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        bookedSlots: [
            { date: '2025-10-27', time: '10:00 AM' },
            { date: '2025-10-27', time: '10:30 AM' },
            { date: '2025-10-29', time: '03:00 PM' },
            { date: '2025-10-31', time: '10:00 AM' },
            { date: '2025-10-25', time: '09:00 AM' },
        ]
    },
    {
        id: 'DOC005',
        name: 'Dr. Olivia Garcia',
        department: 'Pediatrics',
        email: 'olivia.garcia@srm.hosp',
        passwordHash: 'hashed_pw',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        bookedSlots: [
            { date: '2025-10-28', time: '09:00 AM' },
            { date: '2025-10-28', time: '11:00 AM' },
            { date: '2025-10-29', time: '10:00 AM' },
            { date: '2025-10-30', time: '11:30 AM' },
            { date: '2025-10-30', time: '12:00 PM' },
        ]
    },
    {
        id: 'DOC006',
        name: 'Dr. Samuel Wilson',
        department: 'ENT',
        email: 'samuel.wilson@srm.hosp',
        passwordHash: 'hashed_pw',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        bookedSlots: [
            { date: '2025-10-27', time: '02:00 PM' },
            { date: '2025-10-27', time: '02:30 PM' },
            { date: '2025-10-29', time: '09:30 AM' },
            { date: '2025-10-29', time: '10:00 AM' },
            { date: '2025-10-30', time: '03:30 PM' },
            { date: '2025-10-31', time: '02:00 PM' },
        ]
    },
    {
        id: 'DOC007',
        name: 'Dr. Chloe Davis',
        department: 'General Medicine',
        email: 'chloe.davis@srm.hosp',
        passwordHash: 'hashed_pw',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        bookedSlots: [
            { date: '2025-10-28', time: '10:00 AM' },
            { date: '2025-10-28', time: '10:30 AM' },
            { date: '2025-10-28', time: '11:00 AM' },
            { date: '2025-10-29', time: '02:00 PM' },
            { date: '2025-10-31', time: '02:00 PM' },
            { date: '2025-10-31', time: '02:30 PM' },
            { date: '2025-10-25', time: '11:30 AM' },
        ]
    },
    {
        id: 'DOC008',
        name: 'Dr. Sarah Johnson',
        department: 'Gynecology',
        email: 'sarah.johnson@srm.hosp',
        passwordHash: 'hashed_pw',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        bookedSlots: [
            { date: '2025-10-27', time: '09:00 AM' },
            { date: '2025-10-27', time: '09:30 AM' },
            { date: '2025-10-27', time: '10:00 AM' },
            { date: '2025-10-28', time: '02:00 PM' },
            { date: '2025-10-28', time: '02:30 PM' },
            { date: '2025-10-29', time: '09:00 AM' },
            { date: '2025-10-29', time: '10:00 AM' },
            { date: '2025-10-30', time: '10:00 AM' },
            { date: '2025-10-30', time: '10:30 AM' },
            { date: '2025-10-31', time: '11:00 AM' },
        ]
    }
];

const mockPatientPrescriptions: Record<string, PatientPrescription[]> = {
    'PID723709': [
        { id: 'RX1001', medication: 'Atorvastatin', dosage: '20mg', instructions: 'Take 1 tablet at bedtime', date: '2024-07-23', doctor: 'Dr. Evelyn Reed', reason: 'High Cholesterol' },
        { id: 'RX1002', medication: 'Lisinopril', dosage: '10mg', instructions: 'Take 1 tablet in the morning', date: '2024-07-23', doctor: 'Dr. Evelyn Reed', reason: 'Hypertension' },
        { id: 'RX1003', medication: 'Metformin', dosage: '500mg', instructions: 'Take 1 tablet twice daily with meals', date: '2024-07-23', doctor: 'Dr. Evelyn Reed', reason: 'Type 2 Diabetes' },
    ],
    'PID192837': [
        { id: 'RX2001', medication: 'Augmentin', dosage: '625mg', instructions: 'Take 1 tablet every 12 hours for 7 days', date: '2024-07-20', doctor: 'Dr. Ben Carter', reason: 'Pneumonia' },
    ],
};

const mockPatientReferrals: Record<string, PatientReferral[]> = {
    'PID723709': [
        { id: 'REF101', date: '2024-07-24', specialty: 'Cardiac Rehabilitation', doctor: 'Dr. Evelyn Reed', reason: 'Post-MI recovery', referredTo: 'SRM Physical Therapy Center' },
    ],
};

const mockMedicalHistory: Record<string, MedicalHistory> = {
    'PID723709': {
        pastConditions: [
            { id: 'PC1', condition: 'Hypertension', diagnosedDate: '2022-01-15' },
            { id: 'PC2', condition: 'Type 2 Diabetes', diagnosedDate: '2021-11-20' },
        ],
        surgeries: [
            { id: 'S1', procedure: 'Coronary Artery Bypass Graft (CABG)', date: '2023-05-10' },
        ],
    },
    'PID192837': {
        pastConditions: [
            { id: 'PC3', condition: 'Asthma', diagnosedDate: '2010-06-01' },
            { id: 'PC4', condition: 'Seasonal Allergies', diagnosedDate: '2005-01-01' },
        ],
        surgeries: [
            { id: 'S2', procedure: 'Tonsillectomy', date: '1995-03-22' },
        ],
    },
};

const HASHED_PASSWORD_123 = 'sim_hash$321drowssap$srm-hospital-supporter-system';

// Department-specific mock patients based on symptoms and vitals
export const mockPatients: Patient[] = departmentPatients;

export const mockStats: HospitalStat[] = [
    { label: 'Bed Occupancy', value: '84%', change: 5, icon: BedIcon },
    { label: 'Outpatient Visits', value: '472', change: -2, icon: OutpatientIcon },
    { label: 'Scheduled Surgeries', value: '38', change: 10, icon: SurgeryIcon },
    { label: 'Critical Alerts', value: '12', change: -15, icon: AlertIcon },
];

export const mockBedOccupancyData = [
  { day: 'Mon', occupancy: 82 },
  { day: 'Tue', occupancy: 85 },
  { day: 'Wed', occupancy: 88 },
  { day: 'Thu', occupancy: 84 },
  { day: 'Fri', occupancy: 90 },
  { day: 'Sat', occupancy: 92 },
  { day: 'Sun', occupancy: 87 },
];

export const mockAdmissionData = [
  { day: 'Mon', admissions: 65, discharges: 58 },
  { day: 'Tue', admissions: 72, discharges: 65 },
  { day: 'Wed', admissions: 68, discharges: 70 },
  { day: 'Thu', admissions: 75, discharges: 62 },
  { day: 'Fri', admissions: 80, discharges: 75 },
  { day: 'Sat', admissions: 55, discharges: 60 },
  { day: 'Sun', admissions: 50, discharges: 52 },
];

export const mockAppointments: Appointment[] = [
    { id: 'A001', patientId: 'PID_DUMMY_1', patientName: 'David Chen', doctor: 'Dr. Evelyn Reed', department: 'Cardiology', date: '2024-07-28', time: '09:00 AM', symptoms: 'Chest pain', status: 'Confirmed' },
    { id: 'A002', patientId: 'PID_DUMMY_2', patientName: 'Maria Garcia', doctor: 'Dr. Ben Carter', department: 'Orthopedics', date: '2024-07-28', time: '09:30 AM', symptoms: 'Back pain', status: 'Confirmed' },
    { id: 'A003', patientId: 'PID_DUMMY_3', patientName: 'Robert Hill', doctor: 'Dr. Alice Johnson', department: 'Neurology', date: '2024-07-28', time: '10:00 AM', symptoms: 'Headache', status: 'PendingApproval' },
    { id: 'A004', patientId: 'PID_DUMMY_4', patientName: 'Linda Bell', doctor: 'Dr. Evelyn Reed', department: 'Cardiology', date: '2024-07-28', time: '10:15 AM', symptoms: 'Follow-up', status: 'Confirmed' },
    { id: 'A005', patientId: 'PID_DUMMY_5', patientName: 'James Green', doctor: 'Dr. Sam Wilson', department: 'Pediatrics', date: '2024-07-28', time: '11:00 AM', symptoms: 'Child vaccination', status: 'Cancelled' },
];

export const mockComplaintTickets: ComplaintTicket[] = [
    { id: 'T01', patientName: 'John Doe', submitted: '2 hours ago', subject: 'Long wait time at pharmacy', status: 'Open' },
    { id: 'T02', patientName: 'Jane Smith', submitted: '1 day ago', subject: 'Billing query on invoice #5678', status: 'In Progress' },
    { id: 'T03', patientName: 'Carlos Ray', submitted: '3 days ago', subject: 'Difficulty booking follow-up', status: 'Resolved' },
    { id: 'T04', patientName: 'Emily White', submitted: '4 hours ago', subject: 'Room temperature too cold', status: 'In Progress' },
];

export const mockPrescriptions: Prescription[] = [
    { id: 'RX001', patientName: 'Jane Smith', medication: 'Ceftriaxone IV', dosage: '1g daily', date: '2024-07-20', status: 'Filled' },
    { id: 'RX002', patientName: 'John Doe', medication: 'Aspirin', dosage: '81mg daily', date: '2024-07-21', status: 'Pending' },
    { id: 'RX003', patientName: 'Carlos Ray', medication: 'Ibuprofen', dosage: '600mg PRN', date: '2024-07-21', status: 'Pending' },
];

export const mockLabOrders: LabOrder[] = [
    { id: 'L001', patientName: 'John Doe', testName: 'Troponin I', ordered: '2024-07-21 08:00', status: 'Complete' },
    { id: 'L002', patientName: 'Jane Smith', testName: 'CBC with Differential', ordered: '2024-07-21 09:15', status: 'In Progress' },
    { id: 'L003', patientName: 'Emily White', testName: 'Urine Culture', ordered: '2024-07-21 10:30', status: 'Pending' },
];

export const mockBillItems: BillItem[] = [
    { id: 'B01', description: 'Emergency Room Visit', department: 'Emergency', amount: 450.00 },
    { id: 'B02', description: 'ECG - 12 Lead', department: 'Cardiology', amount: 125.50 },
    { id: 'B03', description: 'Troponin I Assay', department: 'Laboratory', amount: 75.00 },
    { id: 'B04', description: 'Cardiac Catheterization', department: 'Cardiology', amount: 8500.00 },
    { id: 'B05', description: 'Aspirin 81mg', department: 'Pharmacy', amount: 15.25 },
];

export const mockEmergencyCases: EmergencyCase[] = [
    { id: 'E01', patientName: 'Unknown MVA', complaint: 'Motor Vehicle Accident', eta: '5 mins', status: 'Incoming' },
    { id: 'E02', patientName: 'John Doe', complaint: 'Chest Pain', eta: 'Arrived', status: 'In ER' },
    { id: 'E03', patientName: 'Emily White', complaint: 'Altered Mental Status', eta: 'Arrived', status: 'Admitted' },
];

export const mockMLCases: MLCase[] = [
    { id: 'MLC001', patientName: 'Carlos Ray', incidentDate: '2024-07-20', type: 'Accident', status: 'Active' },
    { id: 'MLC002', patientName: 'Anonymous', incidentDate: '2024-07-18', type: 'Assault', status: 'Active' },
];

export const mockWardBeds: WardBed[] = [
    { id: 'W1-B101', ward: 'Cardiology', bedNumber: '101', patientName: 'John Doe', status: 'Occupied' },
    { id: 'W1-B102', ward: 'Cardiology', bedNumber: '102', patientName: null, status: 'Available' },
    { id: 'W2-B201', ward: 'General Medicine', bedNumber: '201', patientName: 'Jane Smith', status: 'Occupied' },
    { id: 'W2-B202', ward: 'General Medicine', bedNumber: '202', patientName: null, status: 'Cleaning' },
];

export const mockEquipment: Equipment[] = [
    { id: 'EQ01', name: 'Ventilator V-2000', location: 'ICU-1', status: 'Operational', nextMaint: '2024-08-15' },
    { id: 'EQ02', name: 'Defibrillator D-500', location: 'ER-2', status: 'Operational', nextMaint: '2024-09-01' },
    { id: 'EQ03', name: 'X-Ray Machine XR-1', location: 'Radiology', status: 'Maintenance', nextMaint: '2024-07-22' },
];

export const mockITTickets: ITTicket[] = [
    { id: 'IT01', user: 'Dr. Reed', department: 'Cardiology', issue: 'Cannot access PACS images.', priority: 'High', status: 'In Progress' },
    { id: 'IT02', user: 'Nurse Johnson', department: 'Gen Med', issue: 'Wi-Fi slow on Ward 2.', priority: 'Medium', status: 'New' },
    { id: 'IT03', user: 'Admin Clark', department: 'Billing', issue: 'Printer not working.', priority: 'Low', status: 'Resolved' },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
    { id: 'PO001', supplier: 'Medline', item: 'Sterile Gauze (Case)', quantity: 50, status: 'Shipped' },
    { id: 'PO002', supplier: 'Pfizer', item: 'Ceftriaxone Vials', quantity: 200, status: 'Pending' },
    { id: 'PO003', supplier: 'Office Supplies Inc.', item: 'Printer Paper (Ream)', quantity: 100, status: 'Received' },
];

export const mockQualityMetrics: QualityMetric[] = [
    { id: 'QM01', name: 'Patient Fall Rate', value: '0.2%', target: '< 0.5%', trend: 'stable' },
    { id: 'QM02', name: 'Medication Admin Errors', value: '0.05%', target: '< 0.1%', trend: 'down' },
    { id: 'QM03', name: 'Hand Hygiene Compliance', value: '98%', target: '> 95%', trend: 'up' },
];

export const generateInitialVitals = (): VitalSign[] => {
  const data: VitalSign[] = [];
  let time = new Date();
  time.setSeconds(time.getSeconds() - 40);

  for (let i = 0; i < 20; i++) {
    time.setSeconds(time.getSeconds() + 2);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      hr: 70 + Math.floor(Math.random() * 10 - 5),
      bp: 120 + Math.floor(Math.random() * 10 - 5),
      spo2: 98 + Math.floor(Math.random() * 3 - 1.5),
      temp: 37 + parseFloat((Math.random() * 0.5 - 0.25).toFixed(1)),
    });
  }
  return data;
};

export const generateNextVital = (lastVital: VitalSign): VitalSign => {
  const time = new Date();
  return {
    time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    hr: Math.max(50, Math.min(130, lastVital.hr + Math.floor(Math.random() * 6 - 3))),
    bp: Math.max(90, Math.min(180, lastVital.bp + Math.floor(Math.random() * 4 - 2))),
    spo2: Math.max(90, Math.min(100, lastVital.spo2 + Math.floor(Math.random() * 3 - 1))),
    temp: parseFloat(Math.max(36.0, Math.min(39.0, lastVital.temp + (Math.random() * 0.2 - 0.1))).toFixed(1)),
  };
};

export const mockDoctorSchedule = [
    { time: '08:00 AM', activity: 'Morning Rounds - Cardiology Ward' },
    { time: '10:00 AM', activity: 'Outpatient Clinic' },
    { time: '12:00 PM', activity: 'Case Review' },
    { time: '01:00 PM', activity: 'Cardiac Catheterization Lab' },
    { time: '04:00 PM', activity: 'Team Handoff' },
];

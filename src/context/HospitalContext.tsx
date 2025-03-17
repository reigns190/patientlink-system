
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";

// Define types for our data models
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  address: string;
  bloodGroup: string;
  medicalHistory?: string;
  registeredDate: string;
  lastVisit?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contact: string;
  email: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  patients: number;
  appointments: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  purpose: string;
}

export interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: {
    service: string;
    cost: number;
  }[];
}

export interface Inventory {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  supplierInfo?: string;
  lastRestocked: string;
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    contact: "555-123-4567",
    email: "john.smith@example.com",
    address: "123 Main St, Anytown",
    bloodGroup: "O+",
    medicalHistory: "Hypertension, Diabetes Type 2",
    registeredDate: "2022-05-15",
    lastVisit: "2023-08-10"
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    contact: "555-987-6543",
    email: "sarah.j@example.com",
    address: "456 Oak Ave, Somewhere",
    bloodGroup: "A-",
    registeredDate: "2022-06-22",
    lastVisit: "2023-09-05"
  },
  {
    id: "P003",
    name: "Michael Chen",
    age: 28,
    gender: "Male",
    contact: "555-456-7890",
    email: "m.chen@example.com",
    address: "789 Pine Rd, Elsewhere",
    bloodGroup: "B+",
    medicalHistory: "Asthma",
    registeredDate: "2022-07-10",
    lastVisit: "2023-08-25"
  },
  {
    id: "P004",
    name: "Emily Davis",
    age: 54,
    gender: "Female",
    contact: "555-789-0123",
    email: "emily.d@example.com",
    address: "101 Cedar Ln, Nowhere",
    bloodGroup: "AB+",
    medicalHistory: "Arthritis",
    registeredDate: "2022-04-30",
    lastVisit: "2023-09-12"
  },
  {
    id: "P005",
    name: "Robert Wilson",
    age: 67,
    gender: "Male",
    contact: "555-234-5678",
    email: "r.wilson@example.com",
    address: "222 Maple Dr, Anywhere",
    bloodGroup: "O-",
    medicalHistory: "Heart Disease, High Cholesterol",
    registeredDate: "2022-03-15",
    lastVisit: "2023-08-30"
  }
];

const mockDoctors: Doctor[] = [
  {
    id: "D001",
    name: "Dr. Elizabeth Taylor",
    specialization: "Cardiology",
    contact: "555-111-2222",
    email: "dr.taylor@hospital.com",
    schedule: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "13:00" }
    ],
    patients: 48,
    appointments: 12
  },
  {
    id: "D002",
    name: "Dr. James Rodriguez",
    specialization: "Pediatrics",
    contact: "555-333-4444",
    email: "dr.rodriguez@hospital.com",
    schedule: [
      { day: "Monday", startTime: "08:00", endTime: "16:00" },
      { day: "Tuesday", startTime: "08:00", endTime: "16:00" },
      { day: "Thursday", startTime: "08:00", endTime: "16:00" }
    ],
    patients: 65,
    appointments: 18
  },
  {
    id: "D003",
    name: "Dr. Susan Kim",
    specialization: "Neurology",
    contact: "555-555-6666",
    email: "dr.kim@hospital.com",
    schedule: [
      { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
      { day: "Wednesday", startTime: "10:00", endTime: "18:00" },
      { day: "Friday", startTime: "10:00", endTime: "18:00" }
    ],
    patients: 32,
    appointments: 9
  },
  {
    id: "D004",
    name: "Dr. David Patel",
    specialization: "Orthopedics",
    contact: "555-777-8888",
    email: "dr.patel@hospital.com",
    schedule: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "17:00" }
    ],
    patients: 54,
    appointments: 15
  }
];

const mockAppointments: Appointment[] = [
  {
    id: "A001",
    patientId: "P001",
    patientName: "John Smith",
    doctorId: "D001",
    doctorName: "Dr. Elizabeth Taylor",
    date: "2023-09-22",
    time: "10:30",
    status: "scheduled",
    purpose: "Follow-up for hypertension medication"
  },
  {
    id: "A002",
    patientId: "P003",
    patientName: "Michael Chen",
    doctorId: "D002",
    doctorName: "Dr. James Rodriguez",
    date: "2023-09-23",
    time: "09:15",
    status: "scheduled",
    purpose: "Annual check-up"
  },
  {
    id: "A003",
    patientId: "P002",
    patientName: "Sarah Johnson",
    doctorId: "D003",
    doctorName: "Dr. Susan Kim",
    date: "2023-09-20",
    time: "14:00",
    status: "completed",
    purpose: "Headache and dizziness evaluation"
  },
  {
    id: "A004",
    patientId: "P004",
    patientName: "Emily Davis",
    doctorId: "D004",
    doctorName: "Dr. David Patel",
    date: "2023-09-21",
    time: "11:45",
    status: "completed",
    purpose: "Knee pain consultation"
  },
  {
    id: "A005",
    patientId: "P005",
    patientName: "Robert Wilson",
    doctorId: "D001",
    doctorName: "Dr. Elizabeth Taylor",
    date: "2023-09-24",
    time: "15:30",
    status: "scheduled",
    purpose: "Heart check-up"
  }
];

const mockBills: Bill[] = [
  {
    id: "B001",
    patientId: "P001",
    patientName: "John Smith",
    date: "2023-09-10",
    amount: 350.00,
    status: "paid",
    items: [
      { service: "Consultation", cost: 150.00 },
      { service: "Blood Pressure Test", cost: 50.00 },
      { service: "Blood Sugar Test", cost: 75.00 },
      { service: "Medication", cost: 75.00 }
    ]
  },
  {
    id: "B002",
    patientId: "P003",
    patientName: "Michael Chen",
    date: "2023-08-25",
    amount: 200.00,
    status: "paid",
    items: [
      { service: "Consultation", cost: 150.00 },
      { service: "Lung Function Test", cost: 50.00 }
    ]
  },
  {
    id: "B003",
    patientId: "P002",
    patientName: "Sarah Johnson",
    date: "2023-09-20",
    amount: 475.00,
    status: "pending",
    items: [
      { service: "Consultation", cost: 150.00 },
      { service: "MRI Scan", cost: 325.00 }
    ]
  },
  {
    id: "B004",
    patientId: "P004",
    patientName: "Emily Davis",
    date: "2023-09-21",
    amount: 525.00,
    status: "pending",
    items: [
      { service: "Consultation", cost: 150.00 },
      { service: "X-Ray", cost: 200.00 },
      { service: "Physical Therapy", cost: 175.00 }
    ]
  }
];

const mockInventory: Inventory[] = [
  {
    id: "I001",
    name: "Disposable Syringes",
    category: "Equipment",
    quantity: 500,
    unit: "pcs",
    supplierInfo: "MedSupply Inc.",
    lastRestocked: "2023-09-01"
  },
  {
    id: "I002",
    name: "Paracetamol",
    category: "Medication",
    quantity: 200,
    unit: "bottles",
    supplierInfo: "PharmaCorp Ltd.",
    lastRestocked: "2023-08-25"
  },
  {
    id: "I003",
    name: "Examination Gloves",
    category: "Equipment",
    quantity: 1000,
    unit: "pcs",
    supplierInfo: "MedSupply Inc.",
    lastRestocked: "2023-09-05"
  },
  {
    id: "I004",
    name: "Antibiotics",
    category: "Medication",
    quantity: 150,
    unit: "bottles",
    supplierInfo: "PharmaCorp Ltd.",
    lastRestocked: "2023-08-30"
  }
];

// Create context with default values
interface HospitalContextType {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  bills: Bill[];
  inventory: Inventory[];
  addPatient: (patient: Omit<Patient, 'id' | 'registeredDate'>) => void;
  updatePatient: (patient: Patient) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  cancelAppointment: (id: string) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBillStatus: (id: string, status: Bill['status']) => void;
  searchPatients: (query: string) => Patient[];
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [inventory, setInventory] = useState<Inventory[]>(mockInventory);

  // Function to add a new patient
  const addPatient = (patientData: Omit<Patient, 'id' | 'registeredDate'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `P${(patients.length + 1).toString().padStart(3, '0')}`,
      registeredDate: new Date().toISOString().split('T')[0]
    };
    
    setPatients([...patients, newPatient]);
    toast.success("Patient added successfully");
  };

  // Function to update an existing patient
  const updatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(patient => 
      patient.id === updatedPatient.id ? updatedPatient : patient
    ));
    toast.success("Patient updated successfully");
  };

  // Function to add a new appointment
  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `A${(appointments.length + 1).toString().padStart(3, '0')}`
    };
    
    setAppointments([...appointments, newAppointment]);
    toast.success("Appointment scheduled successfully");
  };

  // Function to update an existing appointment
  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === updatedAppointment.id ? updatedAppointment : appointment
    ));
    toast.success("Appointment updated successfully");
  };

  // Function to cancel an appointment
  const cancelAppointment = (id: string) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
    ));
    toast.success("Appointment cancelled successfully");
  };

  // Function to add a new bill
  const addBill = (billData: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...billData,
      id: `B${(bills.length + 1).toString().padStart(3, '0')}`
    };
    
    setBills([...bills, newBill]);
    toast.success("Bill created successfully");
  };

  // Function to update bill status
  const updateBillStatus = (id: string, status: Bill['status']) => {
    setBills(bills.map(bill => 
      bill.id === id ? { ...bill, status } : bill
    ));
    toast.success(`Bill marked as ${status}`);
  };

  // Function to search for patients
  const searchPatients = (query: string): Patient[] => {
    const lowercaseQuery = query.toLowerCase();
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(lowercaseQuery) || 
      patient.id.toLowerCase().includes(lowercaseQuery) ||
      patient.contact.includes(query) ||
      patient.email.toLowerCase().includes(lowercaseQuery)
    );
  };

  const contextValue: HospitalContextType = {
    patients,
    doctors,
    appointments,
    bills,
    inventory,
    addPatient,
    updatePatient,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    addBill,
    updateBillStatus,
    searchPatients
  };

  return (
    <HospitalContext.Provider value={contextValue}>
      {children}
    </HospitalContext.Provider>
  );
};

// Custom hook to use the context
export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};

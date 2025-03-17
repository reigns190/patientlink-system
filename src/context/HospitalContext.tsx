import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

// API base URL - Updated to point to your Tomcat server
const API_BASE_URL = "http://localhost:8080/hospital-api/api";

// Context type definition
interface HospitalContextType {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  bills: Bill[];
  inventory: Inventory[];
  loading: {
    patients: boolean;
    doctors: boolean;
    appointments: boolean;
    bills: boolean;
    inventory: boolean;
  };
  error: string | null;
  addPatient: (patient: Omit<Patient, 'id' | 'registeredDate'>) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (appointment: Appointment) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  addBill: (bill: Omit<Bill, 'id'>) => Promise<void>;
  updateBillStatus: (id: string, status: Bill['status']) => Promise<void>;
  searchPatients: (query: string) => Promise<Patient[]>;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState({
    patients: true,
    doctors: true,
    appointments: true,
    bills: true,
    inventory: true
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patients
        setLoading(prev => ({ ...prev, patients: true }));
        const patientsResponse = await fetch(`${API_BASE_URL}/patients`);
        if (!patientsResponse.ok) throw new Error('Failed to fetch patients');
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);
        setLoading(prev => ({ ...prev, patients: false }));
        
        // Fetch doctors
        setLoading(prev => ({ ...prev, doctors: true }));
        const doctorsResponse = await fetch(`${API_BASE_URL}/doctors`);
        if (!doctorsResponse.ok) throw new Error('Failed to fetch doctors');
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData);
        setLoading(prev => ({ ...prev, doctors: false }));
        
        // Fetch appointments
        setLoading(prev => ({ ...prev, appointments: true }));
        const appointmentsResponse = await fetch(`${API_BASE_URL}/appointments`);
        if (!appointmentsResponse.ok) throw new Error('Failed to fetch appointments');
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
        setLoading(prev => ({ ...prev, appointments: false }));
        
        // Fetch bills
        setLoading(prev => ({ ...prev, bills: true }));
        const billsResponse = await fetch(`${API_BASE_URL}/bills`);
        if (!billsResponse.ok) throw new Error('Failed to fetch bills');
        const billsData = await billsResponse.json();
        setBills(billsData);
        setLoading(prev => ({ ...prev, bills: false }));
        
        // Fetch inventory
        setLoading(prev => ({ ...prev, inventory: true }));
        const inventoryResponse = await fetch(`${API_BASE_URL}/inventory`);
        if (!inventoryResponse.ok) throw new Error('Failed to fetch inventory');
        const inventoryData = await inventoryResponse.json();
        setInventory(inventoryData);
        setLoading(prev => ({ ...prev, inventory: false }));
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        // If API fails, use mock data (for development only)
        import('./mockData').then(({ mockPatients, mockDoctors, mockAppointments, mockBills, mockInventory }) => {
          setPatients(mockPatients);
          setDoctors(mockDoctors);
          setAppointments(mockAppointments);
          setBills(mockBills);
          setInventory(mockInventory);
          setLoading({
            patients: false,
            doctors: false,
            appointments: false,
            bills: false,
            inventory: false
          });
          toast.error("Using mock data - API connection failed");
        });
      }
    };
    
    fetchData();
  }, []);

  // Function to add a new patient
  const addPatient = async (patientData: Omit<Patient, 'id' | 'registeredDate'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      if (!response.ok) throw new Error('Failed to add patient');
      
      const newPatient = await response.json();
      setPatients([...patients, newPatient]);
      toast.success("Patient added successfully");
      return Promise.resolve();
    } catch (err) {
      console.error("Error adding patient:", err);
      toast.error(err instanceof Error ? err.message : 'Failed to add patient');
      return Promise.reject(err);
    }
  };

  // Function to update an existing patient
  const updatePatient = async (updatedPatient: Patient) => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${updatedPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPatient),
      });
      
      if (!response.ok) throw new Error('Failed to update patient');
      
      setPatients(patients.map(patient => 
        patient.id === updatedPatient.id ? updatedPatient : patient
      ));
      toast.success("Patient updated successfully");
      return Promise.resolve();
    } catch (err) {
      console.error("Error updating patient:", err);
      toast.error(err instanceof Error ? err.message : 'Failed to update patient');
      return Promise.reject(err);
    }
  };

  // Function to add a new appointment
  const addAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!response.ok) throw new Error('Failed to add appointment');
      
      const newAppointment = await response.json();
      setAppointments([...appointments, newAppointment]);
      toast.success("Appointment scheduled successfully");
      return Promise.resolve();
    } catch (err) {
      console.error("Error adding appointment:", err);
      toast.error(err instanceof Error ? err.message : 'Failed to schedule appointment');
      return Promise.reject(err);
    }
  };

  // Function to update an existing appointment
  const updateAppointment = async (updatedAppointment: Appointment) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${updatedAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAppointment),
      });
      
      if (!response.ok) throw new Error('Failed to update appointment');
      
      setAppointments(appointments.map(appointment => 
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      ));
      toast.success("Appointment updated successfully");
      return Promise.resolve();
    } catch (err) {
      console.error("Error updating appointment:", err);
      toast.error(err instanceof Error ? err.message : 'Failed to update appointment');
      return Promise.reject(err);
    }
  };

  // Function to cancel an appointment
  const cancelAppointment = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
        method: 'PUT',
      });
      
      if (!response.ok) throw new Error('Failed to cancel appointment');
      
      setAppointments(appointments.map(appointment => 
        appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
      ));
      toast.success("Appointment cancelled successfully");
      return Promise.resolve();
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      toast.error(err instanceof Error ? err.message : 'Failed to cancel appointment');
      return Promise.reject(err);
    }
  };

  // Function to add a new bill
  const addBill = async (billData: Omit<Bill, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData),
      });
      
      if (!response.ok) throw new Error('Failed to add bill');
      
      const newBill = await response.json();
      setBills([...bills, newBill]);
      toast.success("Bill created successfully");
      return Promise.resolve();
    } catch (err) {
      console.error("Error adding bill:", err);
      toast.error(err instanceof Error ? err.message : 'Failed to create bill');
      return Promise.reject(err);
    }
  };

  // Function to update bill status
  const updateBillStatus = async (id: string, status: Bill['status']) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bills/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error('Failed to update bill status');
      
      setBills(bills.map(bill => 
        bill.id === id ? { ...bill, status } : bill
      ));
      toast.success(`Bill marked as ${status}`);
      return Promise.resolve();
    } catch (err) {
      console.error("Error updating bill status:", err);
      toast.error(err instanceof Error ? err.message : 'Failed to update bill status');
      return Promise.reject(err);
    }
  };

  // Function to search for patients
  const searchPatients = async (query: string): Promise<Patient[]> => {
    try {
      if (!query.trim()) return patients;
      
      const response = await fetch(`${API_BASE_URL}/patients/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search patients');
      
      const searchResults = await response.json();
      return searchResults;
    } catch (err) {
      console.error("Error searching patients:", err);
      
      // Fallback to client-side search if API fails
      const lowercaseQuery = query.toLowerCase();
      return patients.filter(patient => 
        patient.name.toLowerCase().includes(lowercaseQuery) || 
        patient.id.toLowerCase().includes(lowercaseQuery) ||
        patient.contact.includes(query) ||
        patient.email.toLowerCase().includes(lowercaseQuery)
      );
    }
  };

  const contextValue: HospitalContextType = {
    patients,
    doctors,
    appointments,
    bills,
    inventory,
    loading,
    error,
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

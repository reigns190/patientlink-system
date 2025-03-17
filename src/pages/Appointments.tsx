
import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Search, 
  Plus,
  Check,
  X,
  FileEdit,
  Clock
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useHospital, Appointment } from "@/context/HospitalContext";
import { cn } from "@/lib/utils";

const AppointmentDialog = ({
  appointment,
  isOpen,
  onOpenChange,
  onSave,
}: {
  appointment?: Appointment;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (appointment: Omit<Appointment, "id">) => void;
}) => {
  const { patients, doctors } = useHospital();
  
  const [formData, setFormData] = useState<Omit<Appointment, "id">>({
    patientId: appointment?.patientId || "",
    patientName: appointment?.patientName || "",
    doctorId: appointment?.doctorId || "",
    doctorName: appointment?.doctorName || "",
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || "09:00",
    status: appointment?.status || "scheduled",
    purpose: appointment?.purpose || "",
  });

  const handlePatientChange = (patientId: string) => {
    const selectedPatient = patients.find(p => p.id === patientId);
    setFormData(prev => ({
      ...prev,
      patientId,
      patientName: selectedPatient?.name || "",
    }));
  };

  const handleDoctorChange = (doctorId: string) => {
    const selectedDoctor = doctors.find(d => d.id === doctorId);
    setFormData(prev => ({
      ...prev,
      doctorId,
      doctorName: selectedDoctor?.name || "",
    }));
  };

  const handleChange = (
    key: keyof Omit<Appointment, "id" | "patientName" | "doctorName">,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{appointment ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
            <DialogDescription>
              {appointment
                ? "Update the appointment details."
                : "Create a new appointment for a patient."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select 
                value={formData.patientId} 
                onValueChange={handlePatientChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select 
                value={formData.doctorId} 
                onValueChange={handleDoctorChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="flex">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="flex">
                  <Clock className="mr-2 h-4 w-4 opacity-50" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            {appointment && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleChange("status", value as Appointment["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose / Notes</Label>
              <textarea
                id="purpose"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.purpose}
                onChange={(e) => handleChange("purpose", e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {appointment ? "Update Appointment" : "Schedule Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Appointments = () => {
  const { appointments, addAppointment, updateAppointment, cancelAppointment } = useHospital();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Appointment["status"] | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined);
  
  // Filter appointments based on search query and status filter
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleAddAppointment = () => {
    setSelectedAppointment(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };
  
  const handleSaveAppointment = (appointmentData: Omit<Appointment, "id">) => {
    if (selectedAppointment) {
      updateAppointment({
        ...selectedAppointment,
        ...appointmentData,
      });
    } else {
      addAppointment(appointmentData);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500">Manage patient appointments</p>
        </div>
        <Button onClick={handleAddAppointment}>
          <Plus className="h-5 w-5 mr-2" />
          New Appointment
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>Appointment Schedule</CardTitle>
              <CardDescription>
                View and manage all patient appointments
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appointments</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.id}</TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>
                      {new Date(appointment.date).toLocaleDateString()}, {appointment.time}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {appointment.purpose}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          appointment.status === "scheduled" && "bg-blue-100 text-blue-700",
                          appointment.status === "completed" && "bg-green-100 text-green-700",
                          appointment.status === "cancelled" && "bg-red-100 text-red-700"
                        )}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {appointment.status === "scheduled" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditAppointment(appointment)}
                              title="Edit"
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                updateAppointment({
                                  ...appointment,
                                  status: "completed"
                                });
                              }}
                              title="Mark as completed"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => cancelAppointment(appointment.id)}
                              title="Cancel"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-gray-500">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <AppointmentDialog
        appointment={selectedAppointment}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveAppointment}
      />
    </div>
  );
};

export default Appointments;

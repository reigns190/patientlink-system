
import { 
  Users, 
  Calendar, 
  Heart, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Activity,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHospital } from "@/context/HospitalContext";
import { cn } from "@/lib/utils";

export const Dashboard = () => {
  const { patients, doctors, appointments, bills } = useHospital();
  
  // Calculate stats
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingRevenue = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);
  
  // Recent appointments for the table
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome to the Hospital Management System</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{totalPatients}</div>
              <div className="p-2 bg-blue-50 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="text-gray-500 ml-1">since last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{totalDoctors}</div>
              <div className="p-2 bg-hospital-50 rounded-full">
                <Heart className="h-6 w-6 text-hospital-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">5%</span>
              <span className="text-gray-500 ml-1">since last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <div className="p-2 bg-indigo-50 rounded-full">
                <Calendar className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="flex items-center mr-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                <span>{completedAppointments} completed</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                <span>{scheduledAppointments} scheduled</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <div className="p-2 bg-green-50 rounded-full">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-amber-500 font-medium">${pendingRevenue.toFixed(2)}</span>
              <span className="text-gray-500 ml-1">pending</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Hospital Stats</CardTitle>
            <CardDescription>
              Overall hospital performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-hospital-500 mr-2" />
                  <span className="text-sm font-medium">Bed Occupancy Rate</span>
                </div>
                <div className="text-sm font-medium">73%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-sm font-medium">Avg. Wait Time</span>
                </div>
                <div className="text-sm font-medium">18 min</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Treatment Success Rate</span>
                </div>
                <div className="text-sm font-medium">92%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium">Missed Appointments</span>
                </div>
                <div className="text-sm font-medium">7%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>
              Latest scheduled and completed appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.patientName}</TableCell>
                      <TableCell>{appointment.doctorName}</TableCell>
                      <TableCell>
                        {new Date(appointment.date).toLocaleDateString()}, {appointment.time}
                      </TableCell>
                      <TableCell>
                        <span 
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            appointment.status === 'scheduled' && "bg-blue-100 text-blue-700",
                            appointment.status === 'completed' && "bg-green-100 text-green-700",
                            appointment.status === 'cancelled' && "bg-red-100 text-red-700",
                          )}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

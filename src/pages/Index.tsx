
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hospital Management System</h1>
        <p className="text-xl text-gray-600">A comprehensive solution for healthcare providers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>View system overview and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate("/")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <CardDescription>Manage patient records and information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate("/patients")}>
              Manage Patients
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Schedule and track patient appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate("/appointments")}>
              View Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

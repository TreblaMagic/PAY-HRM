
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { getAllEmployees } from "@/services/employeeService";
import { PayrollSummary } from "@/components/payroll/PayrollSummary";
import { PayrollTable } from "@/components/payroll/PayrollTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Payroll() {
  const { user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const employees = getAllEmployees();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <DashboardLayout title="Payroll Management">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee salaries, bonuses and payment status</p>
        </div>

        <div className="mb-6">
          <div className="w-full md:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <PayrollSummary employees={filteredEmployees} />

        {/* Employee Payroll Table */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Employee Salary Overview</h2>
          <PayrollTable employees={filteredEmployees} />
        </div>
      </div>
    </DashboardLayout>
  );
}

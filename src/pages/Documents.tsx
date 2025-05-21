import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { DocumentsTable } from '@/components/documents/DocumentsTable';
import { DocumentsFilter } from '@/components/documents/DocumentsFilter';
import { getAllEmployees } from '@/services/employeeService';
import { getEmployeeDocuments } from '@/services/documentService';
import { Employee } from '@/types/employee';
import { Document, DocumentCategory } from '@/types/document';
import { User } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Documents() {
  const { user, loading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const allEmployees = getAllEmployees();
    setEmployees(allEmployees);
    
    // If there are employees but none selected, select the first one
    if (allEmployees.length > 0 && !selectedEmployeeId) {
      setSelectedEmployeeId(allEmployees[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      const employeeDocs = getEmployeeDocuments(selectedEmployeeId);
      setDocuments(employeeDocs);
    } else {
      setDocuments([]);
    }
  }, [selectedEmployeeId]);

  const refreshDocuments = () => {
    if (selectedEmployeeId) {
      setDocuments(getEmployeeDocuments(selectedEmployeeId));
    }
  };

  // Filter documents based on search and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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

  return (
    <DashboardLayout title="Documents" activePage="documents">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Employee Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Select Employee</h2>
            <Select
              value={selectedEmployeeId || ""}
              onValueChange={(value) => setSelectedEmployeeId(value)}
            >
              <SelectTrigger className="w-full md:w-72">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedEmployeeId && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Document Upload Section */}
              <div className="lg:col-span-1">
                <DocumentUpload 
                  employeeId={selectedEmployeeId}
                  onUploadComplete={refreshDocuments}
                />
              </div>
              
              {/* Documents List Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Employee Documents</h2>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {filteredDocuments.length} document(s)
                    </span>
                  </div>
                  
                  <DocumentsFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                  
                  <DocumentsTable 
                    documents={filteredDocuments}
                    onDocumentDeleted={refreshDocuments}
                  />
                </div>
              </div>
            </div>
          )}
          
          {!selectedEmployeeId && (
            <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No Employee Selected</h2>
              <p className="text-gray-500 mb-6">
                Please select an employee to manage their documents
              </p>
              <Select
                value={selectedEmployeeId || ""}
                onValueChange={(value) => setSelectedEmployeeId(value)}
              >
                <SelectTrigger className="w-full max-w-sm mx-auto">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

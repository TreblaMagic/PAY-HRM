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
import { Spinner } from '@/components/ui/spinner';

export default function Documents() {
  const { user, loading: authLoading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getAllEmployees();
        console.log('Fetched employees:', fetchedEmployees); // Debug log
        
        if (Array.isArray(fetchedEmployees)) {
          setEmployees(fetchedEmployees);
          
          // If there are employees but none selected, select the first one
          if (fetchedEmployees.length > 0 && !selectedEmployeeId) {
            setSelectedEmployeeId(fetchedEmployees[0].id);
          }
        } else {
          console.error('Fetched employees is not an array:', fetchedEmployees);
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (selectedEmployeeId) {
        try {
          const employeeDocs = await getEmployeeDocuments(selectedEmployeeId);
          console.log('Fetched documents:', employeeDocs); // Debug log
          
          if (Array.isArray(employeeDocs)) {
            setDocuments(employeeDocs);
          } else {
            console.error('Fetched documents is not an array:', employeeDocs);
            setDocuments([]);
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
          setDocuments([]);
        }
      } else {
        setDocuments([]);
      }
    };

    fetchDocuments();
  }, [selectedEmployeeId]);

  const refreshDocuments = async () => {
    if (selectedEmployeeId) {
      try {
        const employeeDocs = await getEmployeeDocuments(selectedEmployeeId);
        if (Array.isArray(employeeDocs)) {
          setDocuments(employeeDocs);
        } else {
          console.error('Refreshed documents is not an array:', employeeDocs);
          setDocuments([]);
        }
      } catch (error) {
        console.error('Error refreshing documents:', error);
        setDocuments([]);
      }
    }
  };

  // Filter documents based on search and category
  const filteredDocuments = Array.isArray(documents) ? documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) : [];

  if (authLoading || isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner />
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
                {Array.isArray(employees) && employees.map((employee) => (
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
                  {Array.isArray(employees) && employees.map((employee) => (
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

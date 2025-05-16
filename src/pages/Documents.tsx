
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentsSidebar } from '@/components/documents/DocumentsSidebar';
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
import { Search, Bell, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

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
    <div className="min-h-screen bg-gray-50 flex">
      <DocumentsSidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
              />
            </div>
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="relative">
              <MessageSquare className="h-6 w-6 text-gray-500 cursor-pointer" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center">
              <Link to="/profile" className="flex items-center space-x-2">
                <div className="bg-gray-200 rounded-full p-1">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700">{user?.user_metadata?.display_name || 'John Doe'}</p>
                  <p className="text-gray-500 text-xs">HR Manager</p>
                </div>
                <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Breadcrumbs */}
        <div className="bg-white px-8 py-4 text-sm flex items-center space-x-2">
          <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">Documents</span>
        </div>
        
        {/* Page Content */}
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
      </div>
    </div>
  );
}

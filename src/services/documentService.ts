
import { Document, DocumentCategory } from "../types/document";

// Simulate database with localStorage
const STORAGE_KEY = "employee_documents";

// Initialize localStorage if empty
const initializeDocuments = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all documents
export const getAllDocuments = (): Document[] => {
  initializeDocuments();
  const documents = localStorage.getItem(STORAGE_KEY);
  return documents ? JSON.parse(documents) : [];
};

// Get documents for specific employee
export const getEmployeeDocuments = (employeeId: string): Document[] => {
  const documents = getAllDocuments();
  return documents.filter(doc => doc.employeeId === employeeId);
};

// Add document
export const addDocument = (document: Omit<Document, "id">): Document => {
  const documents = getAllDocuments();
  const newDocument = {
    ...document,
    id: Date.now().toString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...documents, newDocument]));
  return newDocument;
};

// Delete document
export const deleteDocument = (id: string): boolean => {
  const documents = getAllDocuments();
  const filteredDocuments = documents.filter(doc => doc.id !== id);
  
  if (filteredDocuments.length === documents.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDocuments));
  return true;
};

// Mock file upload (in a real app, this would interact with a storage service)
export const uploadDocumentFile = async (file: File, employeeId: string, category: DocumentCategory, title: string): Promise<Document> => {
  // In a real app, you would upload the file to a server or cloud storage here
  // For now, we'll create a data URL to simulate the stored file
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newDocument: Omit<Document, "id"> = {
        employeeId,
        category,
        title: title || file.name,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        fileUrl: reader.result as string,
      };
      
      resolve(addDocument(newDocument));
    };
    reader.readAsDataURL(file);
  });
};

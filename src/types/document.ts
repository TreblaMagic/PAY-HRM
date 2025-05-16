
export type Document = {
  id: string;
  employeeId: string;
  title: string;
  category: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  uploadDate: string;
  fileUrl: string;
};

export type DocumentCategory = 
  | "Contract" 
  | "ID" 
  | "Certificate" 
  | "Resume" 
  | "Medical" 
  | "KYC" 
  | "Other";

export const documentCategories: DocumentCategory[] = [
  "Contract",
  "ID",
  "Certificate",
  "Resume",
  "Medical",
  "KYC",
  "Other"
];

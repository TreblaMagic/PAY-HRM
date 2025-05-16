
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { Document } from "@/types/document";
import { toast } from "@/hooks/use-toast";
import { deleteDocument } from "@/services/documentService";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDistance } from "date-fns";

interface DocumentsTableProps {
  documents: Document[];
  onDocumentDeleted: () => void;
}

export function DocumentsTable({ documents, onDocumentDeleted }: DocumentsTableProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleDeleteClick = (document: Document) => {
    setSelectedDocument(document);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (selectedDocument) {
      const success = deleteDocument(selectedDocument.id);
      
      if (success) {
        toast({
          title: "Success",
          description: "Document deleted successfully",
        });
        onDocumentDeleted();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete document",
          variant: "destructive",
        });
      }
    }
    setShowDeleteDialog(false);
  };

  const handleDownload = (doc: Document) => {
    // For data URLs, we can create a link and click it to download
    const link = window.document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.fileName;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload documents to see them listed here
        </p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>File Type</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.title}</TableCell>
              <TableCell>{doc.category}</TableCell>
              <TableCell>{doc.fileType.split('/')[1]?.toUpperCase() || doc.fileType}</TableCell>
              <TableCell>
                {formatDistance(new Date(doc.uploadDate), new Date(), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClick(doc)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document
              "{selectedDocument?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

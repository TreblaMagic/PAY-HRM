
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserWithRole } from '@/types/role';
import { deleteUser } from '@/services/roleService';
import { useToast } from '@/hooks/use-toast';

interface UserDeleteDialogProps {
  user: UserWithRole;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({ user, open, onClose, onDelete }) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteUser(user.id);
      toast({
        title: 'User deleted',
        description: `User ${user.email} has been deleted.`,
      });
      onDelete();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the user <strong>{user.email}</strong> and remove all of their data.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => { 
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

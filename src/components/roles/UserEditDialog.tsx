
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { UserWithRole, UserRole } from '@/types/role';
import { updateUserRole } from '@/services/roleService';
import { useToast } from '@/hooks/use-toast';

interface UserEditDialogProps {
  user: UserWithRole;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface FormValues {
  username: string;
  role: UserRole;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({ user, open, onClose, onSave }) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      username: user.username,
      role: user.role
    }
  });
  
  React.useEffect(() => {
    setValue('username', user.username);
    setValue('role', user.role);
  }, [user, setValue]);
  
  const selectedRole = watch('role');
  
  const onSubmit = async (data: FormValues) => {
    try {
      await updateUserRole(user.id, data.role, data.username);
      toast({
        title: 'User updated',
        description: `User ${user.email} has been updated.`,
      });
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to update user.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" value={user.email} disabled className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                {...register("username", { required: "Username is required" })}
                className="col-span-3"
              />
              {errors.username && (
                <p className="text-destructive text-sm col-span-4 text-right">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                defaultValue={user.role}
                onValueChange={(value) => setValue('role', value as UserRole)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-4 mt-2">
              <h4 className="font-medium mb-2">Pages this user can access:</h4>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                {selectedRole === 'HR' && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>Dashboard</li>
                    <li>Employees</li>
                    <li>Attendance</li>
                    <li>Leave Management</li>
                    <li>Documents</li>
                  </ul>
                )}
                
                {selectedRole === 'Finance' && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>Dashboard</li>
                    <li>Payroll</li>
                    <li>ISP</li>
                    <li>Documents</li>
                  </ul>
                )}
                
                {selectedRole === 'IT' && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>All pages (Full access)</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

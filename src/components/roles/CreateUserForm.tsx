import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types/role';
import { createUser } from '@/services/roleService';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["HR", "Finance", "IT", "Agent"] as const),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateUserFormProps {
  onUserCreated: () => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onUserCreated }) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: 'HR'
    }
  });
  
  const selectedRole = watch('role');
  
  const onSubmit = async (data: FormValues) => {
    try {
      await createUser(data.email, data.password, data.username, data.role as UserRole);
      toast({
        title: 'User created',
        description: `User ${data.email} has been created with the role of ${data.role}.`,
      });
      reset();
      onUserCreated();
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="johndoe" 
                {...register('username')}
              />
              {errors.username && (
                <p className="text-destructive text-sm">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                {...register('email')}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...register('password')}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                defaultValue="HR"
                onValueChange={(value) => setValue('role', value as UserRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-destructive text-sm">{errors.role.message}</p>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md text-sm mt-4">
            <h4 className="font-medium mb-2">Pages this user will access:</h4>
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
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

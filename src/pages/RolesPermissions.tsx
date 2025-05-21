import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { RolesSidebar } from '@/components/roles/RolesSidebar';
import { CreateUserForm } from '@/components/roles/CreateUserForm';
import { UserTable } from '@/components/roles/UserTable';
import { UserWithRole } from '@/types/role';
import { fetchUsers } from '@/services/roleService';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from '@/components/ui/spinner';
import { RoleDebug } from '@/components/roles/RoleDebug';

const RolesPermissionsPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  
  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await fetchUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  return (
    <DashboardLayout title="Roles & Permissions" activePage="roles-permissions">
      <div className="container mx-auto py-6">
        <div className="grid gap-6">
          {/* <RoleDebug /> */}
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="create">Create User</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">Users</h3>
                    <p className="text-sm text-gray-500">Manage users and their role-based permissions</p>
                  </div>
                  <Separator className="my-4" />
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Spinner className="h-8 w-8" />
                    </div>
                  ) : (
                    <UserTable users={users} onUserUpdated={loadUsers} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="create" className="mt-6">
              <CreateUserForm onUserCreated={loadUsers} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RolesPermissionsPage;

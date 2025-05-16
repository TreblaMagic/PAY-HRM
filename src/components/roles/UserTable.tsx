
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { UserWithRole } from '@/types/role';
import { UserEditDialog } from './UserEditDialog';
import { UserDeleteDialog } from './UserDeleteDialog';
import { formatDistanceToNow } from 'date-fns';

interface UserTableProps {
  users: UserWithRole[];
  onUserUpdated: () => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onUserUpdated }) => {
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserWithRole | null>(null);
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'IT' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'HR' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeletingUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {editingUser && (
        <UserEditDialog 
          user={editingUser} 
          open={!!editingUser} 
          onClose={() => setEditingUser(null)}
          onSave={onUserUpdated}
        />
      )}
      
      {deletingUser && (
        <UserDeleteDialog
          user={deletingUser}
          open={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onDelete={onUserUpdated}
        />
      )}
    </>
  );
};

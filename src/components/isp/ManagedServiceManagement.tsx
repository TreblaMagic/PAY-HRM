import React, { useState } from 'react';
import { ManagedService } from '@/types/isp';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Pencil, Plus } from 'lucide-react';

interface ManagedServiceManagementProps {
  managedServices: ManagedService[];
  onAdd: (service: Omit<ManagedService, 'id'>) => void;
  onUpdate: (service: ManagedService) => void;
  onDelete: (id: string) => void;
}

export const ManagedServiceManagement: React.FC<ManagedServiceManagementProps> = ({ managedServices, onAdd, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<{ name: string; price: number; description: string }>({ name: '', price: 0, description: '' });
  const [newValue, setNewValue] = useState<{ name: string; price: number; description: string }>({ name: '', price: 0, description: '' });

  const startEdit = (service: ManagedService) => {
    setEditingId(service.id);
    setEditValue({ name: service.name, price: service.price, description: service.description || '' });
  };

  const handleEditChange = (field: 'name' | 'price' | 'description', value: string | number) => {
    setEditValue(prev => ({ ...prev, [field]: field === 'price' ? Number(value) : value as string }));
  };

  const handleEditSave = (id: string) => {
    onUpdate({ id, ...editValue });
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newValue.name || newValue.price <= 0) return;
    onAdd(newValue);
    setNewValue({ name: '', price: 0, description: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Service (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-end">
          <Input
            placeholder="Name"
            value={newValue.name}
            onChange={e => setNewValue(v => ({ ...v, name: e.target.value }))}
            className="w-48"
          />
          <Input
            placeholder="Price"
            type="number"
            value={newValue.price || ''}
            onChange={e => setNewValue(v => ({ ...v, price: Number(e.target.value) }))}
            className="w-32"
            min={0}
          />
          <Input
            placeholder="Description"
            value={newValue.description}
            onChange={e => setNewValue(v => ({ ...v, description: e.target.value }))}
            className="w-64"
          />
          <Button onClick={handleAdd} variant="outline" className="flex gap-1 items-center">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managedServices.map(service => (
              <TableRow key={service.id}>
                <TableCell>
                  {editingId === service.id ? (
                    <Input
                      value={editValue.name}
                      onChange={e => handleEditChange('name', e.target.value)}
                      className="w-40"
                    />
                  ) : (
                    service.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === service.id ? (
                    <Input
                      type="number"
                      value={editValue.price}
                      onChange={e => handleEditChange('price', e.target.value)}
                      className="w-24"
                      min={0}
                    />
                  ) : (
                    `₦${service.price}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === service.id ? (
                    <Input
                      value={editValue.description}
                      onChange={e => handleEditChange('description', e.target.value)}
                      className="w-56"
                    />
                  ) : (
                    service.description
                  )}
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  {editingId === service.id ? (
                    <>
                      <Button size="sm" onClick={() => handleEditSave(service.id)} variant="outline">Save</Button>
                      <Button size="sm" onClick={() => setEditingId(null)} variant="ghost">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(service)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(service.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}; 
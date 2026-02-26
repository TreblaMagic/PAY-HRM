import React, { useState } from 'react';
import { SetupCost } from '@/types/isp';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Pencil, Plus } from 'lucide-react';

interface SetupCostManagementProps {
  setupCosts: SetupCost[];
  onAdd: (cost: Omit<SetupCost, 'id'>) => void;
  onUpdate: (cost: SetupCost) => void;
  onDelete: (id: string) => void;
}

export const SetupCostManagement: React.FC<SetupCostManagementProps> = ({ setupCosts, onAdd, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<{ name: string; price: number }>({ name: '', price: 0 });
  const [newValue, setNewValue] = useState<{ name: string; price: number }>({ name: '', price: 0 });

  const startEdit = (cost: SetupCost) => {
    setEditingId(cost.id);
    setEditValue({ name: cost.name, price: cost.price });
  };

  const handleEditChange = (field: 'name' | 'price', value: string | number) => {
    setEditValue(prev => ({ ...prev, [field]: field === 'price' ? Number(value) : value as string }));
  };

  const handleEditSave = (id: string) => {
    onUpdate({ id, ...editValue });
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newValue.name || newValue.price <= 0) return;
    onAdd(newValue);
    setNewValue({ name: '', price: 0 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Cost</CardTitle>
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
          <Button onClick={handleAdd} variant="outline" className="flex gap-1 items-center">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {setupCosts.map(cost => (
              <TableRow key={cost.id}>
                <TableCell>
                  {editingId === cost.id ? (
                    <Input
                      value={editValue.name}
                      onChange={e => handleEditChange('name', e.target.value)}
                      className="w-40"
                    />
                  ) : (
                    cost.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === cost.id ? (
                    <Input
                      type="number"
                      value={editValue.price}
                      onChange={e => handleEditChange('price', e.target.value)}
                      className="w-24"
                      min={0}
                    />
                  ) : (
                    `$${cost.price}`
                  )}
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  {editingId === cost.id ? (
                    <>
                      <Button size="sm" onClick={() => handleEditSave(cost.id)} variant="outline">Save</Button>
                      <Button size="sm" onClick={() => setEditingId(null)} variant="ghost">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(cost)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(cost.id)}>
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
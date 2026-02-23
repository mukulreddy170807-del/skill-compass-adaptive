import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Users } from 'lucide-react';
import { getAllManagers, getEmployeesForManager, departments } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function AdminManagersPage() {
  const { toast } = useToast();
  const managers = getAllManagers();
  const [open, setOpen] = useState(false);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Manager Created', description: 'New manager account has been created (mock).' });
    setOpen(false);
  };

  const handleDelete = (name: string, empCount: number) => {
    if (empCount > 0) {
      toast({ title: 'Cannot Delete', description: `${name} has ${empCount} employees assigned. Reassign them first.`, variant: 'destructive' });
      return;
    }
    toast({ title: 'Manager Deleted', description: `${name} has been removed (mock).` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manager Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Create, edit, and manage manager accounts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Manager</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Manager</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input placeholder="Full name" required /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@company.com" required /></div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select required>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Create Manager</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {managers.map(mgr => {
          const empCount = getEmployeesForManager(mgr.id).length;
          return (
            <Card key={mgr.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{mgr.avatar}</div>
                  <div>
                    <p className="font-medium text-sm">{mgr.name}</p>
                    <p className="text-xs text-muted-foreground">{mgr.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs"><Users className="w-3 h-3 mr-1" />{empCount} employees</Badge>
                  <Badge variant="secondary" className="text-xs">{mgr.department}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(mgr.name, empCount)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

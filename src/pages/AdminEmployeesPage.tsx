import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { getAllManagers, getAllEmployees, getManagerForEmployee } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function AdminEmployeesPage() {
  const { toast } = useToast();
  const managers = getAllManagers();
  const employees = getAllEmployees();
  const [open, setOpen] = useState(false);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Employee Created', description: 'New employee account has been created (mock).' });
    setOpen(false);
  };

  // Group employees by manager
  const grouped = managers.map(mgr => ({
    manager: mgr,
    employees: employees.filter(e => e.managerId === mgr.id),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage employees and manager assignments</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Employee</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Employee</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input placeholder="Full name" required /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@company.com" required /></div>
              <div className="space-y-2">
                <Label>Assign Manager</Label>
                <Select required>
                  <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
                  <SelectContent>
                    {managers.map(m => <SelectItem key={m.id} value={m.id}>{m.name} ({m.department})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Create Employee</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {grouped.map(({ manager, employees: emps }) => (
        <div key={manager.id} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{manager.avatar}</span>
            {manager.name}'s Team ({emps.length})
          </h2>
          <div className="grid gap-2">
            {emps.map(emp => (
              <Card key={emp.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">{emp.avatar}</div>
                    <div>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{emp.department}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Deleted', description: `${emp.name} removed (mock).` })}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

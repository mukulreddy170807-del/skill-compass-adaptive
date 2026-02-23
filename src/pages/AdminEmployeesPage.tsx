import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, Trash2, Copy, CheckCircle2 } from 'lucide-react';
import { getAllManagers, getAllEmployees, getManagerForEmployee } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/store/userStore';
import { generateEmail, generatePassword, generateAvatar, generateUserId } from '@/lib/credentialsUtils';
import type { User } from '@/types';

export default function AdminEmployeesPage() {
  const { toast } = useToast();
  const dynamicUsers = useUserStore((s) => s.dynamicUsers);
  const addUser = useUserStore((s) => s.addUser);
  const managers = getAllManagers(); // This now includes dynamic users
  const employees = getAllEmployees(); // This now includes dynamic users
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [managerId, setManagerId] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Find selected manager to get department
    const selectedManager = managers.find(m => m.id === managerId);
    if (!selectedManager) return;
    
    // Generate credentials
    const email = generateEmail(name, 'employee');
    const password = generatePassword(name);
    const avatar = generateAvatar(name);
    const userId = generateUserId('employee');
    
    // Create user object
    const newEmployee: User = {
      id: userId,
      name: name,
      email: email,
      role: 'employee',
      department: selectedManager.department,
      jobRole: '', // Can be set later
      avatar: avatar,
      managerId: managerId
    };
    
    // Add to user store
    addUser(newEmployee);
    
    // Show credentials to admin
    setCreatedCredentials({ email, password });
    
    toast({ 
      title: 'Employee Created', 
      description: `${name} has been created successfully.` 
    });
  };
  
  const handleCloseDialog = () => {
    setOpen(false);
    setName('');
    setManagerId('');
    setCreatedCredentials(null);
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied', description: `${label} copied to clipboard` });
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
            <DialogHeader>
              <DialogTitle>Create Employee</DialogTitle>
              <DialogDescription>
                Add a new employee account with auto-generated credentials
              </DialogDescription>
            </DialogHeader>
            
            {!createdCredentials ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    placeholder="Full name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assign Manager</Label>
                  <Select value={managerId} onValueChange={setManagerId} required>
                    <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
                    <SelectContent>
                      {managers.map(m => <SelectItem key={m.id} value={m.id}>{m.name} ({m.department})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Email and password will be auto-generated based on the name.
                </p>
                <Button type="submit" className="w-full">Create Employee</Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Employee Created Successfully!</AlertTitle>
                  <AlertDescription>
                    Share these credentials with the employee. They can use them to log in.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2">
                      <Input value={createdCredentials.email} readOnly className="font-mono text-sm" />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(createdCredentials.email, 'Email')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Password</Label>
                    <div className="flex items-center gap-2">
                      <Input value={createdCredentials.password} readOnly className="font-mono text-sm" />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(createdCredentials.password, 'Password')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleCloseDialog} className="w-full">
                  Done
                </Button>
              </div>
            )}
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

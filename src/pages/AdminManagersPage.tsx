import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, Trash2, Users, Copy, CheckCircle2 } from 'lucide-react';
import { getAllManagers, getEmployeesForManager, departments } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/store/userStore';
import { generateEmail, generatePassword, generateAvatar, generateUserId } from '@/lib/credentialsUtils';
import type { User } from '@/types';

export default function AdminManagersPage() {
  const { toast } = useToast();
  const dynamicUsers = useUserStore((s) => s.dynamicUsers);
  const addUser = useUserStore((s) => s.addUser);
  const managers = getAllManagers(); // This now includes dynamic users
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Generate credentials
    const email = generateEmail(name, 'manager');
    const password = generatePassword(name);
    const avatar = generateAvatar(name);
    const userId = generateUserId('manager');
    
    // Create user object
    const newManager: User = {
      id: userId,
      name: name,
      email: email,
      role: 'manager',
      department: department,
      jobRole: '', // Can be set later
      avatar: avatar
    };
    
    // Add to user store
    addUser(newManager);
    
    // Show credentials to admin
    setCreatedCredentials({ email, password });
    
    toast({ 
      title: 'Manager Created', 
      description: `${name} has been created successfully.` 
    });
  };
  
  const handleCloseDialog = () => {
    setOpen(false);
    setName('');
    setDepartment('');
    setCreatedCredentials(null);
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied', description: `${label} copied to clipboard` });
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
            <DialogHeader>
              <DialogTitle>Create Manager</DialogTitle>
              <DialogDescription>
                Add a new manager account with auto-generated credentials
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
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment} required>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Email and password will be auto-generated based on the name.
                </p>
                <Button type="submit" className="w-full">Create Manager</Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Manager Created Successfully!</AlertTitle>
                  <AlertDescription>
                    Share these credentials with the manager. They can use them to log in.
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

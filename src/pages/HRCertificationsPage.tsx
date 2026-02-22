import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { users, employeeCertifications, certifications, skills } from '@/data/mockData';

export default function HRCertificationsPage() {
  const allCerts = employeeCertifications.map((ec) => {
    const cert = certifications.find((c) => c.id === ec.certificationId)!;
    const emp = users.find((u) => u.id === ec.employeeId)!;
    const skill = skills.find((s) => s.id === cert.skillId);
    const now = new Date();
    const expiry = new Date(ec.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let status: 'active' | 'expiring' | 'expired' = 'active';
    if (daysUntilExpiry < 0) status = 'expired';
    else if (daysUntilExpiry < 90) status = 'expiring';
    return { ...ec, cert, emp, skill, status, daysUntilExpiry };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Certification Management</h1>
        <p className="text-muted-foreground text-sm mt-1">{allCerts.length} certifications across organization</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Certification</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Provider</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {allCerts.map((item, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{item.emp.name}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-accent" />
                        {item.cert.name}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{item.cert.provider}</td>
                    <td className="p-3 text-center">
                      <Badge variant={item.status === 'active' ? 'default' : item.status === 'expiring' ? 'secondary' : 'destructive'} className="text-[10px]">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right text-muted-foreground">{item.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

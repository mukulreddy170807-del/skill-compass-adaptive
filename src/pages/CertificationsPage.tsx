import { useAuthStore } from '@/store/authStore';
import { useCertificationStore } from '@/store/certificationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { certifications, skills, courses } from '@/data/mockData';

export default function CertificationsPage() {
  const user = useAuthStore((s) => s.user)!;
  const { certifications: allCertifications } = useCertificationStore();
  const myCerts = allCertifications
    .filter((ec) => ec.employeeId === user.id)
    .map((ec) => {
      let cert = certifications.find((c) => c.id === ec.certificationId);
      
      // Handle course completion certifications
      if (!cert && ec.certificationId.startsWith('cert-course-')) {
        const courseId = ec.certificationId.replace('cert-course-', '');
        const course = courses.find((c) => c.id === courseId);
        if (course) {
          cert = {
            id: ec.certificationId,
            name: `${course.title} - Course Completion`,
            provider: 'ASTRA Platform',
            skillId: course.skillId,
            earnedDate: ec.earnedDate,
            expiryDate: ec.expiryDate,
            status: 'active' as const,
          };
        }
      }

      const skill = skills.find((s) => s.id === cert?.skillId);
      const now = new Date();
      const expiry = new Date(ec.expiryDate);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let status: 'active' | 'expiring' | 'expired' = 'active';
      if (daysUntilExpiry < 0) status = 'expired';
      else if (daysUntilExpiry < 90) status = 'expiring';
      return { ...ec, cert, skill, status, daysUntilExpiry };
    })
    .filter((item) => item.cert); // Only show certifications with valid cert data

  const statusConfig = {
    active: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Active' },
    expiring: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Expiring Soon' },
    expired: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Expired' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Certifications</h1>
        <p className="text-muted-foreground text-sm mt-1">{myCerts.length} certifications tracked</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {myCerts.map((item) => {
          const cfg = statusConfig[item.status];
          const Icon = cfg.icon;
          return (
            <Card key={item.certificationId}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <Award className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.cert.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.cert.provider}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${cfg.color}`}>
                    <Icon className="w-3 h-3 mr-1" />{cfg.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Earned: {item.earnedDate}</span>
                  <span>Expires: {item.expiryDate}</span>
                </div>
                {item.skill && (
                  <Badge variant="secondary" className="text-[10px]">{item.skill.name}</Badge>
                )}
                {item.status === 'expiring' && (
                  <p className="text-xs text-warning">{item.daysUntilExpiry} days until expiry</p>
                )}
              </CardContent>
            </Card>
          );
        })}
        {myCerts.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-10">No certifications yet</p>
        )}
      </div>
    </div>
  );
}

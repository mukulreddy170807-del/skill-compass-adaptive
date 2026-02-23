import { create } from 'zustand';
import { employeeCertifications as initialCertifications } from '@/data/mockData';
import type { EmployeeCertification } from '@/types';

interface CertificationStore {
  certifications: EmployeeCertification[];
  addCertification: (certification: EmployeeCertification) => void;
  getCertificationsByEmployee: (employeeId: string) => EmployeeCertification[];
}

export const useCertificationStore = create<CertificationStore>((set, get) => ({
  certifications: initialCertifications,
  
  addCertification: (certification) => {
    set((state) => ({
      certifications: [...state.certifications, certification],
    }));
  },
  
  getCertificationsByEmployee: (employeeId) => {
    return get().certifications.filter((c) => c.employeeId === employeeId);
  },
}));

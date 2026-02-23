import type { User, Skill, Question, Course, Certification, JobRole, Department, EmployeeSkill, EmployeeCourse, EmployeeCertification, Assessment, CareerPath } from '@/types';

export const departments: Department[] = [
  { id: 'dept-1', name: 'Engineering', managerId: 'mgr-1' },
  { id: 'dept-2', name: 'Product', managerId: 'mgr-2' },
  { id: 'dept-3', name: 'Marketing', managerId: 'mgr-3' },
];

// 1 Admin, 3 Managers, 15 Employees (5 per manager), 20 Students
export const users: User[] = [
  // Admin
  { id: 'admin-1', name: 'Diana Prince', email: 'admin@company.com', role: 'admin', department: 'Engineering', jobRole: 'role-5', avatar: 'DP' },
  // HR (kept for backward compat)
  { id: 'hr-1', name: 'Robert Adams', email: 'robert@company.com', role: 'hr', department: 'Engineering', jobRole: 'role-5', avatar: 'RA' },
  // Managers
  { id: 'mgr-1', name: 'Michael Torres', email: 'michael@company.com', role: 'manager', department: 'Engineering', jobRole: 'role-2', avatar: 'MT' },
  { id: 'mgr-2', name: 'Jennifer Lee', email: 'jennifer@company.com', role: 'manager', department: 'Product', jobRole: 'role-3', avatar: 'JL' },
  { id: 'mgr-3', name: 'Carlos Rivera', email: 'carlos@company.com', role: 'manager', department: 'Marketing', jobRole: 'role-4', avatar: 'CR' },
  // Employees under mgr-1 (Engineering)
  { id: 'user-1', name: 'Alex Chen', email: 'alex@company.com', role: 'employee', department: 'Engineering', jobRole: 'role-1', avatar: 'AC', managerId: 'mgr-1' },
  { id: 'user-2', name: 'Sarah Kim', email: 'sarah@company.com', role: 'employee', department: 'Engineering', jobRole: 'role-1', avatar: 'SK', managerId: 'mgr-1' },
  { id: 'user-3', name: 'James Wilson', email: 'james@company.com', role: 'employee', department: 'Engineering', jobRole: 'role-2', avatar: 'JW', managerId: 'mgr-1' },
  { id: 'user-7', name: "Ryan O'Brien", email: 'ryan@company.com', role: 'employee', department: 'Engineering', jobRole: 'role-2', avatar: 'RO', managerId: 'mgr-1' },
  { id: 'user-9', name: 'Tom Mitchell', email: 'tom@company.com', role: 'employee', department: 'Engineering', jobRole: 'role-1', avatar: 'TM', managerId: 'mgr-1' },
  // Employees under mgr-2 (Product)
  { id: 'user-4', name: 'Maria Garcia', email: 'maria@company.com', role: 'employee', department: 'Product', jobRole: 'role-3', avatar: 'MG', managerId: 'mgr-2' },
  { id: 'user-5', name: 'David Park', email: 'david@company.com', role: 'employee', department: 'Product', jobRole: 'role-3', avatar: 'DP', managerId: 'mgr-2' },
  { id: 'user-10', name: 'Lisa Wong', email: 'lisa@company.com', role: 'employee', department: 'Product', jobRole: 'role-3', avatar: 'LW', managerId: 'mgr-2' },
  { id: 'user-14', name: 'Nina Patel', email: 'nina@company.com', role: 'employee', department: 'Product', jobRole: 'role-3', avatar: 'NP', managerId: 'mgr-2' },
  { id: 'user-15', name: 'Oscar Huang', email: 'oscar@company.com', role: 'employee', department: 'Product', jobRole: 'role-3', avatar: 'OH', managerId: 'mgr-2' },
  // Employees under mgr-3 (Marketing)
  { id: 'user-6', name: 'Emily Zhang', email: 'emily@company.com', role: 'employee', department: 'Marketing', jobRole: 'role-4', avatar: 'EZ', managerId: 'mgr-3' },
  { id: 'user-8', name: 'Priya Patel', email: 'priya@company.com', role: 'employee', department: 'Marketing', jobRole: 'role-5', avatar: 'PP', managerId: 'mgr-3' },
  { id: 'user-16', name: 'Kevin Brown', email: 'kevin@company.com', role: 'employee', department: 'Marketing', jobRole: 'role-4', avatar: 'KB', managerId: 'mgr-3' },
  { id: 'user-17', name: 'Sophie Turner', email: 'sophie@company.com', role: 'employee', department: 'Marketing', jobRole: 'role-4', avatar: 'ST', managerId: 'mgr-3' },
  { id: 'user-18', name: 'Lucas Martin', email: 'lucas@company.com', role: 'employee', department: 'Marketing', jobRole: 'role-5', avatar: 'LM', managerId: 'mgr-3' },
  // Students (20)
  { id: 'stu-1', name: 'Ava Johnson', email: 'ava@student.com', role: 'student', department: '', jobRole: '', avatar: 'AJ' },
  { id: 'stu-2', name: 'Ethan Davis', email: 'ethan@student.com', role: 'student', department: '', jobRole: '', avatar: 'ED' },
  { id: 'stu-3', name: 'Mia Thompson', email: 'mia@student.com', role: 'student', department: '', jobRole: '', avatar: 'MT' },
  { id: 'stu-4', name: 'Noah Martinez', email: 'noah@student.com', role: 'student', department: '', jobRole: '', avatar: 'NM' },
  { id: 'stu-5', name: 'Isabella Anderson', email: 'isabella@student.com', role: 'student', department: '', jobRole: '', avatar: 'IA' },
  { id: 'stu-6', name: 'Liam Taylor', email: 'liam@student.com', role: 'student', department: '', jobRole: '', avatar: 'LT' },
  { id: 'stu-7', name: 'Charlotte Thomas', email: 'charlotte@student.com', role: 'student', department: '', jobRole: '', avatar: 'CT' },
  { id: 'stu-8', name: 'Oliver Jackson', email: 'oliver@student.com', role: 'student', department: '', jobRole: '', avatar: 'OJ' },
  { id: 'stu-9', name: 'Amelia White', email: 'amelia@student.com', role: 'student', department: '', jobRole: '', avatar: 'AW' },
  { id: 'stu-10', name: 'William Harris', email: 'william@student.com', role: 'student', department: '', jobRole: '', avatar: 'WH' },
  { id: 'stu-11', name: 'Emma Clark', email: 'emma@student.com', role: 'student', department: '', jobRole: '', avatar: 'EC' },
  { id: 'stu-12', name: 'James Lewis', email: 'james.s@student.com', role: 'student', department: '', jobRole: '', avatar: 'JL' },
  { id: 'stu-13', name: 'Sophia Robinson', email: 'sophia@student.com', role: 'student', department: '', jobRole: '', avatar: 'SR' },
  { id: 'stu-14', name: 'Benjamin Walker', email: 'benjamin@student.com', role: 'student', department: '', jobRole: '', avatar: 'BW' },
  { id: 'stu-15', name: 'Harper Allen', email: 'harper@student.com', role: 'student', department: '', jobRole: '', avatar: 'HA' },
  { id: 'stu-16', name: 'Elijah Young', email: 'elijah@student.com', role: 'student', department: '', jobRole: '', avatar: 'EY' },
  { id: 'stu-17', name: 'Abigail King', email: 'abigail@student.com', role: 'student', department: '', jobRole: '', avatar: 'AK' },
  { id: 'stu-18', name: 'Henry Wright', email: 'henry@student.com', role: 'student', department: '', jobRole: '', avatar: 'HW' },
  { id: 'stu-19', name: 'Emily Scott', email: 'emily.s@student.com', role: 'student', department: '', jobRole: '', avatar: 'ES' },
  { id: 'stu-20', name: 'Daniel Green', email: 'daniel@student.com', role: 'student', department: '', jobRole: '', avatar: 'DG' },
];

export const skills: Skill[] = [
  { id: 'skill-1', name: 'React', category: 'Frontend', description: 'React.js framework expertise' },
  { id: 'skill-2', name: 'TypeScript', category: 'Languages', description: 'TypeScript language proficiency' },
  { id: 'skill-3', name: 'Node.js', category: 'Backend', description: 'Server-side JavaScript runtime' },
  { id: 'skill-4', name: 'Python', category: 'Languages', description: 'Python programming language' },
  { id: 'skill-5', name: 'AWS', category: 'Cloud', description: 'Amazon Web Services cloud platform' },
  { id: 'skill-6', name: 'Docker', category: 'DevOps', description: 'Container orchestration' },
  { id: 'skill-7', name: 'SQL', category: 'Database', description: 'Database query language' },
  { id: 'skill-8', name: 'System Design', category: 'Architecture', description: 'Large-scale system architecture' },
  { id: 'skill-9', name: 'Agile/Scrum', category: 'Process', description: 'Agile methodology' },
  { id: 'skill-10', name: 'Data Analysis', category: 'Analytics', description: 'Data analysis and visualization' },
  { id: 'skill-11', name: 'UX Design', category: 'Design', description: 'User experience design' },
  { id: 'skill-12', name: 'SEO', category: 'Marketing', description: 'Search engine optimization' },
  // Additional skills for career paths
  { id: 'skill-13', name: 'Machine Learning', category: 'AI', description: 'ML algorithms and frameworks' },
  { id: 'skill-14', name: 'Communication', category: 'Soft Skills', description: 'Verbal and written communication' },
  { id: 'skill-15', name: 'Leadership', category: 'Soft Skills', description: 'Team leadership and management' },
  { id: 'skill-16', name: 'Project Management', category: 'Process', description: 'Planning and executing projects' },
  { id: 'skill-17', name: 'Statistics', category: 'Analytics', description: 'Statistical analysis methods' },
  { id: 'skill-18', name: 'Figma', category: 'Design', description: 'UI design tool proficiency' },
  { id: 'skill-19', name: 'Java', category: 'Languages', description: 'Java programming language' },
  { id: 'skill-20', name: 'Cybersecurity', category: 'Security', description: 'Information security practices' },
  { id: 'skill-21', name: 'DevOps', category: 'DevOps', description: 'CI/CD and infrastructure automation' },
  { id: 'skill-22', name: 'Mobile Development', category: 'Frontend', description: 'React Native / Flutter development' },
  { id: 'skill-23', name: 'Data Engineering', category: 'Data', description: 'ETL pipelines and data warehousing' },
  { id: 'skill-24', name: 'Business Strategy', category: 'Business', description: 'Strategic planning and execution' },
  { id: 'skill-25', name: 'Content Marketing', category: 'Marketing', description: 'Content strategy and creation' },
  { id: 'skill-26', name: 'Financial Analysis', category: 'Business', description: 'Financial modeling and analysis' },
  { id: 'skill-27', name: 'Product Design', category: 'Design', description: 'End-to-end product design thinking' },
  { id: 'skill-28', name: 'Healthcare IT', category: 'Healthcare', description: 'Health informatics systems' },
  { id: 'skill-29', name: 'Cloud Architecture', category: 'Cloud', description: 'Multi-cloud infrastructure design' },
  { id: 'skill-30', name: 'Blockchain', category: 'Emerging Tech', description: 'Distributed ledger technologies' },
  { id: 'skill-31', name: 'Natural Language Processing', category: 'AI', description: 'NLP and text analysis' },
  { id: 'skill-32', name: 'Embedded Systems', category: 'Hardware', description: 'IoT and firmware development' },
  { id: 'skill-33', name: 'Quality Assurance', category: 'Testing', description: 'Software testing methodologies' },
  { id: 'skill-34', name: 'Technical Writing', category: 'Communication', description: 'Documentation and specifications' },
  { id: 'skill-35', name: 'Graphic Design', category: 'Design', description: 'Visual design and branding' },
  { id: 'skill-36', name: 'Sales', category: 'Business', description: 'Sales strategy and execution' },
  { id: 'skill-37', name: 'Supply Chain', category: 'Operations', description: 'Logistics and supply chain management' },
  { id: 'skill-38', name: 'Public Speaking', category: 'Soft Skills', description: 'Presentation and oratory skills' },
  { id: 'skill-39', name: 'Networking', category: 'Infrastructure', description: 'Computer networking and protocols' },
  { id: 'skill-40', name: 'Research', category: 'Academic', description: 'Research methodology and analysis' },
];

export const jobRoles: JobRole[] = [
  { id: 'role-1', title: 'Frontend Developer', department: 'Engineering', requiredSkills: [
    { skillId: 'skill-1', requiredLevel: 'advanced' }, { skillId: 'skill-2', requiredLevel: 'advanced' },
    { skillId: 'skill-8', requiredLevel: 'intermediate' }, { skillId: 'skill-9', requiredLevel: 'intermediate' },
  ]},
  { id: 'role-2', title: 'Backend Developer', department: 'Engineering', requiredSkills: [
    { skillId: 'skill-3', requiredLevel: 'advanced' }, { skillId: 'skill-4', requiredLevel: 'intermediate' },
    { skillId: 'skill-5', requiredLevel: 'intermediate' }, { skillId: 'skill-6', requiredLevel: 'intermediate' },
    { skillId: 'skill-7', requiredLevel: 'advanced' }, { skillId: 'skill-8', requiredLevel: 'advanced' },
  ]},
  { id: 'role-3', title: 'Product Manager', department: 'Product', requiredSkills: [
    { skillId: 'skill-9', requiredLevel: 'advanced' }, { skillId: 'skill-10', requiredLevel: 'intermediate' },
    { skillId: 'skill-11', requiredLevel: 'intermediate' },
  ]},
  { id: 'role-4', title: 'Marketing Specialist', department: 'Marketing', requiredSkills: [
    { skillId: 'skill-12', requiredLevel: 'advanced' }, { skillId: 'skill-10', requiredLevel: 'intermediate' },
  ]},
  { id: 'role-5', title: 'DevOps Engineer', department: 'Engineering', requiredSkills: [
    { skillId: 'skill-5', requiredLevel: 'advanced' }, { skillId: 'skill-6', requiredLevel: 'advanced' },
    { skillId: 'skill-3', requiredLevel: 'intermediate' }, { skillId: 'skill-7', requiredLevel: 'intermediate' },
  ]},
];

export const careerPaths: CareerPath[] = [
  { id: 'career-1', title: 'Software Engineer', description: 'Design, develop, and maintain software applications', requiredSkills: ['React', 'TypeScript', 'Node.js', 'System Design', 'SQL', 'Docker'], certifications: ['Meta Frontend Developer', 'AWS Solutions Architect'], courses: ['Advanced React Patterns', 'TypeScript Deep Dive', 'System Design Interview Prep'], timeline: '6-12 months', salaryRange: '$80k - $150k' },
  { id: 'career-2', title: 'Data Scientist', description: 'Analyze complex data to drive business decisions', requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Analysis'], certifications: ['Google Data Analytics', 'IBM Data Science'], courses: ['Python for Data Science', 'Machine Learning A-Z'], timeline: '8-14 months', salaryRange: '$90k - $160k' },
  { id: 'career-3', title: 'AI Engineer', description: 'Build and deploy AI/ML models at scale', requiredSkills: ['Python', 'Machine Learning', 'Natural Language Processing', 'Cloud Architecture', 'Docker'], certifications: ['AWS ML Specialty', 'TensorFlow Developer'], courses: ['Deep Learning Specialization', 'MLOps'], timeline: '10-18 months', salaryRange: '$100k - $180k' },
  { id: 'career-4', title: 'UI/UX Designer', description: 'Create intuitive and beautiful user experiences', requiredSkills: ['UX Design', 'Figma', 'Product Design', 'Communication', 'Research'], certifications: ['Google UX Design Certificate', 'Nielsen Norman UX'], courses: ['UX Design Fundamentals', 'Figma Masterclass'], timeline: '4-8 months', salaryRange: '$70k - $130k' },
  { id: 'career-5', title: 'Product Designer', description: 'Shape product strategy through design thinking', requiredSkills: ['Product Design', 'UX Design', 'Figma', 'Communication', 'Data Analysis'], certifications: ['Certified Product Designer'], courses: ['Product Design Sprint', 'Design Thinking'], timeline: '6-10 months', salaryRange: '$80k - $140k' },
  { id: 'career-6', title: 'Product Manager', description: 'Drive product strategy and execution', requiredSkills: ['Agile/Scrum', 'Data Analysis', 'Communication', 'Leadership', 'Business Strategy'], certifications: ['Certified Scrum Product Owner', 'PMP'], courses: ['Product Management 101', 'Certified Scrum Master'], timeline: '6-12 months', salaryRange: '$90k - $160k' },
  { id: 'career-7', title: 'Business Analyst', description: 'Bridge business needs with technical solutions', requiredSkills: ['Data Analysis', 'SQL', 'Communication', 'Business Strategy', 'Project Management'], certifications: ['CBAP', 'PMI-PBA'], courses: ['Business Analysis Fundamentals', 'SQL Performance Tuning'], timeline: '4-8 months', salaryRange: '$70k - $120k' },
  { id: 'career-8', title: 'DevOps Engineer', description: 'Automate and optimize software delivery pipelines', requiredSkills: ['Docker', 'AWS', 'DevOps', 'Node.js', 'Cybersecurity'], certifications: ['AWS DevOps Professional', 'Docker Certified Associate'], courses: ['Docker & Kubernetes Mastery', 'AWS Solutions Architect'], timeline: '8-14 months', salaryRange: '$90k - $155k' },
  { id: 'career-9', title: 'Cybersecurity Analyst', description: 'Protect organizations from digital threats', requiredSkills: ['Cybersecurity', 'Networking', 'Python', 'Cloud Architecture', 'DevOps'], certifications: ['CompTIA Security+', 'CISSP'], courses: ['Cybersecurity Fundamentals', 'Ethical Hacking'], timeline: '8-14 months', salaryRange: '$80k - $140k' },
  { id: 'career-10', title: 'Mobile App Developer', description: 'Build native and cross-platform mobile applications', requiredSkills: ['React', 'TypeScript', 'Mobile Development', 'UX Design', 'DevOps'], certifications: ['Google Associate Android Developer'], courses: ['React Native Masterclass', 'Flutter & Dart'], timeline: '6-10 months', salaryRange: '$75k - $140k' },
];

export const employeeSkills: Record<string, EmployeeSkill[]> = {
  'user-1': [
    { skillId: 'skill-1', level: 'advanced', targetLevel: 'expert', lastAssessed: '2025-12-15', score: 82 },
    { skillId: 'skill-2', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-11-20', score: 58 },
    { skillId: 'skill-8', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-10-05', score: 30 },
    { skillId: 'skill-9', level: 'intermediate', targetLevel: 'intermediate', lastAssessed: '2025-12-01', score: 65 },
  ],
  'user-2': [
    { skillId: 'skill-1', level: 'expert', targetLevel: 'expert', lastAssessed: '2026-01-10', score: 95 },
    { skillId: 'skill-2', level: 'advanced', targetLevel: 'expert', lastAssessed: '2025-12-20', score: 78 },
    { skillId: 'skill-8', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-11-15', score: 55 },
    { skillId: 'skill-9', level: 'advanced', targetLevel: 'advanced', lastAssessed: '2026-01-05', score: 80 },
  ],
  'user-3': [
    { skillId: 'skill-3', level: 'advanced', targetLevel: 'expert', lastAssessed: '2026-01-15', score: 75 },
    { skillId: 'skill-4', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-12-10', score: 52 },
    { skillId: 'skill-5', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-11-01', score: 28 },
    { skillId: 'skill-6', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-12-20', score: 48 },
    { skillId: 'skill-7', level: 'advanced', targetLevel: 'advanced', lastAssessed: '2026-01-08', score: 72 },
    { skillId: 'skill-8', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-11-25', score: 55 },
  ],
  'user-4': [
    { skillId: 'skill-9', level: 'advanced', targetLevel: 'expert', lastAssessed: '2026-01-12', score: 78 },
    { skillId: 'skill-10', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-12-05', score: 60 },
    { skillId: 'skill-11', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-11-18', score: 35 },
  ],
  'user-5': [
    { skillId: 'skill-9', level: 'expert', targetLevel: 'expert', lastAssessed: '2026-02-01', score: 92 },
    { skillId: 'skill-10', level: 'advanced', targetLevel: 'advanced', lastAssessed: '2026-01-20', score: 80 },
    { skillId: 'skill-11', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-12-15', score: 55 },
  ],
  'user-6': [
    { skillId: 'skill-12', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2026-01-05', score: 58 },
    { skillId: 'skill-10', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-11-20', score: 30 },
  ],
  'user-7': [
    { skillId: 'skill-3', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-12-20', score: 50 },
    { skillId: 'skill-5', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2026-01-10', score: 55 },
    { skillId: 'skill-6', level: 'advanced', targetLevel: 'expert', lastAssessed: '2026-01-15', score: 76 },
    { skillId: 'skill-7', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-12-05', score: 48 },
    { skillId: 'skill-8', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-10-30', score: 25 },
  ],
  'user-8': [
    { skillId: 'skill-12', level: 'advanced', targetLevel: 'expert', lastAssessed: '2026-01-18', score: 82 },
    { skillId: 'skill-10', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2026-01-05', score: 60 },
  ],
  'user-9': [
    { skillId: 'skill-1', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-12-10', score: 50 },
    { skillId: 'skill-2', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-11-15', score: 30 },
    { skillId: 'skill-8', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-10-20', score: 22 },
    { skillId: 'skill-9', level: 'intermediate', targetLevel: 'intermediate', lastAssessed: '2025-12-28', score: 60 },
  ],
  'user-10': [
    { skillId: 'skill-9', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2026-01-10', score: 55 },
    { skillId: 'skill-10', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-12-01', score: 32 },
    { skillId: 'skill-11', level: 'advanced', targetLevel: 'advanced', lastAssessed: '2026-01-20', score: 78 },
  ],
  'user-14': [
    { skillId: 'skill-9', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2026-01-08', score: 52 },
    { skillId: 'skill-10', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-12-15', score: 58 },
    { skillId: 'skill-11', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-11-20', score: 33 },
  ],
  'user-15': [
    { skillId: 'skill-9', level: 'advanced', targetLevel: 'expert', lastAssessed: '2026-01-15', score: 75 },
    { skillId: 'skill-10', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2026-01-02', score: 62 },
  ],
  'user-16': [
    { skillId: 'skill-12', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-12-20', score: 35 },
    { skillId: 'skill-10', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-11-10', score: 28 },
  ],
  'user-17': [
    { skillId: 'skill-12', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2026-01-10', score: 55 },
    { skillId: 'skill-10', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2025-12-25', score: 50 },
  ],
  'user-18': [
    { skillId: 'skill-5', level: 'intermediate', targetLevel: 'advanced', lastAssessed: '2026-01-05', score: 48 },
    { skillId: 'skill-6', level: 'beginner', targetLevel: 'intermediate', lastAssessed: '2025-12-01', score: 30 },
  ],
};

export const questions: Question[] = [
  // React (skill-1)
  { id: 'q-1', skillId: 'skill-1', text: 'What hook is used to manage state in a functional React component?', options: ['useEffect', 'useState', 'useRef', 'useMemo'], correctAnswer: 1, difficulty: 'easy', explanation: 'useState is the hook for managing state in functional components.' },
  { id: 'q-2', skillId: 'skill-1', text: 'What is the purpose of React.memo()?', options: ['Memoize function results', 'Prevent unnecessary re-renders', 'Store data in memory', 'Create memoized selectors'], correctAnswer: 1, difficulty: 'medium', explanation: 'React.memo() prevents re-renders when props haven\'t changed.' },
  { id: 'q-3', skillId: 'skill-1', text: 'How does React\'s reconciliation algorithm (Fiber) determine tree diffs?', options: ['Compares all nodes linearly', 'Uses heuristic O(n) diffing with two assumptions', 'Deep equality comparison', 'Brute-force comparison of virtual DOMs'], correctAnswer: 1, difficulty: 'hard', explanation: 'Fiber uses heuristic O(n) diffing assuming: different types = different trees, keys hint stable identity.' },
  // TypeScript (skill-2)
  { id: 'q-4', skillId: 'skill-2', text: 'What keyword makes a property optional in TypeScript?', options: ['optional', '?', 'maybe', 'void'], correctAnswer: 1, difficulty: 'easy', explanation: 'The ? symbol after a property name makes it optional.' },
  { id: 'q-5', skillId: 'skill-2', text: 'What is a discriminated union in TypeScript?', options: ['Union with a shared literal property', 'Two interfaces merged', 'An enum with values', 'A type intersection'], correctAnswer: 0, difficulty: 'medium', explanation: 'A discriminated union uses a shared literal property to narrow types.' },
  { id: 'q-6', skillId: 'skill-2', text: 'What does the `infer` keyword do in conditional types?', options: ['Infers a return type', 'Creates a new type variable within extends clause', 'Auto-imports types', 'Validates type inference'], correctAnswer: 1, difficulty: 'hard', explanation: 'infer declares a type variable within a conditional type\'s extends clause.' },
  // Node.js (skill-3)
  { id: 'q-7', skillId: 'skill-3', text: 'What is the event loop in Node.js?', options: ['A loop for iterating arrays', 'A mechanism for non-blocking I/O', 'A debugging tool', 'A testing framework'], correctAnswer: 1, difficulty: 'easy', explanation: 'The event loop handles non-blocking asynchronous operations.' },
  { id: 'q-8', skillId: 'skill-3', text: 'What is the difference between process.nextTick() and setImmediate()?', options: ['They are identical', 'nextTick fires before I/O, setImmediate after', 'setImmediate is faster', 'nextTick is deprecated'], correctAnswer: 1, difficulty: 'medium', explanation: 'nextTick callbacks fire before I/O events, setImmediate after.' },
  { id: 'q-9', skillId: 'skill-3', text: 'How does the Node.js cluster module achieve load balancing?', options: ['Round-robin distribution', 'Random assignment', 'Hash-based routing', 'OS-level scheduling only'], correctAnswer: 0, difficulty: 'hard', explanation: 'Node.js cluster uses round-robin (except Windows) to distribute connections.' },
  // Python (skill-4)
  { id: 'q-10', skillId: 'skill-4', text: 'What is a list comprehension in Python?', options: ['A way to create lists from loops', 'A sorting algorithm', 'A type of data structure', 'A debugging tool'], correctAnswer: 0, difficulty: 'easy', explanation: 'List comprehensions create lists using concise loop syntax.' },
  { id: 'q-11', skillId: 'skill-4', text: 'What is the GIL in Python?', options: ['Global Import Lock', 'Global Interpreter Lock', 'General Input Layer', 'Generic Interface Library'], correctAnswer: 1, difficulty: 'medium', explanation: 'The Global Interpreter Lock prevents multiple threads from executing Python bytecode simultaneously.' },
  { id: 'q-12', skillId: 'skill-4', text: 'How do Python descriptors work under the hood?', options: ['Via __get__, __set__, __delete__ protocol', 'Via metaclasses only', 'Through decorators', 'Using the GIL'], correctAnswer: 0, difficulty: 'hard', explanation: 'Descriptors implement __get__, __set__, and/or __delete__ for attribute access control.' },
  // AWS (skill-5)
  { id: 'q-13', skillId: 'skill-5', text: 'What AWS service is used for object storage?', options: ['EC2', 'S3', 'RDS', 'Lambda'], correctAnswer: 1, difficulty: 'easy', explanation: 'Amazon S3 (Simple Storage Service) provides object storage.' },
  { id: 'q-14', skillId: 'skill-5', text: 'What is the difference between SQS and SNS?', options: ['SQS is queue-based, SNS is pub/sub', 'They are the same service', 'SNS stores data, SQS does not', 'SQS is newer than SNS'], correctAnswer: 0, difficulty: 'medium', explanation: 'SQS is a message queue service, SNS is a pub/sub notification service.' },
  { id: 'q-15', skillId: 'skill-5', text: 'How does AWS Lambda handle cold starts in provisioned concurrency?', options: ['By pre-warming execution environments', 'By caching code in S3', 'By using dedicated EC2 instances', 'By compiling code ahead of time'], correctAnswer: 0, difficulty: 'hard', explanation: 'Provisioned concurrency keeps execution environments pre-initialized.' },
  // Docker (skill-6)
  { id: 'q-16', skillId: 'skill-6', text: 'What command builds a Docker image?', options: ['docker run', 'docker build', 'docker create', 'docker compile'], correctAnswer: 1, difficulty: 'easy', explanation: 'docker build creates an image from a Dockerfile.' },
  { id: 'q-17', skillId: 'skill-6', text: 'What is a multi-stage build in Docker?', options: ['Building multiple images at once', 'Using multiple FROM statements to reduce image size', 'Building for multiple platforms', 'Running multiple containers'], correctAnswer: 1, difficulty: 'medium', explanation: 'Multi-stage builds use multiple FROM statements to create smaller final images.' },
  { id: 'q-18', skillId: 'skill-6', text: 'How does Docker overlay2 storage driver implement layers?', options: ['Using OverlayFS with lowerdir/upperdir/merged', 'Using copy-on-write with btrfs', 'Using symbolic links', 'Using hard links only'], correctAnswer: 0, difficulty: 'hard', explanation: 'overlay2 uses OverlayFS with lowerdir (read-only layers), upperdir (writable), and merged view.' },
  // SQL (skill-7)
  { id: 'q-19', skillId: 'skill-7', text: 'What SQL clause filters rows after grouping?', options: ['WHERE', 'HAVING', 'FILTER', 'GROUP BY'], correctAnswer: 1, difficulty: 'easy', explanation: 'HAVING filters groups, while WHERE filters individual rows.' },
  { id: 'q-20', skillId: 'skill-7', text: 'What is a Common Table Expression (CTE)?', options: ['A temporary table', 'A named temporary result set in a WITH clause', 'A view alias', 'A stored procedure'], correctAnswer: 1, difficulty: 'medium', explanation: 'CTEs use WITH clause to create named temporary result sets.' },
  { id: 'q-21', skillId: 'skill-7', text: 'How do window functions differ from aggregate functions in execution?', options: ['Window functions operate on a set of rows related to current row without collapsing', 'They are identical', 'Window functions are faster', 'Aggregate functions support OVER clause'], correctAnswer: 0, difficulty: 'hard', explanation: 'Window functions compute across row sets related to current row without grouping into single output row.' },
  // System Design (skill-8)
  { id: 'q-22', skillId: 'skill-8', text: 'What does horizontal scaling mean?', options: ['Adding more RAM', 'Adding more servers', 'Upgrading CPU', 'Adding more disk space'], correctAnswer: 1, difficulty: 'easy', explanation: 'Horizontal scaling means adding more machines to distribute load.' },
  { id: 'q-23', skillId: 'skill-8', text: 'What is the CAP theorem?', options: ['Consistency, Availability, Partition tolerance trade-off', 'Cache, Access, Performance model', 'Compute, Analyze, Process framework', 'Client, API, Provider pattern'], correctAnswer: 0, difficulty: 'medium', explanation: 'CAP theorem states distributed systems can guarantee at most 2 of 3.' },
  { id: 'q-24', skillId: 'skill-8', text: 'How does consistent hashing solve the rehashing problem?', options: ['By mapping servers and keys to a ring, minimizing key redistribution', 'By using random assignment', 'By duplicating all data', 'By sorting hash values'], correctAnswer: 0, difficulty: 'hard', explanation: 'Consistent hashing maps both keys and servers to a ring.' },
  // Agile (skill-9)
  { id: 'q-25', skillId: 'skill-9', text: 'What is a Sprint in Scrum?', options: ['A planning meeting', 'A time-boxed iteration', 'A testing phase', 'A deployment step'], correctAnswer: 1, difficulty: 'easy', explanation: 'A Sprint is a time-boxed development iteration.' },
  { id: 'q-26', skillId: 'skill-9', text: 'What is the difference between a Product Backlog and Sprint Backlog?', options: ['Product backlog is all items, sprint backlog is selected for current sprint', 'They are the same', 'Sprint backlog is longer term', 'Product backlog is owned by developers'], correctAnswer: 0, difficulty: 'medium', explanation: 'Product Backlog contains all work items; Sprint Backlog contains items for the current sprint.' },
  // Data Analysis (skill-10)
  { id: 'q-27', skillId: 'skill-10', text: 'What is the median?', options: ['The average value', 'The middle value in a sorted dataset', 'The most frequent value', 'The range of values'], correctAnswer: 1, difficulty: 'easy', explanation: 'The median is the middle value when data is sorted.' },
  { id: 'q-28', skillId: 'skill-10', text: 'What is the difference between correlation and causation?', options: ['Correlation implies relationship, causation implies one causes the other', 'They are the same', 'Causation is weaker', 'Correlation requires experiments'], correctAnswer: 0, difficulty: 'medium', explanation: 'Correlation shows relationship; causation means one directly affects the other.' },
  // UX Design (skill-11)
  { id: 'q-29', skillId: 'skill-11', text: 'What is a wireframe?', options: ['Final design mockup', 'Low-fidelity layout sketch', 'Code prototype', 'User test script'], correctAnswer: 1, difficulty: 'easy', explanation: 'A wireframe is a low-fidelity representation of a page layout.' },
  { id: 'q-30', skillId: 'skill-11', text: "What is Fitts's Law?", options: ['Time to target depends on distance and target size', 'Users read left to right', 'Simple designs are better', 'Color affects usability'], correctAnswer: 0, difficulty: 'medium', explanation: "Fitts's Law states that time to reach a target depends on distance and size." },
  // SEO (skill-12)
  { id: 'q-31', skillId: 'skill-12', text: 'What does SEO stand for?', options: ['Search Engine Optimization', 'Site Enhancement Operation', 'Search Entry Output', 'Social Engagement Online'], correctAnswer: 0, difficulty: 'easy', explanation: 'SEO stands for Search Engine Optimization.' },
  { id: 'q-32', skillId: 'skill-12', text: 'What are canonical tags used for?', options: ['Styling pages', 'Indicating preferred URL for duplicate content', 'Tracking users', 'Compressing images'], correctAnswer: 1, difficulty: 'medium', explanation: 'Canonical tags tell search engines which URL is the preferred version.' },
];

export const courses: Course[] = [
  { id: 'course-1', title: 'Advanced React Patterns', description: 'Master advanced React patterns including render props, compound components, and hooks.', skillId: 'skill-1', duration: '20 hours', level: 'advanced', provider: 'Frontend Masters', url: '#', thumbnail: '' },
  { id: 'course-2', title: 'TypeScript Deep Dive', description: 'Comprehensive TypeScript course covering generics, utility types, and advanced patterns.', skillId: 'skill-2', duration: '15 hours', level: 'intermediate', provider: 'Udemy', url: '#', thumbnail: '' },
  { id: 'course-3', title: 'Node.js Microservices', description: 'Build production-ready microservices with Node.js.', skillId: 'skill-3', duration: '25 hours', level: 'advanced', provider: 'Pluralsight', url: '#', thumbnail: '' },
  { id: 'course-4', title: 'Python for Data Science', description: 'Learn Python with pandas, numpy, and matplotlib.', skillId: 'skill-4', duration: '30 hours', level: 'intermediate', provider: 'Coursera', url: '#', thumbnail: '' },
  { id: 'course-5', title: 'AWS Solutions Architect', description: 'Prepare for the AWS SAA certification exam.', skillId: 'skill-5', duration: '40 hours', level: 'advanced', provider: 'A Cloud Guru', url: '#', thumbnail: '' },
  { id: 'course-6', title: 'Docker & Kubernetes Mastery', description: 'Container orchestration from zero to production.', skillId: 'skill-6', duration: '22 hours', level: 'intermediate', provider: 'Udemy', url: '#', thumbnail: '' },
  { id: 'course-7', title: 'SQL Performance Tuning', description: 'Optimize queries and database performance.', skillId: 'skill-7', duration: '12 hours', level: 'advanced', provider: 'LinkedIn Learning', url: '#', thumbnail: '' },
  { id: 'course-8', title: 'System Design Interview Prep', description: 'Design scalable systems from scratch.', skillId: 'skill-8', duration: '18 hours', level: 'advanced', provider: 'Educative', url: '#', thumbnail: '' },
  { id: 'course-9', title: 'Certified Scrum Master', description: 'Learn Scrum framework and prepare for CSM certification.', skillId: 'skill-9', duration: '16 hours', level: 'intermediate', provider: 'Scrum Alliance', url: '#', thumbnail: '' },
  { id: 'course-10', title: 'Data Analytics with Excel & Tableau', description: 'Business intelligence and data visualization.', skillId: 'skill-10', duration: '20 hours', level: 'beginner', provider: 'Coursera', url: '#', thumbnail: '' },
  { id: 'course-11', title: 'UX Design Fundamentals', description: 'User research, wireframing, and prototyping.', skillId: 'skill-11', duration: '24 hours', level: 'beginner', provider: 'Google', url: '#', thumbnail: '' },
  { id: 'course-12', title: 'React Fundamentals', description: 'Getting started with React.js from scratch.', skillId: 'skill-1', duration: '10 hours', level: 'beginner', provider: 'freeCodeCamp', url: '#', thumbnail: '' },
  { id: 'course-13', title: 'Advanced SQL Workshop', description: 'Window functions, CTEs, and query optimization.', skillId: 'skill-7', duration: '8 hours', level: 'intermediate', provider: 'DataCamp', url: '#', thumbnail: '' },
  { id: 'course-14', title: 'SEO Mastery', description: 'Complete guide to modern SEO strategies.', skillId: 'skill-12', duration: '14 hours', level: 'intermediate', provider: 'Moz Academy', url: '#', thumbnail: '' },
  { id: 'course-15', title: 'Cloud Architecture Patterns', description: 'Design patterns for cloud-native applications.', skillId: 'skill-5', duration: '16 hours', level: 'intermediate', provider: 'AWS Training', url: '#', thumbnail: '' },
];

export const certifications: Certification[] = [
  { id: 'cert-1', name: 'AWS Solutions Architect Associate', provider: 'Amazon', skillId: 'skill-5', earnedDate: '2025-06-01', expiryDate: '2026-06-01', status: 'active' },
  { id: 'cert-2', name: 'Certified Kubernetes Administrator', provider: 'CNCF', skillId: 'skill-6', earnedDate: '2025-03-15', expiryDate: '2026-03-15', status: 'expiring' },
  { id: 'cert-3', name: 'Professional Scrum Master I', provider: 'Scrum.org', skillId: 'skill-9', earnedDate: '2025-01-10', expiryDate: '2027-01-10', status: 'active' },
  { id: 'cert-4', name: 'Google UX Design Certificate', provider: 'Google', skillId: 'skill-11', earnedDate: '2024-08-20', expiryDate: '2025-08-20', status: 'expired' },
  { id: 'cert-5', name: 'Meta Frontend Developer', provider: 'Meta', skillId: 'skill-1', earnedDate: '2025-09-01', expiryDate: '2027-09-01', status: 'active' },
  { id: 'cert-6', name: 'Microsoft Azure Fundamentals', provider: 'Microsoft', skillId: 'skill-5', earnedDate: '2025-04-10', expiryDate: '2027-04-10', status: 'active' },
  { id: 'cert-7', name: 'Oracle SQL Certified', provider: 'Oracle', skillId: 'skill-7', earnedDate: '2024-12-01', expiryDate: '2025-12-01', status: 'expired' },
  { id: 'cert-8', name: 'Google Data Analytics', provider: 'Google', skillId: 'skill-10', earnedDate: '2025-07-15', expiryDate: '2027-07-15', status: 'active' },
  { id: 'cert-9', name: 'HubSpot SEO Certification', provider: 'HubSpot', skillId: 'skill-12', earnedDate: '2025-10-01', expiryDate: '2026-10-01', status: 'active' },
  { id: 'cert-10', name: 'Docker Certified Associate', provider: 'Docker', skillId: 'skill-6', earnedDate: '2025-05-20', expiryDate: '2026-05-20', status: 'active' },
];

export const employeeCourses: EmployeeCourse[] = [
  { courseId: 'course-1', employeeId: 'user-1', progress: 75, startedDate: '2025-11-01', status: 'in-progress' },
  { courseId: 'course-2', employeeId: 'user-1', progress: 100, startedDate: '2025-09-01', completedDate: '2025-10-15', status: 'completed' },
  { courseId: 'course-8', employeeId: 'user-1', progress: 20, startedDate: '2025-12-15', status: 'in-progress' },
  { courseId: 'course-1', employeeId: 'user-2', progress: 100, startedDate: '2025-08-01', completedDate: '2025-09-20', status: 'completed' },
  { courseId: 'course-2', employeeId: 'user-2', progress: 60, startedDate: '2025-12-01', status: 'in-progress' },
  { courseId: 'course-3', employeeId: 'user-3', progress: 45, startedDate: '2025-11-15', status: 'in-progress' },
  { courseId: 'course-5', employeeId: 'user-3', progress: 10, startedDate: '2026-01-05', status: 'in-progress' },
  { courseId: 'course-9', employeeId: 'user-4', progress: 100, startedDate: '2025-10-01', completedDate: '2025-11-30', status: 'completed' },
  { courseId: 'course-10', employeeId: 'user-4', progress: 30, startedDate: '2025-12-10', status: 'in-progress' },
  { courseId: 'course-11', employeeId: 'user-5', progress: 80, startedDate: '2025-11-01', status: 'in-progress' },
  { courseId: 'course-14', employeeId: 'user-6', progress: 55, startedDate: '2025-12-05', status: 'in-progress' },
  { courseId: 'course-6', employeeId: 'user-7', progress: 100, startedDate: '2025-09-15', completedDate: '2025-11-01', status: 'completed' },
  { courseId: 'course-7', employeeId: 'user-7', progress: 40, startedDate: '2025-12-20', status: 'in-progress' },
  { courseId: 'course-12', employeeId: 'user-9', progress: 65, startedDate: '2025-11-10', status: 'in-progress' },
];

export const employeeCertifications: EmployeeCertification[] = [
  { certificationId: 'cert-5', employeeId: 'user-1', earnedDate: '2025-09-01', expiryDate: '2027-09-01' },
  { certificationId: 'cert-1', employeeId: 'user-3', earnedDate: '2025-06-01', expiryDate: '2026-06-01' },
  { certificationId: 'cert-2', employeeId: 'user-7', earnedDate: '2025-03-15', expiryDate: '2026-03-15' },
  { certificationId: 'cert-10', employeeId: 'user-7', earnedDate: '2025-05-20', expiryDate: '2026-05-20' },
  { certificationId: 'cert-3', employeeId: 'user-4', earnedDate: '2025-01-10', expiryDate: '2027-01-10' },
  { certificationId: 'cert-3', employeeId: 'user-5', earnedDate: '2025-01-10', expiryDate: '2027-01-10' },
  { certificationId: 'cert-4', employeeId: 'user-5', earnedDate: '2024-08-20', expiryDate: '2025-08-20' },
  { certificationId: 'cert-8', employeeId: 'user-4', earnedDate: '2025-07-15', expiryDate: '2027-07-15' },
  { certificationId: 'cert-9', employeeId: 'user-8', earnedDate: '2025-10-01', expiryDate: '2026-10-01' },
  { certificationId: 'cert-7', employeeId: 'user-3', earnedDate: '2024-12-01', expiryDate: '2025-12-01' },
];

export const assessmentHistory: Assessment[] = [
  { id: 'assess-1', employeeId: 'user-1', skillId: 'skill-1', date: '2025-12-15', score: 82, totalQuestions: 10, correctAnswers: 8, timeSpent: 420, difficulty: 'medium', status: 'completed' },
  { id: 'assess-2', employeeId: 'user-1', skillId: 'skill-2', date: '2025-11-20', score: 58, totalQuestions: 10, correctAnswers: 6, timeSpent: 380, difficulty: 'easy', status: 'completed' },
  { id: 'assess-3', employeeId: 'user-1', skillId: 'skill-1', date: '2025-10-10', score: 72, totalQuestions: 10, correctAnswers: 7, timeSpent: 450, difficulty: 'medium', status: 'completed' },
  { id: 'assess-4', employeeId: 'user-1', skillId: 'skill-8', date: '2025-10-05', score: 30, totalQuestions: 10, correctAnswers: 3, timeSpent: 500, difficulty: 'easy', status: 'completed' },
  { id: 'assess-5', employeeId: 'user-2', skillId: 'skill-1', date: '2026-01-10', score: 95, totalQuestions: 10, correctAnswers: 10, timeSpent: 300, difficulty: 'hard', status: 'completed' },
  { id: 'assess-6', employeeId: 'user-2', skillId: 'skill-2', date: '2025-12-20', score: 78, totalQuestions: 10, correctAnswers: 8, timeSpent: 360, difficulty: 'medium', status: 'completed' },
  { id: 'assess-7', employeeId: 'user-3', skillId: 'skill-3', date: '2026-01-15', score: 75, totalQuestions: 10, correctAnswers: 7, timeSpent: 400, difficulty: 'medium', status: 'completed' },
  { id: 'assess-8', employeeId: 'user-3', skillId: 'skill-7', date: '2026-01-08', score: 72, totalQuestions: 10, correctAnswers: 7, timeSpent: 350, difficulty: 'medium', status: 'completed' },
];

// Helper functions for relational filtering
export function getEmployeesForManager(managerId: string): User[] {
  return users.filter(u => u.role === 'employee' && u.managerId === managerId);
}

export function getManagerForEmployee(employeeId: string): User | undefined {
  const employee = users.find(u => u.id === employeeId);
  if (!employee?.managerId) return undefined;
  return users.find(u => u.id === employee.managerId);
}

export function getAllManagers(): User[] {
  return users.filter(u => u.role === 'manager');
}

export function getAllEmployees(): User[] {
  return users.filter(u => u.role === 'employee');
}

export function getAllStudents(): User[] {
  return users.filter(u => u.role === 'student');
}

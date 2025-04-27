export const mockDocuments = [
  {
    id: '1',
    name: 'annual-report-2023.pdf',
    type: 'PDF',
    size: '4.2 MB',
    uploadedAt: '2 hours ago',
    tags: ['finance', 'annual', 'report'],
  },
  {
    id: '2',

    name: 'project-proposal.docx',
    type: 'DOCX',
    size: '2.1 MB',
    uploadedAt: '5 hours ago',
    tags: ['project', 'proposal'],
  },
  {
    id: '3',
    name: 'financial-analysis.xlsx',
    type: 'XLSX',
    size: '3.5 MB',
    uploadedAt: '1 day ago',
    tags: ['finance', 'analysis'],
  },
];

export const mockUserActivityLogs = [
  {
    id: '1',
    name: 'Annual Reports Batch',
    status: 'completed' as const,
    progress: 100,
    documentsCount: 5,
    startedAt: '2023-10-15 09:30 AM',
    completedAt: '2023-10-15 09:45 AM',
  },
  {
    id: '2',
    name: 'Financial Documents',
    status: 'processing' as const,
    progress: 65,
    documentsCount: 12,
    startedAt: '2023-10-16 02:15 PM',
  },
  {
    id: '3',
    name: 'Marketing Materials',
    status: 'queued' as const,
    progress: 0,
    documentsCount: 8,
    startedAt: '2023-10-16 03:00 PM',
  },
];

export const mockUsers = [
  {
    id: '1',
    name: 'basavaraj1',
    email: 'basavaraj1@gmail.com',
    role: 'admin' as const,
    status: 'active' as const,
    lastActive: 'Just now',
  },
  {
    id: '2',
    name: 'basavaraj2',
    email: 'basavaraj2@gmail.com',
    role: 'user' as const,
    status: 'active' as const,
    lastActive: '5 minutes ago',
  },
  {
    id: '3',
    name: 'basavaraj3',
    email: 'basavaraj3@gmail.com',
    role: 'user' as const,
    status: 'active' as const,
    lastActive: '1 hour ago',
  },
];

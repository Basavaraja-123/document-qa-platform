
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUserData = {
  id: '1',
  name: 'basavaraj1',
  email: 'basavaraj1@gmail.com',
  role: 'admin' as const,
};

export const mockLogin = async (
  email: string,
  password: string
): Promise<User> => {
  await delay(1000);

  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    throw new Error('No user found');
  }

  const userInfo = JSON.parse(storedUser);
  if (email === userInfo.email && password === userInfo.password) {
    return userInfo;
  }

  throw new Error('Invalid credentials');
};

export const mockSignUp = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  await delay(1500);

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    role: 'user' as const,
    password,
  };

  localStorage.setItem('user', JSON.stringify(newUser));
  return newUser;
};

export const mockLogout = async (): Promise<void> => {
  await delay(500);
  localStorage.removeItem('user');
};

export const mockGetCurrentUser = async (): Promise<User | null> => {
  await delay(800);

  const userJson = localStorage.getItem('user');
  if (!userJson) return null;

  return JSON.parse(userJson);
};

export const mockUploadDocument = async (
  files: File[],
  description: string,
  tags: string[]
): Promise<void> => {
  await delay(2000);

  console.log('Uploaded files:', files);
  console.log('Description:', description);
  console.log('Tags:', tags);
};

interface QuestionResponse {
  answer: string;
  sources: {
    name: string;
    excerpt: string;
  }[];
}

export const mockAskQuestion = async (
  question: string
): Promise<QuestionResponse> => {
  await delay(2000); 


  if (
    question.toLowerCase().includes('financial') ||
    question.toLowerCase().includes('revenue')
  ) {
    return {
      answer:
        'The financial results for Q3 showed a 15% increase in revenue compared to the previous quarter, with total earnings of $2.4M. This growth was primarily driven by the launch of our new product line and expansion into international markets.',
      sources: [
        {
          name: 'annual-report-2023.pdf',
          excerpt:
            'Q3 financial results: Revenue increased by 15% compared to Q2, with total earnings of $2.4M.',
        },
        {
          name: 'financial-analysis.xlsx',
          excerpt:
            'The growth in Q3 was primarily driven by the new product line (contributing 60% of growth) and international expansion (contributing 40% of growth).',
        },
      ],
    };
  } else if (
    question.toLowerCase().includes('marketing') ||
    question.toLowerCase().includes('strategy')
  ) {
    return {
      answer:
        'Our marketing strategy for the next quarter focuses on digital campaigns, influencer partnerships, and expanding into new social media platforms. The budget allocation is 40% for digital ads, 30% for influencer partnerships, 20% for content creation, and 10% for analytics and optimization.',
      sources: [
        {
          name: 'marketing-strategy.pptx',
          excerpt:
            'Q4 Strategy: Focus on digital campaigns, influencer partnerships, and new social media platforms.',
        },
      ],
    };
  } else if (
    question.toLowerCase().includes('project') ||
    question.toLowerCase().includes('proposal')
  ) {
    return {
      answer:
        'The project proposal outlines a 6-month timeline, $150K budget, and aims to increase customer engagement by 25%. The key milestones include research phase (Month 1), development (Months 2-4), testing (Month 5), and launch (Month 6).',
      sources: [
        {
          name: 'project-proposal.docx',
          excerpt:
            'Project timeline: 6 months. Budget: $150K. Goal: Increase customer engagement by 25%.',
        },
      ],
    };
  } else {
    return {
      answer:
        "I don't have specific information about that in my knowledge base. Could you try asking a more specific question related to our financial reports, marketing strategy, or project proposals?",
      sources: [],
    };
  }
};

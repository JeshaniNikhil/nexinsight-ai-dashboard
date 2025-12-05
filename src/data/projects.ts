export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  platform: string;
  budget_min: number;
  budget_max: number;
  skills_required: string[];
  nex_score: number;
  win_probability: number;
  risk_level: string;
  project_url: string;
  posted_at: string;
  client_location?: string;
  client_history?: string;
  deliverables?: string[];
  requirements?: string[];
}

export const dummyProjectDetails: ProjectDetail[] = [
  {
    id: "dummy-1",
    title: "AI-Powered Proposal Analyzer",
    description: "Build a Next.js tool that evaluates freelance proposals using NLP and sentiment analysis to highlight risks and opportunities.",
    platform: "upwork",
    budget_min: 1200,
    budget_max: 1800,
    skills_required: ["Next.js", "TypeScript", "OpenAI", "Tailwind CSS"],
    nex_score: 88,
    win_probability: 74,
    risk_level: "low",
    project_url: "https://www.upwork.com/jobs/~example1",
    posted_at: "2025-11-28T10:00:00Z",
    client_location: "San Francisco, USA",
    client_history: "38 jobs posted • 95% hire rate • $120k total spend",
    deliverables: [
      "Proposal intelligence dashboard",
      "Sentiment analysis pipeline",
      "Risk/opportunity scoring system"
    ],
    requirements: [
      "Experience with OpenAI or similar LLMs",
      "Knowledge of freelance marketplaces",
      "Ability to deploy on Vercel"
    ]
  },
  {
    id: "dummy-2",
    title: "Realtime Bid Automation Agent",
    description: "Create an automation agent that monitors Freelancer.com listings and drafts personalized bids based on predefined playbooks.",
    platform: "freelancer",
    budget_min: 900,
    budget_max: 1500,
    skills_required: ["Python", "Supabase", "LangChain", "Automation"],
    nex_score: 82,
    win_probability: 68,
    risk_level: "medium",
    project_url: "https://www.freelancer.com/projects/example2",
    posted_at: "2025-11-26T14:30:00Z",
    client_location: "Berlin, Germany",
    client_history: "12 jobs posted • 88% hire rate • $35k total spend",
    deliverables: [
      "Monitoring agent",
      "Playbook editor UI",
      "Bid submission workflow"
    ],
    requirements: [
      "LangChain experience",
      "Supabase row level security understanding",
      "Strong Python automation background"
    ]
  },
  {
    id: "dummy-3",
    title: "Voice-Enabled Client Discovery Bot",
    description: "Develop a Chrome extension that uses speech-to-text and AI to summarize client calls and suggest follow-up actions in real time.",
    platform: "fiverr",
    budget_min: 600,
    budget_max: 1100,
    skills_required: ["Chrome Extensions", "React", "Whisper", "UI/UX"],
    nex_score: 76,
    win_probability: 63,
    risk_level: "medium",
    project_url: "https://www.fiverr.com/example3",
    posted_at: "2025-11-25T09:15:00Z",
    client_location: "Sydney, Australia",
    client_history: "22 jobs posted • 90% hire rate • $48k total spend",
    deliverables: [
      "Chrome extension MVP",
      "Realtime transcription layer",
      "Insights dashboard"
    ],
    requirements: [
      "Familiarity with Whisper or similar",
      "Chrome extension publishing knowledge",
      "Strong UI polish"
    ]
  }
];

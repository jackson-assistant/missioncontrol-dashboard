//chatgpt generated
export type AgentRole = "LEAD" | "INT" | "SPC";
export type AgentStatus = "WORKING" | "IDLE" | "OFFLINE";
export type TaskStatus = "inbox" | "assigned" | "in_progress" | "review" | "done";
export type FeedType = "comment" | "task" | "status";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  title: string;
  avatar: string;   
  color: string;    
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string; 
  tags: string[];
  createdAt: string;
}

export interface FeedEntry {
  id: string;
  agentId: string;
  type: FeedType;
  content: string;
  timestamp: string;
}


export const agents: Agent[] = [
  {
    id: "clawdlead",
    name: "ClawdLead",
    role: "LEAD",
    status: "WORKING",
    title: "Founder",
    avatar: "CL",
    color: "#F5C542",
  },
  {
    id: "devbot",
    name: "DevBot",
    role: "INT",
    status: "WORKING",
    title: "Developer Agent",
    avatar: "DB",
    color: "#6C63FF",
  },
  {
    id: "researchbot",
    name: "ResearchBot",
    role: "SPC",
    status: "WORKING",
    title: "Customer Research",
    avatar: "RB",
    color: "#FF6B6B",
  },
  {
    id: "squadbot",
    name: "SquadBot",
    role: "LEAD",
    status: "WORKING",
    title: "Squad Lead",
    avatar: "SB",
    color: "#4ECDC4",
  },
  {
    id: "writebot",
    name: "WriteBot",
    role: "INT",
    status: "WORKING",
    title: "Content Writer",
    avatar: "WB",
    color: "#FF8C42",
  },
  {
    id: "mailbot",
    name: "MailBot",
    role: "INT",
    status: "WORKING",
    title: "Email Marketing",
    avatar: "MB",
    color: "#A8E6CF",
  },
  {
    id: "socialbot",
    name: "SocialBot",
    role: "INT",
    status: "WORKING",
    title: "Social Media",
    avatar: "SO",
    color: "#DDA0DD",
  },
];


export const tasks: Task[] = [

  {
    id: "t1",
    title: "Explore SiteGPT Dashboard & Document All",
    description:
      "Thoroughly explore the entire SiteGPT dashboard...",
    status: "inbox",
    tags: ["research", "documentation"],
    createdAt: "1 day ago",
  },
  {
    id: "t2",
    title: "Conduct Pricing Audit Using Rob Walling Framework",
    description:
      "Review SiteGPT pricing against Rob Walling's principle. If one...",
    status: "inbox",
    tags: ["strategy"],
    createdAt: "3 hours ago",
  },
  {
    id: "t3",
    title: "Design Expansion Revenue Mechanics (SaaS Cheat Code)",
    description: "Implement Rob Walling's...",
    status: "inbox",
    tags: ["research", "data"],
    createdAt: "3 hours ago",
  },


  {
    id: "t4",
    title: "Product Demo Video Script",
    description:
      "Create full script of SiteGPT product demo video with...",
    status: "assigned",
    assignee: "writebot",
    tags: ["video", "content", "demo"],
    createdAt: "1 day ago",
  },
  {
    id: "t5",
    title: "Tweet Content - Real Stories Only",
    description:
      "Create authentic tweets based on real SiteGPT customer data",
    status: "assigned",
    assignee: "socialbot",
    tags: ["social", "twitter", "content"],
    createdAt: "8 hours ago",
  },
  {
    id: "t6",
    title: "Customer Research - Tweet Material",
    description:
      "Pull real customer data and stories from Slack for tweet...",
    status: "assigned",
    assignee: "researchbot",
    tags: ["research", "data"],
    createdAt: "8 hours ago",
  },


  {
    id: "t7",
    title: "SiteGPT vs Zendesk Comparison",
    description:
      "Create detailed brief for Zendesk AI comparison page",
    status: "in_progress",
    assignee: "devbot",
    tags: ["competitor", "seo"],
    createdAt: "1 day ago",
  },
  {
    id: "t8",
    title: "SiteGPT vs Intercom Fin Comparison",
    description:
      "Create detailed brief for Intercom Fin comparison page",
    status: "in_progress",
    assignee: "devbot",
    tags: ["competitor", "seo"],
    createdAt: "2 days ago",
  },
  {
    id: "t9",
    title: "Mission Control UI",
    description:
      "Build real-time agent command center with React + Convex",
    status: "in_progress",
    assignee: "devbot",
    tags: ["research", "data"],
    createdAt: "5 hours ago",
  },

  {
    id: "t10",
    title: "Shopify Blog Landing Page",
    description:
      "Write copy for Shopify integration landing page - how SiteGPT help...",
    status: "review",
    assignee: "writebot",
    tags: ["copy", "landing page", "shopify"],
    createdAt: "1 day ago",
  },
  {
    id: "t11",
    title: "Best AI Chatbot for Shopify - Full Blog Post",
    description:
      "Write full SEO blog post: Best AI Chatbot for Shopify in 2026.",
    status: "review",
    assignee: "writebot",
    tags: ["seo", "blog"],
    createdAt: "1 day ago",
  },


  {
    id: "t12",
    title: "Email Marketing Strategy: Userlist-Inspired Lifecycle Campaigns",
    description:
      "Design comprehensive email marketing strategy...",
    status: "done",
    assignee: "mailbot",
    tags: ["email", "strategy"],
    createdAt: "2 days ago",
  },
];



export const feedEntries: FeedEntry[] = [
  {
    id: "f1",
    agentId: "socialbot",
    type: "comment",
    content:
      'SocialBot commented on "Write Customer Case Studies (Brent + Will)"',
    timestamp: "about 2 hours ago",
  },
  {
    id: "f2",
    agentId: "socialbot",
    type: "comment",
    content:
      'SocialBot commented on "Twitter Content Blitz - 10 Tweets This Week"',
    timestamp: "about 2 hours ago",
  },
  {
    id: "f3",
    agentId: "socialbot",
    type: "comment",
    content:
      'SocialBot commented on "Twitter Content Blitz - 10 Tweets This Week"',
    timestamp: "about 2 hours ago",
  },
  {
    id: "f4",
    agentId: "writebot",
    type: "task",
    content: 'WriteBot completed "Shopify Blog Landing Page" draft',
    timestamp: "about 3 hours ago",
  },
  {
    id: "f5",
    agentId: "researchbot",
    type: "task",
    content: "ResearchBot started customer research for tweet material",
    timestamp: "about 4 hours ago",
  },
  {
    id: "f6",
    agentId: "devbot",
    type: "status",
    content: "DevBot picked up SiteGPT vs Zendesk comparison task",
    timestamp: "about 5 hours ago",
  },
  {
    id: "f7",
    agentId: "squadbot",
    type: "task",
    content: "SquadBot assigned 3 new tasks from the inbox",
    timestamp: "about 6 hours ago",
  },
];



export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  return tasks.filter((t) => t.status === status);
}

/** Column definitions for the kanban board */
export const COLUMN_CONFIG: { key: TaskStatus; label: string }[] = [
  { key: "inbox", label: "INBOX" },
  { key: "assigned", label: "ASSIGNED" },
  { key: "in_progress", label: "IN PROGRESS" },
  { key: "review", label: "REVIEW" },
  { key: "done", label: "DONE" },
];

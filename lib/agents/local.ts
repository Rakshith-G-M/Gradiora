import type {
  UserProfile,
  RoadmapNode,
  Question,
  ScoreBreakdown,
  ReportData,
  AnswerRecord,
  InterviewRole,
} from "./types";
import { ROLE_LABELS, INTERVIEW_ROLES } from "./config";
import frontendData from "@/data/frontend-questions.json";
import backendData from "@/data/backend-questions.json";
import aimlData from "@/data/aiml-questions.json";
import hrData from "@/data/hr-questions.json";
import pythonData from "@/data/python-questions.json";

const DATASETS: Record<string, Question[]> = {
  frontend: frontendData as Question[],
  backend: backendData as Question[],
  aiml: aimlData as Question[],
  hr: hrData as Question[],
  python: pythonData as Question[],
};

function normalizeRole(role: string): InterviewRole {
  const r = role.toLowerCase().trim();
  if (INTERVIEW_ROLES.includes(r as InterviewRole)) return r as InterviewRole;
  return "frontend";
}

export function localProfile(rawMessage: string): UserProfile {
  const lower = rawMessage.toLowerCase();
  const targetRole = lower.includes("back") ? "backend"
    : lower.includes("ai") || lower.includes("ml") ? "aiml"
    : lower.includes("python") || lower.includes("py") ? "python"
    : lower.includes("hr") ? "hr"
    : lower.includes("full") ? "fullstack"
    : lower.includes("devops") ? "devops"
    : lower.includes("mobile") ? "mobile"
    : "frontend";

  const yearsMatch = rawMessage.match(/(\d+)\s*(?:years?|yrs?)/i);
  const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;
  const isSenior = lower.includes("senior") || years > 5;
  const isMid = years > 2;

  const weaknesses = rawMessage.match(/(?:weak(?:ness|nesses?)|(?:need|want)\s+to\s+improve)\s*:?\s*([^.]+)/i);
  const strengths = rawMessage.match(/(?:strength(?:s)?|good\s+(?:at|with))\s*:?\s*([^.]+)/i);
  const timeline = rawMessage.match(/(\d+)\s*(?:weeks?|months?)/i);
  const weeks = timeline ? parseInt(timeline[1]) : 4;

  return {
    currentRole: rawMessage.split(/[.,\n]/)[0]?.trim() ?? "",
    targetRole,
    experienceLevel: isSenior ? "advanced" : isMid ? "intermediate" : "beginner",
    yearsOfExperience: years || 1,
    strengths: strengths ? strengths[1].split(",").map((s) => s.trim()).filter(Boolean) : [],
    weaknesses: weaknesses ? weaknesses[1].split(",").map((s) => s.trim()).filter(Boolean) : ["general improvement"],
    goals: [`Interview ready in ${weeks} weeks`],
    timelineWeeks: weeks,
    topicsCompleted: [],
    completed: true,
  };
}

const ROADMAP_TEMPLATES: Record<string, RoadmapNode> = {
  frontend: {
    id: "root", label: "Frontend Developer Roadmap", description: "Complete frontend interview preparation", progress: 0,
    children: [
      { id: "phase-1", label: "Foundations", description: "HTML, CSS, JavaScript basics", progress: 0, children: [
        { id: "skill-1", label: "HTML5 & CSS3", description: "Semantic HTML, flexbox, grid, responsive design", progress: 0, children: [
          { id: "topic-1", label: "Semantic HTML", description: "Proper document structure and accessibility", progress: 0, children: [] },
          { id: "topic-2", label: "CSS Layouts", description: "Flexbox, Grid, positioning", progress: 0, children: [] },
        ]},
        { id: "skill-2", label: "JavaScript Core", description: "ES6+, closures, promises, async/await", progress: 0, children: [
          { id: "topic-3", label: "Data Structures", description: "Arrays, objects, maps, sets", progress: 0, children: [] },
          { id: "topic-4", label: "Async Patterns", description: "Callbacks, promises, async/await, event loop", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-2", label: "Core Skills", description: "Frameworks, tooling, testing", progress: 0, children: [
        { id: "skill-3", label: "React", description: "Components, hooks, state management", progress: 0, children: [
          { id: "topic-5", label: "Component Lifecycle", description: "Mount, update, unmount patterns", progress: 0, children: [] },
          { id: "topic-6", label: "State Management", description: "Context, Redux, Zustand", progress: 0, children: [] },
        ]},
        { id: "skill-4", label: "Build Tools", description: "Webpack, Vite, npm", progress: 0, children: [
          { id: "topic-7", label: "Module Bundlers", description: "Webpack config, code splitting", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-3", label: "Interview Prep", description: "Mock interviews, system design", progress: 0, children: [
        { id: "skill-5", label: "Coding Challenges", description: "Algorithms, data structures", progress: 0, children: [
          { id: "topic-8", label: "Common Patterns", description: "Two pointers, sliding window, recursion", progress: 0, children: [] },
        ]},
      ]},
    ],
  },
  backend: {
    id: "root", label: "Backend Developer Roadmap", description: "Complete backend interview preparation", progress: 0,
    children: [
      { id: "phase-1", label: "Programming Core", description: "Language fundamentals, OOP, design patterns", progress: 0, children: [
        { id: "skill-1", label: "Language Deep Dive", description: "Java/Python/Node.js fundamentals", progress: 0, children: [
          { id: "topic-1", label: "OOP Principles", description: "Inheritance, polymorphism, encapsulation", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-2", label: "System Design", description: "Architecture, scaling, databases", progress: 0, children: [
        { id: "skill-2", label: "Databases", description: "SQL, NoSQL, indexing, optimization", progress: 0, children: [
          { id: "topic-2", label: "SQL Queries", description: "Joins, aggregations, subqueries", progress: 0, children: [] },
        ]},
        { id: "skill-3", label: "API Design", description: "REST, GraphQL, gRPC", progress: 0, children: [
          { id: "topic-3", label: "RESTful APIs", description: "Resource design, status codes, versioning", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-3", label: "Interview Prep", description: "System design interviews, coding rounds", progress: 0, children: [
        { id: "skill-4", label: "System Design", description: "Distributed systems, caching, load balancing", progress: 0, children: [
          { id: "topic-4", label: "Design Patterns", description: "Singleton, factory, observer, strategy", progress: 0, children: [] },
        ]},
      ]},
    ],
  },
  aiml: {
    id: "root", label: "AI/ML Engineer Roadmap", description: "Complete AI/ML interview preparation", progress: 0,
    children: [
      { id: "phase-1", label: "Mathematics", description: "Linear algebra, calculus, probability", progress: 0, children: [
        { id: "skill-1", label: "Linear Algebra", description: "Matrices, vectors, eigenvalues", progress: 0, children: [
          { id: "topic-1", label: "Matrix Operations", description: "Multiplication, transpose, inverse", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-2", label: "ML Fundamentals", description: "Supervised, unsupervised, deep learning", progress: 0, children: [
        { id: "skill-2", label: "Supervised Learning", description: "Regression, classification, trees", progress: 0, children: [
          { id: "topic-2", label: "Linear Regression", description: "Gradient descent, cost functions", progress: 0, children: [] },
        ]},
        { id: "skill-3", label: "Deep Learning", description: "Neural networks, CNNs, RNNs", progress: 0, children: [
          { id: "topic-3", label: "Neural Networks", description: "Backpropagation, activation functions", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-3", label: "MLOps & Deployment", description: "Pipeline, monitoring, serving", progress: 0, children: [
        { id: "skill-4", label: "Model Deployment", description: "Docker, Kubernetes, API serving", progress: 0, children: [
          { id: "topic-4", label: "Serving Patterns", description: "Batch vs real-time, scaling", progress: 0, children: [] },
        ]},
      ]},
    ],
  },
  hr: {
    id: "root", label: "HR Interview Roadmap", description: "Complete HR interview preparation", progress: 0,
    children: [
      { id: "phase-1", label: "Core HR Knowledge", description: "Employment law, compensation, culture", progress: 0, children: [
        { id: "skill-1", label: "Employment Law", description: "Labor laws, compliance, regulations", progress: 0, children: [
          { id: "topic-1", label: "Key Regulations", description: "FMLA, ADA, FLSA, EEOC", progress: 0, children: [] },
        ]},
        { id: "skill-2", label: "Compensation", description: "Salary bands, equity, benefits", progress: 0, children: [
          { id: "topic-2", label: "Total Rewards", description: "Base, bonus, equity, benefits structure", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-2", label: "Talent Management", description: "Recruiting, interviewing, retention", progress: 0, children: [
        { id: "skill-3", label: "Recruiting", description: "Sourcing, screening, offer management", progress: 0, children: [
          { id: "topic-3", label: "Interviewing", description: "Structured interviews, bias reduction", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-3", label: "Interview Prep", description: "HR-specific scenarios", progress: 0, children: [
        { id: "skill-4", label: "Behavioral Questions", description: "STAR method, scenarios", progress: 0, children: [
          { id: "topic-4", label: "Common Scenarios", description: "Conflict resolution, culture fit", progress: 0, children: [] },
        ]},
      ]},
    ],
  },
  python: {
    id: "root", label: "Python Developer Roadmap", description: "Complete Python interview preparation", progress: 0,
    children: [
      { id: "phase-1", label: "Python Core", description: "Language fundamentals, advanced features", progress: 0, children: [
        { id: "skill-1", label: "Python Deep Dive", description: "Decorators, generators, context managers", progress: 0, children: [
          { id: "topic-1", label: "Advanced Functions", description: "Decorators, closures, partials", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-2", label: "Frameworks & Tools", description: "Django, FastAPI, testing", progress: 0, children: [
        { id: "skill-2", label: "Web Frameworks", description: "Django, FastAPI, Flask", progress: 0, children: [
          { id: "topic-2", label: "REST APIs", description: "DRF, FastAPI routers, middleware", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-3", label: "Interview Prep", description: "Python-specific patterns", progress: 0, children: [
        { id: "skill-3", label: "Coding Challenges", description: "Python-specific algorithms", progress: 0, children: [
          { id: "topic-3", label: "Common Problems", description: "List comprehensions, generators, itertools", progress: 0, children: [] },
        ]},
      ]},
    ],
  },
};

export function localRoadmap(profile: UserProfile): RoadmapNode {
  const template = ROADMAP_TEMPLATES[profile.targetRole];
  if (template) return JSON.parse(JSON.stringify(template));

  return {
    id: "root",
    label: `${ROLE_LABELS[profile.targetRole] ?? "Developer"} Roadmap`,
    description: "Personalized interview preparation roadmap",
    progress: 0,
    children: [
      { id: "phase-1", label: "Fundamentals", description: "Core concepts review", progress: 0, children: [
        { id: "skill-1", label: "Core Skills", description: "Role-specific fundamentals", progress: 0, children: [
          { id: "topic-1", label: "Key Concepts", description: "Essential knowledge areas", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-2", label: "Advanced Topics", description: "Deep dive into advanced areas", progress: 0, children: [
        { id: "skill-2", label: "Advanced Skills", description: "Expert-level topics", progress: 0, children: [
          { id: "topic-2", label: "Specialized Areas", description: "Role-specific advanced topics", progress: 0, children: [] },
        ]},
      ]},
      { id: "phase-3", label: "Interview Prep", description: "Mock interviews and practice", progress: 0, children: [
        { id: "skill-3", label: "Practice", description: "Mock interview preparation", progress: 0, children: [
          { id: "topic-3", label: "Common Questions", description: "Frequently asked interview questions", progress: 0, children: [] },
        ]},
      ]},
    ],
  };
}

export function localQuestions(role: string, count = 5): Question[] {
  const normalized = normalizeRole(role);
  const dataset = DATASETS[normalized];
  if (!dataset || dataset.length === 0) {
    return [
      { id: "q-1", question: `Tell me about your experience with ${normalized} development.`, difficulty: "medium", keywords: ["experience", normalized], expectedConcepts: ["relevant experience", "technical skills"], idealAnswerSummary: "Focus on specific projects and technologies used." },
      { id: "q-2", question: "Describe a challenging project you worked on.", difficulty: "medium", keywords: ["challenge", "project"], expectedConcepts: ["problem-solving", "technical approach"], idealAnswerSummary: "Describe the problem, approach, and outcome." },
      { id: "q-3", question: "How do you stay updated with industry trends?", difficulty: "easy", keywords: ["learning", "trends"], expectedConcepts: ["continuous learning", "resources"], idealAnswerSummary: "Mention blogs, courses, conferences." },
    ];
  }
  return dataset.slice(0, Math.min(count, dataset.length));
}

export function localEvaluate(question: Question, answer: string): ScoreBreakdown {
  const wordCount = answer.split(/\s+/).length;
  const hasCode = /[{}();]/.test(answer) || /function|const|let|var|import|export|class/.test(answer);
  const hasStructure = /^(first|second|third|finally|in conclusion|to begin|additionally|moreover)/im.test(answer);
  const hasKeywords = question.keywords?.some((k) => answer.toLowerCase().includes(k.toLowerCase())) ?? false;
  const confidentWords = /(will|can|implemented|built|designed|created|solved|delivered)/i.test(answer);
  const hedgingWords = /(maybe|perhaps|i think|i guess|not sure|kind of|sort of)/i.test(answer);
  const isLongEnough = wordCount >= 30;

  const technicalAccuracy = Math.min(100, (hasCode ? 40 : 0) + (hasKeywords ? 30 : 0) + (isLongEnough ? 30 : 0));
  const completeness = Math.min(100, (isLongEnough ? 50 : 10) + (hasStructure ? 30 : 0) + (hasKeywords ? 20 : 0));
  const communication = Math.min(100, (hasStructure ? 40 : 10) + (wordCount > 50 ? 30 : wordCount > 30 ? 20 : 10) + (hasKeywords ? 30 : 0));
  const confidence = Math.min(100, (confidentWords ? 60 : 20) + (hedgingWords ? -20 : 10) + (wordCount > 30 ? 20 : 0));
  const sentiment = Math.min(100, 50 + (confidentWords ? 20 : 0) + (wordCount > 30 ? 15 : 0) + (hedgingWords ? -15 : 0));

  const overall = Math.round((technicalAccuracy * 0.35 + completeness * 0.25 + communication * 0.2 + confidence * 0.1 + sentiment * 0.1));

  const feedback = overall >= 80 ? "Strong answer with good technical depth."
    : overall >= 60 ? "Decent answer. Consider adding more specific examples and technical details."
    : "Room for improvement. Provide more detailed, structured responses with concrete examples.";

  return {
    technicalAccuracy: Math.max(0, Math.min(100, technicalAccuracy)),
    completeness: Math.max(0, Math.min(100, completeness)),
    communication: Math.max(0, Math.min(100, communication)),
    confidence: Math.max(0, Math.min(100, confidence)),
    sentiment: Math.max(0, Math.min(100, sentiment)),
    overall,
    feedback,
  };
}

export function localReport(role: string, answers: AnswerRecord[]): ReportData {
  const n = answers.length;
  if (n === 0) {
    return {
      overallScore: 0, technicalScore: 0, confidenceScore: 0, communicationScore: 0, completenessScore: 0,
      perQuestion: [], strengths: [], improvements: ["Complete at least one interview question"], nextSteps: ["Start your first interview"],
    };
  }

  const avg = (key: keyof ScoreBreakdown) =>
    Math.round(answers.reduce((s, a) => s + (a.scores[key] as number), 0) / n);

  const technicalScore = avg("technicalAccuracy");
  const confidenceScore = avg("confidence");
  const communicationScore = avg("communication");
  const completenessScore = avg("completeness");
  const overallScore = avg("overall");

  const strengths: string[] = [];
  const improvements: string[] = [];
  const nextSteps: string[] = [];

  if (technicalScore >= 70) strengths.push("Strong technical knowledge");
  else improvements.push("Deepen technical understanding");
  if (communicationScore >= 70) strengths.push("Clear communication");
  else improvements.push("Structure answers more clearly");
  if (confidenceScore >= 70) strengths.push("Confident delivery");
  else improvements.push("Use more assertive language");

  nextSteps.push(`Review ${improvements.length > 0 ? improvements[0].toLowerCase() : "advanced topics"}`);
  nextSteps.push("Practice with more mock interviews");
  if (n < 5) nextSteps.push("Complete more questions for a comprehensive assessment");

  return {
    overallScore,
    technicalScore,
    confidenceScore,
    communicationScore,
    completenessScore,
    perQuestion: answers.map((a) => ({
      question: a.questionText,
      score: a.scores.overall,
      feedback: a.scores.feedback,
    })),
    strengths: strengths.length ? strengths : ["Completed the interview"],
    improvements: improvements.length ? improvements : ["Continue practicing"],
    nextSteps,
  };
}



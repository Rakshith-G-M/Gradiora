import type { InterviewRole } from "./types";

export const INTERVIEW_ROLES: InterviewRole[] = [
  "frontend", "backend", "python", "aiml", "hr", "fullstack", "devops", "mobile"
];

export const ROLE_LABELS: Record<InterviewRole, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  python: "Python Developer",
  aiml: "AI/ML Engineer",
  hr: "HR Interview",
  fullstack: "Fullstack Developer",
  devops: "DevOps Engineer",
  mobile: "Mobile Developer",
};

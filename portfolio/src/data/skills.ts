import { SkillCategory } from "@/types/skill";

export const skills: SkillCategory[] = [
  {
    id: "languages",
    label: "Languages",
    course: "starter",
    items: ["C++", "Python", "TypeScript", "JavaScript", "Rust", "R", "MATLAB", "Solidity"],
  },
  {
    id: "ml",
    label: "ML & Algorithms",
    course: "starter",
    items: ["NumPy", "Pandas", "RandomForest", "CNN", "KNN", "XGBoost", "SVM", "Linear Regression"],
  },
  {
    id: "cs",
    label: "CS Fundamentals",
    course: "starter",
    items: ["DSA (Python, C++)", "DBMS", "Operating Systems"],
  },
  {
    id: "web",
    label: "Web & Blockchain",
    course: "main",
    items: ["React", "Next.js", "Node.js", "PostgreSQL", "MySQL", "Solidity", "Ethereum", "IPFS"],
  },
  {
    id: "tools",
    label: "Tools & Infra",
    course: "main",
    items: ["Git", "GitHub", "Hardhat", "Vercel", "RTL-SDR", "LangChain", "Gemini API", "Azure"],
  },
];

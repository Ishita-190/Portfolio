import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "fitflow",
    title: "FitFlow",
    description: "AI-powered fitness trainer using real-time pose detection to track exercises, count reps, correct posture, and guide users with audio feedback. Includes a recipe page, restaurant recommendations, and a women's health section.",
    stack: ["React", "Vite", "TypeScript", "Node.js", "Mediapipe", "Microsoft Azure", "Vercel"],
    live: "https://fit-flow-weignite.vercel.app/",
    github: "https://github.com/Ishita-190/FitFlow_backend",
  },
  {
    id: "ecochain",
    title: "Eco Chain",
    description: "Waste classification system using CNN and MobileNet architectures with 87% accuracy for automated waste segregation. Integrated into a blockchain-based platform that incentivizes responsible waste disposal through eco credit rewards and visual tracking.",
    stack: ["Next.js", "Solidity", "Ethereum", "MobileNet", "TensorFlow", "IPFS", "Hardhat", "Vercel"],
    live: "https://eco-chain-1-s3vi.vercel.app/",
    github: "https://github.com/Ishita-190/Eco_Chain",
  },
  {
    id: "terratrace",
    title: "TerraTrace",
    description: "AI-based platform for communities displaced due to dam construction and deforestation, offering RTI analysis, compensation analysis, complaint systems, and access to legal assistance.",
    stack: ["TypeScript", "Next.js", "Neon", "Gemini API", "LangChain", "Vercel"],
    live: "https://terra-trace-ten.vercel.app/",
    github: "https://terra-trace-ten.vercel.app/",
  },
  {
    id: "briefix",
    title: "Briefix",
    description: "AI-powered legal assistant providing customised explanations, document analysis, legal procedures guide, and an AI chatbot for personalised legal support.",
    stack: ["AI", "React","TypeScript", "NLP", "Netlify"],
    live: "https://briefix.netlify.app/",
    github: "https://github.com/Ishita-190/Briefix",
  },
  {
    id: "cherry",
    title: "Cherry",
    description: "AIML-powered awareness and diagnostic support for women's health. Provides personalised guidance, raises awareness, and supports research for menstrual and reproductive health conditions like PCOD, endometriosis, and related disorders.",
    stack: ["AI/ML", "React", "TypeScript", "Netlify"],
    live: "https://cherryw.netlify.app/",
    github: "https://github.com/Ishita-190/cherry",
  },
];

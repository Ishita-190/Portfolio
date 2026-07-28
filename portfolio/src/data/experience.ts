export interface Experience {
  id: string;
  org: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export const experiences: Experience[] = [
  {
    id: "dmrc",
    org: "Delhi Metro Rail Corportation (DMRC)",
    role: "Research Intern",
    period: "July 2026 – Present",
    location: "Hybrid",
    bullets: [
      "Working on developing an AI-based railway track fault detection system using computer vision techniques for automated defect identification.",
      "Building a railway track simulation environment to generate and visualize different track conditions for model development and testing.",
    ],
  },
  {
    id: "asyncapi",
    org: "AsyncAPI Initiative",
    role: "Mentee, AsyncAPI Maintainership Program 2026 (AMP'26)",
    period: "June 2026 – Present",
    location: "Remote",
    bullets: [
      "Selected as 1 of 3 global mentees for the AsyncAPI Maintainership Program 2026.",
      "Refactoring the AsyncAPI React component with a canonical render model and parser-adapter architecture.",
      "Designing an extensible plugin lifecycle system to support community-driven rendering extensions.",
      "Improving framework integrations for Angular, SSR, and Web Components with first-class support.",
    ],
  },
  {
    id: "drdo",
    org: "Institute for Systems Studies & Analyses (ISSA), DRDO",
    role: "Summer Research Intern",
    period: "May 2026 – Present",
    location: "On-Site",
    bullets: [
      "Developing a deep learning pipeline for RF signal classification using CNNs trained on STFT spectrograms.",
      "Simulating modulation signals (AM, FM, ADS-B, ISM433) to build a labelled training dataset.",
      "Validating models on real-world RF data collected via RTL-SDR hardware.",
      "Achieving >90% classification accuracy across 6 modulation classes on held-out test splits.",
    ],
  },
  {
    id: "sansoftech",
    org: "Sansoftech Services Private Ltd.",
    role: "Gen AI & LLM Engineering Intern",
    period: "May 2025 – Jul 2025",
    location: "Remote",
    bullets: [
      "Built a GPT-based healthcare symptom checker achieving 88% F1-score on clinical test cases.",
      "Analysed hallucination patterns, bias matrices, and edge-case failures to iteratively improve reliability.",
      "Implemented retrieval-augmented generation (RAG) to ground responses in verified medical literature.",
      "Reduced average response latency by 34% through prompt compression and context window optimisation.",
    ],
  },
];

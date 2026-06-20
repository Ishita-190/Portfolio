export interface SkillCategory {
  id: string;
  label: string;
  course: "starter" | "main";
  items: string[];
}

export interface Social {
  id: string;
  label: string;
  href: string;
  symbol: string;
  isImage?: boolean;
}

export const socials: Social[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Ishita-190",
    symbol: "/icons/github.png",
    isImage: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ishita-s-91683a32b/",
    symbol: "/icons/linkedin.png",
    isImage: true,
  },
  {
    id: "leetcode",
    label: "LeetCode",
    href: "https://leetcode.com/u/I_shita_21/",
    symbol: "/icons/leetcode.png",
    isImage: true,
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:ishasati19@gmail.com",
    symbol: "/icons/email.png",
    isImage: true,
  },
];

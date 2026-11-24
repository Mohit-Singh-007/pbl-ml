export type Member = {
  name: string;
  role: string;
  focus?: string;
  roll?: string;
  github?: string;
  linkedin?: string;
  photo?: string;
};

export const PROJECT = {
  course: "MCA",
  institute: "GEHU, Bhimtal",
  year: "2026",
  repo: "https://github.com/Mohit-Singh-007/pbl-ml",
};

export const GUIDE: { name: string; designation: string } = {
  name: "Dr. Bhupesh Rawat",
  designation: "Professor,School of Computer Applications",
};

export const TEAM: Member[] = [
  {
    name: "Mohit Singh",
    role: "Team Leader",
    roll: "2551515",
    github: "https://github.com/Mohit-Singh-007",
  },
  {
    name: "Simran Dalakoti",
    role: "Model Implementation | Testing",
    roll: "2551529",
  },
  {
    name: "Aditya Joshi",
    role: "UI/UX",
    roll: "2551501",
  },
  {
    name: "Divya Belwal",
    role: "Visualization",
    roll: "2551507",
  },
];

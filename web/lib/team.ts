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
  institute: "Your college / university name", // TODO: edit
  year: "2026",
  repo: "https://github.com/Mohit-Singh-007/pbl-ml",
};

export const GUIDE: { name: string; designation: string } = {
  name: "Guide name", // TODO: edit
  designation: "Project guide, Department of Computer Applications", // TODO: edit
};

export const TEAM: Member[] = [
  {
    name: "Mohit Singh", // TODO: check spelling
    role: "Team member", // TODO: e.g. "Model and data"
    focus: "Describe what this person worked on.",
    roll: "Roll no.",
    github: "https://github.com/Mohit-Singh-007",
  },
  {
    name: "Team member 2",
    role: "Role",
    focus: "Describe what this person worked on.",
    roll: "Roll no.",
  },
  {
    name: "Team member 3",
    role: "Role",
    focus: "Describe what this person worked on.",
    roll: "Roll no.",
  },
  {
    name: "Team member 4",
    role: "Role",
    focus: "Describe what this person worked on.",
    roll: "Roll no.",
  },
];

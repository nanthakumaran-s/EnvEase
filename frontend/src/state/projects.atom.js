import { atom } from "recoil";

export const projectsAtom = atom({
  key: "projects",
  default: [],
});

export const currentProjectAtom = atom({
  key: "currentProject",
  default: 0,
});

export const membersAtom = atom({
  key: "members",
  default: [],
});

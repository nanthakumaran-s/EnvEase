import { atom } from "recoil";

export const userDefault = {
  name: "",
  email: "",
  twoFactor: false,
  enterprise: {
    id: -1,
    name: "",
    imgUrl: "",
  },
  role: {
    id: -1,
    role: "",
  },
};

export const userAtom = atom({
  key: "user",
  default: userDefault,
});

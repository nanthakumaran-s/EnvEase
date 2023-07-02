import { atom } from "recoil";

export const userDefault = {
  name: "",
  email: "",
  enterprise: {
    name: "",
    imgUrl: "",
  },
  role: {
    role: "",
  },
};

export const user = atom({
  key: "user",
  default: userDefault,
});

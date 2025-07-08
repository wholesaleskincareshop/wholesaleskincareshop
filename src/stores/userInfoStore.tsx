import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
  email: string;
  phoneNumber: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  saveInfo: boolean;
  setUserInfo: (info: Partial<UserInfo>) => void;
}

const useUserInfoStore = create<UserInfo>()(
  persist(
    (set) => ({
      email: "",
      phoneNumber: "",
      country: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      saveInfo: false,
      setUserInfo: (info) => set((state) => ({ ...state, ...info })),
    }),
    { name: "user-info-storage" } // Key for local storage
  )
);

export default useUserInfoStore;

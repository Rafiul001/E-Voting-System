import { create } from "zustand";
import type { TVoter } from "../types/VoterTypes";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "./authStore";

const API_BASE_URL = "http://localhost:3000/api/v1/voter";

type TToastMessage = {
  type: "success" | "error" | "";
  toastMessage: string;
};

export type TVoterFilter = {
  divisionName: string;
  districtName: string;
  constituencyNumber: number;
  constituencyName: string;
  upazila?: {
    upazilaName: string;
    unionName: string;
    wardNumber: number;
  };
  cityCorporation?: {
    cityCorporationName: string;
    wardNumber: number;
  };
};

type TVoterStore = {
  voterList: TVoter[];
  filter: Partial<TVoterFilter> | null;
  toastMessage: TToastMessage;

  setFilter: (newFilter: Partial<TVoterFilter>) => void;
  clearFilter: () => void;
  setVoterList: (filterOverride?: Partial<TVoterFilter>) => Promise<void>;
  addVoter: (newVoter: Partial<TVoter>) => Promise<void>;
  updateVoter: (
    voterObjectId: string,
    updatedData: Partial<TVoter>
  ) => Promise<void>;
  deleteVoter: (voterObjectId: string) => Promise<void>;
};

// ✅ Helper: always get axios instance with latest token
const getAxiosInstance = () => {
  const { token, logout } = useAuthStore.getState();

  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // Auto logout on 401 (expired or invalid token)
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout(true);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const useVoterStore = create<TVoterStore>((set, get) => ({
  voterList: [],
  filter: null,
  toastMessage: { type: "", toastMessage: "" },

  setFilter: (newFilter) => {
    set((state) => ({
      filter: { ...(state.filter ?? {}), ...newFilter },
    }));
  },

  clearFilter: () => set({ filter: null }),

  setVoterList: async (filterOverride) => {
    const axiosInstance = getAxiosInstance(); // 🔥 always fresh token
    const filter = filterOverride ?? get().filter;

    try {
      const response = await axiosInstance.post("/get-all", filter ?? {});
      const { message, voterList } = response.data;
      set({
        voterList,
        toastMessage: { type: "success", toastMessage: message },
      });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        toastMessage: {
          type: "error",
          toastMessage:
            error.response?.data?.message ?? "Failed to fetch voters",
        },
      });
    }
  },

  addVoter: async (newVoter) => {
    const axiosInstance = getAxiosInstance();
    try {
      const response = await axiosInstance.post("/create", newVoter);
      const { message } = response.data;
      await get().setVoterList();
      set({ toastMessage: { type: "success", toastMessage: message } });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        toastMessage: {
          type: "error",
          toastMessage: error.response?.data?.message ?? "Failed to add voter",
        },
      });
    }
  },

  updateVoter: async (voterObjectId, updatedData) => {
    const axiosInstance = getAxiosInstance();
    try {
      const response = await axiosInstance.put(
        `/update/${voterObjectId}`,
        updatedData
      );
      const { message } = response.data;
      set({ toastMessage: { type: "success", toastMessage: message } });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        toastMessage: {
          type: "error",
          toastMessage:
            error.response?.data?.message ?? "Failed to update voter",
        },
      });
    }
  },

  deleteVoter: async (voterObjectId) => {
    const axiosInstance = getAxiosInstance();
    try {
      const response = await axiosInstance.delete(`/delete/${voterObjectId}`);
      const { message } = response.data;
      set({ toastMessage: { type: "success", toastMessage: message } });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        toastMessage: {
          type: "error",
          toastMessage:
            error.response?.data?.message ?? "Failed to delete voter",
        },
      });
    }
  },
}));

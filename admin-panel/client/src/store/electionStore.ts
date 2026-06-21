import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "./authStore";
import type { TElectionModel } from "../types/ElectionType";

const API_BASE_URL = "http://localhost:3000/api/v1/election";

type TToastMessage = {
  type: string;
  toastMessage: string;
};

type TElectionStore = {
  electionList: TElectionModel[];

  setElectionList: () => Promise<TToastMessage>;
  addElection: (electionName: string) => Promise<TToastMessage>;
  startElection: (electionId: string) => Promise<TToastMessage>;
  finishElection: (electionId: string) => Promise<TToastMessage>;
};

// ✅ Function that creates a new axios instance each time with the latest token
const getAxiosInstance = () => {
  const { token, logout } = useAuthStore.getState();

  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

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

export const useElectionStore = create<TElectionStore>((set) => ({
  electionList: [],

  setElectionList: async () => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance(); // 🔥 Always get fresh token

    try {
      const response = await axiosInstance.get("/all-election");
      set({ electionList: response.data.electionList });
      toastMessage.type = "success";
      toastMessage.toastMessage = "Election list loaded successfully";
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to fetch election list";
    }

    return toastMessage;
  },

  addElection: async (electionName) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance();

    try {
      const response = await axiosInstance.post("/create", { electionName });
      set((state) => ({
        electionList: [...state.electionList, response.data.election],
      }));

      toastMessage.type = "success";
      toastMessage.toastMessage = response.data.message;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to add election";
    }

    return toastMessage;
  },

  startElection: async (electionId) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance();

    try {
      const response = await axiosInstance.get(`/start-election/${electionId}`);
      const updatedElection = response.data.election;
      // Update the specific election in the list
      set((state) => ({
        electionList: state.electionList.map((election) =>
          election.electionId === updatedElection.electionId
            ? updatedElection
            : election
        ),
      }));

      toastMessage.type = "success";
      toastMessage.toastMessage = response.data.message;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to start election";
    }

    return toastMessage;
  },
  finishElection: async (electionId) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance();

    try {
      const response = await axiosInstance.get(
        `/finish-election/${electionId}`
      );
      const updatedElection = response.data.election;
      // Update the specific election in the list
      set((state) => ({
        electionList: state.electionList.map((election) =>
          election.electionId === updatedElection.electionId
            ? updatedElection
            : election
        ),
      }));

      toastMessage.type = "success";
      toastMessage.toastMessage = response.data.message;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to finish election";
    }

    return toastMessage;
  },
}));

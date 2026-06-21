import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "./authStore";
import type {
  TAddConstituencyForCandidate,
  TCandidateRecord,
  TCreateCandidate,
  TRemoveConstituencyForCandidate,
} from "../types/candidateType";

const API_BASE_URL = "http://localhost:3000/api/v1/candidate";

type TToastMessage = {
  type: string;
  toastMessage: string;
};

type TCandidateStore = {
  candidateList: TCandidateRecord[];

  setCandidateListByElectionId: (electionId: string) => Promise<TToastMessage>;
  setCandidateListByConstituency: (
    constituencyNumber: number,
    constituencyName: string
  ) => Promise<TToastMessage>;
  createCandidate: (candidate: TCreateCandidate) => Promise<TToastMessage>;
  addConstituency: (
    constituency: TAddConstituencyForCandidate
  ) => Promise<TToastMessage>;
  removeConstituency: (
    constituency: TRemoveConstituencyForCandidate
  ) => Promise<TToastMessage>;
  deleteCandidate: (
    candidateId: string,
    electionId: string
  ) => Promise<TToastMessage>;
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

export const useCandidateStore = create<TCandidateStore>((set) => ({
  candidateList: [],

  setCandidateListByElectionId: async (electionId) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance(); // 🔥 Always get fresh token

    try {
      const response = await axiosInstance.get(`/get-all/${electionId}`);
      set({ candidateList: response.data.candidateList });
      toastMessage.type = "success";
      toastMessage.toastMessage = response.data.message;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to fetch candidate list";
    }

    return toastMessage;
  },

  setCandidateListByConstituency: async (
    constituencyNumber,
    constituencyName
  ) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance(); // 🔥 Always get fresh token

    try {
      const response = await axiosInstance.get(
        `/get-all/${constituencyNumber}/${constituencyName}`
      );
      set({ candidateList: response.data.candidateList });
      toastMessage.type = "success";
      toastMessage.toastMessage = response.data.message;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to fetch candidate list";
    }

    return toastMessage;
  },

  createCandidate: async (candidate) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance(); // 🔥 Always get fresh token

    try {
      const response = await axiosInstance.post(`/create`, candidate);

      if (response.data.candidate) {
        set((state) => ({
          candidateList: [...state.candidateList, response.data.candidate],
        }));
        toastMessage.type = "success";
        toastMessage.toastMessage = response.data.message;
      } else {
        toastMessage.type = "failed";
        toastMessage.toastMessage = response.data.message;
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to create candidate";
    }

    return toastMessage;
  },

  addConstituency: async (constituency) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance(); // 🔥 Always get fresh token
    console.log(constituency);

    try {
      const response = await axiosInstance.put(
        `/${constituency.electionId}/${constituency.candidateId}/addConstituency`,
        {
          constituencyNumber: constituency.constituencyNumber,
          constituencyName: constituency.constituencyName,
        }
      );
      console.log(response);

      if (response.data.candidate) {
        set((state) => ({
          candidateList: state.candidateList.map((can) => {
            if (can.candidateId === response.data.candidate.candidateId) {
              return response.data.candidate;
            } else {
              return can;
            }
          }),
        }));
        toastMessage.type = "success";
        toastMessage.toastMessage = response.data.message;
      } else {
        toastMessage.type = "failed";
        toastMessage.toastMessage = response.data.message;
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message ||
        "Failed to add constituency to the candidate";
    }

    return toastMessage;
  },

  removeConstituency: async (constituency) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance(); // 🔥 Always get fresh token

    try {
      const response = await axiosInstance.put(
        `/${constituency.electionId}/${constituency.candidateId}/removeConstituency`,
        {
          constituencyNumber: constituency.constituencyNumber,
          constituencyName: constituency.constituencyName,
        }
      );

      if (response.data.candidate) {
        set((state) => ({
          candidateList: state.candidateList.map((can) => {
            if (can.candidateId === response.data.candidate.candidateId) {
              return response.data.candidate;
            } else {
              return can;
            }
          }),
        }));
        toastMessage.type = "success";
        toastMessage.toastMessage = response.data.message;
      } else {
        toastMessage.type = "failed";
        toastMessage.toastMessage = response.data.message;
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message ||
        "Failed to remove constituency to the candidate";
    }

    return toastMessage;
  },

  deleteCandidate: async (candidateId, electionId) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance(); // 🔥 Always get fresh token

    try {
      const response = await axiosInstance.delete(
        `/delete/${candidateId}/${electionId}`
      );

      if (response.data.candidate) {
        set((state) => ({
          candidateList: state.candidateList.filter(
            (can) => can.candidateId !== response.data.candidate.candidateId
          ),
        }));
        toastMessage.type = "success";
        toastMessage.toastMessage = response.data.message;
      } else {
        toastMessage.type = "failed";
        toastMessage.toastMessage = response.data.message;
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to delete the candidate";
    }
    return toastMessage;
  },
}));

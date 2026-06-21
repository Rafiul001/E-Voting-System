import { create } from "zustand";
import type { TConstituencyModel } from "../types/ConstituencyType";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "./authStore";

const API_BASE_URL = "http://localhost:3000/api/v1/constituency";

type TToastMessage = {
  type: string;
  toastMessage: string;
};

type TFilter = {
  divisionName: string;
  districtName: string;
  pageNumber: number;
};

type TConstituencyStore = {
  divisionList: TConstituencyModel[];
  filter: TFilter;

  setDivisionList: () => Promise<TToastMessage>;
  addDivision: (divisionName: string) => Promise<TToastMessage>;
  updateConstituency: (
    constituencyObject: TConstituencyModel
  ) => Promise<TToastMessage>;
  deleteConstituency: (constituencyObjectId: string) => Promise<TToastMessage>;

  setFilter: (filter: Partial<TFilter>) => void;
  getFilteredDivisionObject: () => TConstituencyModel | undefined;
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

export const useConstituencyStore = create<TConstituencyStore>((set, get) => ({
  divisionList: [],
  filter: {
    divisionName: "",
    districtName: "",
    pageNumber: 1,
  },

  setDivisionList: async () => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance(); // 🔥 Always get fresh token

    try {
      const response = await axiosInstance.get("/get-all");
      set({ divisionList: response.data.constituencyList });
      toastMessage.type = "success";
      toastMessage.toastMessage = "Division list loaded successfully";
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to fetch division list";
    }

    return toastMessage;
  },

  addDivision: async (divisionName) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance();

    try {
      const state = get();
      if (state.divisionList.some((d) => d.divisionName === divisionName)) {
        toastMessage.type = "error";
        toastMessage.toastMessage = "This division already exists";
        return toastMessage;
      }

      const response = await axiosInstance.post("/create", { divisionName });
      set((state) => ({
        divisionList: [...state.divisionList, response.data.constituency],
      }));

      toastMessage.type = "success";
      toastMessage.toastMessage = "Division added successfully";
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to add division";
    }

    return toastMessage;
  },

  updateConstituency: async (constituencyObject) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance();

    try {
      const response = await axiosInstance.put(
        `/add/${constituencyObject._id}`,
        constituencyObject
      );
      const updated = response.data.constituency;

      set((state) => ({
        divisionList: state.divisionList.map((division) =>
          division._id === updated._id ? updated : division
        ),
      }));

      toastMessage.type = "success";
      toastMessage.toastMessage = "Constituency updated successfully";
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to update constituency";
    }

    return toastMessage;
  },

  deleteConstituency: async (constituencyObjectId) => {
    const toastMessage: TToastMessage = { type: "", toastMessage: "" };
    const axiosInstance = getAxiosInstance();

    try {
      const response = await axiosInstance.delete(
        `/delete/${constituencyObjectId}`
      );
      const deleted = response.data.constituency;

      set((state) => ({
        divisionList: state.divisionList.filter(
          (division) => division._id !== deleted._id
        ),
      }));

      toastMessage.type = "success";
      toastMessage.toastMessage = "Constituency deleted successfully";
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toastMessage.type = "error";
      toastMessage.toastMessage =
        err.response?.data?.message || "Failed to delete constituency";
    }

    return toastMessage;
  },

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  getFilteredDivisionObject: () => {
    const { divisionList, filter } = get();
    return divisionList.find(
      (division) =>
        division.divisionName.toLowerCase() ===
        filter.divisionName.toLowerCase()
    );
  },
}));

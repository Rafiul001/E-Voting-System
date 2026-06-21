import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  exp: number; // expiration timestamp (seconds)
  userId?: string;
}

interface AuthState {
  accessToken: string | null;
  userName: string | null;
  isLoggedIn: boolean;
  expiresAt: number | null;

  login: ({ token, userName }: { token: string; userName: string }) => void;
  logout: () => void;
  checkExpiration: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      userName: null,
      isLoggedIn: false,
      expiresAt: null,

      login: ({ token, userName }) => {
        const decoded = jwtDecode<JWTPayload>(token);

        set({
          accessToken: token,
          userName: userName,
          isLoggedIn: true,
          expiresAt: decoded.exp * 1000, // convert to ms
        });
      },

      logout: () => {
        set({
          accessToken: null,
          userName: null,
          isLoggedIn: false,
          expiresAt: null,
        });
      },

      checkExpiration: () => {
        const { expiresAt, logout } = get();

        if (expiresAt && Date.now() > expiresAt) {
          console.log("Token expired — auto logout");
          logout();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        userName: state.userName,
        isLoggedIn: state.isLoggedIn,
        expiresAt: state.expiresAt,
      }),
    }
  )
);

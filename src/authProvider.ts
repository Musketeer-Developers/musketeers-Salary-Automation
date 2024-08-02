import type { AuthProvider } from "@refinedev/core";
import { AuthHelper } from "@refinedev/strapi-v4";
import axios from "axios";
import { API_URL, token } from "./constants";

export const strapiAuthHelper = AuthHelper(`${API_URL}`);
export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const tok = localStorage.getItem(token);
  if (tok) {
    config.headers.Authorization = `Bearer ${tok}`;
  }
  return config;
});

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data, status } = await strapiAuthHelper.login(email, password);
      if (status === 200) {
        localStorage.setItem(token, data.jwt);
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      const errorObj = error?.response?.data?.message?.[0]?.messages?.[0];
      return {
        success: false,
        error: {
          message: errorObj?.message || "Login failed",
          name: errorObj?.id || "Invalid email or password",
        },
      };
    }

    return {
      success: false,
      error: {
        message: "Login failed",
        name: "Invalid email or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(token);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  check: async () => {
    const tok = localStorage.getItem(token);
    if (tok) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: "Authentication failed",
        name: "Token not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const tok = localStorage.getItem(token);
    if (!tok) {
      return null;
    }

    const { data, status } = await strapiAuthHelper.me(tok);
    if (status === 200) {
      const { id, username, email } = data;
      return {
        id,
        name: username,
        email,
      };
    }

    return null;
  },
};
import type { AuthProvider } from "@refinedev/core";
import { AuthHelper } from "@refinedev/strapi-v4";
import axios from "axios";
import { API_URL, TOKEN_KEY } from "./constants";

export const axiosInstance = axios.create();
const strapiAuthHelper = AuthHelper(API_URL + "/api");

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    // Simulated login logic with hardcoded credentials
    const hardcodedUser = {
      email: 'demo@demo.com',
      password: 'demodemo',
      jwt: 'fake-jwt-token-12345'
    };

    if (email === hardcodedUser.email && password === hardcodedUser.password) {
      localStorage.setItem(TOKEN_KEY, hardcodedUser.jwt);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${hardcodedUser.jwt}`;
      return { success: true, redirectTo: "/" };
    } else {
      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    delete axiosInstance.defaults.headers.common["Authorization"];
    return { success:true,redirectTo: "/login" };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Token not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }

    const { data, status } = await strapiAuthHelper.me(token);
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

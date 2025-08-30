// src/services/api.ts
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: "https://fiscalizacaoapi.crea-rn.org.br/",
});

// ✅ Interceptor: Adiciona o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
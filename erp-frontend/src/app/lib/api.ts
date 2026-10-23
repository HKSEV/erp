import axios from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {
  if (typeof window === "undefined")
    return config;

  const token =
    sessionStorage.getItem("token") ??
    localStorage.getItem("token");

  if (token)
    config.headers.set("Authorization", `Bearer ${token}`);
  else
    config.headers.delete("Authorization");

  return config;
});

export default api;

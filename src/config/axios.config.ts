import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL environment variable is not defined");
}

axios.defaults.baseURL = backendUrl;

export { axios, backendUrl };

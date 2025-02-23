import axios from "axios";

export const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "http://45.9.75.34:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});




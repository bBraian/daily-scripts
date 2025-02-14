import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Important to send cookies
});

export default api;
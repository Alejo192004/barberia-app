import axios from "axios";

const api = axios.create({
  baseURL: "https://barberia-app-24tm.onrender.com"
});

export default api;
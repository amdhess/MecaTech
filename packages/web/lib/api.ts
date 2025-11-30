import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: "http://127.0.0.1:3000",
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = Cookies.get("mecatech_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
